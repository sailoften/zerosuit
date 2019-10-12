import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import CardView from '../common/CardView';
import moment from 'moment';

export default class TasksScreen extends React.Component {
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
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          contentInsetAdjustmentBehavior="never"
          >
          <Text style={styles.groupTitle}>Uncategorized Expenses</Text>
          <TouchableOpacity style={styles.homeCards}>
            <CardView style={styles.infoCard}>
            <View style={{flex: 1, flexDirection:'row'}}>
              <View style={{width: '70%'}}>
                <Text style={styles.infoText}>Kickstarter.com</Text>
                <Text style={styles.infoText}>Sep. 24th, 2018</Text>
              </View>
              <View style={{width: '30%'}}>
                <Text style={styles.infoText, {fontWeight: '600', fontSize: 16, textAlign: 'right'}}>$214.00</Text>
              </View>
            </View>
            </CardView>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

TasksScreen.navigationOptions = {
  title: 'Tasks',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6edf9',
  },
  groupTitle: {
    marginHorizontal: 10,
    marginTop:30,
    marginBottom: 15,
    fontWeight: '600',
  },
  infoCard: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  infoTitle: {
    backgroundColor: 'grey',
    fontSize:12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
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
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
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
