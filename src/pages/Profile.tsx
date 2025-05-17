import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/RootNavigator';
import { BodyContext } from '../context/UserBodyContext';
import {
  calculateBMI,
  getBMIStatus,
  calculateIdealWeightRange,
  calculateDailyCalories,
} from '../utils/bodyCalculations';

const screenHeight = Dimensions.get('window').height;

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

export default function Profile() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { bodyData, setBodyData } = useContext(BodyContext);
  const weight = parseFloat(bodyData?.weight || '0');
  const height = parseFloat(bodyData?.height || '0');
  const age = parseInt(bodyData?.age || '0', 10);
  const gender = bodyData?.gender || 'Female';
  const activityLevel = bodyData?.activityLevel || 'Sedentary';

  const hasBodyData = weight > 0 && height > 0 && age > 0;

  const bmi = calculateBMI(weight, height);
  const bmiStatus = getBMIStatus(parseFloat(bmi));
  const idealWeight = calculateIdealWeightRange(height);
  const dailyCalories = calculateDailyCalories(
    weight,
    height,
    age,
    gender,
    activityLevel
  );

  const handleLogout = async () => {
    try {
      setBodyData({
        weight: '',
        height: '',
        age: '',
        gender: 'Female',
        activityLevel: '',
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEditClick = () => {
    navigation.navigate('EditBodyStatus');
  };

  return (
    <View style={{ flex: 1, position: 'relative', backgroundColor: '#fff' }}>
      {/* Green square background like in Progress screen */}
      <View style={styles.greenSquare} />

      <ScrollView
        contentContainerStyle={{ 
          flexGrow: 1,
          backgroundColor: '#4CA635',
          paddingTop: 40
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Green header section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.editIcon} onPress={handleEditClick}>
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Image
              source={
                bodyData?.gender === 'Male'
                  ? require('../../assets/male-avatar.png')
                  : require('../../assets/female-avatar.png')
              }
              style={styles.avatar}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.name}>Sharieva Inez</Text>
              <Text style={styles.subLabel}>
                Activity Level: {bodyData?.activityLevel || '-'}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bodyData?.height || '-'} cm</Text>
              <Text style={styles.statLabel}>Height</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bodyData?.weight || '-'} kg</Text>
              <Text style={styles.statLabel}>Weight</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bodyData?.age || '-'}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
          </View>
        </View>

        {/* White content section */}
        <View style={styles.contentSection}>
          {!hasBodyData ? (
            <View style={styles.cardSection}>
              <Text style={{ textAlign: 'center', color: '#999', fontSize: 16 }}>
                Please enter your body information to see health stats.
              </Text>
            </View>
          ) : (
            <View style={styles.cardSection}>
              <View style={styles.card}>
                <Text style={styles.cardValue}>{bmi} kg/m²</Text>
                <Text style={styles.cardLabel}>BMI</Text>
                <Text style={styles.cardStatus}>
                  Status: <Text style={styles.statusNormal}>{bmiStatus}</Text>
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardValue}>
                  {dailyCalories.toLocaleString()} calories
                </Text>
                <Text style={styles.cardLabel}>Calorie per day</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardValue}>
                  {idealWeight.min}–{idealWeight.max} kg
                </Text>
                <Text style={styles.cardLabel}>Ideal Weight</Text>
                <Text style={styles.cardStatus}>
                  Status: <Text style={styles.statusAchieved}>Achieved</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Logout button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  greenSquare: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: screenHeight / 2.5,
    width: '100%',
    backgroundColor: '#4CA635',
  },
  header: {
    backgroundColor: 'transparent', // Let the greenSquare show through
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  editIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subLabel: {
    color: 'white',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 12,
  },
  contentSection: {
    flex: 1,
    backgroundColor: 'white',
    //marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  cardSection: {
    marginTop: 30,
  },
  card: {
    backgroundColor: '#f2f2f2',
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  cardStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  statusNormal: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusAchieved: {
    color: 'green',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
