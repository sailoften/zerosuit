import React from 'react';
import {StyleSheet, View, Text, SectionList} from 'react-native';
import CardView from '../common/CardView';

export default class AccountsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {title: 'Banks', data: [{name: 'Silicon Valley Bank'}, {name: 'Mercury Checking'}]},
        {title: 'Credit Cards', data: [{name: 'Brex'}, {name: 'American Express Platinum'}]},
        {title: 'Payroll', data: [{name: 'Gusto'}]},
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
      <CardView>
        <Text key={index}>{item.name}</Text>
      </CardView>
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

AccountsScreen.navigationOptions = {
  title: 'Accounts',
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
