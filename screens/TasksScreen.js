import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardView from '../common/CardView';
import { formatMoney, makeRequest, segmentScreen } from '../common/Utils';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';

export default class TasksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: 0,
      currentBurn: 0,
      lastBurn: 0,
      firstName: '',
      company: '',
      allTransactions: [],
      transactions: [],
      filter: 'incomplete',
      loading: true,
      refreshing: false,
    }
  }

  componentDidMount() {
    this._setupPage();
    segmentScreen("Tasks Screen");
  }

  _setupPage = async () => {
      const { filter } = this.state;
      await this._getData();
      const newTxs = this._filterTransactions(filter);
      this.setState({ transactions: newTxs });
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this._setupPage();
    this.setState({ refreshing: false });
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
    const payload = await makeRequest('/api/transaction/uncategorized', {});
    if (payload.error) {
      // Return user to signin screen
      await AsyncStorage.removeItem('user');
      this.props.navigation.navigate('Auth');
      return;
    }
    this.setState({allTransactions: payload.uncategorized, loading: false});
  }

  _onTxPress = (item) => {
    this.props.navigation.navigate('UncatTx', {
      tx: item,
      taskSaved: this._taskSaved
    });
  }

  _showDetails = (tx) => {
    this.setState({ focusTx: tx });
  }

  _taskSaved = (savedTx) => {
      const { filter, allTransactions } = this.state;
      for (const tx of allTransactions) {
          if (tx.transactionId === savedTx.transactionId) {
              tx.notes = savedTx.notes;
          }
      }
      const newTxs = this._filterTransactions(filter);
      this.setState({ transactions: newTxs });
  }

  _changeFilter = (filter) => {
      this.setState({ filter });
      const newTxs = this._filterTransactions(filter);
      this.setState({ transactions: newTxs });
  }

  _filterTransactions = (filter) => {
      const { allTransactions } = this.state;
      switch(filter) {
        case 'incomplete':
            return allTransactions.filter(tx => (!tx.notes || tx.notes.length === 0));
        case 'complete':
            return allTransactions.filter(tx => (tx.notes && tx.notes.length > 0));
        case 'all':
            return allTransactions;
      }
  }

  _renderTitle = (tx) => {
      const title = tx.merchantName ? tx.merchantName : tx.memo;
      if (!title) {
          return 'Untitled Transaction';
      }
      return title;
  }

  _renderItem = ({item}) => {
    if (!item.masonicId) {
      console.log(item);
    }
      return (
        <TouchableOpacity style={styles.homeCards} onPress={() => this._onTxPress(item)}>
            <CardView style={styles.infoCard}>
                <View style={{flex: 1, flexDirection:'row'}}>
                <View style={{width: '60%'}}>
                    <Text numberOfLines={1} style={styles.infoText}>{this._renderTitle(item)}</Text>
                    <Text style={styles.infoText, {color: 'gray'}}>{moment.utc(item.transactionDate).format('MMM DD, YYYY')}</Text>
                </View>
                <View style={{width: '40%'}}>
                    <Text style={styles.infoText, {fontWeight: '600', fontSize: 16, textAlign: 'right'}}>{formatMoney(item.amount)}</Text>
                </View>
                </View>
            </CardView>
        </TouchableOpacity>
      )
  }

  _renderEmptyList = () => {
    const { loading } = this.state;
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>{ loading? 'Loading...' : 'Yay! No new tasks' }</Text>
      </View>
    )
  }

  render() {
    const { transactions, filter, refreshing } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          contentInsetAdjustmentBehavior="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
          }
        >
          <CardView style={styles.optionBar}>

          <Text style={styles.groupTitle}>Uncategorized Expenses</Text>
            <RNPickerSelect
                        onValueChange={(value) => this._changeFilter(value)}
                        placeholder={{}}
                        items={[{label: 'Incomplete', value: 'incomplete'}, {label: 'Complete', value: 'complete'}, {label: 'All', value: 'all'}]}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 10,
                                right: 12,
                            }
                        }}
                        value={filter}
                        Icon={() => {
                            return <Ionicons name="md-arrow-down" size={18} color="gray" />;
                        }}
                    />
          </CardView>
          <FlatList
            data={transactions}
            renderItem={this._renderItem}
            keyExtractor={item => item.masonicId}
            ListEmptyComponent={this._renderEmptyList}
        />
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
  optionBar: {
      marginTop: 20,
  },
  infoCard: {
    marginBottom: 0,
    paddingVertical: 20,
  },
  groupTitle: {
    marginBottom: 15,
    fontWeight: '600',
    fontSize: 20,
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
  loading: {
    paddingVertical: 20,
  },
  loadingText: {
    textAlign: 'center'
  }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 8,
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