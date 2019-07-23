import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import Globals from './Globals';

const styles = StyleSheet.create({
  backIcon: {
    marginLeft: 20,
    marginRight: 20,
    color: Globals.colors.PRIMARY,
  },
});

export default class PANavBackButton extends React.Component {
  render() {
    const { disabled, onPress } = this.props;
    return (
      <TouchableOpacity onPress={disabled ? null : onPress}>
        <Ionicons
          name="ios-arrow-round-back"
          size={32}
          style={styles.backIcon}
        />
      </TouchableOpacity>
    );
  }
}

PANavBackButton.defaultProps = {
  disabled: false,
  onPress: () => {},
};

PANavBackButton.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};
