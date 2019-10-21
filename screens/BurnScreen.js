import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import * as Segment from 'expo-analytics-segment';
import CardView from '../common/CardView';
import moment from 'moment';
import getEnvVars from '../env';
const { apiUrl } = getEnvVars();

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
            firstDate: null,
            burnRange: [],
            currMonth: date.curr,
            loading: true,
            refreshing: false,
        }
    }

    _getTimeRange = () => {
        const now = moment.utc();
        const start = now.startOf('month').toDate();;
        const end = now.endOf('month').toDate();
        const curr = now.format('MMMM, YYYY');
        return { start, end, curr };
    }

    _monthYear = (myear) => {
        const date = moment.utc(myear, "MMMM, YYYY");
        const start = date.startOf('month').toDate();;
        const end = date.endOf('month').toDate();
        return { start, end };
    }

    _getBurnRanges = (firstDate) => {
        const inceptionNumber = parseInt(moment(firstDate).format('YYYYMM'));
        const now = moment();
        const range = [];
        let iterNumber = parseInt(now.format('YYYYMM'));
        while (iterNumber >= inceptionNumber) {
            range.push({ label: now.format('MMMM, YYYY'), value: now.format('MMMM, YYYY')});
            now.subtract(1, 'month');
            iterNumber = parseInt(now.format('YYYYMM'));
        }
        this.setState({burnRange: range});
        return range;
    }

    _getData = async (start, end) => {
        this.setState({ loading: true});
        const { startDate, endDate, burnRange } = this.state;
        console.log("StartDate: " + startDate + " EndDate: " + endDate);
        const url = `${apiUrl}/api/transaction/categoryInfo`;
        const body = {
            startDate: start ? start : startDate,
            endDate: end ? end : endDate
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
        if (burnRange.length === 0) {
            this._getBurnRanges(payload.firstDate);
        }
        this.setState({company: payload.company, categoryExpenses: payload.expenseInfo, totalBurn: payload.spending, loading: false});
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true});
        await this._getData();
        this.setState({ refreshing: false});
    }

    _changeDates = async (monthYear) => {
        const dates = this._monthYear(monthYear);
        this.setState({startDate: dates.start, endDate: dates.end, currMonth: monthYear });
        await this._getData(dates.start, dates.end);
        Segment.trackWithProperties("Changed burn month", { month: monthYear });
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
        Segment.trackWithProperties("Selected Indiv Category", { category, categoryId });
        this.props.navigation.navigate('Category', {
            cat: category,
            catId: categoryId, 
            startDate,
            endDate
        });
    }

    // Deprecated
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

    componentDidMount() {
        this._getData();
        Segment.screen("Burn Screen");
    }

    render() {
        const { categoryExpenses, totalBurn, burnRange, currMonth, company, loading, refreshing } = this.state;
        //TODO: put button in for date picker
        return (
            <ScrollView style={styles.container} 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
            }>
              <CardView style={styles.burnPickerCard}>
                <RNPickerSelect
                    onValueChange={(value) => this._changeDates(value)}
                    placeholder={{}}
                    items={burnRange}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 10,
                            right: 12,
                        }
                    }}
                    value={currMonth}
                    Icon={() => {
                        return <Ionicons name="md-arrow-down" size={24} color="gray" />;
                    }}
                />
              </CardView>
              { !loading && <View>
                <CardView style={styles.burnCard}>
                    <Text style={styles.burnAmount}>{company} spent ${this._moneyFormat(totalBurn)} in {currMonth}</Text>
                </CardView>
                <CardView style={styles.expenseCard}>
                    <Text style={styles.expenseTitle}>Company Expenses</Text>
                    <FlatList
                        data={categoryExpenses}
                        keyExtractor={(item) => item.categoryId}
                        renderItem={this._renderExpenses}
                    />
                </CardView>
              </View> }
            </ScrollView>
        );
    }
}

/*
<CardView style={styles.expenseCard}>
                <Text style={styles.expenseTitle}>Spending By Person</Text>
                <FlatList
                    data={peopleSpending}
                    keyExtractor={(item) => item.person}
                    renderItem={this._renderPeople}
                />
              </CardView>
*/

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
    paddingVertical: 20, 
    paddingHorizontal: 20
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });