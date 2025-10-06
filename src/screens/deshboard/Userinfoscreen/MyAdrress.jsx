import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import navigationString from '../../../navigation/navigationString';
import AddressModal from '../../../constant/Adressmodal';
import ButtonCompo from '../../../components/ButtonCompo';
import Headercomp from '../../../components/Headercomp';
import {COLORS} from '../../../styles/colors';
import {API_URLS} from '../../../utils/apiurls';
import makeApiCall from '../../../utils/apiHelper';
import {useFocusEffect} from '@react-navigation/native';
import MyAddressModal from '../../../constant/MyAddressModal';

const MyAdrress = ({navigation}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
  console.log(addresses, 'Addresss=======');
  // Fetch addresses from the API
  const fetchAddresses = async () => {
    try {
      const response = await makeApiCall(API_URLS.getAddresses, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(response,'ADDRESSESSSS')
      if (response.result.message === 'Success') {
        const addressData = response?.result?.data?.partners || {};
        const addressesArray = Object.values(addressData);
        setAddresses(addressesArray);

        // Automatically select the first address if none is selected
        // if (addressesArray.length > 0 && !selectedAddressId) {
        //   // setSelectedAddressId(addressesArray);
        // }
      }
    } catch (error) {
      console.log('Error fetching addresses:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('✅ Screen focused');
      fetchAddresses();

      return () => {
        console.log('❌ Screen unfocused');
      };
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
            backgroundColor: isSelected ? '#f0f8ff' : COLORS.whiteColor,
          },
        ]}
        onPress={() => {
          // Toggle selection
          if (selectedAddressId === item.id) {
            setSelectedAddressId(null); // unselect if same item pressed again
          } else {
            setSelectedAddressId(item.id);
          }
        }}>
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
            <Text style={styles.addressText}>Phone: {item.phone}</Text>
            <Text style={styles.addressText}>Email: {item.email}</Text>
          </View>
          <Icon
            name="edit"
            size={18}
            color={isSelected ? COLORS.blackColor : COLORS.whiteColor}
            style={styles.icon}
            onPress={() => {
              setEditingAddress(item);
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
        <View style={styles.buttonContainer}>
          <ButtonCompo
            title="Add Address"
            // onPress={() => setIsModalOpen(true)}
            onPress={() => {
              setEditingAddress(null); // 👈 clear editing state
              setIsModalOpen(true);   // open fresh modal
            }}
            disabled={isLoading}
          />
        </View>
        {/* <AddressModal
          visible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            fetchAddresses();
          }
          }
          data={editingAddress} 
        /> */}
        <MyAddressModal
         visible={isModalOpen}
         onClose={() => {
           setIsModalOpen(false)
           fetchAddresses();
         }
         }
         data={editingAddress} 
        />
      </ScrollView>
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

export default MyAdrress;
