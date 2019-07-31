import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import CardView from '../common/CardView';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: 0,
    }
  }

  componentDidMount() {
    this._getData();
  }

  _getData = async () => {
    const url = 'https://masonic-staging-backend.onrender.com/api/transaction/accounts';
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const payload = await res.json();
    this.setState({cash: payload.cash});
  }

  _moneyFormat = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  render() {
    const { cash } = this.state;
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
                  <Text style={styles.getStartedText}>Hello Jimmy!</Text>
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
              <Text>This feature is coming soon</Text>
            </CardView>
            <CardView>
              <Text>This feature is coming soon</Text>
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
  }
});
