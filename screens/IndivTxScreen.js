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

export default function TxScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        >

        <View style={styles.headerContainer}>
          {false && <DevelopmentModeNotice />}
          <View style={styles.headerTextContainer}>
            <Text style={styles.getStartedText}>Transaction Details Here</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

TxScreen.navigationOptions = {
  title: 'Transaction',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6edf9',
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
