import React from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import CardView from '../common/CardView';
import moment from 'moment';

export default class RunwayScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            totalBurn: 0,
            cash: 0,
            months: 0,
        }
    }

    componentDidMount() {
        this._getData();
    }

    _getData = async () => {
        const url = 'https://masonic-staging-backend.onrender.com/api/transaction/runway';
        //TODO: use moment to set this to last month
        const body = {
            startDate: "2019-06-01T00:00:00.000",
            endDate: "2019-06-28T23:59:59.000",
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
        const runway = this._calcRunway(payload);
        this.setState({totalBurn: payload.spending, cash: payload.cash, months: runway});
        console.log(payload);
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
        const {totalBurn, cash, months} = this.state;
        return (
            <ScrollView style={styles.container}>
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
                        data={[{key: 'August', amount: 232110}, {key: 'September', amount: 212110}, {key: 'October', amount: 197110}]}
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