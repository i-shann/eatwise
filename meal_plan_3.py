
import numpy as np
import pandas as pd
import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from sklearn.feature_extraction import text
from sklearn.feature_extraction.text import TfidfVectorizer

import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))

recipes_file_path = r"/kaggle/input/better-recipes-for-a-better-life/recipes.csv"
recipes_df = pd.read_csv('recipes.csv')

# Extracting the relevant columns for recipe titles, ingredients, and directions
recipe_df = recipes_df[['recipe_name', 'total_time', 'ingredients', 'directions', 'cuisine_path', 'nutrition', 'img_src' ]]
# Renaming columns to match the desired output
recipe_df.rename(columns={'recipe_name': 'Recipe_titles', 'total_time' : 'Time', 'ingredients': 'Ingredients', 'directions': 'Directions', 'cuisine_path' : 'Cuisine', 'nutrition' : 'Nutrition', 'img_src': 'Image link'}, inplace=True)

# Set Recipe_titles as the index
recipe_df = recipe_df.set_index('Recipe_titles')

# Display the resulting DataFrame
print(recipe_df.head())

# Function to clean the Ingredients column in the dataframe recipe_df
def clean_text(row):
    #remove non-letters
    #print(row)
    row = ','.join(row)
    print(row)
    letters_only = re.sub("[^a-zA-Z]"," ",row)
    #print('\n')
    #print(letters_only)
    words = letters_only.lower().split()
    stops = stopwords.words('english')
    meaningful_words = [w for w in words if not w in stops]
    #singles = [stemmer.stem(word) for word in meaningful_words]
    return (' '.join(meaningful_words))

recipe_df.isnull().sum()

# Create the TfidfVectorizer
tfidf = TfidfVectorizer(analyzer='word', sublinear_tf=True, stop_words='english', ngram_range=(1, 1))

# Fit and transform the Ingredients column
tfidf_data = tfidf.fit_transform(recipe_df['Ingredients'].astype(str))

# Create a DataFrame from the tf-idf matrix
data_dtm = pd.DataFrame(tfidf_data.toarray(), columns=tfidf.get_feature_names_out())

# Extract the feature names (top ingredients)
features = tfidf.get_feature_names_out()

# Display the DataFrame and features
print(data_dtm.head())
print(features[:10])  # Display the first 10 features as a sample

# Get the TF-IDF values for the first recipe (index 0)
recipe_index = 0
tfidf_values_for_recipe = data_dtm.iloc[recipe_index]

# Sort the values in descending order to get the top ingredients
sorted_tfidf_values = tfidf_values_for_recipe.sort_values(ascending=False)

# Display the top 10 ingredients (with their TF-IDF values)
top_10_ingredients = sorted_tfidf_values.head(10)
print(top_10_ingredients)

# writing the top ten ingredients with TFIDF weights occuring in a descending manner to the top_dict.
data_dtm_transposed = data_dtm.transpose()
top_dict={}
top_dt = {}
for c in data_dtm_transposed.columns:
    top = data_dtm_transposed[c].sort_values(ascending=False).head(10)
    top_dict[c] = list(zip(top.index,top.values))
    top_dt[recipe_df.index[c]] = list(top.index)

# Storing the words after the ingredients columns has been reduced to individual words
# and appending a list,words.
words=[]
for c in data_dtm_transposed.columns:
    top = [word for (word,value) in top_dict[c]]
    for t in top:
        words.append(t)
# finding the most commonly occuring words based on the word count.
from collections import Counter
Counter(words).most_common()

#In the above data we see some words like bought,store,tablespoons,festive..etc add no meaning to the ingredients
# adding these words to stopwords again...
stop_list=['tablespoons','teaspoon','festive','ounce','ounces','lbs','use','inch','purpose','low','cup','like',
           'small','large','heavy','used','fav','substitute','temperature','removed','cups','finely','optional',
           'bunch','style','ml','old','lengthwise','prefer','needed','flat','refrigerated','quarts','lb',
          'stick','inches','separated','quart','active','just','feel','make','depending','using',
          'original','kg','want','real','great','approx','bought','type','double','note','tbsp','called',
          'approximately','new','paper','fast','directions','ears','angel','quarters','according',
          'gallon','leftover','left','cover','leave','cm','liter','available','recommended','diagonally',
          'equal','variety','minutes','total','usually','adjust','try','remove','nutritional','including',
          'aluminium','sec','equivalent','sure','simply','possible','day','really','fully','won','store','bought','bottled','table',
          'ready','rocket','won','gram']



