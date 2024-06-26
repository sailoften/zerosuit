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
import { formatMoney, txTitle, segmentScreen, segmentTrack, makeRequest, dateFormat } from '../common/Utils';
import { Header } from 'react-navigation';

export default class TxScreen extends React.Component {
    constructor(props) {
        super(props);
        const tx = this.props.navigation.getParam("tx");
        console.log(tx);
        this.state = {
            tx,
            infoText: tx.notes ? tx.notes : '',
            saving: false,
        }
        this.props.navigation.setParams({ onSave: this._onSave });
        this._taskSaved = this.props.navigation.getParam('taskSaved');
    }

    componentDidMount() {
      segmentScreen("Uncategorized Transaction Screen");
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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
            {key: 'Date', desp: dateFormat(tx.transactionDate)},
            {key: 'Person', desp: tx.transactionOwner},
            {key: 'Account', desp: tx.qbAccount.accountName},
            {key: 'Comments', desp: tx.memo},
        ]
    }

    _onSave = async () => {
        const { infoText, tx, saving } = this.state;
        if (infoText.length === 0) {
            alert("Please enter a note to save");
            return;
        } else if (saving) {
          return;
        }
        this.setState({ saving: true });
        const body = {
            transactionId: tx.transactionId,
            notes: infoText,
        }
        try {
            const payload = await makeRequest('/api/transaction/categorize', body);
            if (!payload || !payload.updatedTxn) {
               throw "Could not save";
            }
            Keyboard.dismiss();
            segmentTrack("Added Note to Uncat Txn", { note: infoText, masonicId: tx.masonicId });
            this._taskSaved({masonicId: tx.masonicId, transactionId: tx.transactionId, notes: payload.updatedTxn[0].notes});
            this.props.navigation.goBack();
            //this.setState({ saving: false });
        } catch(e) {
            console.log("Error! " + e);
            alert("Error saving");
            this.setState({ saving: false });
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
                    <Text style={[styles.titleText, {width: '70%'}]}>{txTitle(tx)}</Text>
                    <Text style={[styles.titleText, {width: '30%', textAlign: 'right'}]}>{formatMoney(tx.amount)}</Text>
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
                        style={{ flex: 1, height: 100, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10 }}
                        multiline={true}
                        scrollEnabled={false}
                        onChangeText={text => this._onTextChange(text)}
                        placeholder={'This was a sales dinner with a potential client of ours'}
                        textAlignVertical={'top'}
                        value={infoText}
                      />
                  </CardView>
                  <CardView style={{flex: 1}}>
                      <Text style={styles.cardTitleText}>Why is this transaction uncategorized?</Text>
                      <Text style={styles.cardText}>We weren't able to categorize this transaction based on bank info so we need your input. We'll remember similar transactions in the future.</Text>
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
        <View style={{marginRight: 5}}>
          <Button
            onPress={navigation.getParam('onSave')}
            title="Save"
            color="#007AFF"
          />
        </View>
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
      
  },
  cardText: {
    lineHeight: 22,
  }
});
