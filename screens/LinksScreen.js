import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import CardView from '../common/CardView';

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container}>
      <CardView>
        <Text>This is your burn!</Text>
      </CardView>
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Burn',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
});