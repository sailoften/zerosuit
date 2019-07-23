import React from 'react';
import {StyleSheet, View, Text, SectionList} from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  //return <ExpoConfigView />;
  render() {
    return(
      <SectionList
        renderItem={({item, index, section}) => <View style={styles.item}><Text key={index}>{item}</Text></View>}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        sections={[
          {title: 'July 23, 2019', data: ['Transaction 1', 'Transaction 2']},
          {title: 'July 22, 2019', data: ['Transaction 1', 'Transaction 2']},
          {title: 'July 21, 2019', data: ['Transaction 1', 'Transaction 2']},
        ]}
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
