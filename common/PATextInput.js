import React from 'react';
import { Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import Globals from './Globals';

export default class PATextInput extends React.Component {
  render() {
    const { style, children, ...rest } = this.props;
    return (
      <TextInput
        style={[{
         fontFamily: Globals.fonts.Regular,
        }, style]}
        underlineColorAndroid="transparent"
        {...rest}
      >{children}
      </TextInput>
    );
  }
}

PATextInput.defaultProps = {
  style: {},
  children: null,
};

PATextInput.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.any, // eslint-disable-line
};
