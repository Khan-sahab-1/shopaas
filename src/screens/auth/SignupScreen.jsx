import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import TextInputCompo from '../../components/TextInputCompo';
import ButtonCompo from '../../components/ButtonCompo';
import navigationString from '../../navigation/navigationString';
import { COLORS } from '../../styles/colors';
import SingledropdownPicker from '../../components/SingledropdownPicker';
import { API_URLS } from '../../utils/apiurls';
import makeApiCall from '../../utils/apiHelper';
import Dropdowncomp from '../../components/Dropdowncomp';
import Loader from '../../components/Loader';
import MessageShow from '../../constant/MessageShow';
import { validateSignupForm } from '../../utils/ValidationForm';

const SignupScreen = ({ navigation }) => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [isLoading,setIsloding]=useState(false)
  const [phone, setphone] = useState('');
  const [countries, setCountries] = useState([]);
const [selectedCountry, setSelectedCountry] = useState(null);
// console.log(countries,'cccc')
  

  // const [items] = useState([
  //   { label: 'India', value: 'india', id: '+91', code: 'IN', countryId: 1 },
  //   { label: 'USA', value: 'usa', id: '+1', code: 'US', countryId: 2 },
  //   { label: 'UK', value: 'uk', id: '+44', code: 'UK', countryId: 3 },
  // ]);

  // const [selectedCountry, setSelectedCountry] = useState(items[0]);


  const fetchCountry = async (country_id = null, state_id = null) => {
    try {
      setIsloding(true);
  
      const response = await makeApiCall(API_URLS.getGeoData, 'POST', {
        jsonrpc: '2.0',
        params: {
          country_id,
          state_id,
        },
      });
  
      if (response?.error) {
        Alert.alert('Error', response.error.message || 'Something went wrong');
        console.error('API Error:', response.error);
      } else {
        console.log(response, 'Country');
  
        const countryData = response?.result?.data?.country || {};
        const defaultId = response?.result?.data?.default;
  
        // Convert country object → array for dropdown
        const formattedCountries = Object.values(countryData).map(c => ({
          label: c.name,
          value: c.id,
          id: `+${c.phone_code}`,
          code: c.code,
          countryId: c.id,
        }));
  
        setCountries(formattedCountries);
        const defaultCountry = formattedCountries.find(c => c.countryId === defaultId);
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
        }
      }
    } catch (error) {
      console.error('Fetch Country Error:', error);
      Alert.alert('Network Error', error.message || 'Unable to fetch countries. Please try again later.');
    } finally {
      setIsloding(false);
    }
  };
  
  useEffect(() => {
    fetchCountry();
  }, []);
  


  const handlesubmit = async () => {
    // ✅ Basic validation
    const { valid, message } = validateSignupForm({
      name,
      email,
      phone,
      password,
      confirmpassword,
      selectedCountry,
    });
  
    if (!valid) {
      // Alert.alert("Validation", message);
      MessageShow.error("Validation", message)
      return;
    }
    if (!email || !name || !phone || !password || !confirmpassword) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }
  
    if (password !== confirmpassword) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
  
    if (!selectedCountry) {
      Alert.alert('Validation', 'Please select a country');
      return;
    }
  
    try {
      setIsloding(true);
  
      const payload = {
        id: null,
        name,
        email,
        mobile: phone,
        passwd: password,
        confirmPasswd: confirmpassword,
        showPassword: false,
        country: {
          id: selectedCountry.countryId,
          name: selectedCountry.label,
          phone_code: parseInt(selectedCountry.id.replace('+', '')),
          code: selectedCountry.code,
        },
        phone_code: parseInt(selectedCountry.id.replace('+', '')),
        language: {
          id: 1,
          name: 'English(US)',
        },
      };
  
      console.log('Signup payload:', payload);
  
      const response = await makeApiCall(API_URLS.customerSignup, 'POST', {
        jsonrpc:"2.0",
        params: payload,
      });
  
      console.log('Signup success:', response);
  
      if (!response.error && response.result?.redirectPage==='registration success' && response.result?.redirectFlag) {
        MessageShow.success('Success',response.result?.redirectPage)
        // Alert.alert('Success', 'Signup successful!');
        navigation.navigate(navigationString.LOGIN);
      } else {
        MessageShow.error('Error',
          response.result?.errorMessage || response.error?.message || 'Signup failed')
        // Alert.alert(
        //   'Error',
        //   response.result?.errorMessage || response.error?.message || 'Signup failed'
        // );
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error?.response?.data?.error || error.message);
    } finally {
      setIsloding(false);
    }
  };
  

  return (
    <View
      
      style={styles.container}
    >
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.innerContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../../assets/shopaas.png')}
              style={styles.logoImage}
            />

            <View style={styles.inputContainer}>
              <TextInputCompo
                placeholder="Email"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                keyboardType="email-address"
                onChangeText={setemail}
                value={email}
               
              />
              <TextInputCompo
                placeholder="Name"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                onChangeText={setname}
                value={name}
              />

              {/* <SingledropdownPicker
                style={styles.input}
                items={items}
                onSelect={item => setSelectedCountry(item)}
                placeholder="Select Country"
              /> */}
              <Dropdowncomp
              data={countries}
              style={styles.input}
              // placeholderStyle={{color:COLORS.blackColor}}
              onChange={item => setSelectedCountry(item)}
              value={selectedCountry}
              placeholder={'Select Country'}
              search={true}
              selectedStyle={{color:COLORS.blackColor,}}
              // placeholderStyle={{color:COLORS.whiteColor}}
              />

              <View style={styles.inputWrapper}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryText}>{selectedCountry?.id}</Text>
                </View>
                <TextInputCompo
                  placeholder="Phone Number"
                  placeholderTextColor={COLORS.blackColor}
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  onChangeText={setphone}
                  value={phone}
                />
              </View>

              <TextInputCompo
                placeholder="Password"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                secureTextEntry
                onChangeText={setpassword}
                value={password}
                isPassword={true}
              />
              <TextInputCompo
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                secureTextEntry
                onChangeText={setconfirmpassword}
                value={confirmpassword}
                isPassword={true}
              />
            </View>

            <ButtonCompo
              style={styles.loginButton}
              title="Sign Up"
              onPress={handlesubmit}
            />

            <View style={styles.linkContainer}>
              <TouchableOpacity>
                {/* <Text style={styles.linkText}>Forgot Password?</Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate(navigationString.LOGIN)}
              >
                <Text style={styles.linkText}>
                  Already have an account? Login 
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Loader visible={isLoading}/>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  backgroundColor:COLORS.whiteColor,
  },
  safeContainer: {
    flex: 1,
    backgroundColor:COLORS.whiteColor,
  },
  innerContainer: {
    marginTop: 30,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoImage: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 200,
    height: 100,
    resizeMode: 'contain',
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
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.blackColor,
    marginTop: 10,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  countryCode: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.blackColor,
  },
  countryText: {
    fontSize: 16,
    color: COLORS.blackColor,
  },
  phoneInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: COLORS.blackColor,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
});

export default SignupScreen;
