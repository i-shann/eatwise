// ../pages/useFavoritesStore.ts
import { create } from 'zustand';

export type Recipe = {
  recipe_name: string;
  img_src: string;
  total_time: string;
  calorie: string;
};

type FavoritesState = {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipeName: string) => void;
  toggleFavorite: (recipe: Recipe) => void;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  addFavorite: (recipe) =>
    set((state) => ({
      favorites: [...state.favorites, recipe],
    })),
  removeFavorite: (recipeName) =>
    set((state) => ({
      favorites: state.favorites.filter((r) => r.recipe_name !== recipeName),
    })),
  toggleFavorite: (recipe) => {
    const { favorites } = get();
    const exists = favorites.some((r) => r.recipe_name === recipe.recipe_name);
    if (exists) {
      get().removeFavorite(recipe.recipe_name);
    } else {
      get().addFavorite(recipe);
    }
  },
}));
