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
          {false && <DevelopmentModeNotice />}
          <View style={styles.headerTextContainer}>
            <Text style={styles.getStartedText}>Hello!</Text>
            <Text style={styles.getStartedText}>Cash</Text>
            <Text style={styles.getStartedText}>Income</Text>
            <Text style={styles.getStartedText}>Credit Debt</Text>
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

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6edf9',
  },
  contentContainer: {
    paddingTop: 30,
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
