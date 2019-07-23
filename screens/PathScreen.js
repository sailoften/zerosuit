import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import BurnScreen from './BurnScreen';
import RunwayScreen from './RunwayScreen';

export default class BurnTabScreen extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Burn' },
      { key: 'second', title: 'Runway' },
    ],
  };
 
  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: BurnScreen,
          second: RunwayScreen,
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }
}

BurnTabScreen.navigationOptions = {
  title: 'Burn',
};
 
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