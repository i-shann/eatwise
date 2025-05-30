import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function App() {
  const [prediction, setPrediction] = useState('');

  const handlePress = async () => {
    try {
      console.log("Sending request to backend...");
      const response = await fetch('https://43cb-136-158-32-235.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 's',
                               
         }),
      });
  
      console.log("Received response:", response);
      const data = await response.json();
      console.log("Parsed JSON:", data);
  
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error during fetch:', error);
      setPrediction('Failed to connect');
    }
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Send to Backend" onPress={handlePress} />
      <Text style={{ marginTop: 20 }}>{prediction}</Text>
    </View>
  );
}
