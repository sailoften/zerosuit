import React from 'react';
import {StyleSheet, Text, TouchableOpacity, AsyncStorage, FlatList, Linking} from 'react-native';
import * as Push from '../common/Push';
import { logoutHelper } from '../common/Utils';
import * as Segment from 'expo-analytics-segment';

export default class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {title: 'Banks', data: [{name: 'Silicon Valley Bank'}, {name: 'Mercury Checking'}]},
        {title: 'Credit Cards', data: [{name: 'Brex'}, {name: 'American Express Platinum'}]},
        {title: 'Payroll', data: [{name: 'Gusto'}]},
      ],
      user: null,
    }
  }

  _getUser = async () => {
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        console.log(user);
        this.setState({user});
    }
  }

  _userLogout = async () => {
    await logoutHelper();
    await Push.unregisterToken();
    this.props.navigation.navigate('Auth');
  }

  _viewAccounts = () => {
    this.props.navigation.navigate('Accounts');
  }

  _getHelp = () => {
    Linking.openURL('mailto:founders@bemasonic.com?subject=Hello!')
  }

  componentDidMount() {
      this._getUser();
      Segment.screen("User Profile Screen");
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={item.action} style={styles.optionItem}>
        <Text>{item.key}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { user } = this.state;
    return(
      <FlatList
        data={[{key: 'Connected Accounts', action: this._viewAccounts}, {key: 'Contact Masonic', action: this._getHelp}, {key: 'Logout', action: this._userLogout}]}
        renderItem={this._renderItem}
      />
    );
  }
}

/*
<View style={styles.container}>
          <TouchableOpacity onPress={this._userLogout}>
              <Text>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._viewAccounts}>
              <Text>Accounts</Text>
          </TouchableOpacity>
          { user && <View>
            <Text>{user.firstName}</Text>
          </View> }
      </View>
*/

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
  },
  optionItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: '#f4f7fb',
    borderBottomWidth: 1,
  }
});
