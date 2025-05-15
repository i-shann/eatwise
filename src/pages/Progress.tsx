import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Progress() {
  const calorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [1800, 2000, 1900, 2100, 2000, 2200, 2000] }],
  };

  const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ data: [70, 69.5, 69, 68.8, 68.5, 68, 67.5, 67.2, 67, 66.8, 66.5, 66] }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#EAF4E7',
    backgroundGradientTo: '#EAF4E7',
    color: (opacity = 1) => `rgba(76, 166, 53, ${opacity})`,
    labelColor: () => '#667085',
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <View style={styles.root}>
      {/* Green Square Background */}
      <View style={styles.greenSquare} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Progress Tracker</Text>

          <Text style={styles.header}>Calorie Intake (kcal)</Text>
          <BarChart
            data={calorieData}
            width={screenWidth - 50}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" kcal"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={styles.chart}
          />

          <View style={{ height: 24 }} />

          <Text style={styles.header}>Weight Progress (kg)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={weightData}
              width={screenWidth * 1.5}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" kg"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              style={{ ...styles.chart, marginRight: 16 }}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  greenSquare: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: screenHeight / 2.5, // covers upper section of screen
    width: '100%',
    backgroundColor: '#4CA635',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 16,
  paddingTop: 40, // Adjust as needed
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#667085',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EAF4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
});
