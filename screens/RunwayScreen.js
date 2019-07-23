import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CardView from '../common/CardView';

export default class RunwayScreen extends React.Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <CardView>
                    <Text>Based on last month's burn rate, you have 2 days of runway</Text>
                </CardView>
            </ScrollView>
        );
    }
}

RunwayScreen.navigationOptions = {
  title: 'Burn',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
});