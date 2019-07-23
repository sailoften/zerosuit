import React from 'react';
import {StyleSheet, TouchableOpacity, Text, SectionList} from 'react-native';

export default class TransactionsScreen extends React.Component {
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

  _onTxPress = () => {
    this.props.navigation.navigate('TxScreen');
  }

  _renderItem = ({ item, index, section }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={this._onTxPress}>
        <Text key={index}>{item.name}, {item.value}</Text>
      </TouchableOpacity>
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

TransactionsScreen.navigationOptions = {
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
