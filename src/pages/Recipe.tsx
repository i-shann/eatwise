import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../pages/types';

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

type Props = {
  route: RecipeDetailRouteProp;
};

export default function RecipeDetailScreen({ route }: Props) {
  const { recipe } = route.params;
  const navigation = useNavigation();

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView>

              <View>
        <Image source={{ uri: recipe.img_src }} style={styles.image} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backButtonOverlay}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.recipe_name}</Text>
         <View style={styles.infoRow}>
  <View style={styles.infoItem}>
    <Ionicons name="time" size={18} color="#4CA635" />
    <Text style={styles.infoText}>{recipe.total_time}</Text>
  </View>
  <View style={styles.infoItem}>
    <MaterialCommunityIcons name="fire" size={18} color="#4CA635" />
    <Text style={styles.infoText}>{recipe.calorie} kcal</Text>
  </View>
</View>

          <Text style={styles.label}>Ingredients:</Text>
          {recipe.ingredients.split(',').map((item, index) => (
            <Text key={index} style={styles.text}>• {item.trim()}</Text>
          ))}

          <Text style={styles.label}>Directions:</Text>
          {recipe.directions.split('.').filter(Boolean).map((step, index) => (
            <Text key={index} style={styles.text}>{index + 1}. {step.trim()}.</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
image: {
  width: '100%',
  height: 350, // adjust as needed
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
},

content: {
  marginTop: 300, // a bit less than image height to overlay
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  minHeight: 600, // or 'flex: 1' if ScrollView handles the height
  zIndex: 1,
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
},
  text: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  label: {
   fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
    color: '#4CA635',
    fontWeight: 'bold'
  },
    backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 35 : 55,
    left: 16,
  },
  backButtonOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 6,
  },
  infoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
infoItem: {
  flexDirection: 'row',
  alignItems: 'center',
},
infoText: {
  fontSize: 15,
  marginLeft: 6,
  color: '#555',
},

});
