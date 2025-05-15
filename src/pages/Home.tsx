
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Modal} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Recipe } from '../pages/types'; // adjust path
import { useFavoritesStore } from '../pages/useFavoritesStore';

import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';


type NavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetail'>;


const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMeal, setSelectedMeal] = useState('');
  const [input, setInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [calorie, setCalorie] = useState<number | null>(null);
  const [showCalorieInfo, setShowCalorieInfo] = useState(false);
const handleClear = () => {
  setSelectedMeal('');
  setSelectedIngredients([]);
  setRecipes([]);
  setCalorie(null);
  setShowCalorieInfo(false);
};

  const [allIngredients, setAllIngredients] = useState(['absolut', 'achiote', 'acini', 'active', 'additional', 'adjust', 'adobo', 'agave', 'aged', 'ale', 
  'alfalfa', 'allspice', 'almond', 'almondmilk', 'almonds', 'aluminum', 'amaretto', 'american', 'ancho', 'angel', 'anjou',
   'apart', 'apple', 'apples', 'applesauce', 'applewood', 'apricot', 'apricots', 'arbol', 'arborio', 'aromatic', 
   'arugula', 'assorted', 'attached', 'avocado', 'avocados', 'baby', 'bacardi', 'backbone', 'bacon', 'bag', 'bags', 
   'baguette', 'baked', 'baker', 'baking', 'ball', 'baller', 'balls', 'balm', 'balsamic', 'bamboo', 'banana', 'bananas', 'barbeque', 
   'bartlett', 'base', 'basil', 'basmati', 'bass', 'bay', 'bean', 'beans', 'beaten', 'beef', 'beer', 'bell', 'belly', 'benedictine', 'berries', 
   'best', 'beverage', 'bing', 'biscuit', 'biscuits', 'bisquick', 'bite', 'bits', 'bitters', 'bittersweet', 'black', 'blackberries', 'blade', 'blanched', 
   'blend', 'blossom', 'blue', 'blueberries', 'blueberry', 'boiled', 'boiling', 'bone', 'boneless', 'bones', 'bosc', 'bottle', 'bottles', 'bouillon', 'bourbon',
    'box', 'bran', 'brandy', 'brazil', 'bread', 'breast', 'breasts', 'breeze', 'brewed', 'brie', 'broccoli', 'broken', 'broth', 'brown', 'brussels', 'buckwheat', 
    'bunch', 'bunches', 'burrata', 'bush', 'butt', 'butter', 'butterflied', 'buttermilk', 'butternut', 'butterscotch', 'buttery', 'cabbage', 'cactus', 'cake', 
    'cakes', 'calimyrna', 'candied', 'canned', 'cannellini', 'canning', 'canola', 'cans', 'cantaloupe', 'capers', 'caramels', 'carbonated', 'cardamom', 'carrot', 
    'carrots', 'cartons', 'cascadian', 'cashews', 'cassis', 'castor', 'catalina', 'cayenne', 'celery', 'center', 'cereal', 'certo', 'chambord', 'chamoy',
     'champagne', 'chard', 'chardonnay', 'cheddar', 'cheerios', 'cheese', 'cherries', 'cherry', 'chestnuts', 'chevre', 'chia', 'chicken', 'chickpeas', 
     'chile', 'chiles', 'chili', 'chilled', 'chinese', 'chipotle', 'chips', 'chives', 'chocolate', 'chopped', 'chops', 'chopsticks', 'chuck', 'chunks', 
     'ciabatta', 'cider', 'cilantro', 'cinnamon', 'citrus', 'clam', 'clarified', 'cleaned', 'clear', 'clementine', 'clingstone', 'clove', 'cloves', 'club',
      'coarse', 'coarsely', 'coating', 'cocktail', 'cocoa', 'coconut', 'cod', 'coffee', 'cointreau', 'cola', 'colby', 'cold', 'coleslaw', 'colored', 'coloring', 
      'combination', 'compressed', 'concentrate', 'condensed', 'condiment', 'cone', 'confectioners', 'conference', 'container', 'cooked', 'cookie', 'cookies',
       'cooking', 'cool', 'cooled', 'cored', 'coriander', 'corn', 'cornflake', 'cornflakes', 'cornish', 'cornstarch', 'cottage', 'country', 'county', 'course', 'couscous',
        'cover', 'crabmeat', 'cracked', 'cracker', 'crackers', 'craft', 'cranberries', 'cranberry', 'cream', 'creamy', 'creations', 'crema', 'creme', 'crescent', 'crisp', 
        'crispy', 'crosswise', 'crumbled', 'crumbs', 'crushed', 'crust', 'crusts', 'crusty', 'crystal', 'crystallized', 'cube', 'cubed', 'cubes', 'cucumber', 'cucumbers',
         'cumin', 'cup', 'cups', 'curacao', 'currant', 'currants', 'curry', 'custard', 'cut', 'damask', 'damson', 'dannon', 'dark', 'dash', 'dashes', 'date', 'dates', 'day',
          'decoration', 'deep', 'deglet', 'degrees', 'delicious', 'desired', 'dessert', 'deveined', 'di', 'diagonally', 'diagonals', 'diameter', 'diamond', 'dice', 
          'diced', 'dijon', 'dinosaur', 'directions', 'discarded', 'distilled', 'divided', 'dole', 'door', 'double', 'dough', 'drained', 'dressing', 'dried', 'drop', 
          'drops', 'drumsticks', 'dry', 'duck', 'duncan', 'dusting', 'ears', 'egg', 'eggplant', 'eggs', 'eighths', 'english', 'envelope', 'espresso', 'evaporated', 'extra', 
          'extract', 'extracted', 'fajita', 'fall', 'farina', 'farm', 'fashioned', 'fat', 'favorite', 'fennel', 'feta', 'field', 'fig', 'figs', 'fillet', 'fillets', 'filling',
           'fine', 'finely', 'fireweed', 'firm', 'fish', 'fit', 'fl', 'flake', 'flaked', 'flakes', 'flaky', 'flat', 'flatbread', 'flavor', 'flavored', 'flavoring', 'flax', 'flesh', 
           'fleshed', 'florets', 'flounder', 'flour', 'fluid', 'focaccia', 'foil', 'follow', 'food', 'footnote', 'free', 'freekeh', 'french', 'fresh', 'freshly', 'friendship',
            'frozen', 'fruit', 'fruits', 'fruity', 'fry', 'frying', 'fudge', 'fully', 'fuyu', 'gallo', 'gallons', 'game', 'garlic', 'garnish', 'gelatin', 'germ', 'german', 
            'gewurztraminer', 'gin', 'ginger', 'gingersnap', 'glace', 'glasses', 'glaze', 'gluten', 'glutinous', 'goat', 'gold', 'golden', 'good', 'gorgonzola', 'grade', 
            'graham', 'grain', 'grand', 'grands', 'granny', 'granular', 'granulated', 'granules', 'grape', 'grapefruit', 'grapes', 'grapeseed', 'grated', 'greek', 'green',
             'greens', 'grenadine', 'ground', 'gruyere', 'guacamole', 'guajillo', 'guava', 'guittard', 'habanero', 'hachiya', 'half', 'halloumi', 'halved', 'halves', 'ham',
              'handles', 'hard', 'harissa', 'havarti', 'hazelnuts', 'head', 'heads', 'heated', 'heath', 'heavy', 'heirloom', 'hens', 'herbed', 'high', 'hines', 'hint', 'hoisin',
               'honey', 'honeycrisp', 'honeydew', 'horseradish', 'hot', 'hulled', 'hungarian', 'husked', 'husks', 'ice', 'iceberg', 'imitation', 'inch', 'individually', 'instant',
                'italian', 'jack', 'jalapeno', 'jam', 'japanese', 'jar', 'jars', 'jasmine', 'jell', 'jellied', 'jelly', 'jicama', 'jiffy', 'jigger', 'jonagold', 'juice', 'juiced',
                 'julienned', 'just', 'kaimal', 'kale', 'kernel', 'kernels', 'ketchup', 'kidney', 'kiwi', 'kiwifruit', 'kiwis', 'knox', 'kosher', 'krispies', 'lacinato', 'lady',
                  'lamb', 'large', 'layers', 'leaf', 'leafy', 'lean', 'leaves', 'left', 'leg', 'legs', 'lemon', 'lemongrass', 'lemons', 'lengths', 'lengthwise', 'lentils', 'lettuce',
                   'lid', 'lids', 'light', 'lightly', 'lime', 'limeade', 'limes', 'link', 'liqueur', 'liquid', 'liter', 'liters', 'liver', 'loaf', 'lobster', 'log', 'loin',
                    'long', 'low', 'lukewarm', 'lumps', 'maca', 'macadamia', 'macapuno', 'macaroon', 'machine', 'macintosh', 'mackerel', 'madras', 'mahi', 'mahlab', 
                    'malibu', 'malt', 'mandarin', 'mango', 'mangoes', 'mangos', 'maple', 'maraschino', 'margarine', 'marina', 'marinara', 'marmalade', 'marnier',
                     'marsala', 'marshmallows', 'mashed', 'matchsticks', 'maya', 'mayonnaise', 'meal', 'meat', 'medium', 'medjool', 'melissa', 'melon', 'melted', 
                     'membrane', 'mesquite', 'mexican', 'meyer', 'mild', 'milder', 'milk', 'milliliter', 'minced', 'mini', 'miniature', 'mint', 'minute', 'mission',
                      'mix', 'mixed', 'mochiko', 'molasses', 'montchevre', 'monterey', 'moons', 'moscato', 'mozzarella', 'muffin', 'multigrain', 'muscovado', 
                      'mushrooms', 'mustard', 'naval', 'navel', 'nectar', 'nectarine', 'nectarines', 'needed', 'neufchatel', 'non', 'nondairy', 'nonfat', 
                      'nonstick', 'noodles', 'noor', 'nori', 'nutmeg', 'nuts', 'oat', 'oatmeal', 'oats', 'ocean', 'oelek', 'oil', 'old', 'olive', 'olives',
                      'onion', 'onions', 'optional', 'orange', 'oranges', 'oregano', 'original', 'orzo', 'ounce', 'ounces', 'overripe', 'oyster', 'oz', 
                      'pack', 'package', 'packages', 'packed', 'palm', 'panko', 'papaya', 'papayas', 'paper', 'paprika', 'parchment', 'parmesan', 'parsley', 
                      'passion', 'pasta', 'paste', 'pastry', 'pats', 'patted', 'peach', 'peaches', 'peanut', 'peanuts', 'pear', 'pears', 'pecan', 'pecans', 
                      'pecorino', 'pectin', 'peel', 'peeled', 'pekoe', 'penne', 'pepe', 'pepper', 'peppers', 'persimmon', 'persimmons', 'peychaud', 'philadelphia',
                       'pickled', 'pickles', 'pickling', 'pico', 'pie', 'piece', 'pieces', 'pillsbury', 'piloncillo', 'pinch', 'pinches', 'pine', 'pineapple', 'pink', 
                       'pint', 'pinto', 'pints', 'pistachio', 'pistachios', 'pith', 'pits', 'pitted', 'pizza', 'plain', 'plastic', 'plum', 'plums', 'plus', 'poblano', 
                       'pods', 'pomegranate', 'pomegranates', 'popcorn', 'poppy', 'pork', 'portobello', 'potato', 'potatoes', 'pouch', 'pouches', 'pound', 'pounded', 
                       'pounds', 'powder', 'powdered', 'pre', 'precooked', 'preferred', 'premium', 'prepared', 'prerolled', 'preserved', 'preserves', 'press', 'pressed', 
                       'pretzels', 'prickly', 'processor', 'proof', 'prosciutto', 'protein', 'provolone', 'prune', 'prunes', 'pudding', 'puff', 'pulp', 'pumpkin', 'pure',
                        'puree', 'pureed', 'purple', 'purpose', 'quaker', 'quality', 'quart', 'quarter', 'quartered', 'quarters', 'quarts', 'quick', 'quinoa', 'raisin', 
                        'raisins', 'ranch', 'raspberries', 'raspberry', 'raw', 'ready', 'recipe', 'rectangles', 'red', 'reduced', 'refried', 'refrigerated', 'regular', 
                        'remove', 'removed', 'reserved', 'reynolds', 'rhubarb', 'ribs', 'rice', 'ricotta', 'rimming', 'rind', 'rings', 'rinsed', 'ripe', 'rising', 'ritz', 
                        'roast', 'roasted', 'roll', 'rolled', 'rolling', 'rolls', 'roma', 'romaine', 'romano', 'room', 'root', 'rosa', 'rosemary', 'rouge', 'roughly',
                         'roughy', 'round', 'rounds', 'rub', 'rum', 'russet', 'russian', 'rye', 'safflower', 'saffron', 'sage', 'salad', 'salmon', 'salsa', 'salt', 'salted', 
                         'saltine', 'sambal', 'sandwich', 'sashimi', 'sauce', 'sausage', 'sazon', 'scallions', 'scallops', 'schnapps', 'scissors', 'scoop', 'scooped', 'scoops',
                          'sea', 'seafood', 'seasonal', 'seasoned', 'seasoning', 'seaweed', 'sec', 'sections', 'seed', 'seeded', 'seedless', 'seeds', 'segments', 'self',
                           'semi', 'semisweet', 'semolina', 'separated', 'separately', 'serrano', 'sesame', 'shallot', 'shallots', 'shaoxing', 'sharp', 'sheet', 'sheets', 'shell', 'shelled', 'shells', 'sherry', 'shiraz', 'shoots', 'short', 'shortbread', 'shortcrust', 'shortening', 'shoulder', 'shredded', 'shrimp', 'sieve', 'sifted', 'silks', 'silver', 'similar', 'simple', 'single', 'sirloin', 'size', 'sized', 'skewers', 'skim', 'skin', 'skinless', 'skinned', 'skirt', 'slabs', 'slice', 'sliceable', 'sliced', 'slices', 'slivered', 'small', 'smashed', 'smith', 'smoke', 'smoked', 'smooth', 'snip', 'soda', 'sodium', 'soft', 'softened', 'solid', 'sorted', 'soup', 'sour', 'southwest', 'soy', 'spanish', 'spareribs', 'sparkling', 'spearmint', 'spears', 'spice', 'spicy', 'spinach', 'spiral', 'splash', 'splenda', 'split', 'sponge', 'spray', 'sprig', 'sprigs', 'spring', 'sprinkling', 'sprite', 'sprouts', 'squares', 'squash', 'squeeze', 'squeezed', 'sriracha', 'stalk', 'stalks', 'starter', 'steak', 'steaks', 'stem', 'stemmed', 'stems', 'stevia', 'stewed', 'stick', 'sticks', 'stir', 'stock', 'stolichnaya', 'stone', 'strawberries', 'strawberry', 'strings', 'stripped', 'strips', 'strong', 'style', 'substitute', 'sucralose', 'suet', 'sugar', 'sunflower', 'superfine', 'supreme', 'sure', 'sushi', 'sweet', 'sweetened', 'sweetener', 'swiss', 'syrup', 'tablespoon', 'tablespoons', 'taco', 'tahini', 'tails', 'tajin', 'tangy', 'tapioca', 'tarragon', 'tart', 'tartar', 'taste', 'tea', 'teaspoon', 'teaspoons', 'temperature', 'tenderloin', 'tenderloins', 'tenders', 'tequila', 'teriyaki', 'texture', 'textured', 'thai', 'thawed', 'thickly', 'thickness', 'thighs', 'thinly', 'thirds', 'thoroughly', 'threads', 'thyme', 'tidbits', 'tied', 'tilapia', 'toasted', 'toffee', 'tomatillos', 'tomato', 'tomatoes', 'tonic', 'toothpicks', 'topping', 'tops', 'torn', 'tortilla', 'tortillas', 'tray', 'triangular', 'trimmed', 'triple', 'tuna', 'turbinado', 'turkey', 'turmeric', 'twist', 'unbaked', 'unbleached', 'uncooked', 'undrained', 'unflavored', 'unfolded', 'unpeeled', 'unpopped', 'unripe', 'unsalted', 'unsweetened', 'unwrapped', 'use', 'valencia', 'vanilla', 'vegetable', 'vertically', 'vidalia', 'vinaigrette', 'vindaloo', 'vinegar', 'virgin', 'vodka', 'wafer', 'wafers', 'walnut', 'walnuts', 'warm', 'warmed', 'wasabi', 'wash', 'washed', 'water', 'watermelon', 'way', 'wedge', 'wedges', 'welch', 'wheat', 'whey', 'whip', 'whipped', 'whipping', 'whiskey', 'white', 'whites', 'wide', 'wine', 'wing', 'wings', 'wooden', 'worcestershire', 'work', 'wrap', 
    'wrapped', 'yeast', 'yellow', 'yogurt', 'yolk', 'yolks', 'young', 'zest', 'zested', 'ziyad', 'zucchini']);


  // Filter ingredient list when input changes
  const handleInputChange = (text: string) => {
    setInput(text);
    const filtered = allIngredients.filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
    setDropdownVisible(true);
  };
  
useEffect(() => {
  // Clear calorie and recipes if user changes selection
  setCalorie(null);
  setRecipes([]);
  setShowCalorieInfo(false);
}, [selectedMeal, selectedIngredients]);



  // Add selected ingredient
const handleSelect = (item: string) => {
  if (!selectedIngredients.includes(item)) {
    setSelectedIngredients([...selectedIngredients, item]);
  }
  setDropdownVisible(false);
  setInput(''); // clear input
  console.log('ha', selectedIngredients)
};


  // Remove an ingredient
const removeIngredient = (item: string) => {
  setSelectedIngredients((prev) => prev.filter((ingredient) => ingredient !== item));
};


  

  // Fetch recipes from backend
  const fetchRecipes = async () => {
  try {
  const response = await fetch('https://213b-136-158-32-235.ngrok-free.app/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'haha',
      ingredients: selectedIngredients,
      meal:  selectedMeal,
    }),
  });

  // Check if the response is ok
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }


  // Parse the response as JSON
  const result = await response.json();

  // Log the API response for debugging
  console.log('API Response:', result);
  console.log(result.user, result.ingredient)
  console.log(selectedMeal)
    if (result.message) {
    alert(result.message); // or show in UI
  } else {
    // render recipes
  }
  

    const fetchedCalorie = result?.calorie;
    setCalorie(fetchedCalorie);
    setShowCalorieInfo(true); 


  // Check if the result contains suggestions
   // Check if the result contains suggestions
  if (result && result.suggestions) {
    if (Array.isArray(result.suggestions)) {
      // Successfully received suggestions, update state
      setRecipes(result.suggestions);
    } else {
      console.error('Suggestions is not an array:', result.suggestions);
      setRecipes([]); // Handle the error case if suggestions is not an array
    }
  } else {
    console.log('No suggestions found in response');
    setRecipes([]); // Optionally handle the empty suggestion case
  }
} catch (error) {
  console.error('Error fetching data:', error);
  setRecipes([]);
}
};

