import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import TextInputCompo from '../../components/TextInputCompo';
import ButtonCompo from '../../components/ButtonCompo';
import navigationString from '../../navigation/navigationString';
import makeApiCall from '../../utils/apiHelper';
import { API_URLS } from '../../utils/apiurls';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../redux/reducers/authreducers';
import { fetchSessionInfo } from '../../redux/reducers/sessionSlice';
import { COLORS } from '../../styles/colors';
import ResetPassModal from '../../constant/ResetPassModal';

const Loginscreen = ({ navigation }) => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const dispatch = useDispatch();
  const [isModalVisible, setisModalVisible] = useState(false);
  // const { isLoading, error, isLoggedIn } = useSelector(state => state.auth);
  // const handlelogin = async () => {
  //   try {
  //     const res = await makeApiCall(API_URLS.login, 'POST', {
  //       jsonrpc: '2.0',
  //       params: {
  //         login: email,
  //         password: password,
  //       },
  //     });
  //     console.log(res, 'responcemila');
  //     if (res?.result?.message === 'success') {
  //       navigation.navigate(navigationString.HOMESCREEN);
  //     } else if (res?.result?.errorMessage === 'Access denied') {
  //       Alert.alert('Login Failed', 'Access denied. Please credentials.');
  //     } else {
  //       Alert.alert(
  //         'Login Failed',
  //         res?.result?.errorMessage || 'Unknown error',
  //       );
  //     }
  //   } catch (error) {
  //     console.log('Login error:', error);
  //     Alert.alert(
  //       'Network Error',
  //       error.message || 'Could not connect to server.',
  //     );
  //   }
  // };

  const handlelogin = async () => {
    const resultAction = await dispatch(loginAsync({ login: email, password }));
    console.log(resultAction, 'Action');

    if (loginAsync.fulfilled.match(resultAction)) {
      await dispatch(fetchSessionInfo());
      navigation.navigate(navigationString.HOMESCREEN);
    } else {
      Alert.alert('Login Failed', resultAction.payload || 'Unknown error');
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.innerContainer}
        >
          <Image
            source={require('../../assets/shopaas.png')}
            style={styles.logoImage}
          />
          {/* <Text style={styles.logo}>Shopass</Text> */}

          <View style={styles.inputContainer}>
            <TextInputCompo
              placeholder="Email"
              placeholderTextColor={COLORS.blackColor}
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={text => setemail(text)}
            />
            <TextInputCompo
              placeholder="Password"
              placeholderTextColor={COLORS.blackColor}
              style={styles.input}
              secureTextEntry
              onChangeText={text => setpassword(text)}
              value={password}
              isPassword
            />
          </View>

          {/* <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity> */}
          <ButtonCompo style={styles.loginButton} onPress={handlelogin} />

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => setisModalVisible(true)}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(navigationString.SIGNUP)}
            >
              <Text style={styles.linkText}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationString.REGISTERYOURCOMPANEY)
              }
            >
              <Text style={styles.linkText}>Register your company.</Text>
            </TouchableOpacity>
          </View>
          <ResetPassModal
            isVisible={isModalVisible}
            onclose={() => setisModalVisible(false)}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Loginscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: COLORS.whiteColor,
  },
  logo: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: COLORS.blackColor,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.blackColor,
  },
  loginButton: {
    backgroundColor: '#00C9A7',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  loginText: {
    color: COLORS.blackColor,
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.blackColor,
    marginTop: 10,
    fontSize: 14,
  },
  logoImage: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
});
