import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  FlatList,
  Button
} from 'react-native';
import Modal from "react-native-modal";
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
      transactions: [],
      modalVisible: false,
      focusTx: {},
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
    const url = 'https://masonic-backend.onrender.com' + '/api/transaction/uncategorized';
    const body = {};
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
    this.setState({transactions: payload.uncategorized});
  }

  _moneyFormat = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  _showDetails = (tx) => {
    this.setState({ focusTx: tx, modalVisible: true });
  }

  _renderItem = ({item}) => {
      return (
        <TouchableOpacity style={styles.homeCards} onPress={() => this._showDetails(item)}>
            <CardView style={styles.infoCard}>
            <View style={{flex: 1, flexDirection:'row'}}>
              <View style={{width: '60%'}}>
                <Text style={styles.infoText}>{item.merchantName ? item.merchantName : item.memo}</Text>
                <Text style={styles.infoText, {color: 'gray'}}>{moment(item.transactionDate).format('MMM DD, YYYY')}</Text>
              </View>
              <View style={{width: '40%'}}>
                <Text style={styles.infoText, {fontWeight: '600', fontSize: 16, textAlign: 'right'}}>${this._moneyFormat(item.amount)}</Text>
              </View>
            </View>
            </CardView>
          </TouchableOpacity>
      )
  }

  _hideModal = () => {
      this.setState({ modalVisible: false });
  }

  render() {
    const { transactions, modalVisible, focusTx } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          contentInsetAdjustmentBehavior="never"
          >
          <Text style={styles.groupTitle}>Uncategorized Expenses</Text>
          <FlatList
            data={transactions}
            renderItem={this._renderItem}
            keyExtractor={item => item.masonicId}
        />
        </ScrollView>
        <Modal isVisible={modalVisible} style={styles.bottomModal} swipeDirection={['up', 'left', 'right', 'down']}>
          <View style={styles.modal}>
            <Text>{focusTx.memo}</Text>
            <Button title="Hide modal" onPress={this._hideModal} />
          </View>
        </Modal>
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
  modal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  groupTitle: {
    marginHorizontal: 10,
    marginTop:30,
    marginBottom: 15,
    fontWeight: '600',
  },
  infoCard: {
    paddingVertical: 20,
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
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
