// src/navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Favorite from '../pages/Favorite';
import Progress from '../pages/Progress';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'Discover') iconName = 'compass';
          else if (route.name === 'Progress') iconName = 'bar-chart';
          else if (route.name === 'Favorite') iconName = 'heart';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CA635',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Discover" component={Home} options={{headerShown : false}} />
      
      <Tab.Screen name="Progress" component={Progress} options={{headerShown : false}}/>
      <Tab.Screen name="Favorite" component={Favorite} options={{headerShown : false}}/>
      <Tab.Screen name="Profile" component={Profile} options = {{headerShown: false}} />
    </Tab.Navigator>
  );
}
