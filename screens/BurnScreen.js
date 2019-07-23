import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CardView from '../common/CardView';

export default class BurnScreen extends React.Component {
    render() {
        return (
            <ScrollView style={styles.container}>
              <CardView>
                <Text>This is your burn!</Text>
              </CardView>
            </ScrollView>
        );
    }
}

BurnScreen.navigationOptions = {
  title: 'Burn',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
});