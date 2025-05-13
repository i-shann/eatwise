import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import requests
from PIL import Image
from io import BytesIO
import re
from sklearn.metrics.pairwise import cosine_similarity
import requests
from PIL import Image

def mealsuggest(age, height, weight, gender, active_level, meal_type, ingredients ):
    df = pd.read_csv("recipes.csv")

    df = df[['recipe_name', 'total_time', 'ingredients', 'directions', 'cuisine_path', 'nutrition', 'img_src' ]]
    df.head()
    df['total_time'] = df['total_time'].fillna('30 mins')

    def extract_macros(nutrition_str):
        fat_match = re.search(r'Total Fat (\d+)g', nutrition_str)
        carb_match = re.search(r'Total Carbohydrate (\d+)g', nutrition_str)
        protein_match = re.search(r'Protein (\d+)g', nutrition_str)

        fat = int(fat_match.group(1)) if fat_match else 0
        carb = int(carb_match.group(1)) if carb_match else 0
        protein = int(protein_match.group(1)) if protein_match else 0

        return fat, carb, protein

    df[['fat_g', 'carb_g', 'protein_g']] = df['nutrition'].apply(
        lambda x: pd.Series(extract_macros(x))
    )


    df['calorie'] = (df['fat_g'] * 9) + (df['carb_g'] * 4) + (df['protein_g'] * 4)

    print(df[['fat_g', 'carb_g', 'protein_g', 'calorie']])

    fractions = {
        '½': '1/2',
        '¼': '1/4',
        '¾': '3/4',
        '⅓': '1/3',
        '⅔': '2/3'
    }

    df['ingredients'] = (
        df['ingredients']
        .str.replace('Â', '', regex=False) 
        .replace(fractions, regex=True)     
        .str.lower()                       
        .str.strip()                       
    )


    df['ingredients_clean'] = df['ingredients'].str.replace(r'\(.*?\)', '', regex=True).str.strip()

    # 2. Tokenize ingredients into individual words (lowercased)
    df['ingredient_tokens'] = df['ingredients_clean'].apply(lambda x: [word.lower() for word in re.split(r'[\s,]+', x)])

    # 3. Remove units and common non-ingredient words
    units = ['cup', 'tbsp', 'tsp', 'oz', 'g', 'mg', 'ml', 'inch', 'small', 'large', 'medium',
            'slice', 'can', 'teaspoon', 'tablespoon', 'pound', 'quart', 'pinch', 'clove',
            'cups', 'tablespoons', 'teaspoons', 'grams', 'ounces', 'pints']

    def remove_units(tokens):
        return [token for token in tokens if token not in units and not token.isnumeric()]

    df['filtered_ingredients'] = df['ingredient_tokens'].apply(remove_units)


    def calculate_calories(height_cm, weight_kg, gender, activity_level, age):
        if gender.lower() == 'male':
            bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
        else:
            bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161

        activity_multipliers = {
            'sedentary': 1.2,
            'lightly active': 1.375,
            'moderately active': 1.55,
            'very active': 1.725,
            'super active': 1.9
        }

        multiplier = activity_multipliers.get(activity_level.lower())
        tdee = bmr * multiplier
        return round(tdee, 2)

    def categorize_meal_type(cuisine_path):
        if any(keyword in cuisine_path.lower() for keyword in ['breakfast', 'brunch']):
            return 'breakfast'
        elif any(keyword in cuisine_path.lower() for keyword in ['main dish', 'meat', 'seafood']):
            return 'dinner'
        elif 'lunch' in cuisine_path.lower():
            return 'lunch'
        elif any(keyword in cuisine_path.lower() for keyword in ['snack', 'appetizer', 'side dish']):
            return 'snacks'
        else:
            return 'unknown'

    # Apply meal categorization to the dataframe based on cuisine path
    df['meal_type'] = df['cuisine_path'].apply(categorize_meal_type)


    # Function to suggest recipes
    def suggest_recipes(user_ingredients, meal_type, tdee):
        meal_percentages = {
            'breakfast': 0.25,
            'lunch': 0.30,
            'dinner': 0.30,
            'snacks': 0.15
        }

        if meal_type.lower() not in meal_percentages:
            raise ValueError(f"Invalid meal type: {meal_type}. Choose from breakfast, lunch, dinner, snacks.")

        target_meal_calories = tdee * meal_percentages[meal_type.lower()]
        calorie_tolerance = 100

        # Process user ingredients
        user_ingredients_tokens = [word.lower() for word in re.split(r'[\s,]+', ' '.join(user_ingredients))]
        user_ingredients_filtered = remove_units(user_ingredients_tokens)

        # Filter by meal type first
        filtered_df = df[df['meal_type'].str.contains(meal_type, case=False, na=False)].copy()

        # Compute overlap before calorie filtering
        filtered_df['ingredient_overlap'] = filtered_df['filtered_ingredients'].apply(
            lambda x: len(set(user_ingredients_filtered) & set(x))
        )

        # Filter out recipes with no ingredient overlap
        filtered_df = filtered_df[filtered_df['ingredient_overlap'] > 0]

        # Calculate similarity
        filtered_df['similarity'] = filtered_df['ingredient_overlap'] / filtered_df['filtered_ingredients'].apply(len)

        # Filter by calorie proximity
        filtered_df = filtered_df[
            filtered_df['calorie'].between(target_meal_calories - calorie_tolerance, target_meal_calories + calorie_tolerance)
        ]

        filtered_df['calorie_diff'] = abs(filtered_df['calorie'] - target_meal_calories)

        # Sort by similarity and calorie closeness
        result = filtered_df.sort_values(by=['similarity', 'calorie_diff'], ascending=[False, True])

        top_recipes_df = result.head(10)

        recipe_suggestions = []
        for _, row in top_recipes_df.iterrows():
            recipe_data = {
                'recipe_name': row['recipe_name'],
                'meal_type': row['meal_type'],
                'img_src': row['img_src'],
                'total_time': row['total_time'],
                'calorie': row['calorie'],
                'ingredients': row['ingredients'],
                'directions': row['directions'][:300]  # Shorten directions for preview
            }
            recipe_suggestions.append(recipe_data)

        return recipe_suggestions


    height_cm = 165
    weight_kg = 60
    age = 20
    gender = 'female'
    activity_level = 'moderately active'
    meal_type = 'snacks'
    user_ingredients = ['apple', 'banana', 'yogurt']

    tdee = calculate_calories(height_cm, weight_kg, gender, activity_level, age)

    top_recs = suggest_recipes(user_ingredients, "breakfast", tdee)
    print(tdee, top_recs)