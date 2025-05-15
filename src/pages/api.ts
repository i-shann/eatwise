// src/services/api.ts

export const fetchRecipes = async (
  selectedIngredients: string[],
  selectedMeal: string,
  name: string = 'haha' // optional: override default name
) => {
  try {
    const response = await fetch('https://213b-136-158-32-235.ngrok-free.app/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        ingredients: selectedIngredients,
        meal: selectedMeal,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('fetchRecipes error:', error);
    throw error;
  }
};
