// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import BottomTabs from './BottomTabs';
import Profile from '../pages/Profile';
import EditBodyStatus from '../pages/EditBodyStatus';
import RecipeDetail from '../pages/Recipe';
import Favorite from '../pages/Favorite';

// Define the types for the routes in the stack navigator
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  Profile: undefined;
  EditBodyStatus: undefined;
  RecipeDetail: undefined;
  Favorite: undefined;  // <-- Added Favorite here
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }} // header hidden on all screens
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditBodyStatus" component={EditBodyStatus} />
<Stack.Screen
  name="Favorite"
  component={Favorite}
  options={{ headerShown: false }} // <- still works too
/>      

</Stack.Navigator>
    </NavigationContainer>
  );
}
