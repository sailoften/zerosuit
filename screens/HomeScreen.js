import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import CardView from '../common/CardView';
import moment from 'moment';
import * as Push from '../common/Push';
import { makeRequest, logoutHelper, segmentScreen } from '../common/Utils';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: 0,
      currentBurn: 0,
      lastBurn: 0,
      firstName: '',
      company: '',
      loading: true,
      refreshing: false,
    }
  }

  componentDidMount() {
    this._getData();
    this._handlePush();
    segmentScreen("Home Screen");
  }

  _handlePush = async () => {
    const action = await Push.status();
    if (action === 'ask') {
      //TODO: prompt for push notification
      const currStatus = await Push.checkPermission();
      let finalStatus = currStatus;
      if (currStatus !== 'granted') {
        finalStatus = await Push.getPermission();
      }

      if (finalStatus !== 'granted') {
        return;
      }

      const token = await Push.retrieveToken();
      if (token) {
        await Push.registerToken(token);
      }
    }
  }

  _getTimeRange = (offset) => {
    offset = offset ? offset : 0;
    const now = moment.utc();
    now.subtract(offset, 'month');
    const start = now.startOf('month').toDate();;
    const end = now.endOf('month').toDate();
    return { start, end };
  }

  _checkPushPermission = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    return status;
  }

  _getPushPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    return status;
  }

  _retrieveExpoToken = async () => {
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    return token;
  }

  _getData = async () => {
    const dates = this._getTimeRange();
    const burnDates = this._getTimeRange(1);
    const body = {
      startDate: dates.start,
      endDate: dates.end,
      burnStartDate: burnDates.start,
      burnEndDate: burnDates.end
    }
    const payload = await makeRequest('/api/transaction/home', body);
    if (payload.error) {
      // Return user to signin screen
      await logoutHelper();
      this.props.navigation.navigate('Auth');
      return;
    }
    this.setState({company: payload.company, firstName: payload.firstName, cash: payload.cash, currentBurn: payload.currentBurn, lastBurn: payload.lastBurn, loading: false});
  }

  _moneyFormat = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this._getData();
    this.setState({ refreshing: false});
  }

  render() {
    const { cash, currentBurn, lastBurn, company, firstName, loading, refreshing } = this.state;
    const months = Math.floor(cash / lastBurn);
    return (
      <SafeAreaView style={styles.container}>
        { !loading && 
        <ScrollView style={styles.container} 
          contentContainerStyle={styles.contentContainer} 
          contentInsetAdjustmentBehavior="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
        }>

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
        </ScrollView> }
        { loading &&
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} contentInsetAdjustmentBehavior="never">
            <View style={styles.headerContainer}>
              <View style={styles.headerTextContainer}>
                <View style={styles.loadingCard}>
                  <Text style={styles.getStartedText}>Hello! Loading your info...</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        }
      </SafeAreaView>
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
    //marginTop: 30,
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
  loadingCard: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 45,
    paddingHorizontal: 20,
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
