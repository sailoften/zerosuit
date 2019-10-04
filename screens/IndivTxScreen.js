import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import CardView from '../common/CardView';

export default class TxScreen extends React.Component {
    constructor(props) {
        super(props);
        const tx = this.props.navigation.getParam("tx");
        this.state = {
            tx,
        }
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    _dateFormat = (dateString) => {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString();
    }

    _renderItem = ({item}) => {
        if (item.key && item.desp) {
            return (
                <View style={styles.despItem}>
                  <Text style={[styles.despText, {width: '30%'}]}>{item.key}</Text>
                  <Text style={[styles.despText, {textAlign: 'right', width: '70%'}]}>{item.desp}</Text>
                </View>
              );
        }
    }

    _getData = () => {
        const { tx } = this.state;
        return [
            {key: 'Date', desp: this._dateFormat(tx.transactionDate)},
            {key: 'Category', desp: tx.expenseCategory},
            {key: 'Person', desp: tx.transactionOwner},
            {key: 'Account', desp: tx.qbAccount.accountName},
        ]
    }

    render() {
        const { tx } = this.state;
        return (
            <View style={styles.container}>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                >

                <View style={styles.headerContainer}>
                    <Text style={[styles.titleText, {width: '70%'}]}>{tx.merchantName}</Text>
                    <Text style={[styles.titleText, {width: '30%', textAlign: 'right'}]}>${this._moneyFormat(tx.amount)}</Text>
                </View>
        
                <View>
                  <CardView style={styles.headerTextContainer}>
                  <FlatList
                    data={this._getData()}
                    renderItem={this._renderItem} />
                  </CardView>
                </View>
              </ScrollView>
            </View>
        );
    }
}

TxScreen.navigationOptions = {
  title: 'Transaction',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6edf9',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerContainer: {
    marginTop: 40,
    marginHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  headerTextContainer: {
  },
  getStartedText: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
  },
  despItem: {
    paddingVertical: 15,
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  },
  despText: {
      
  }
});
