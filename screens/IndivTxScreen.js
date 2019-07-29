import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CardView from '../common/CardView';

export default class TxScreen extends React.Component {
    constructor(props) {
        super(props);
        const tx = this.props.navigation.getParam("tx");
        this.state = {
            tx,
        }
    }

    _moneyFormat = (amount) => {
        return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    _dateFormat = (dateString) => {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString();
    }

    render() {
        const { tx } = this.state;
        return (
            <View style={styles.container}>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                >
        
                <View style={styles.headerContainer}>
                  {false && <DevelopmentModeNotice />}
                  <CardView style={styles.headerTextContainer}>
                    <Text style={styles.getStartedText}>{tx.merchantName}</Text>
                    <Text style={styles.getStartedText}>${this._moneyFormat(tx.amount)}</Text>
                    <Text style={styles.getStartedText}>{this._dateFormat(tx.transactionDate)}</Text>
                    <Text style={styles.getStartedText}>{tx.source}</Text>
                  </CardView>
                </View>
              </ScrollView>
            </View>
        );
    }
}

TxScreen.navigationOptions = {
  title: 'Transaction',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6edf9',
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTextContainer: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  getStartedText: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
  },
});
