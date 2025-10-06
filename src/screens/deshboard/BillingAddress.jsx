import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import makeApiCall from '../../utils/apiHelper';
import {API_URLS} from '../../utils/apiurls';
import {COLORS} from '../../styles/colors';
import Headercomp from '../../components/Headercomp';
import ButtonCompo from '../../components/ButtonCompo';
import AddressModal from '../../constant/Adressmodal';
import navigationString from '../../navigation/navigationString';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../components/Loader';
import MessageShow from '../../constant/MessageShow';
import { useDispatch } from 'react-redux';
import { fetchCartData } from '../../redux/reducers/fetchCartData';

const BillingAddress = ({navigation}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validateLoding,setvalidateLoding]=useState(false)
  const [isEditable,setIsEditable]=useState(false)
  const [editingAddress, setEditingAddress] = useState(null);
  const dispatch=useDispatch()


  

  const fetchAddresses = async () => {
    try {
      const response = await makeApiCall(API_URLS.getAddresses, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(response)
      if (response.result.message === 'Success') {
        const addressData = response?.result?.data?.partners || {};
        const addressesArray = Object.values(addressData);
        setAddresses(addressesArray);
      
  
        if (addressesArray.length > 0 && !selectedAddressId) {
          setSelectedAddressId(addressesArray[0].id);
        }
  
        // Auto-open modal if country, state, or city is missing
        const incompleteAddress = addressesArray.find(
          addr =>
            !addr.country?.id ||
            !addr.state?.id ||
            !addr.city?.id
        );
  
        if (incompleteAddress) {
          setEditingAddress(incompleteAddress);
          setIsEditable(incompleteAddress.is_editable ?? true);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.log('Error fetching addresses:', error);
    }
  };
  
  const selectAddress = async id => {
    try {
      setIsLoading(true);
      const res = await makeApiCall(API_URLS.selectShippingAddress, 'POST', {
        jsonrpc: '2.0',
        params: {
          selected_shipping_address: id,
        },
      });
      console.log('Shipping address selected:', res);
    } catch (error) {
      console.log('Error selecting shipping address:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const validateaddress = async () => {
    try {
      setvalidateLoding(true);
      const res = await makeApiCall(API_URLS.validateDelivery, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(res, 'RES');
      if (res?.result?.message==='success' && res?.result?.redirectFlag) {
        navigation.navigate(navigationString.CONFIRMORDER);
      } else if (res?.result?.statusCode == '200') {
        navigation.navigate(navigationString.CONFIRMORDER);
      } else {
        // Alert.alert(
        //   'Error',
        //   'For this product order cannot be created because ID is coming null'
        // );
        MessageShow.error(
          'Error',(res?.result?.errorMessage)
        );
      }
      
      
    } catch (error) {
      console.log(error);
    } finally {
      setvalidateLoding(false);
    }
  };


  const handleAddressSelection = id => {
    setSelectedAddressId(id);
    selectAddress(id); 
  };

  useEffect(() => {
    if (isEditable) {
    }
  }, []);

  // useEffect(() => {
  //   fetchAddresses();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
      dispatch(fetchCartData())
      return () => {};
    }, []),
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <Headercomp
        title="My Address"
        left={true}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.container}>
          {addresses.length > 0 ? (
            addresses.map(item => {
              const isSelected = selectedAddressId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.box,
                    {
                      borderColor: isSelected ? COLORS.primaryColor : '#ccc',
                      backgroundColor: isSelected
                        ? '#f0f8ff'
                        : COLORS.whiteColor,
                    },
                  ]}
                  onPress={() => handleAddressSelection(item.id)}>
                  <View style={styles.addressRow}>
                    <Icon
                      name="location-pin"
                      size={24}
                      color={isSelected ? COLORS.primaryColor : '#666'}
                      style={styles.icon}
                    />
                    <View style={styles.addressDetails}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.addressText}>{item.street}</Text>
                      <Text style={styles.addressText}>
                        {item.city?.name}, {item.state?.name} - {item.zip}
                      </Text>
                      <Text style={styles.addressText}>
                        Phone: {item.phone}
                      </Text>
                      <Text style={styles.addressText}>
                        Email: {item.email}
                      </Text>
                    </View>
                    <Icon
                     name="edit" 
                      size={18}
                      color={isSelected ? COLORS.blackColor : COLORS.whiteColor}
                      style={styles.icon}
                      onPress={() => {
                        setEditingAddress(item); // pass existing address
                        setIsEditable(item.is_editable); // only editable if allowed
                        setIsModalOpen(true);
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noAddressText}>No Address Found</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ButtonCompo
          title="Add Address"
          onPress={() => setIsModalOpen(true)}
          disabled={isLoading}
        />
        {selectedAddressId !== null && (
          <ButtonCompo
            title="Confirm"
            onPress={() => {
              validateaddress();
            }}
          />
        )}
      </View>
      {/* <AddressModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditable={isEditable}
        data={addresses}
      /> */}
      <AddressModal
  visible={isModalOpen}
  onClose={() => {setIsModalOpen(false)
    fetchAddresses();
  }}
  isEditable={isEditable}
  data={editingAddress} 
/>
<Loader visible={isLoading}/>
<Loader visible={validateLoding}/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  box: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  addressDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#555',
  },
  noAddressText: {
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
  },
});

export default BillingAddress;
