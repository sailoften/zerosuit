import React from 'react';
import {
  View,
  ViewPropTypes,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Globals from './Globals';
import PAText from './PAText';

const containerStyle = disabled => ({
  borderRadius: 5,
  paddingTop: 10,
  paddingBottom: 10,
  backgroundColor: Globals.colors.PRIMARY,
  opacity: disabled ? 0.3 : 1,
});

const textStyle = () => ({
  fontFamily: Globals.fonts.Medium,
  fontSize: 18,
  marginTop: 5,
  marginBottom: 5,
  textAlign: 'center',
  color: Globals.colors.WHITE,
});

export default class PADefaultButton extends React.Component {
  render() {
    const {
      text, disabled, onPress, style,
    } = this.props;
    return (
      <TouchableOpacity style={style} disabled={disabled} onPress={disabled ? null : onPress}>
        <View style={containerStyle(disabled)}>
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
  style: {},
};

PADefaultButton.propTypes = {
  style: ViewPropTypes.style,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};
