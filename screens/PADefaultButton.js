
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import _ from 'underscore';
import PropTypes from 'prop-types';

import PAText from './PAText';

const containerStyle = () => ({
  height: 60,
  borderRadius: 10,
  paddingTop: 20,
  paddingBottom: 20,
  backgroundColor: '#61b799'
});

const textStyle = () => ({
  fontFamily: 'Rubik-Medium',
  fontSize: 18,
  height: 60,
  textAlign: 'center',
  color: '#fff',
});

export default class PADefaultButton extends React.Component {
  render() {
    const { text, disabled, onPress } = this.props;
    return (
      <TouchableOpacity onPress={disabled ? null : onPress}>
        <View style={containerStyle()}>
          <PAText style={textStyle()}>{text}</PAText>
        </View>
      </TouchableOpacity>
    );
  }
}

PADefaultButton.defaultProps = {
  text: 'Buy Now',
  disabled: false,
  onPress: () => {},
};

PADefaultButton.propTypes = {
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};