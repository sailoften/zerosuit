import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import RubikLight from './assets/fonts/Rubik/Rubik-Light.ttf';
import RubikRegular from './assets/fonts/Rubik/Rubik-Regular.ttf';
import RubikMedium from './assets/fonts/Rubik/Rubik-Medium.ttf';
import RubikBold from './assets/fonts/Rubik/Rubik-Bold.ttf';

import MaisonNeueLight from './assets/fonts/MaisonNeue/MaisonNeue-Light.ttf';
import MaisonNeueRegular from './assets/fonts/MaisonNeue/MaisonNeue-Book.ttf';
import MaisonNeueMedium from './assets/fonts/MaisonNeue/MaisonNeue-Demi.ttf';
import MaisonNeueBold from './assets/fonts/MaisonNeue/MaisonNeue-Bold.ttf';

import AppNavigator from './navigation/AppNavigator';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'Rubik-Light': RubikLight,
      'Rubik-Regular': RubikRegular,
      'Rubik-Medium': RubikMedium,
      'Rubik-Bold': RubikBold,
      'MaisonNeue-Light': MaisonNeueLight,
      'MaisonNeue-Regular': MaisonNeueRegular,
      'MaisonNeue-Medium': MaisonNeueMedium,
      'MaisonNeue-Bold': MaisonNeueBold,
    }),
  ]);
}

function handleLoadingError(error: Error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
