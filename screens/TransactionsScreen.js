import React from 'react';
import {StyleSheet, TouchableOpacity, Text, SectionList, View, RefreshControl} from 'react-native';
import { formatMoney, txTitle, makeRequest } from '../common/Utils';
import PATextInput from '../common/PATextInput';
import _ from 'lodash';
import * as Segment from 'expo-analytics-segment';

export default class TransactionsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allSections: [],
      sections: [],
      search: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this._fetchTransactions();
    Segment.screen("All Transactions Screen");
  }

  _fetchTransactions = async() => {
    const payload = await makeRequest('/api/transaction/get', {});
    await this._transformTransactions(payload.transactions);
  }

  _transformTransactions = async(payload) => {
    //TODO: need to sort by date
    const payloadGrouped = _.chain(payload).groupBy((tx) => {
      const timeStamp = new Date(tx.transactionDate).toDateString();
      return timeStamp;
    }).map((data, title) => ({ title, data })).value();
    this.setState({sections: payloadGrouped, allSections: payloadGrouped})
  }

  _onRefresh = async() => {
    console.log("Refreshing transactions");
    this.setState({ refreshing: true });
    await this._fetchTransactions();
    this.setState({ refreshing: false });
  }

  _searchTransactions = (searchText) => {
    console.log("New search query: " + searchText);
    const { allSections } = this.state;
    if (searchText === '') {
      this.setState({ sections: allSections })
    }
    const search = searchText.toLowerCase().trim();
    const filteredTx = _.chain(allSections).map((section) => {
      const newData = [];
      const title = section.title;
      section.data.forEach((tx) => {
        const name = txTitle(tx);
        if (name.toLowerCase().includes(search)) {
          newData.push(tx);
        }
      });
      if (newData.length > 0) {
        return ({ title, data: newData });
      }
    }).compact().value();
    Segment.trackWithProperties("Transaction search", {query: searchText});
    console.log('Search Done');
    // DuctTape.gif
    if (filteredTx.length === 0) {
      this.setState({ sections: [{title: "No transactions found", data: []}]});
    } else {
      this.setState({ sections: filteredTx})
    }
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <Text style={styles.sectionHeader}>{section.title}</Text>
    );
  };

  _renderSearch = () => {
    return (
      <PATextInput
        style={styles.inputField}
        clearButtonMode="while-editing"
        placeholder="Search"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={searchText => this._searchTransactions(searchText)}
        returnKeyType='go'
      />
    );
  }

  _renderEmptyList = () => {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  _onTxPress = (item) => {
    this.props.navigation.navigate('TxScreen', {
      tx: item
    });
  }

  _renderItem = ({ item, index, section }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this._onTxPress(item)}>
        <Text numberOfLines={1} style={{width: '70%'}} key={index}>{txTitle(item)}</Text>
        <Text style={{width: '30%', textAlign: 'right'}}>{formatMoney(item.amount)}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { sections, refreshing } = this.state;
    return(
      <SectionList
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={sections}
        ListEmptyComponent={this._renderEmptyList}
        keyExtractor={(item, index) => item + index}
        ListHeaderComponent={this._renderSearch}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
        }
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
  loading: {
    paddingVertical: 20,
  },
  loadingText: {
    textAlign: 'center'
  }
});
