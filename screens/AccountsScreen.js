import React from 'react';
import {StyleSheet, View, Text, SectionList} from 'react-native';
import _ from 'lodash';
import { makeRequest, segmentScreen } from '../common/Utils';

export default class AccountsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
    }
  }

  componentDidMount() {
      this._getAccounts();
      segmentScreen("Connected Accounts Screen");
  }

  _getAccounts= async () => {
    const payload = await makeRequest('/api/transaction/accounts', {});
    if (!payload.error) {
      const transformed = this._transformAccounts(payload.accounts);
      this.setState({sections: transformed});
      console.log(transformed);
    }
  }

  _transformAccounts = (accounts) => {
    const groupedBy = _.chain(accounts).groupBy((acc) => {
        return "Quickbooks"
    }).map((data, title) => ({title, data})).value();
    return groupedBy;
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <Text style={styles.sectionHeader}>{section.title}</Text>
    );
  };

  _renderItem = ({ item, index, section }) => {
    return (
      <View style={styles.item}>
        <Text key={index}>{item.accountName}</Text>
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
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  }
});
