import React, { use } from 'react';
import { BodyProvider } from './src/context/UserBodyContext'; // adjust if needed
import RootNavigator from './src/navigation/RootNavigator';
import { useEffect } from 'react';


export default function App() {
  return (
    <BodyProvider>
      <RootNavigator />
    </BodyProvider>
  );
}
