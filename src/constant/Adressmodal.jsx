

import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../styles/colors';
import TextInputCompo from '../components/TextInputCompo';
import makeApiCall from '../utils/apiHelper';
import { API_URLS } from '../utils/apiurls';
import Dropdowncomp from '../components/Dropdowncomp';
import MessageShow from './MessageShow';
import { validateAddress } from '../utils/ValidationForm';

const AddressModal = ({
  visible,
  onClose,
  data,
  handleSelectAddress,
}) => {
  // const partnersObj = partnersData?.partners || [];
  // const partners = Object.values(partnersObj);

  const [countryItems, setCountryItems] = useState([]);
  const [stateItems, setStateItems] = useState([]);
  const [cityItems, setCityItems] = useState([]);
  const [stateinfo,setStateInfo]=useState([])
  console.log(data,'DATA')

  const [selectedCountry, setSelectedCountry] = useState({
    label: 'India',
    value: 104,
    code: 'IN',
    phone_code: 91,
  });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoding,setisloding]=useState(false)

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    email: '',
    street1: '',
    street2: '',
    country: '',
    state: '',
    zip: '',
  });

  const handleInputChange = (field, value) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setNewAddress({
      name: '',
      phone: '',
      email: '',
      street1: '',
      street2: '',
      country: '',
      state: '',
      zip: '',
    });
    setSelectedCountry({
      label: 'India',
      value: 104,
      code: 'IN',
      phone_code: 91,
    }); 
    setSelectedState(null);
    setSelectedCity(null);
    onClose();
  };
  

  const fetchCountries = async () => {
    try {
      const response = await makeApiCall(API_URLS.getGeoData, 'POST', {
        jsonrpc: '2.0',
        params: { country_id: null, state_id: null },
      });

      const countryObject = response?.result?.data?.country;
      const countryArray = countryObject ? Object.values(countryObject) : [];

      setCountryItems(
        countryArray.map(c => ({
          label: c.name,
          value: c.id,
          code: c.code,
          phone_code: c.phone_code,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStates = async (country_id, preselectedStateId = null) => {
    try {
      const response = await makeApiCall(API_URLS.getGeoData, 'POST', {
        jsonrpc: '2.0',
        params: { country_id },
      });
  
      setStateInfo(response?.result?.data);
  
      const stateObject = response?.result?.data?.state;
      const stateArray = stateObject ? Object.values(stateObject) : [];
      const states = stateArray.map(s => ({ label: s.name, value: s.id }));
  
      setStateItems(states);
      setCityItems([]);
  
      if (preselectedStateId) {
        const matchedState = states.find(s => s.value === preselectedStateId);
        setSelectedState(matchedState || null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const fetchCities = async (country_id,state_id) => {
    // console.log(country_id,state_id)
    try {
      const response = await makeApiCall(API_URLS.getGeoData, 'POST', {
        jsonrpc: '2.0',
        params: { state_id:state_id,country_id:country_id },
      });
      // console.log(response, 'City=====>>>>>>>');
      const cityObject = response?.result?.data?.city;
      const cityArray = cityObject ? Object.values(cityObject) : [];
      // console.log(cityArray, 'City Arrat');
      setCityItems(cityArray.map(c => ({ label: c.name, value: c.id })));
      setSelectedCity(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCountries();
    if (selectedCountry?.value) {
      fetchStates(selectedCountry.value);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry?.value) {
      fetchStates(selectedCountry.value);
    }
  }, [selectedCountry]);

  const handleSubmit = async () => {
    try {
      setisloding(true);
      const { isValid, errors } = validateAddress({
        name: newAddress.name,
        phone: newAddress.phone,
        houseNumber: newAddress.street1, // House No. & Street
        state: selectedState?.label || "",
        city: selectedCity?.label || "",
        zip: newAddress.zip,
      });
    
      if (!isValid) {
        // Show first error message
        const firstError = Object.values(errors)[0];
        // Alert.alert("Validation Error", firstError);
        MessageShow.error("Validation Error", firstError)
        return;
      }
  
      const payload = {
        jsonrpc: "2.0",
        params: {
          id: data?.id?data?.id:null, 
          name: newAddress.name,
          street: newAddress.street1,
          street2: newAddress.street2,
          zip: newAddress.zip,
          city: selectedCity
            ? { id: selectedCity.value, name: selectedCity.label }
            : null,
          state: selectedState
            ? { id: selectedState.value, name: selectedState.label }
            : null,
          country: selectedCountry
            ? {
                id: selectedCountry.value,
                name: selectedCountry.label,
                phone_code: selectedCountry.phone_code,
                code: selectedCountry.code,
              }
            : null,
          phone_code: selectedCountry?.phone_code || "",
          email: newAddress.email,
          phone: newAddress.phone,
          mobile: newAddress.phone, 
        },
      };
  
      console.log("Submit Payload:", payload);
  
      const response = await makeApiCall(API_URLS.putAdress, "POST", payload);
  
      if (response?.result) {
        console.log("Address Saved:", response.result);
        if(response.result.message==='Success'){
          Alert.alert("Success", response?.result?.message ?? "Succsss");
          MessageShow.success('Success',response?.result?.message)
          setNewAddress({
            name: "",
            phone: "",
            email: "",
            street1: "",
            street2: "",
            country: "",
            state: "",
            zip: "",
          });
          onClose()
        }
        
        // handleSelectAddress && handleSelectAddress(response.result);
        // onClose();
      } else {
        console.log("Save failed:", response);
        MessageShow.error('error',response.result?.errorMessage)
      }
      if(response?.result?.errorMessage){
        // Alert.alert('success','success')
        MessageShow.error('error',response?.result?.errorMessage)
      }
    } catch (error) {
      console.log("Error saving address:", error);
      MessageShow.error('error',response.result?.errorMessage)
    } finally {
      setisloding(false);
    }
  };
  useEffect(() => {
    if (data) {
      // Prefill basic info
      setNewAddress({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        street1: data.street || '',
        street2: data.street2 || '',
        zip: data.zip || '',
      });
  
      // Prefill country
      const country = data.country
        ? {
            label: data.country.name,
            value: data.country.id,
            code: data.country.code || 'IN',
            phone_code: data.country.phone_code || 91,
          }
        : {
            label: 'India',
            value: 104,
            code: 'IN',
            phone_code: 91,
          };
      setSelectedCountry(country);
  
      // Fetch states for this country
      fetchStates(country.value).then(() => {
        // After states are fetched, set selectedState
        if (data.state) {
          setSelectedState({ label: data.state.name, value: data.state.id });
  
          // Fetch cities for this state
          fetchCities(country.value, data.state.id).then(() => {
            // After cities are fetched, set selectedCity
            if (data.city) {
              setSelectedCity({ label: data.city.name, value: data.city.id });
            }
          });
        }
      });
    } else {
      // Reset for new address
      setNewAddress({
        name: '',
        phone: '',
        email: '',
        street1: '',
        street2: '',
        zip: '',
      });
      setSelectedCountry({
        label: 'India',
        value: 104,
        code: 'IN',
        phone_code: 91,
      });
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [data]);
  
  
  


  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.handleBar} />
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <Text style={styles.title}>Add New Address</Text>

              {/* Form Fields */}
              <TextInputCompo
                placeholder="Full Name"
                value={newAddress.name}
                onChangeText={text => handleInputChange('name', text)}
                style={styles.input}
                
              />
              <TextInputCompo
                placeholder="Phone Number"
                value={newAddress.phone}
                onChangeText={text => handleInputChange('phone', text)}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInputCompo
                placeholder="Email (Optional)"
                value={newAddress.email}
                onChangeText={text => handleInputChange('email', text)}
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInputCompo
                placeholder="House No. & Street"
                value={newAddress.street1}
                onChangeText={text => handleInputChange('street1', text)}
                style={styles.input}
              />
              <TextInputCompo
                placeholder="Landmark (Optional)"
                value={newAddress.street2}
                onChangeText={text => handleInputChange('street2', text)}
                style={styles.input}
              />

              {/* Country Dropdown */}
              <Dropdowncomp
                search={true}
                data={countryItems}
                value={selectedCountry}
                style={styles.input}
                onChange={item => setSelectedCountry(item)}
                placeholder={'Select Country'}
              />

              {/* State Dropdown */}
              <Dropdowncomp
                data={stateItems}
                value={selectedState}
                onChange={item => {
                  setSelectedState(item);
                  fetchCities(stateinfo?.country_id,item?.value);
                }}
                placeholder={'Please Select State'}
                style={styles.input}
              />

              {/* City Dropdown */}
              <Dropdowncomp
                data={cityItems}
                value={selectedCity}
                onChange={item => setSelectedCity(item)}
                placeholder={'Please Select City'}
                style={styles.input}
              />

              <TextInputCompo
                placeholder="ZIP Code"
                value={newAddress.zip}
                onChangeText={text => handleInputChange('zip', text)}
                keyboardType="number-pad"
                style={styles.input}
              />

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={[styles.buttonText, { color: COLORS.grayText }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSubmit}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>
                    Save Address
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.whiteColor,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.whiteColor,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: COLORS.blueColor,
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: COLORS.whiteColor,
  },
});

export default AddressModal;
