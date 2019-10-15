import React from 'react';
import {StyleSheet, TouchableOpacity, Text, SectionList, View} from 'react-native';
import PATextInput from '../common/PATextInput';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';

export default class CategoryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      allSections: [],
      sections: [],
      search: '',
      startDate: this.props.navigation.getParam("startDate"),
      endDate: this.props.navigation.getParam("endDate"),
      category: this.props.navigation.getParam("cat"),
      categoryId: this.props.navigation.getParam("catId")
    };
  }

  componentWillMount() {
    this._fetchTransactions();
  }

  _fetchTransactions = async() => {
    const {startDate, endDate, categoryId} = this.state;
    const body = {
        startDate,
        endDate,
        category: categoryId,
    }
    const url = 'https://masonic-backend.onrender.com' + '/api/transaction/categoryTransactions';
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const payload = await res.json();
    await this._transformTransactions(payload);
    this.setState({ loading: false });
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
    //this.setState({ search: searchText });
    if (searchText === '') {
      this.setState({ sections: allSections });
    }
    const search = searchText.toLowerCase().trim();
    const filteredTx = _.chain(allSections).map((section) => {
      const newData = [];
      const title = section.title;
      section.data.forEach((tx) => {
        const name = tx.merchantName ? tx.merchantName : '';
        if (name.toLowerCase().includes(search)) {
          newData.push(tx);
        }
      });
      if (newData.length > 0) {
        return ({ title, data: newData });
      }
    }).compact().value();
    if (filteredTx.length === 0) {
      this.setState({ sections: [{title: "No transactions found", data: []}]});
    } else {
      this.setState({ sections: filteredTx})
    }
  }

  _moneyFormat = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <Text style={styles.sectionHeader}>{section.title}</Text>
    );
  };

  _renderEmptyList = () => {
    const { loading } = this.state;
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>{ loading? 'Loading...' : 'No Transactions' }</Text>
      </View>
    )
  }

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
                  Icon={() => {
                    return <Ionicons name="md-arrow-down" size={24} color="gray" />;
                  }}
                />
    );
  }

  _onTxPress = (item) => {
    this.props.navigation.navigate('TxScreen', {
      tx: item
    });
  }

  _txTitle = (item) => {
    switch(item.transactionType) {
      case 'Expense':
        if (item.merchantName) {
          return item.merchantName;
        } else if (item.memo && item.memo !== '') {
          return item.memo;
        } else {
          return 'Untitled Transaction'
        }
      case 'Transfer':
        return "Transfer: " + item.merchantName;
      default:
        if (item.merchantName) {
          return item.merchantName;
        } else if (item.memo && item.memo !== '') {
          return item.memo;
        } else {
          return 'Untitled Transaction'
        }
    }
  }

  _renderItem = ({ item, index, section }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this._onTxPress(item)}>
        <Text numberOfLines={1} style={{width: '70%'}} key={index}>{this._txTitle(item)}</Text>
        <Text style={{width: '30%', textAlign: 'right'}}>${this._moneyFormat(item.amount)}</Text>
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
        ListEmptyComponent={this._renderEmptyList}
      />
    );
  }
}

CategoryView.navigationOptions = {
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
