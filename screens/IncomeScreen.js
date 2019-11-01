import React from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import CardView from '../common/CardView';
import moment from 'moment';
import { makeRequest, segmentScreen, segmentTrack, formatMoney } from '../common/Utils';

export default class IncomeScreen extends React.Component {
    constructor(props) {
        super(props);
        const date = this._getTimeRange();
        this.state = {
            categoryIncome: [],
            categoryCog: [],
            peopleSpending: [],
            income: 0,
            expense: 0,
            cog: 0,
            netIncome: 0,
            grossProfit: 0,
            startDate: date.start,
            endDate: date.end,
            company: '',
            firstDate: null,
            burnRange: [],
            currMonth: date.curr,
            loading: true,
            refreshing: false,
            noData: false,
        }
    }

    componentDidMount() {
        this._getData();
        segmentScreen("Income Screen");
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
        //const live = this._isLive(start ? start : startDate);
        //console.log("StartDate: " + startDate + " EndDate: " + endDate);
        const body = {
            startDate: start ? start : startDate,
            endDate: end ? end : endDate
        }
        const payload = await makeRequest('/api/transaction/categoryInfo', body);
        if (!payload.error) {
            if (burnRange.length === 0) {
                this._getBurnRanges(payload.firstDate);
            }
            if (payload.income === 0 && payload.cog === 0) {
                this.setState({ noData: true, loading: false });
                return;
            }
            const categoryIncome = payload.incomeInfo.filter(cat => cat.total !== 0).reverse();
            const categoryCog = payload.cogInfo.filter(cat => cat.total !== 0);
            const grossProfit = payload.income + payload.cog;
            const netIncome = payload.income + payload.cog + payload.spending;
            this.setState({company: payload.company, categoryIncome, categoryCog, income: payload.income, cog: payload.cog, expense: payload.spending, grossProfit, netIncome, loading: false, noData: false});
        }
    }

    // Check if current month, if so return true to display live data panel
    _isLive = (monthYear) => {
        const date = moment(monthYear);
        const now = moment();
        console.log(date, now);
        return date.isSame(now, 'month');
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
        segmentTrack("Changed income month", { month: monthYear });
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    _renderExpenses = ({item}) => {
        return (
            <TouchableOpacity style={styles.expenseCat} onPress={() => this._goToExpense(item.category, item.categoryId)}>
                <Text style={{width: '50%'}}>{item.category}</Text>
                <Text style={{width: '50%', textAlign: 'right'}}>{this._renderNumber(item.total)}</Text>
            </TouchableOpacity>
        );
    }

    _formatMoney = (amount) => {
        return formatMoney(-amount);
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

    _renderNumber = (num) => {
        const number = this._formatMoney(num);
        if (number.includes('+')) {
            return (
                <Text style={{color: '#6ba206'}}>{number}</Text>
            )
        } else {
            return (
                <Text style={{color: '#101d2f'}}>-{number}</Text>
            );
        }
    }


    //TODO: handle months with no income information
    render() {
        const { categoryIncome, categoryCog, income, cog, expense, burnRange, currMonth, grossProfit, netIncome, loading, refreshing, noData } = this.state;
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
              { !loading && !noData && <View>
                  <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{width: '50%'}}>
                        <CardView style={{ marginRight: 5, marginLeft: 10}}>
                            <Text style={styles.cardTitleText}>Income</Text>
                            <Text style={styles.cardNumber}>{this._renderNumber(income)}</Text>
                        </CardView>
                    </View>
                    <View style={{width: '50%'}}>
                        <CardView style={{ marginRight: 10, marginLeft: 5}}>
                            <Text style={styles.cardTitleText}>Cost of Goods Sold</Text>
                            <Text style={styles.cardNumber}>{this._renderNumber(cog)}</Text>
                        </CardView>
                    </View>
                  </View>
                <CardView>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={styles.expenseTitle}>Ramen Profitability</Text>
                        { (netIncome > 0) && <Text style={{...styles.expenseTitle, textAlign: 'right'}}>Status: Not Yet</Text> }
                        { (netIncome <= 0) && <Text style={{...styles.expenseTitle, textAlign: 'right'}}>Status: Profitable!</Text> }
                    </View>
                    <View style={styles.statsCat}>
                        <Text style={{width: '50%'}}>+ Gross Profit</Text>
                        <Text style={{width: '50%', textAlign: 'right'}}>{this._renderNumber(grossProfit)}</Text>
                    </View>
                    <View style={styles.statsCat}>
                        <Text style={{width: '50%'}}>- Expenses</Text>
                        <Text style={{width: '50%', textAlign: 'right'}}>{this._renderNumber(expense)}</Text>
                    </View>
                    <View style={{...styles.statsCat, borderBottomWidth: 0}}>
                        <Text style={{width: '50%'}}>= EBITDA</Text>
                        <Text style={{width: '50%', textAlign: 'right'}}>{this._renderNumber(netIncome)}</Text>
                    </View>
                </CardView>
                <CardView style={styles.expenseCard}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={styles.expenseTitle}>Income Breakdown</Text>
                        <Text style={{...styles.expenseTitle, textAlign: 'right'}}>{this._renderNumber(income)}</Text>
                    </View>
                    <FlatList
                        data={categoryIncome}
                        keyExtractor={(item) => item.categoryId}
                        renderItem={this._renderExpenses}
                    />
                </CardView>
                <CardView style={styles.expenseCard}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={styles.expenseTitle}>COGS Breakdown</Text>
                        <Text style={{...styles.expenseTitle, textAlign: 'right'}}>{this._renderNumber(cog)}</Text>
                    </View>
                    <FlatList
                        data={categoryCog}
                        keyExtractor={(item) => item.categoryId}
                        renderItem={this._renderExpenses}
                    />
                </CardView>
              </View> }
              { !loading && noData &&
              <CardView>
                <Text style={styles.cardTitleText}>Finalizing Revenue Data</Text>
                <Text style={styles.cardText}>We're working on finalizing income data for { currMonth }. Check back soon!</Text>
              </CardView>
              }
            </ScrollView>
        );
    }
}

// Green color: #6ba206

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
    width: '50%',
  },
  statsCat: {
    paddingVertical: 10,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
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
  },
  cardNumber: {
      fontWeight: '700',
      fontSize: 20,
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