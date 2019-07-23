import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import PAText from '../common/PAText';
import PADefaultButton from '../common/PADefaultButton';
import PATextInput from '../common/PATextInput';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 65,
    marginBottom: 30,
  },
  backgroundWhite: {
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  marginVertical: {
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    marginTop: 20,
    width: 120,
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    backgroundColor: 'transparent',
  },
  inputField: {
    height: 45,
    fontSize: 16,
    borderColor: '#efefef',
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
  finePrintContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  finePrintText: {
    fontSize: 11,
    color: '#D3D3D3',
  },
});

class Login extends React.Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      email: '',
      password: '',
      error: null,
    };
  }

  handleLogin = async () => {
    /*const { email, password, navigation } = this.state;
    const loginData = {
      email,
      password,
    };
    try {
      const response = await postData('/user/login', loginData);
      if (response && !response.error) {
        // Securely store response
        try {
          await SecureStore.setItemAsync('user', JSON.stringify(response));
          // Navigate to HomeTabs, but also reset stack
          const loginReset = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({ routeName: 'HomeTabs' }),
            ],
          });
          navigation.dispatch(loginReset);
        } catch (error) {
          // Error
          this.setState({ error });
        }
      } else if (!response) {
        this.setState({ error: 'Error connecting to server ' });
      } else {
        this.setState({ error: response.error.toString() });
      }
    } catch (e) {
      this.setState({ error: 'Error logging in' });
    }*/
    this.props.navigation.navigate('App');
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;
    return (
      <View style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior="padding" enabled>
          <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps="handled" style={styles.backgroundWhite} contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
                <Text>Masonic</Text>
            </View>
            <View>
              <View style={styles.marginVertical}>
                <View style={styles.marginVertical}>
                  <PAText style={styles.errorText}>{error}</PAText>
                </View>
                <PATextInput
                  style={styles.inputField}
                  clearButtonMode="while-editing"
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={emailText => this.setState({ email: emailText })}
                  value={email}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.marginVertical}>
                <PATextInput
                  style={styles.inputField}
                  clearButtonMode="while-editing"
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={passwordText => this.setState({ password: passwordText })}
                  value={password}
                  returnKeyType="go"
                />
              </View>
              <View style={styles.marginVertical}>
                <PADefaultButton
                  text="Login"
                  onPress={this.handleLogin}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.finePrintContainer}>
          <PAText style={styles.finePrintText}>
            By signing in to Parta you agree to our Terms of Service and Privacy Policy.
          </PAText>
        </View>
      </View>
    );
  }
}

Login.defaultProps = {
  navigation: {
    navigate: () => {},
  },
};

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default Login;