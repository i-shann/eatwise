import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useFavoritesStore } from '../pages/useFavoritesStore';

type FavoriteBoxProps = {
  label: string;
  image: string;
};

const FavoriteBox: React.FC<FavoriteBoxProps> = ({ label, image }) => {
  return (
    <View style={styles.box}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => Alert.alert('This is a favorite item')}
        style={styles.icon}
      >
        <Fontisto name="favorite" size={28} color="green" />
      </TouchableOpacity>
    </View>
  );
};

export default function Favorite() {
  const { favorites } = useFavoritesStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.recipe_name}
        renderItem={({ item }) => (
          <FavoriteBox label={item.recipe_name} image={item.img_src} />
        )}
        ListEmptyComponent={<Text>No favorites yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F9F9F9',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    height: 80,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  icon: {
    marginLeft: 10,
  },
});
