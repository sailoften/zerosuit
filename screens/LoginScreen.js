import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>

        <View style={styles.headerContainer}>
          {false && <DevelopmentModeNotice />}
          <View style={styles.headerTextContainer}>
            <Text style={styles.getStartedText}>Login to Masonic</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

LoginScreen.navigationOptions = {
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
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  headerContainer: {
    backgroundColor: 'gray',
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
