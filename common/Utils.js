import { AsyncStorage } from 'react-native';
import * as Segment from 'expo-analytics-segment';
import getEnvVars from '../env';
const { apiUrl } = getEnvVars();

export { formatMoney, txTitle, makeRequest, registerSegment, unregisterSegment, segmentScreen, segmentTrack, enableGod };

const formatMoney = (amount) => {
    if (typeof amount !== 'number') {
        console.log(typeof amount);
        return '$0.00';
    }
    const amountAbs = Math.abs(amount);
    const fixedDecimal = (amountAbs).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Format flaot to String with 2 decimal points + commas
    const fancyFormatted = (amount > 0 ? '+' : '') + '$' + fixedDecimal; // Append + if amount is positive
    return fancyFormatted;
}

const txTitle = (item) => {
    switch(item.transactionType) {
      case 'Expense':
        if (item.merchantName) {
          return item.merchantName;
        } else if (item.memo && item.memo !== '') {
          return item.memo;
        } else {
          return 'Untitled Transaction'
        }
      case 'Transfer':
        return "Transfer: " + item.merchantName;
      default:
        if (item.merchantName) {
          return item.merchantName;
        } else if (item.memo && item.memo !== '') {
          return item.memo;
        } else {
          return 'Untitled Transaction'
        }
    }
  }

  const makeRequest = async (url, body) => {
    try {
      const finalUrl = `${apiUrl}${url}`;
      const res = await fetch(finalUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const payload = await res.json();
      return payload;
    } catch(e) {
      return { error: e };
    }
  }

  const unregisterSegment = async () => {
    const active = await _useSegment();
    if (active) {
      Segment.reset();
    }
  }

  const registerSegment = async (user) => {
    const active = await _useSegment();
    if (active) {
      Segment.identifyWithTraits(user.id, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }

  const segmentScreen = async (name) => {
    const active = await _useSegment();
    if (active) {
      Segment.screen(name);
    }
  }

  const segmentTrack = async (name, props) => {
    const active = await _useSegment();
    if (active) {
      Segment.trackWithProperties(name, props);
    }
  }

  // Call enableGod(true) to enable god mode and disable segment tracking
  const enableGod = async (status) => {
    if (typeof enableGod.status == 'undefined') {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      console.log(user);
      //TODO: change to godmode
      if (user.firstName === 'Jimmy') {
        enableGod.status = true;
      } else {
        enableGod.status = false;
      }
    } else if (enableGod.status === true) {
      return true;
    }
    return false;
  }

  const _useSegment = async () => {
    const isExpo = __DEV__;
    const isGod = await enableGod();
    return !isExpo && !isGod;
  }