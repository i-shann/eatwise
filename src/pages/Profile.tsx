import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { BodyContext } from '../context/UserBodyContext';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function Profile() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { bodyData } = useContext(BodyContext);

  const handleEditClick = () => {
    navigation.navigate('EditBodyStatus');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          />
          <View>
            <Text style={styles.name}>Sharieva Inez</Text>
            <Text style={styles.subLabel}>Activity Level: {bodyData?.activityLevel || '-'}</Text>
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

      {/* Health Summary Cards */}
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>24.9 kg/m²</Text>
          <Text style={styles.cardLabel}>BMI</Text>
          <Text style={styles.cardStatus}>
            Status: <Text style={styles.statusNormal}>Normal</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>2,400 calories</Text>
          <Text style={styles.cardLabel}>Calorie per day</Text>
          <Text style={styles.cardStatus}>
            Status: <Text style={styles.statusNormal}>Normal</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>50–60 kg</Text>
          <Text style={styles.cardLabel}>Ideal Weight</Text>
          <Text style={styles.cardStatus}>
            Status: <Text style={styles.statusAchieved}>Achieved</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CA635',
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
  cardSection: {
    marginTop: 30,
    paddingHorizontal: 20,
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
});