const [favorites, setFavorites] = useState<string[]>([]);

const toggleFavorite = (recipeName: string) => {
  setFavorites(prev =>
    prev.includes(recipeName)
      ? prev.filter(name => name !== recipeName)
      : [...prev, recipeName]
  );
};



  const handleSubmit = () => {
    if (selectedIngredients.length > 0) {
      fetchRecipes();
    }
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    
  <FlatList
    ListHeaderComponent={
      <>
        <Text style={styles.header}>Find your food</Text>

        {/* Search Input and Dropdown */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Search ingredient"
            value={input}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            style={styles.icon}
          >
            <Ionicons name="chevron-down" size={24} />
          </TouchableOpacity>

          {dropdownVisible && filteredList.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredList}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={styles.dropdownItem}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

                 {/* Ingredient Chips */}
        <View style={styles.chipContainer}>
          {selectedIngredients.map((ingredient, index) => (
            <View key={index.toString()} style={styles.chip}>
              <Text>{ingredient}</Text>
              <TouchableOpacity onPress={() => removeIngredient(ingredient)}>
                <Ionicons
                  name="close"
                  size={16}
                  color="red"
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>


{/* Meal Options */}
<View style={styles.mealContainer}>
  <Text style={styles.mealLabel}>Meal:</Text>
  <View style={styles.mealOptions}>
    {[
      { label: 'Breakfast', value: 'breakfast' },
      { label: 'Lunch', value: 'lunch' },
      { label: 'Dinner', value: 'dinner' },
      { label: 'Snacks', value: 'snacks' },
    ].map((meal) => (
      <TouchableOpacity
        key={meal.value}
        style={[
          styles.mealButton,
          selectedMeal === meal.value && styles.mealButtonSelected,
        ]}
        onPress={() => setSelectedMeal(meal.value)}
      >
        <Text
          style={[
            styles.mealText,
            selectedMeal === meal.value && styles.mealTextSelected,
          ]}
        >
          {meal.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
  
       <View style={[styles.confirmButtonContainer, { flexDirection: 'row', justifyContent: 'center' }]}>
  {/* Confirm Button */}
  <TouchableOpacity onPress={handleSubmit} style={styles.confirmButton}>
    <Text style={styles.confirmButtonText}>Confirm</Text>
  </TouchableOpacity>

  {/* Clear Button */}
  <TouchableOpacity
    onPress={handleClear}
    style={[styles.confirmButton, { backgroundColor: 'white',borderWidth: 1.5, borderColor: '#4CA635', marginLeft: 10 }]}
  >
    <Text style={[styles.confirmButtonText, { color: '#333' }]}>Clear</Text>
  </TouchableOpacity>
</View>

          {showCalorieInfo && (
  <Text
    style={{
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      paddingHorizontal: 20,
  
    }}
  >
    Suggested calorie for{" "}
    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
      {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}
    </Text>
    {calorie ? `: ${Number(calorie).toFixed(2)} kcal` : ''}
  </Text>
)}
      </>
    }
    data={recipes}
    keyExtractor={(item, index) => index.toString()}
    contentContainerStyle={styles.cardListContainer}
    renderItem={({ item }) => (

      <TouchableOpacity
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      >
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: item.img_src }}
            style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          />
          <Card.Content style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
            {/* Recipe Name */}
            <Title style={{ marginBottom: 4, fontWeight: 'bold' }}>{item.recipe_name}</Title>

            {/* Time, Calories, Heart */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="time"
                  size={16}
                  color="#4CA635"
                  style={{ marginRight: 4 }}
                />
                <Paragraph style={{ marginRight: 16 }}>{item.total_time}</Paragraph>

                <Ionicons
                  name="flame"
                  size={16}
                  color="red"
                  style={{ marginRight: 4 }}
                />
                <Paragraph>{`${item.calorie} kcal`}</Paragraph>
              </View>

              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Ionicons
                  name={
                    favorites.some(
                      f => f.recipe_name === item.recipe_name
                    )
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )}
  />
</SafeAreaView>

  );
};


const styles = StyleSheet.create({

  container: {
    padding: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop:  30,
    marginBottom: 20,
    color: '#4CA635',
    paddingHorizontal: 16,

  },
  cardListContainer: {
  paddingBottom: 16,
},

safeArea: {
  flex: 1,
  backgroundColor: '#fff',
  paddingTop: Platform.OS === 'android' ? 25 : 0,
  paddingHorizontal: 5,
},

  searchContainer: {
    position: 'relative',
    marginHorizontal: 0,
    marginTop: 10,
      paddingHorizontal: 16,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    paddingLeft: 10,
    paddingRight: 35, // space for the icon
    borderRadius: 5,
    backgroundColor: '#EEF9EB',

  },
  icon: {
    position: 'absolute',
    right: 30,
    top: 15,
  },
dropdown: {
  position: 'absolute',
  top: 55,
  alignSelf: 'center',
  width: '100%', // or a fixed value like 300
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
  zIndex: 10,
  maxHeight: 180,
  marginTop: -5,
},


dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
  backgroundColor: '#fff',

},
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
      paddingHorizontal: 16,
      marginBottom: -20,


  },
  chip: {
    backgroundColor: 'white',
    borderColor: '#4CA635',
    borderWidth: 1,
    margin: 5,
    padding: 7,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  confirmButtonContainer: {
    alignItems: 'center',
    marginTop: 20,

  },
  confirmButton: {
    backgroundColor: '#4CA635',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20, // 👈 This adds space between the button and the next card

  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular', // Add here

  },
card: {
  marginVertical: 10,
  padding: 10,
  borderRadius: 10,
  backgroundColor: '#fff',
  elevation: 2,
},

cardRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

cardImage: {
  width: 100,
  height: 10,
  borderRadius: 8,
  marginRight: 10,
},

cardContent: {
  flex: 1,
  flexDirection: 'column',
  marginLeft: -10
},

cardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 2, // Reduced from 5
},

cardText: {
  fontSize: 14,
  color: '#555',
  marginBottom: 2, // Add this if not present to control spacing
},

recipeName: {
  fontSize: 16,
  fontWeight: 'bold',
  flexShrink: 1,
  color: '#4CA635',
    fontFamily: 'Poppins_400Regular',

},
mealContainer: {
  marginTop: 25,
  paddingHorizontal: 10,
  marginLeft: 13
},

mealLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10,},

mealOptions: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
},

mealButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 10,
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: 'gray',
},

mealButtonSelected: {
  backgroundColor: '#4CAF50',
  borderColor: '#388E3C',
},

mealText: {
  color: '#333',
  fontSize: 14,
},

mealTextSelected: {
  color: '#fff',
  fontWeight: 'bold',
},
suggestionContainer: {
  paddingHorizontal: 20,
  marginTop: 20,
},

suggestionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10,
},

highlightedMeal: {
  color: '#4CA635',
  fontWeight: 'bold',
},


});

export default HomeScreen;