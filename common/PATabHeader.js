import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import Globals from './Globals';
import PAText from './PAText';

const styles = {
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: Globals.colors.OFFWHITE,
  },
  titleText: {
    color: Globals.colors.DARK_GREY,
    fontSize: 26,
    fontFamily: Globals.fonts.Medium,
  },
  subtitleText: {
    marginTop: 15,
    fontFamily: Globals.fonts.Regular,
    fontSize: 14,
    color: Globals.colors.GREY,
    lineHeight: 23,
  },
};

export default class PATabHeader extends React.Component {
  render() {
    const { title, subtitle } = this.props;
    return (
      <View style={styles.container}>
        <PAText style={styles.titleText}>{title}</PAText>
        <PAText style={styles.subtitleText}>{subtitle}</PAText>
      </View>
    );
  }
}

PATabHeader.defaultProps = {
  title: 'Title',
  subtitle: 'Subtitle',
};

PATabHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
