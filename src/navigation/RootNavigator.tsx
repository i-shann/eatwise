// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import BottomTabs from './BottomTabs';
import Profile from '../pages/Profile';
import EditBodyStatus from '../pages/EditBodyStatus';
import RecipeDetail from '../pages/Recipe'; // You had this in HEAD part, include if still needed

// Define the types for the routes in the stack navigator
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  Profile: undefined;
  EditBodyStatus: undefined;
   // add if you're using this screen
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditBodyStatus" component={EditBodyStatus} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
