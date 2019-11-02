import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import CardView from '../common/CardView';
import moment from 'moment';
import { makeRequest, segmentScreen, segmentTrack } from '../common/Utils';

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
            live: false,
        }
    }

    componentDidMount() {
        const { startDate, endDate, currMonth } = this.state;
        this._getData(startDate, endDate, currMonth);
        segmentScreen("Burn Screen");
    }

    // Get current month time range for instatiation
    _getTimeRange = () => {
        const now = moment.utc();
        const start = now.startOf('month').toDate();;
        const end = now.endOf('month').toDate();
        const curr = now.format('MMMM, YYYY');
        return { start, end, curr };
    }

    // Take in a month year (e.g. July 2019) and convert it to a Date string
    _monthYear = (myear) => {
        const date = moment.utc(myear, "MMMM, YYYY");
        const start = date.startOf('month').toDate();;
        const end = date.endOf('month').toDate();
        return { start, end };
    }

    // Based on inception transaction, generate range of possible months for company
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

    // Retrieve data from the server for burn data
    _getData = async (start, end, curr) => {
        this.setState({ loading: true});
        const { burnRange } = this.state;
        const live = this._isLive(curr);
        console.log("StartDate: " + start + " EndDate: " + end);
        const body = {
            startDate: start,
            endDate: end
        }
        const payload = await makeRequest('/api/transaction/categoryInfo', body);
        if (!payload.error) {
            if (burnRange.length === 0) {
                this._getBurnRanges(payload.firstDate);
            }
            const categoryExpenses = payload.expenseInfo.filter(cat => cat.total !== 0);
            this.setState({company: payload.company, categoryExpenses, totalBurn: payload.spending, loading: false, live});
        }
    }

    // Check if current month, if so return true to display live data panel
    _isLive = (monthYear) => {
        const date = moment(monthYear, "MMMM, YYYY");
        const now = moment();
        console.log(date, now);
        return date.isSame(now, 'month');
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true});
        const { startDate, endDate, currMonth } = this.state;
        await this._getData(startDate, endDate, currMonth);
        this.setState({ refreshing: false});
    }

    _changeDates = async (monthYear) => {
        const { currMonth } = this.state;
        if (monthYear === currMonth) {
            return;
        }
        const dates = this._monthYear(monthYear);
        this.setState({startDate: dates.start, endDate: dates.end, currMonth: monthYear });
        await this._getData(dates.start, dates.end, monthYear);
        segmentTrack("Changed burn month", { month: monthYear });
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
        segmentTrack("Selected Indiv Category", { category, categoryId });
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

    render() {
        const { categoryExpenses, totalBurn, burnRange, currMonth, company, loading, refreshing, live } = this.state;
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
                { live && <CardView>
                    <Text style={styles.cardTitleText}>Displaying Live Data</Text>
                    <Text style={styles.cardText}>We include real-time data for current month burn information. Categorizations may change as we review transactions.</Text>
                </CardView> }
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
    paddingHorizontal: 20,
  },
  burnPickerCard: {
    paddingVertical: 20, 
    paddingHorizontal: 20
  },
  burnAmount: {
    textAlign: 'center',
    fontSize:23,
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
  },
  cardTitleText: {
    fontWeight: '600',
    marginBottom: 12,
  },
  cardText: {
    lineHeight: 22,
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