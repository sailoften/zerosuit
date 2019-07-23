import React from 'react';
import {StyleSheet, View, Text, SectionList} from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {title: 'July 23, 2019', data: [{name: 'Transaction 1', value: 1244}, {name: 'Transaction 1', value: 1244}]},
        {title: 'July 22, 2019', data: [{name: 'Transaction 1', value: 1244}, {name: 'Transaction 1', value: 1244}]},
        {title: 'July 21, 2019', data: [{name: 'Transaction 1', value: 1244}, {name: 'Transaction 1', value: 1244}]},
      ]
    }
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <Text style={styles.sectionHeader}>{section.title}</Text>
    );
  };

  _renderItem = ({ item, index, section }) => {
    return (
      <View style={styles.item}>
        <Text key={index}>{item.name}, {item.value}</Text>
      </View>
    );
  };

  render() {
    const { sections } = this.state;
    return(
      <SectionList
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={sections}
        keyExtractor={(item, index) => item + index}
      />
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'Transactions',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
  sectionHeader: {
    flex: 1,
    paddingVertical: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: '#e6edf9',
  },
  item: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  }
});
