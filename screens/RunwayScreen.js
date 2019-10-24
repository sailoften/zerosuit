import React from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import CardView from '../common/CardView';
import moment from 'moment';
import { makeRequest, segmentScreen } from '../common/Utils';

export default class RunwayScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            totalBurn: 0,
            cash: 0,
            months: 0,
            projection: [],
            refreshing: false,
        }
    }

    componentDidMount() {
        this._getData();
        segmentScreen("Runway Screen");
    }

    _getData = async () => {
        const range = this._getTimeRange();
        const body = {
            startDate: range.start,
            endDate: range.end,
        }
        const payload = await makeRequest('/api/transaction/runway', body);
        if (!payload.error) {
            const runway = this._calcRunway(payload);
            const projection = this._calcProjections(payload);
            this.setState({totalBurn: payload.spending, cash: payload.cash, months: runway, projection});
        }
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        await this._getData();
        this.setState({ refreshing: false});
    }

    _getTimeRange = () => {
        const now = moment.utc();
        now.subtract(1, 'month');
        const start = now.startOf('month').toDate();;
        const end = now.endOf('month').toDate();
        return { start, end };
    }

    _calcProjections = ({spending, cash}) => {
        const now = moment();
        const proj = [];
        for (let i = 0; i < 10; i++) {
            now.add(1, 'month');
            const projMonth = {
                key: now.format('MMMM, YYYY'),
                amount: cash - (spending * (i + 1))
            }
            proj.push(projMonth);
            if (projMonth.amount < 0) {
                projMonth.amount = 0;
                break;
            }
        }
        return proj;
    }

    _calcRunway = ({spending, cash}) => {
        return Math.floor(cash / spending);
    }

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
        const {totalBurn, refreshing, months, projection} = this.state;
        return (
            <ScrollView style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
            }>
                <CardView>
                    <View style={{flex: 1, flexDirection:'row'}}>
                        <View style={{width: '50%'}}>
                            <Text style={styles.textBig}>${this._moneyFormat(totalBurn)}</Text>
                            <Text style={{color: 'gray'}}>Last Month's Burn</Text>
                        </View>
                        <View style={{width: '50%'}}>
                            <Text style={[styles.textBig, {textAlign: 'right'}]}>{months} {months > 1 ? 'Months' : 'Month'}</Text>
                            <Text style={{textAlign: 'right', color: 'gray'}}>Runway Left</Text>
                        </View> 
                    </View>
                </CardView>
                <CardView style={styles.expenseCard}>
                    <Text style={styles.expenseTitle}>Runway Projection</Text>
                    <FlatList
                        data={projection}
                        renderItem={this._renderExpenses}
                    />
                </CardView>
            </ScrollView>
        );
    }
}

RunwayScreen.navigationOptions = {
  title: 'Burn',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
  textBig: {
      fontSize:24,
      fontWeight: '500',
      marginBottom: 5,
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