import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PathScreen from '../screens/PathScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AccountsScreen from '../screens/AccountsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const PathStack = createStackNavigator(
  {
    Path: PathScreen,
  },
  config
);

PathStack.navigationOptions = {
  tabBarLabel: 'Path',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

PathStack.path = '';

const TransactionsStack = createStackNavigator(
  {
    Transactions: TransactionsScreen,
  },
  config
);

TransactionsStack.navigationOptions = {
  tabBarLabel: 'Transactions',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

TransactionsStack.path = '';

const AccountsStack = createStackNavigator(
  {
    Accounts: AccountsScreen,
  },
  config
);

AccountsStack.navigationOptions = {
  tabBarLabel: 'Accounts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

AccountsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  PathStack,
  TransactionsStack,
  AccountsStack
});

tabNavigator.path = '';

export default tabNavigator;