# Add new stop words
# performing union operation with the built-in stop words and the user_defined stop words.
# Convert the frozenset to a list
stopwords = list(text.ENGLISH_STOP_WORDS.union(stop_list))

# recreate document term matrix
tfidf1 = TfidfVectorizer(stop_words=stopwords, sublinear_tf=True, ngram_range=(1, 2))
vect_matrix = tfidf1.fit_transform(recipe_df['Ingredients'])

# Creating DataFrame from the matrix
data_stop = pd.DataFrame(vect_matrix.toarray(), columns=tfidf1.get_feature_names_out())

data_stop.head()
data_stop.tail()

# Commented out IPython magic to ensure Python compatibility.

# %matplotlib inline

# Create WordCloud instance
wc = WordCloud(stopwords=stopwords, background_color="white", colormap="Dark2", max_font_size=150, random_state=42)

# Transpose the data for easier iteration
data_stp = data_stop.transpose()

# Generate and display wordclouds
for index, recipe_num in enumerate(data_stp.columns[:12]):
    wc.generate(recipe_df['Ingredients'].iloc[recipe_num])  # Use .iloc to access by position
    plt.figure(figsize=(10, 10))
    plt.subplot(6, 2, index + 1)
    plt.imshow(wc, interpolation="bilinear")
    plt.axis('off')
    plt.title(recipe_df.index[index])

# Adjust layout and display
plt.tight_layout()

# Sparse matrix generated by Tf-IDF vectorizer
vect_matrix

# Finding the shape of the sparse matrix
vect_matrix.shape

# Compress the sparse matrix row-wise.
from scipy import sparse
vect_matrix = sparse.csr_matrix(vect_matrix)

'''import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def recommendations_func(recipe_name, dom):
    # Constructing a pandas series from the dataframe index
    indices = pd.Series(recipe_df.index)

    # Initialize empty recommendations list
    recommendations = []

    # Getting the index of the recipe title passed into recommendations_func
    idx = indices[indices == recipe_name].index[0]
    print(f"Index of {recipe_name}: {idx}")

    # Compute cosine similarity
    cosine_sim = cosine_similarity(dom[idx], dom)

    # Flattening and sorting the similarity scores
    cosine_sim = cosine_sim.flatten()
    score_series = pd.Series(cosine_sim).sort_values(ascending=False)

    # Getting the indexes of the 10 most similar recipes
    top_10_indexes = list(score_series.iloc[1:11].index)  # Skipping the first element (itself)

    # Populating the list with the titles of the best 10 matching recipes
    for i in top_10_indexes:
        recipe = recipe_df.index[i]
        if recipe not in recommendations:  # Ensuring uniqueness
            recommendations.append(recipe)

    # Show ingredients and directions of the recommended recipes
    recommended_details = {}
    for recipe in recommendations:
        ingredients = recipe_df.loc[recipe, 'Ingredients']
        directions = recipe_df.loc[recipe, 'Directions']
        recommended_details[recipe] = {
            'ingredients': ingredients,
            'directions': directions
        }

    return recommended_details'''

'''# Example of calling the function
recommended_recipes = recommendations_func('Mulligatawny Soup', vect_matrix)

# Display the results
for recipe, details in recommended_recipes.items():
    print(f"Recipe: {recipe}")
    print(f"Ingredients: {details['ingredients']}")
    print(f"Directions: {details['directions']}")
    print("-" * 50)
'''

#getting the calories
import re
def extract_macros(nutrition_str):
    fat_match = re.search(r'Total Fat (\d+)g', nutrition_str)
    carb_match = re.search(r'Total Carbohydrate (\d+)g', nutrition_str)
    protein_match = re.search(r'Protein (\d+)g', nutrition_str)

    fat = int(fat_match.group(1)) if fat_match else 0
    carb = int(carb_match.group(1)) if carb_match else 0
    protein = int(protein_match.group(1)) if protein_match else 0

    return fat, carb, protein

recipe_df[['fat_g', 'carb_g', 'protein_g']] = recipe_df['Nutrition'].apply(
    lambda x: pd.Series(extract_macros(x))
)
recipe_df['calorie'] = (recipe_df['fat_g'] * 9) + (recipe_df['carb_g'] * 4) + (recipe_df['protein_g'] * 4)

print(recipe_df[['fat_g', 'carb_g', 'protein_g', 'calorie']])

#calculating the recommended daily calorie intake
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

