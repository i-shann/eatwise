import React, { useContext,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { BodyContext } from '../context/UserBodyContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator'; // Adjust path if needed


export default function EditBodyStatus() {
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [activityLevel, setActivityLevel] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const { setBodyData } = useContext(BodyContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Body Stats</Text>

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Male' && styles.genderSelected]}
          onPress={() => setGender('Male')}
        >
          <Text style={gender === 'Male' ? styles.genderTextSelected : styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Female' && styles.genderSelected]}
          onPress={() => setGender('Female')}
        >
          <Text style={gender === 'Female' ? styles.genderTextSelected : styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <Image 
        source={
          gender ==='Male'
          ? require('../../assets/male-avatar.png')
          : require('../../assets/female-avatar.png')
        }
        style={styles.avatar}

      />




      {/* Card-like input section */}
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="scale-bathroom" size={24} color="#4CA635" />
          <Text style={styles.inputLabel}>Weight</Text>
          <TextInput style={styles.inputField} 
          keyboardType="numeric" 
          placeholder="kg" 
          value={weight}
          onChangeText={setWeight} />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="resize-outline" size={24} color="#4CA635" />
          <Text style={styles.inputLabel}>Height</Text>
          <TextInput style={styles.inputField} 
          keyboardType="numeric" 
          placeholder="cm"
          value={height} 
          onChangeText={setHeight}/>
        </View>

        <View style={styles.inputRow}>
          <FontAwesome5 name="chart-line" size={20} color="#4CA635" />
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput 
          style={styles.inputField} 
          keyboardType="numeric" 
          placeholder=""
          value={age}
          onChangeText={setAge} />
        </View>



        <View style = {styles.inputRow}>
          <Ionicons name = "walk" size={24} color = "#4CA635" />
          <Text style = {styles.inputLabel}>Activity</Text>
          <View style = {styles.pickerContainer}>
          <Picker
            selectedValue = {activityLevel}
            style = {styles.picker}
            onValueChange={(itemValue) => setActivityLevel(itemValue)} 
            >
              <Picker.Item label ="Select Activity" value =""/>
              <Picker.Item label ="Sedentary" value = "Sedentary"/>
              <Picker.Item label ="Moderately Active" value = "Lightly Active"/>
              <Picker.Item label ="Very Active" value="Very Active"/>
            </Picker>
        </View>
      </View>

       <TouchableOpacity
  style={styles.confirmButton}
  onPress={() => {
    setBodyData({
      weight,
      height,
      age,
      gender,
      activityLevel,
    });
    navigation.goBack(); 
  }}
>
  <Text style={styles.confirmText}>Confirm</Text>
</TouchableOpacity>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9', 
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 18,
    color: '#4CA635',
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    marginVertical: 10,
 
  },
  genderButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 35,
    elevation: 2,
    width : '30%',
    alignItems: 'center',
    justifyContent:'center',
  },
  genderSelected: {
    backgroundColor: '#4CA635',
  },
  genderText: {
    color: '#4CA635',
    fontWeight: 'bold',
  },
  genderTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  avatar: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginVertical: -10,
   
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    elevation: 5,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputLabel: {
    marginLeft: 10,
    width: 70,
    fontSize: 16,
    color: '#333',
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4CA635',
    borderRadius: 8,
    padding: 8,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#4CA635',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer:{
  flex: 1,
  borderWidth: 1,
  borderColor: '#4CA635',
  borderRadius: 8,
  paddingHorizontal:8,
  marginLeft: 10,
  justifyContent: 'center',
  overflow: 'hidden',
  height: 40,
  backgroundColor: 'white',
  },
  picker: {
  color: '#333', // dark text
  width: '100%',
  fontSize : 12,

  
  }
});
