import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BodyData {
  weight: string;
  height: string;
  age: string;
  gender: 'Male' | 'Female';
  activityLevel: string;
}

interface BodyContextProps {
  bodyData: BodyData;
  setBodyData: (data: BodyData) => void;
}

export const BodyContext = createContext<BodyContextProps>({
  bodyData: { weight: '', height: '', age: '', gender: 'Female', activityLevel: '' },
  setBodyData: () => {},
});

export const BodyProvider = ({ children }: { children: ReactNode }) => {
  const [bodyData, setBodyDataState] = useState<BodyData>({
    weight: '',
    height: '',
    age: '',
    gender: 'Female',
    activityLevel: '',
  });

  const setBodyData = async (data: BodyData) => {
    setBodyDataState(data);
    await AsyncStorage.setItem('bodyData', JSON.stringify(data));
  };

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem('bodyData');
      if (stored) setBodyDataState(JSON.parse(stored));
    };
    loadData();
  }, []);

  return (
    <BodyContext.Provider value={{ bodyData, setBodyData }}>
      {children}
    </BodyContext.Provider>
  );
};
