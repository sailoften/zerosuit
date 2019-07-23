import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import CardView from '../common/CardView';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="never"
        >

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            {false && <DevelopmentModeNotice />}
            <View style={styles.headerTextContainer}>
              <Text style={styles.getStartedText}>Hello!</Text>
              <Text style={styles.getStartedText}>Cash</Text>
              <Text style={styles.getStartedText}>Income</Text>
              <Text style={styles.getStartedText}>Credit Debt</Text>
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.homeCards}>
          <CardView>
            <Text>This is a card</Text>
          </CardView>
          <CardView>
            <Text>This is another card</Text>
          </CardView>
        </View>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6edf9',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'gray',
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 0,
  },
  headerContainer: {
    backgroundColor: 'gray',
    marginBottom: 20,
  },
  headerTextContainer: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  getStartedText: {
    fontSize: 17,
    color: 'white',
    lineHeight: 24,
  },
});
