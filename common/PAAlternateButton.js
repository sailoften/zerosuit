import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Globals from './Globals';
import PAText from './PAText';

const containerStyle = () => ({
  borderRadius: 5,
  paddingTop: 8,
  paddingBottom: 8,
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: Globals.colors.PRIMARY,
});

const textStyle = () => ({
  fontFamily: Globals.fonts.Medium,
  fontSize: 18,
  textAlign: 'center',
  marginTop: 5,
  marginBottom: 5,
  color: Globals.colors.PRIMARY,
});

export default class PAAlternateButton extends React.Component {
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

PAAlternateButton.defaultProps = {
  text: 'Buy Now',
  disabled: false,
  onPress: () => {},
};

PAAlternateButton.propTypes = {
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};
