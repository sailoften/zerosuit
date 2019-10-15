import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Keyboard
} from 'react-native';
import CardView from '../common/CardView';
import { Header } from 'react-navigation';

export default class TxScreen extends React.Component {
    constructor(props) {
        super(props);
        const tx = this.props.navigation.getParam("tx");
        console.log(tx);
        this.state = {
            tx,
            infoText: tx.notes ? tx.notes : '',
        }
        this.props.navigation.setParams({ onSave: this._onSave });
        this._taskSaved = this.props.navigation.getParam('taskSaved');
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    _dateFormat = (dateString) => {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString();
    }

    _renderItem = ({item}) => {
        if (item.key && item.desp) {
            return (
                <View style={styles.despItem}>
                  <Text style={[styles.despText, {width: '30%'}]}>{item.key}</Text>
                  <Text style={[styles.despText, {textAlign: 'right', width: '70%'}]}>{item.desp}</Text>
                </View>
              );
        }
    }

    _getData = () => {
        const { tx } = this.state;
        return [
            {key: 'Date', desp: this._dateFormat(tx.transactionDate)},
            {key: 'Person', desp: tx.transactionOwner},
            {key: 'Account', desp: tx.qbAccount.accountName},
            {key: 'Comments', desp: tx.memo},
        ]
    }

    _txTitle = (item) => {
      switch(item.transactionType) {
        case 'Expense':
          if (item.merchantName) {
            return item.merchantName;
          } else if (item.memo && item.memo !== '') {
            return item.memo;
          } else {
            return 'Untitled Transaction'
          }
        case 'Transfer':
          return "Transfer: " + item.merchantName;
        default:
          if (item.merchantName) {
            return item.merchantName;
          } else if (item.memo && item.memo !== '') {
            return item.memo;
          } else {
            return 'Untitled Transaction'
          }
      }
    }

    _onSave = async () => {
        console.log("Saving");
        const { infoText, tx } = this.state;
        console.log(infoText);
        if (infoText.length === 0) {
            alert("Please enter a note to save");
            return;
        }
        // api/categorize POST
        // txnId, note
        const url = 'https://masonic-backend.onrender.com' + '/api/transaction/categorize';
        const body = {
            transactionId: tx.transactionId,
            notes: infoText,
        }
        try {
            console.log("Trying to send network request");
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Resolved");
            const payload = await res.json();
            console.log(payload);
            console.log("Saved");
            Keyboard.dismiss();
            this._taskSaved({masonicId: tx.masonicId, notes: payload.updatedTxn[0].notes});
            this.props.navigation.goBack();
            //TODO: navigate back to home page and dismiss item from array
        } catch(e) {
            console.log("Error! " + e);
            alert("Error saving");
        }
    }

    _onTextChange = (infoText) => {
        this.setState({ infoText });
    }

    render() {
        const { tx, infoText } = this.state;
        return (
            
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }} behavior="padding" keyboardVerticalOffset={Header.HEIGHT + 20} enabled>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                keyboardDismissMode={'interactive'}
                >
                <View style={styles.headerContainer}>
                    <Text style={[styles.titleText, {width: '70%'}]}>{this._txTitle(tx)}</Text>
                    <Text style={[styles.titleText, {width: '30%', textAlign: 'right'}]}>${this._moneyFormat(tx.amount)}</Text>
                </View>
        
                <View>
                  <CardView style={styles.headerTextContainer}>
                  <FlatList
                    data={this._getData()}
                    renderItem={this._renderItem} />
                  </CardView>
                  <CardView style={{flex: 1}}>
                      <Text style={styles.cardTitleText}>Add a note for your bookkeeper</Text>
                      <TextInput
                        style={{ flex: 1, height: 100, borderColor: 'gray', borderWidth: 1 }}
                        multiline={true}
                        scrollEnabled={false}
                        onChangeText={text => this._onTextChange(text)}
                        placeholder={'This was a business dinner with a client that our sales manager booked'}
                        textAlignVertical={'top'}
                        value={infoText}
                      />
                  </CardView>
                </View>

              </ScrollView>

              </KeyboardAvoidingView>
        );
    }
}

TxScreen.navigationOptions = ({navigation}) => {
  return {
    title: 'Uncategorized',
    headerRight: (
        <Button
        onPress={navigation.getParam('onSave')}
        title="Save"
        color="#007AFF"
        />
    ),
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6edf9',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
  },
  cardTitleText: {
    fontWeight: '600',
    marginBottom: 12,
  },
  headerContainer: {
    marginTop: 40,
    marginHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  headerTextContainer: {
  },
  getStartedText: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
  },
  despItem: {
    paddingVertical: 15,
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  },
  despText: {
      
  }
});
