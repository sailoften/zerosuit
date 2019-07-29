import React from 'react';
import {StyleSheet, TouchableOpacity, Text, SectionList, View} from 'react-native';
import PATextInput from '../common/PATextInput';
import _ from 'lodash';

export default class TransactionsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allSections: [],
      sections: [],
      search: ''
    };
  }

  componentWillMount() {
    this._fetchTransactions();
  }

  _fetchTransactions = async() => {
    const url = 'https://masonic-staging-backend.onrender.com/api/transaction/get';
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const payload = await res.json();
    await this._transformTransactions(payload);
  }

  _transformTransactions = async(payload) => {
    const payloadGrouped = _.chain(payload).groupBy((tx) => {
      const timeStamp = new Date(tx.transactionDate).toDateString();
      return timeStamp;
    }).map((data, title) => ({ title, data })).value();
    this.setState({sections: payloadGrouped, allSections: payloadGrouped})
  }

  _searchTransactions = (searchText) => {
    const { allSections } = this.state;
    this.setState({ search: searchText });
    if (searchText === "") {
      return allSections;
    }
    const search = searchText.toLowerCase().trim();
    const filteredTx = _.chain(allSections).map((section) => {
      const newData = [];
      const title = section.title;
      section.data.forEach((tx) => {
        if (tx.merchantName.toLowerCase().includes(search)) {
          newData.push(tx);
        }
      });
      if (newData.length > 0) {
        return ({ title, data: newData });
      }
    }).compact().value();
    console.log('Search Done');
    this.setState({ sections: filteredTx})
  }

  _moneyFormat = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <Text style={styles.sectionHeader}>{section.title}</Text>
    );
  };

  _renderSearch = () => {
    const { search } = this.state;
    return (
      <PATextInput
                  style={styles.inputField}
                  clearButtonMode="while-editing"
                  placeholder="Search"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={searchText => this._searchTransactions(searchText)}
                  value={search}
                  returnKeyType='go'
                />
    );
  }

  _onTxPress = (item) => {
    this.props.navigation.navigate('TxScreen', {
      tx: item
    });
  }

  _renderItem = ({ item, index, section }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this._onTxPress(item)}>
        <Text style={{width: '50%'}} key={index}>{item.merchantName}</Text>
        <Text style={{width: '50%', textAlign: 'right'}}>${this._moneyFormat(item.amount)}</Text>
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
        ListHeaderComponent={this._renderSearch}
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
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  inputField: {
    height: 45,
    fontSize: 16,
    borderColor: '#efefef',
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
});
