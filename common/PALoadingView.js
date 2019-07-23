import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import LoadingImage from '../../assets/loading-grey.gif';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 50,
    height: 50,
  },
});

export default class PALoadingView extends React.Component {
  render() {
    return (
      <View style={styles.loadingContainer}>
        <Image
          style={styles.loadingImage}
          source={LoadingImage}
        />
      </View>
    );
  }
}
