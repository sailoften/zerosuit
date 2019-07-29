import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View } from 'react-native';
import CardView from '../common/CardView';

export default class BurnScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryExpenses: [],
            totalBurn: 0,
        }
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }

    _getData = async () => {
        const url = 'https://masonic-staging-backend.onrender.com/api/transaction/burn';
        const body = {
            startDate: "2019-07-01T00:00:00.000",
            endDate: "2019-07-28T00:00:00.000",
        }
        const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
        });
        const payload = await res.json();
        this.setState({categoryExpenses: payload.categories, totalBurn: payload.spending });
        console.log(payload);
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    _renderExpenses = ({item}) => {
        return (
            <View style={styles.expenseCat}>
                <Text style={{width: '50%'}}>{item.category}</Text>
                <Text style={{width: '50%', textAlign: 'right'}}>${this._moneyFormat(item.amount)}</Text>
            </View>
        );
    }

    componentWillMount() {
        this._getData();
    }

    render() {
        const { categoryExpenses, totalBurn } = this.state;
        return (
            <ScrollView style={styles.container}>
              <CardView style={styles.burnCard}>
                <Text style={styles.burnAmount}>Parta spent ${this._moneyFormat(totalBurn)} so far this month</Text>
              </CardView>
              <CardView style={styles.expenseCard}>
                <Text style={styles.expenseTitle}>Payroll</Text>
                <FlatList
                    data={categoryExpenses}
                    keyExtractor={(item) => item.category}
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