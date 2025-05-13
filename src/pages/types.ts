export type Recipe = {
  recipe_name: string;
  meal_type: string;
  total_time: string;
  calorie: string;
  ingredients: string;
  directions: string;
  img_src: string;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  RecipeDetail: { recipe: Recipe };
};