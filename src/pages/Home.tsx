
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Modal} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Recipe } from '../pages/types'; // adjust path

import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';


type NavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetail'>;


const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [input, setInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allIngredients, setAllIngredients] = useState([
    'egg', 'banana', 'apple', 'milk', 'flour', 'sugar', 'cheese'
  ]);


  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Filter ingredient list when input changes
  const handleInputChange = (text: string) => {
    setInput(text);
    const filtered = allIngredients.filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
    setDropdownVisible(true);
  };
  

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
  const response = await fetch('https://6f7c-136-158-32-235.ngrok-free.app/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'haha',
      ingredients: selectedIngredients,
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
  setRecipes([]); // Optionally handle the fetch error case
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
      console.log('Fetched recipes:', recipes);

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
            placeholder="Search or pick ingredient"
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

        {/* Confirm Button */}
        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
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

              <TouchableOpacity onPress={() => toggleFavorite(item.recipe_name)}>
                <Ionicons
                  name={
                    favorites.includes(item.recipe_name)
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



});

export default HomeScreen;
