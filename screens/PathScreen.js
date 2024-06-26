import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import { TabView } from 'react-native-tab-view';

import BurnScreen from './BurnScreen';
import IncomeScreen from './IncomeScreen';
import RunwayScreen from './RunwayScreen';

export default class PathTabScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Burn' },
        { key: 'second', title: 'Income'},
        { key: 'third', title: 'Runway' },
      ],
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <BurnScreen navigation={this.props.navigation} />;
      case 'second':
            return <IncomeScreen navigation={this.props.navigation} />;
      case 'third':
        return <RunwayScreen navigation={this.props.navigation} />;
      default:
        return null;
    }
  };
}

PathTabScreen.navigationOptions = {
  title: 'Path',
}
 
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#e6edf9',
  },
});