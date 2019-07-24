import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View } from 'react-native';
import CardView from '../common/CardView';

export default class BurnScreen extends React.Component {
    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    _renderExpenses = ({item}) => {
        return (
            <View style={styles.expenseCat}>
                <Text style={{width: '50%'}}>{item.key}</Text>
                <Text style={{width: '50%', textAlign: 'right'}}>${this._moneyFormat(item.amount)}</Text>
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
              <CardView style={styles.burnCard}>
                <Text style={styles.burnAmount}>Parta spent $13,231 so far this month</Text>
              </CardView>
              <CardView style={styles.expenseCard}>
                <Text style={styles.expenseTitle}>Payroll</Text>
                <FlatList
                    data={[{key: 'Tim Apple', amount: 11210.21}, {key: 'Jony Ive', amount: 12210.21}, {key: 'Craig Federighi', amount: 3210.21}]}
                    renderItem={this._renderExpenses}
                />
              </CardView>
              <CardView style={styles.expenseCard}>
                <Text style={styles.expenseTitle}>Company Expenses</Text>
                <FlatList
                    data={[{key: 'Meals', amount: 3210.21}, {key: 'Uber', amount: 3210.21}, {key: 'Travel', amount: 3210.21}]}
                    renderItem={this._renderExpenses}
                />
              </CardView>
            </ScrollView>
        );
    }
}

BurnScreen.navigationOptions = {
  title: 'Burn',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
  burnCard: {
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  burnAmount: {
    textAlign: 'center',
    fontSize:25,
    lineHeight: 35,
  },
  expenseTitle: {
    marginBottom: 20,
    fontWeight:"700",
  },
  expenseCat: {
    paddingVertical: 15,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
  }
});