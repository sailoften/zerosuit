import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import CardView from '../common/CardView';
import moment from 'moment';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: 0,
      currentBurn: 0,
      lastBurn: 0,
      firstName: '',
      company: '',
    }
  }

  componentDidMount() {
    this._getData();
  }

  _getTimeRange = (offset) => {
    offset = offset ? offset : 0;
    const now = moment.utc();
    now.subtract(offset, 'month');
    const start = now.startOf('month').toDate();;
    const end = now.endOf('month').toDate();
    return { start, end };
}

  _getData = async () => {
    const url = 'https://masonic-backend.onrender.com' + '/api/transaction/home';
    const dates = this._getTimeRange();
    const burnDates = this._getTimeRange(1);
    const body = {
      startDate: dates.start,
      endDate: dates.end,
      burnStartDate: burnDates.start,
      burnEndDate: burnDates.end
    }
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const payload = await res.json();
    console.log(payload);
    if (payload.error) {
      // Return user to signin screen
      await AsyncStorage.removeItem('user');
      this.props.navigation.navigate('Auth');
      return;
    }
    this.setState({company: payload.company, firstName: payload.firstName, cash: payload.cash, currentBurn: payload.currentBurn, lastBurn: payload.lastBurn});
  }

  _moneyFormat = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  render() {
    const { cash, currentBurn, lastBurn, company, firstName } = this.state;
    const months = Math.floor(cash / lastBurn);
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          contentInsetAdjustmentBehavior="never"
          >

            <View style={styles.headerContainer}>
              <View style={styles.headerTextContainer}>
                <View style={styles.greetingCard}>
                  <Text style={styles.getStartedText}>Hello {firstName}!</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statCardText}>Cash</Text>
                  <Text style={[styles.statCardText, {textAlign: 'right'}]}>${this._moneyFormat(cash)}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statCardText}>Revenue</Text>
                  <Text style={[styles.statCardText, {textAlign: 'right'}]}>Coming Soon</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statCardText}>Credit Debt</Text>
                  <Text style={[styles.statCardText, {textAlign: 'right'}]}>Coming Soon</Text>
                </View>
              </View>
            </View>

          <View style={styles.homeCards}>
          <CardView>
                    <View style={{flex: 1, flexDirection:'row'}}>
                        <View style={{width: '50%'}}>
                          <Text style={styles.textBig}>${this._moneyFormat(lastBurn)}</Text>
                          <Text style={{color: 'gray'}}>Last Month's Burn</Text>
                        </View>
                        <View style={{width: '50%'}}>
                          <Text style={[styles.textBig, {textAlign: 'right'}]}>{months} {months > 1 ? 'Months' : 'Month'}</Text>
                          <Text style={{textAlign: 'right', color: 'gray'}}>Runway Left</Text>
                        </View> 
                    </View>
                </CardView>
            <CardView style={styles.burnCard}>
              <Text style={styles.burnAmount}>{company} spent ${this._moneyFormat(currentBurn)} so far this month</Text>
            </CardView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  safeArea: {
    flex: 1,
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 0,
  },
  headerContainer: {
    //backgroundColor: 'gray',
    marginBottom: 20,
  },
  headerTextContainer: {
    //marginHorizontal: 20,
    marginTop: 30,
  },
  getStartedText: {
    fontSize: 20,
    color: 'black',
    lineHeight: 24,
    fontWeight: '600'
  },
  greetingCard: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 45,
    paddingHorizontal: 20,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  },
  statCard: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  },
  statCardText: {
    fontSize: 15,
    color: 'black',
    lineHeight: 24,
    width: '50%'
  },
  textBig: {
    fontSize:24,
    fontWeight: '500',
    marginBottom: 5,
  }
});