#categorizing meal type
def categorize_meal_type(cuisine_path):
    if any(keyword in cuisine_path.lower() for keyword in ['breakfast', 'brunch', 'soup']):
        return 'breakfast'
    elif any(keyword in cuisine_path.lower() for keyword in ['main dish', 'meat', 'seafood']):
        return 'dinner'
    elif 'lunch' in cuisine_path.lower():
        return 'lunch'
    elif any(keyword in cuisine_path.lower() for keyword in ['snack', 'appetizer', 'side dish', 'desserts', 'salad', 'drinks']):
        return 'snacks'
    else:
        return 'unknown'

# Apply meal categorization to the dataframe based on cuisine path
recipe_df['meal_type'] = recipe_df['Cuisine'].apply(categorize_meal_type)

print(recipe_df['meal_type'])

def multi_ingredient_recommendations(*ingredients, meal_type=None, tdee, top_n=5):
    if not ingredients:
        return []

    # Meal percentage mapping
    meal_percentages = {
        'breakfast': 0.25,
        'lunch': 0.30,
        'dinner': 0.30,
        'snacks': 0.15
    }

    # Calculate target meal calories only if meal_type is provided
    if meal_type:
        if meal_type.lower() not in meal_percentages:
            raise ValueError(f"Invalid meal type: {meal_type}. Choose from breakfast, lunch, dinner, snacks.")

        # Calculate target meal calories based on TDEE and meal type percentage
        target_meal_calories = tdee * meal_percentages[meal_type.lower()]
        print(f"Target calories for {meal_type}: {target_meal_calories}")

        # Apply meal type and calorie filter (±150 calories)
        calorie_min = target_meal_calories - 150
        calorie_max = target_meal_calories + 150
    else:
        # If meal_type is not provided, we just set the calorie range to be wide
        calorie_min = 0
        calorie_max = float('inf')

    # Create a dictionary mapping recipe names to their top ingredients
    recipe_top_ingredients = {
        recipe_df.index[recipe_idx]: data_dtm.iloc[recipe_idx].sort_values(ascending=False).head(10).index.tolist()
        for recipe_idx in range(len(recipe_df))
    }

    # Score recipes based on how many input ingredients they contain
    recipe_scores = {}
    for recipe_name, top_ings in recipe_top_ingredients.items():
        score = sum(1 for ing in ingredients if ing in top_ings)
        if score > 0:
            recipe_scores[recipe_name] = score

    # Sort recipes by score and take the top N
    sorted_recipes = sorted(recipe_scores.items(), key=lambda x: x[1], reverse=True)
    top_recipes = [recipe for recipe, _ in sorted_recipes[:top_n]]

    # Filter the recipes based on calories (meal_type filter is only applied if meal_type is provided)
    filtered_recipes = recipe_df.loc[top_recipes]
    filtered_recipes = filtered_recipes[
        (filtered_recipes['calorie'].between(calorie_min, calorie_max))
    ]

    # Check if any recipes remain after filtering
    if filtered_recipes.empty:
        print("No recipes found after filtering.")
    else:
        # Print detailed information for each filtered recipe
       recipe_suggestions = []

    for recipe_name, row in filtered_recipes.iterrows():
    # Get detailed information from the original recipe_df using the recipe index
        detailed_recipe = recipe_df.loc[recipe_name]

        recipe_data = {
            'recipe_name': recipe_name,
            'meal_type': detailed_recipe.get('meal_type', 'N/A'),
            'img_src': detailed_recipe.get('Image link', 'N/A'),
            'total_time': detailed_recipe.get('Time', 'N/A'),
            'calorie': detailed_recipe.get('calorie', 'N/A'),
            'ingredients': detailed_recipe.get('Ingredients', 'N/A'),
            'directions': detailed_recipe.get('Directions', 'N/A')[:300]
        }

        recipe_suggestions.append(recipe_data)

# Now ready to send to API
    return recipe_suggestions


# Assuming calculate_calories is defined elsewhere
height_cm = 165
weight_kg = 60
age = 20
gender = 'female'
activity_level = 'moderately active'
#meal_type = 'dinner'
user_ingredients = ['orange']

# Calculate TDEE
tdee = calculate_calories(height_cm, weight_kg, gender, activity_level, age)

# Call multi_ingredient_recommendations, unpacking the ingredients list
recommended = multi_ingredient_recommendations(
    *user_ingredients, #meal_type=meal_type,  # Unpack the list of ingredients
    tdee=tdee  # Directly pass TDEE
)

# Print the recommended recipes
print(recommended)