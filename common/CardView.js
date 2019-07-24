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
    constructor(props) {
        super(props);
    }

    render() {
        const {style, children, ...rest} = this.props;
        return (
            <View style={[styles.cardView, style]}>
                {children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
    }
});

export default CardView