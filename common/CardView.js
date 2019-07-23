import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

class CardView extends React.Component {
    render() {
        return (
            <View style={styles.cardView}>
                {this.props.children}
            </View>
        )
    }
}

const styles = {
    cardView: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
    }
}

export default CardView