
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Define Recipe type
type Recipe = {
  meal_type: string;
  img_src: string;
  recipe_name: string;
  total_time: string;
  calorie: string;
  ingredients: string;
  directions: string;
};


const HomeScreen = () => {
  const [input, setInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allIngredients, setAllIngredients] = useState([
    'egg', 'banana', 'apple', 'milk', 'flour', 'sugar', 'cheese'
  ]);


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
  const response = await fetch('https://c81c-136-158-32-235.ngrok-free.app/predict', {
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

  const handleSubmit = () => {
    if (selectedIngredients.length > 0) {
      fetchRecipes();
      console.log('Fetched recipes:', recipes);

    }
  };

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Find your food</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Search or pick ingredient"
              value={input}
              onChangeText={handleInputChange}
            />
            <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
              <Ionicons name="chevron-down" size={24} />
            </TouchableOpacity>
          </View>

          {dropdownVisible && filteredList.length > 0 && (
            <View style={{ maxHeight: 200 }}>
              <FlatList
                data={filteredList}
                keyExtractor={(item) => item}
                style={styles.dropdown}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelect(item)} style={styles.dropdownItem}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View style={styles.chipContainer}>
            {selectedIngredients.map((ingredient, index) => (
              <View key={index.toString()} style={styles.chip}>
                <Text>{ingredient}</Text>
                <TouchableOpacity onPress={() => removeIngredient(ingredient)}>
                  <Ionicons name="close-circle" size={16} color="red" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity onPress={handleSubmit} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      data={recipes}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Cover source={{ uri: item.img_src }} />
          <Card.Content>
            <Title>{item.recipe_name}</Title>
            <Paragraph>{`Meal Type: ${item.meal_type}`}</Paragraph>
            <Paragraph>{`Time: ${item.total_time}`}</Paragraph>
            <Paragraph>{`Calories: ${item.calorie}`}</Paragraph>
            <Paragraph>{`Ingredients: ${item.ingredients}`}</Paragraph>
            <Paragraph>{`Directions: ${item.directions.substring(0, 100)}...`}</Paragraph>
          </Card.Content>
        </Card>
      )}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    margin: 5,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  confirmButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContainer: {
    marginTop: 20,
  },
  card: {
    marginBottom: 20,
  },
});

export default HomeScreen;
