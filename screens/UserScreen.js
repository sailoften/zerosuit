import React from 'react';
import {StyleSheet, View, Text, SectionList, TouchableOpacity, AsyncStorage} from 'react-native';
import CardView from '../common/CardView';

export default class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {title: 'Banks', data: [{name: 'Silicon Valley Bank'}, {name: 'Mercury Checking'}]},
        {title: 'Credit Cards', data: [{name: 'Brex'}, {name: 'American Express Platinum'}]},
        {title: 'Payroll', data: [{name: 'Gusto'}]},
      ]
    }
  }

  _userLogout = async () => {
    await AsyncStorage.removeItem('user');
    this.props.navigation.navigate('Auth');
  }

  _viewAccounts = () => {
    this.props.navigation.navigate('Accounts');
  }

  render() {
    const { sections } = this.state;
    return(
      <View>
          <TouchableOpacity onPress={this._userLogout}>
              <Text>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._viewAccounts}>
              <Text>Accounts</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

UserScreen.navigationOptions = {
  title: 'User',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
  sectionHeader: {
    flex: 1,
    paddingVertical: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: '#e6edf9',
  },
  item: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  }
});
