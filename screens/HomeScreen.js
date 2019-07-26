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

          <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <View style={styles.greetingCard}>
                <Text style={styles.getStartedText}>Hello Jimmy!</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardText}>Cash</Text>
                <Text style={[styles.statCardText, {textAlign: 'right'}]}>$15,000</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardText}>Income</Text>
                <Text style={[styles.statCardText, {textAlign: 'right'}]}>$15,000</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardText}>Credit Debt</Text>
                <Text style={[styles.statCardText, {textAlign: 'right'}]}>$15,000</Text>
              </View>
            </View>
          </View>

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
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 0,
  },
  headerContainer: {
    //backgroundColor: 'gray',
    marginBottom: 20,
  },
  headerTextContainer: {
    //marginHorizontal: 20,
    marginTop: 30,
  },
  getStartedText: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
  },
  greetingCard: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 45,
    paddingHorizontal: 20,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  },
  statCard: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  },
  statCardText: {
    fontSize: 15,
    color: 'black',
    lineHeight: 24,
    width: '50%'
  }
});
