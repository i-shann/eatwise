export const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

export const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateIdealWeightRange = (height: number) => {
  const heightInMeters = height / 100;
  const min = 18.5 * heightInMeters * heightInMeters;
  const max = 24.9 * heightInMeters * heightInMeters;
  return {
    min: min.toFixed(1),
    max: max.toFixed(1),
  };
};

export const calculateDailyCalories = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string
) => {
  // BMR using Mifflin-St Jeor Equation
  const bmr =
    gender === 'Male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  let activityMultiplier = 1.2;
  if (activityLevel === 'Lightly Active') activityMultiplier = 1.375;
  if (activityLevel === 'Moderately Active') activityMultiplier = 1.55;
  if (activityLevel === 'Very Active') activityMultiplier = 1.725;

  return Math.round(bmr * activityMultiplier);
};
