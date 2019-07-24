import React from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import CardView from '../common/CardView';

export default class RunwayScreen extends React.Component {
    _renderExpenses = ({item}) => {
        return (
            <View style={styles.expenseCat}>
                <Text style={{width: '50%'}}>{item.key}</Text>
                <Text style={{width: '50%', textAlign: 'right'}}>${item.amount}</Text>
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <CardView>
                    <View style={{flex: 1, flexDirection:'row'}}>
                        <View style={{width: '50%'}}>
                            <Text style={styles.textBig}>$14,974</Text>
                            <Text style={{color: 'gray'}}>Last Month's Burn</Text>
                        </View>
                        <View style={{width: '50%'}}>
                            <Text style={[styles.textBig, {textAlign: 'right'}]}>5 Months</Text>
                            <Text style={{textAlign: 'right', color: 'gray'}}>Runway Left</Text>
                        </View> 
                    </View>
                </CardView>
                <CardView style={styles.expenseCard}>
                    <Text style={styles.expenseTitle}>Runway Projection</Text>
                    <FlatList
                        data={[{key: 'August', amount: 232110}, {key: 'September', amount: 212110}, {key: 'October', amount: 197110}]}
                        renderItem={this._renderExpenses}
                    />
                </CardView>
            </ScrollView>
        );
    }
}

RunwayScreen.navigationOptions = {
  title: 'Burn',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
  textBig: {
      fontSize:24,
      fontWeight: '500',
      marginBottom: 5,
  },
  expenseTitle: {
    marginBottom: 20,
    fontWeight:"700",
  },
  expenseCat: {
    paddingVertical: 15,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
  }
});