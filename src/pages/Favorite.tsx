import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useFavoritesStore } from '../pages/useFavoritesStore';

const screenHeight = Dimensions.get('window').height;

type FavoriteBoxProps = {
  label: string;
  image: string;
  onRemove: () => void;
};

const FavoriteBox: React.FC<FavoriteBoxProps> = ({ label, image, onRemove }) => {
  const handleRemove = () => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${label}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove },
      ]
    );
  };

  return (
    <View style={styles.box}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <TouchableOpacity onPress={handleRemove} style={styles.icon}>
        <Fontisto name="favorite" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );
};

export default function Favorite() {
  const { favorites, removeFavorite } = useFavoritesStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite</Text>

      {/* Green background at the top */}
      <View style={styles.greenSquare} />

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.recipe_name}
          renderItem={({ item }) => (
            <FavoriteBox
              label={item.recipe_name}
              image={item.img_src}
              onRemove={() => removeFavorite(item.recipe_name)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: 'transparent', // previously '#F9F9F9's
  paddingTop: 40,

  },
  greenSquare: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: screenHeight / 2.5,
    width: '100%',
    backgroundColor: '#4CA635',
    zIndex: -1,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  icon: {
    paddingLeft: 10,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
      fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    paddingTop: 40,
    textAlign: 'center',  // <== Center horizontally
  },
});
