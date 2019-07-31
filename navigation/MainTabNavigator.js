import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PathScreen from '../screens/PathScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AccountsScreen from '../screens/AccountsScreen';
import TxScreen from '../screens/IndivTxScreen';
import UserScreen from '../screens/UserScreen';
import CategoryScreen from '../screens/CategoryView';

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
    Category: CategoryScreen
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
    TxScreen: TxScreen,
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

const UserStack = createStackNavigator(
  {
    User: UserScreen,
    Accounts: AccountsScreen,
  },
  config
);

UserStack.navigationOptions = {
  tabBarLabel: 'User',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

UserStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  PathStack,
  TransactionsStack,
  UserStack
});

tabNavigator.path = '';

export default tabNavigator;
