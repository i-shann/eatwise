import React from 'react';
import { BodyProvider } from './src/context/UserBodyContext'; // adjust if needed
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <BodyProvider>
      <RootNavigator />
    </BodyProvider>
  );
}
