import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Globals from './Globals';

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Globals.fonts.Regular,
    paddingBottom: 1,
  },
});

export default class PAText extends React.Component {
  render() {
    const { style, children } = this.props;
    return (
      <Text style={[styles.textStyle, style]}>{children}</Text>
    );
  }
}

PAText.defaultProps = {
  style: {},
  children: null,
};

PAText.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.any, // eslint-disable-line
};
