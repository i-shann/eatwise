// src/pages/Signup.tsx
import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function Signup() {
  const navigation = useNavigation<any>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

   const handleLoginTab = () => {
      navigation.navigate("Login"); // navigate to Login screen
    };

    const handleSignupTab = () => {
      navigation.navigate("Signup"); // navigate to Signup screen
    };

  const handleSignup = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', `Account created for ${firstName} ${lastName}`);
    // Navigate to login or home
    navigation.navigate('MainTabs');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>

    <View  style={styles.backBox } >
    <Image source={require('../images/header.jpg')}
      style ={styles.headerImage}
    />

  <View style={styles.greenTab}>
    {/*  greentab overlay */}
  </View>

    </View>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.Upperbutton} >
                {/* Sign in and sign up button on the upper part*/}
                <TouchableOpacity style={[styles.button, {marginRight:10, backgroundColor: 'white',  elevation: 10, 
}]} onPress={handleLoginTab}>
                  <Text style={[styles.buttonText, {color: '#4CA635'}]}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSignupTab}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

              </View>

          {/* First Name */}
          <View style={styles.inputContainer}>
           {/*  <Ionicons name="person-outline" size={30} color="gray" /> */}
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            {/* <Ionicons name="person-outline" size={30} color="gray" /> */}
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            {/* <Ionicons name="mail-outline" size={30} color="gray" /> */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            {/* <SimpleLineIcons name="lock" size={30} color="gray" /> */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
              <Ionicons name = {showPassword ? "eye" : "eye-off"} size={25} color={"gray"} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
           {/* <SimpleLineIcons name="lock" size={30} color="gray" />*/}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />

          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
            <Ionicons name = {showPassword ? "eye" : "eye-off"} size={25} color={"gray"} />
          </TouchableOpacity>

          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

        </View>
      </View>

      <Image source={require('../images/fruit.png')}
      style ={styles.footerImage}
    />

    </View>
  );
}

const styles = StyleSheet.create({

  // The green tab overlay
  greenTab: {
    position: 'absolute',
    width: '100%',
    height: height * 0.45, // taller image for cropping
    backgroundColor: 'rgba(76, 166, 53, 0.6)',  // green
    borderRadius: 30,
    zIndex: 10,
    elevation: 5,
  },

  backBox:{
    width: Dimensions.get('window').width,
    height: 280,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0,
  },
  
  footerImage:{
    width: '50%',
    height: 300, // taller image for cropping
    bottom: -50,
    transform: [{rotate: '-90 deg'}],
    position: 'absolute',
    marginLeft: '40%',

  },


  headerImage:{
  width: '100%',
  height: height * 0.45, // taller image for cropping
  marginTop: -height * 0.09, // shift up to center image content
  },

  container: {
    flex: 1,
    position:'relative',
    backgroundColor: "white", // background of the whole screen
  },

  background: {
    width: Dimensions.get('window').width,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    marginBottom: -50,
  },


  headingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },

  headingTextOrange: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'orange',
  },

  content: {//front box
    /*width: Dimensions.get('window').width,*/
    width: Dimensions.get('window').width * 0.85,
    borderRadius:30,
    backgroundColor: 'white',
    marginTop: 5,
    height: '53%',
    alignItems: 'center',
    paddingTop: 42,
    marginLeft: 30,
    zIndex: 10,
    position: 'absolute',
    top: height * 0.2,
    shadowColor:"black",
    elevation: 10, //shadow
  },
  
  formContainer: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: -40,  
  },

  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    width: 250,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
  },

  Upperbutton:{
    flexDirection: 'row',
    padding: 15,
    width: '70%',
  },
  
  button: {
    backgroundColor: '#4CA635',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    width: '50%',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  signinText: {
    fontWeight: 'bold',
    marginLeft: 5,
    color: 'orange',
  },
});
