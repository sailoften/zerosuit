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

export default class TxScreen extends React.Component {
    constructor(props) {
        super(props);
        const tx = this.props.navigation.getParam("tx");
        console.log(tx);
        this.state = {
            tx,
            infoText: '',
        }
        this.props.navigation.setParams({ onSave: this._onSave });
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
            return 'Transaction'
          }
        case 'Transfer':
          return "Transfer: " + item.merchantName;
        default:
          return item.merchantName ? item.merchantName : item.memo;
      }
    }

    _onSave = async () => {
        const { infoText } = this.state;
        Keyboard.dismiss();
    }

    _onTextChange = (infoText) => {
        this.setState({ infoText });
    }

    render() {
        const { tx } = this.state;
        return (
            
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center'}} behavior="padding" keyboardVerticalOffset={80} enabled>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
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
                  <CardView>
                      <Text style={styles.cardTitleText}>Why is this transaction uncategorized?</Text>
                      <Text>We weren't able to determine the purpose of this transaction so we need your input to properly categorize it. We'll remember similar transactions in the future.</Text>
                  </CardView>
                  <CardView>
                      <Text style={styles.cardTitleText}>Add a note</Text>
                      <TextInput
                        style={{ height: 100, borderColor: 'gray', borderWidth: 1 }}
                        multiline={true}
                        onChangeText={text => this._onTextChange(text)}
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
        color="blue"
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
