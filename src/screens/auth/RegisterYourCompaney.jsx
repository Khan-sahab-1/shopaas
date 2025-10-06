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
import Dropdowncomp from '../../components/Dropdowncomp';
import { API_URLS } from '../../utils/apiurls';
import makeApiCall from '../../utils/apiHelper';
import Loader from '../../components/Loader';
import MessageShow from '../../constant/MessageShow';
import { validateCompaneyForm, validateCompanyForm, validateSignupForm } from '../../utils/ValidationForm';

const RegisterYourCompaney = ({ navigation }) => {
  const [isLoading, setIsloding] = useState(false);

  // dropdown data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // selected values
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectdType, setselectedtype] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [catagory, setcatagory] = useState([]);
  console.log(selectdType);

  // form inputs
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: null,
    state: null,
    zip: '',
    comment: '',
    street: '',
  });

  const fetchGeoData = async (
    country_id = null,
    state_id = null,
    city_id = null,
  ) => {
    try {
      setIsloding(true);
      const response = await makeApiCall(API_URLS.getGeoData, 'POST', {
        jsonrpc: '2.0',
        params: { country_id, state_id, city_id },
      });

      if (response?.error) {
        Alert.alert('Error', response.error.message || 'Something went wrong');
        return;
      }

      const {
        country = {},
        state = {},
        city = {},
        default: defaultId,
      } = response?.result?.data || {};

      if (!country_id) {
        // ----- Load Countries -----
        const formattedCountries = Object.values(country).map(c => ({
          label: c.name,
          value: c.id,
          id: `+${c.phone_code}`,
          code: c.code,
          countryId: c.id,
        }));
        setCountries(formattedCountries);

        // Set default country
        const defaultCountry = formattedCountries.find(
          c => c.countryId === defaultId,
        );
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
          setFormData(prev => ({ ...prev, country: defaultCountry.value }));
          // Fetch states for default country
          fetchGeoData(defaultCountry.value, null, null);
        }
      } else if (country_id && !state_id) {
        // ----- Load States -----
        const formattedStates = Object.values(state).map(s => ({
          label: s.name,
          value: s.id,
        }));
        setStates(formattedStates);
      } else if (state_id && !city_id) {
        // ----- Load Cities -----
        const formattedCities = Object.values(city).map(ct => ({
          label: ct.name,
          value: ct.id,
        }));
        setCities(formattedCities);
      }
    } catch (error) {
      console.error('GeoData Fetch Error:', error);
      Alert.alert(
        'Network Error',
        error.message || 'Unable to fetch geo data. Try again later.',
      );
    } finally {
      setIsloding(false);
    }
  };

  const fetchcatagorydata = async () => {
    try {
      const responce = await makeApiCall(API_URLS.getcatagory, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(responce, 'catagory data');
      if (!responce.result.errorMessage && !responce.error) {
        const formateData = responce?.result?.companyTypes.map(item => ({
          label: item.name,
          value: item.id,
          image: item.image,
        }));
        setcatagory(formateData);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(error);
    }
  };

  useEffect(() => {
    fetchGeoData();
    fetchcatagorydata();
  }, []);

  // ---- Handlers ----
  const handleCountryChange = country => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country: country.value,
      state: null,
      city: null,
    }));
    setStates([]);
    setCities([]);
    setSelectedState(null);
    setSelectedCity(null);
    fetchGeoData(country.value, null, null);
  };

  const handleStateChange = state => {
    setSelectedState(state);
    setFormData(prev => ({ ...prev, state: state.value, city: null }));
    setCities([]);
    setSelectedCity(null);
    fetchGeoData(selectedCountry?.value, state.value, null);
  };

  const handleCityChange = city => {
    setSelectedCity(city);
    setFormData(prev => ({ ...prev, city: city.value }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { valid, message } = validateCompanyForm({
      ...formData,
      selectedCountry,
      selectedState,
      selectedCity,
      selectdType,
    });
  
    if (!valid) {
      MessageShow.error("Validation Error", message);
      return;
    }

    try {
      if (
        !formData.name ||
        !formData.companyName ||
        !formData.email ||
        !formData.phone ||
        !selectdType
      ) {
        // Alert.alert('Validation Error', 'Please fill all required fields.');
        MessageShow.error('Validation Error', 'Please fill all required fields.')
        return;
      }

      setIsloding(true);

      const payload = {
        id: null,
        name: formData.name,
        street: formData.street,
        zip: formData.zip,
        city: {
          id: selectedCity?.value || null,
          name: selectedCity?.label || '',
        },
        state: {
          id: selectedState?.value || null,
          name: selectedState?.label || '',
        },
        country: {
          id: selectedCountry?.value || null,
          name: selectedCountry?.label || '',
          phone_code: selectedCountry?.id?.replace('+', '') || '',
          code: selectedCountry?.code || '',
        },
        phone_code: selectedCountry?.id?.replace('+', ''),
        email: formData.email,
        mobile: formData.phone,
        businessName: formData.companyName,
        company_type: selectdType,
        comment: formData.comment,
      };

      console.log('Register Payload ===>', payload);

      const response = await makeApiCall(API_URLS.registerCompany, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      console.log(response);
      if (response?.error) {
        Alert.alert('Error', response.error.message || 'Something went wrong');
      } else {
        // Alert.alert('Success', 'Company registered successfully!');
        MessageShow.success('success',response?.result?.message)
        navigation.navigate(navigationString.LOGIN);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong!');
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
                placeholder="Name"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                onChangeText={val => handleChange('name', val)}
                value={formData.name}
              />
              <TextInputCompo
                placeholder="Company / Business Name"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                onChangeText={val => handleChange('companyName', val)}
                value={formData.companyName}
              />
              <TextInputCompo
                placeholder="Email"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                keyboardType="email-address"
                onChangeText={val => handleChange('email', val)}
                value={formData.email}
              />

              {/* phone */}
              <View style={styles.inputWrapper}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryText}>
                    {selectedCountry?.id || '+--'}
                  </Text>
                </View>
                <TextInputCompo
                  placeholder="Phone Number"
                  placeholderTextColor={COLORS.blackColor}
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  onChangeText={val => handleChange('phone', val)}
                  value={formData.phone}
                />
              </View>

              {/* business type */}
              <Dropdowncomp
                data={catagory}
                placeholder={'Company / Business Type'}
                // placeholderStyle={{ color: COLORS.whiteColor }}
                style={styles.input}
                onChange={item => setselectedtype(item.value)}
                // selectedStyle={{ color: COLORS.whiteColor }}
                value={selectdType}
              />

              {/* Country */}
              <Dropdowncomp
                data={countries}
                style={styles.input}
                // placeholderStyle={{ color: COLORS.blackColor }}
                onChange={handleCountryChange}
                value={selectedCountry}
                placeholder={'Select Country'}
                search={true}
                // selectedStyle={{color:COLORS.blackColor}}
              />

              {/* State */}
              <Dropdowncomp
                data={states}
                style={styles.input}
                // placeholderStyle={{ color: COLORS.blackColor }}
                onChange={handleStateChange}
                value={selectedState}
                placeholder={'State / Province'}
                search={true}
                // selectedStyle={{color:COLORS.blackColor,}}
              />

              <Dropdowncomp
                data={cities}
                style={styles.input}
                // placeholderStyle={{ color: COLORS.blackColor }}
                onChange={handleCityChange}
                value={selectedCity}
                placeholder={'Select City'}
                search={true}
                selectedStyle={{ color: COLORS.blackColor }}
              />
              <TextInputCompo
                placeholder="Enter Zip"
                placeholderTextColor={COLORS.blackColor}
                style={styles.input}
                onChangeText={val => handleChange('zip', val)}
                value={formData.zip}
              />
              <TextInputCompo
                placeholder="Street"
                placeholderTextColor={COLORS.blackColor}
                style={{ ...styles.input }}
                onChangeText={val => handleChange('street', val)}
                value={formData.street}
              />
              <TextInputCompo
                placeholder="Comment"
                placeholderTextColor={COLORS.blackColor}
                style={{ ...styles.input, height: 100 }}
                onChangeText={val => handleChange('comment', val)}
                value={formData.comment}
              />
            </View>

            <ButtonCompo
              style={styles.loginButton}
              title="Sign Up"
              onPress={handleSubmit}
            />

            <View style={styles.linkContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate(navigationString.LOGIN)}
              >
                <Text style={styles.linkText}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Loader visible={isLoading} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeContainer: { flex: 1 },
  innerContainer: {
    marginTop: 30,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  logoImage: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  inputContainer: { marginBottom: 30 },
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
  linkContainer: { marginTop: 20, alignItems: 'center' },
  linkText: { color: COLORS.blackColor, marginTop: 10, fontSize: 14 },
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
  countryText: { fontSize: 16, color: COLORS.blackColor, },
  phoneInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: COLORS.blackColor,
  },
  scrollContainer: { paddingBottom: 40 },
});

export default RegisterYourCompaney;
