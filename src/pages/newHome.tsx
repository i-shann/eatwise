import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Recipe } from '../pages/types';
import { useFavoritesStore } from '../pages/useFavoritesStore';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

type NavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetail'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, toggleFavorite } = useFavoritesStore(); // ✅ Correct usage inside component

  const [input, setInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allIngredients] = useState([
    'egg',
    'banana',
    'apple',
    'milk',
    'flour',
    'sugar',
    'cheese',
  ]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleInputChange = (text: string) => {
    setInput(text);
    const filtered = allIngredients.filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
    setDropdownVisible(true);
  };

  const handleSelect = (item: string) => {
    if (!selectedIngredients.includes(item)) {
      setSelectedIngredients([...selectedIngredients, item]);
    }
    setDropdownVisible(false);
    setInput('');
  };

  const removeIngredient = (item: string) => {
    setSelectedIngredients(prev =>
      prev.filter(ingredient => ingredient !== item)
    );
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        'https://fcc9-112-204-99-221.ngrok-free.app/predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'haha',
            ingredients: selectedIngredients,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const result = await response.json();
      console.log('API Response:', result);

      if (result && Array.isArray(result.suggestions)) {
        setRecipes(result.suggestions);
      } else {
        console.error('Suggestions is not an array');
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setRecipes([]);
    }
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
                    keyExtractor={item => item}
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

            <View style={styles.chipContainer}>
              {selectedIngredients.map((ingredient, index) => (
                <View key={index.toString()} style={styles.chip}>
                  <Text>{ingredient}</Text>
                  <TouchableOpacity
                    onPress={() => removeIngredient(ingredient)}
                  >
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

            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.confirmButton}
              >
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
            onPress={() =>
              navigation.navigate('RecipeDetail', { recipe: item })
            }
          >
            <Card style={styles.card}>
              <Card.Cover
                source={{ uri: item.img_src }}
                style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              />
              <Card.Content
                style={{ paddingVertical: 8, paddingHorizontal: 12 }}
              >
                <Title style={{ marginBottom: 4, fontWeight: 'bold' }}>
                  {item.recipe_name}
                </Title>

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
                    <Paragraph style={{ marginRight: 16 }}>
                      {item.total_time}
                    </Paragraph>

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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingHorizontal: 5,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 30,
    marginBottom: 20,
    color: '#4CA635',
    paddingHorizontal: 16,
  },
  searchContainer: {
    position: 'relative',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    paddingLeft: 10,
    paddingRight: 35,
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
    width: '100%',
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
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  cardListContainer: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
});

export default HomeScreen;
