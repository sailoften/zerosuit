import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import CardView from '../common/CardView';
import moment from 'moment';

export default class BurnScreen extends React.Component {
    constructor(props) {
        super(props);
        const date = this._getTimeRange();
        this.state = {
            categoryExpenses: [],
            peopleSpending: [],
            totalBurn: 0,
            startDate: date.start,
            endDate: date.end,
            company: '',
            firstDate: moment().subtract(10, 'month'),
            burnRange: []
        }
        this._getBurnRanges();
    }

    _getTimeRange = () => {
        const now = moment();
        const start = now.startOf('month').toDate();;
        const end = now.endOf('month').toDate();
        return { start, end };
    }

    _monthYear = (myear) => {
        const date = moment(myear, "MMM, YYYY");
        const start = date.startOf('month').toDate();;
        const end = date.endOf('month').toDate();
        return { start, end };
    }

    _getBurnRanges = () => {
        const { firstDate } = this.state;
        const inceptionNumber = parseInt(firstDate.format('YYYYMM'));
        const now = moment();
        const range = [];
        let iterNumber = parseInt(now.format('YYYYMM'));
        while (iterNumber >= inceptionNumber) {
            range.push(now.format('MMM, YYYY'));
            now.subtract(1, 'month');
            iterNumber = parseInt(now.format('YYYYMM'));
        }
        console.log(range);
        return range;
    }

    componentWillReceiveProps(props) {

    }

    _getData = async () => {
        const { startDate, endDate } = this.state;
        const url = 'https://masonic-backend.onrender.com' + '/api/transaction/categoryInfo';
        const body = {
            startDate, endDate
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
        this.setState({company: payload.company, categoryExpenses: payload.categories, totalBurn: payload.spending});
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    _renderExpenses = ({item}) => {
        return (
            <TouchableOpacity style={styles.expenseCat} onPress={() => this._goToExpense(item.category, item.categoryId)}>
                <Text style={{width: '50%'}}>{item.category}</Text>
                <Text style={{width: '50%', textAlign: 'right'}}>${this._moneyFormat(item.total)}</Text>
            </TouchableOpacity>
        );
    }

    _goToExpense = (category, categoryId) => {
        const { startDate, endDate } = this.state;
        this.props.navigation.navigate('Category', {
            cat: category,
            catId: categoryId, 
            startDate,
            endDate
        });
    }

    _renderPeople = ({item}) => {
        if (item.person === "null") {
            item.person = 'Company';
        }
        return (
            <View style={styles.expenseCat}>
                <Text style={{width: '50%'}}>{item.person}</Text>
                <Text style={{width: '50%', textAlign: 'right'}}>${this._moneyFormat(item.amount)}</Text>
            </View>
        );
    }

    componentWillMount() {
        this._getData();
    }

    render() {
        const { categoryExpenses, totalBurn, peopleSpending, company } = this.state;
        //TODO: put button in for date picker
        return (
            <ScrollView style={styles.container}>
              <CardView style={styles.burnPickerCard}>
                <Text>Displaying burn for October</Text>
                <RNPickerSelect
                    onValueChange={(value) => console.log(value)}
                    items={[
                        { label: 'Football', value: 'football' },
                        { label: 'Baseball', value: 'baseball' },
                        { label: 'Hockey', value: 'hockey' },
                    ]}
                />
              </CardView>
              <CardView style={styles.burnCard}>
                <Text style={styles.burnAmount}>{company} spent ${this._moneyFormat(totalBurn)} so far this month</Text>
              </CardView>
              <CardView style={styles.expenseCard}>
                <Text style={styles.expenseTitle}>Company Expenses</Text>
                <FlatList
                    data={categoryExpenses}
                    keyExtractor={(item) => item.categoryId}
                    renderItem={this._renderExpenses}
                />
              </CardView>
              <CardView style={styles.expenseCard}>
                <Text style={styles.expenseTitle}>Spending By Person</Text>
                <FlatList
                    data={peopleSpending}
                    keyExtractor={(item) => item.person}
                    renderItem={this._renderPeople}
                />
              </CardView>
            </ScrollView>
        );
    }
}

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
  burnPickerCard: {
    paddingVertical: 30, 
    paddingHorizontal: 30
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