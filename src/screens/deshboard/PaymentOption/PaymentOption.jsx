// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { COLORS } from '../../../styles/colors';
// import Headercomp from '../../../components/Headercomp';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Entypo from 'react-native-vector-icons/Entypo';

// import Icon from 'react-native-vector-icons/Entypo';
// import {
//   fetchAddressInfo,
//   setSelectedAddressId,
// } from '../../../redux/reducers/addressSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import Adressmodal from '../../../constant/Adressmodal';
// import makeApiCall from '../../../utils/apiHelper';
// import { API_URLS } from '../../../utils/apiurls';

// const PaymentOption = ({ navigation, route }) => {
//   // console.log(route?params ,'Pa')
//   //  clgroute.params
//   const { payableAmount } = route?.params;
//   const [selectedPayment, setSelectedPayment] = useState('');
//   const [expandAddress, setExpandAddress] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [paymentdetails, setpaymentdetail] = useState([]);
//   const [isLoding, setisLoding] = useState(false);
//   const dispatch = useDispatch();
//   console.log(paymentdetails?.payment_acquirers,'PaymnetDetails')

//   const paymentMethods = paymentdetails?.payment_acquirers;
//   console.log(paymentMethods,'')

//   const { addressInfo, loading } = useSelector(state => state.address);
//   const [addresschangeModal, setaddresschangeModala] = useState(false);
//   // const handleSelectAddress = address => {
//   //   setSelectedAddress(address);
//   //   setExpandAddress(false);
//   // };

//   useEffect(() => {
//     dispatch(fetchAddressInfo());
//     fetchpaymentDetails();
//   }, []);

//   // useEffect(() => {
//   //   if (addressInfo && typeof addressInfo === 'object') {
//   //     const addressArray = Object.values(addressInfo);
//   //     if (addressArray.length > 0) {
//   //       setSelectedAddress(addressArray[0]);
//   //     }
//   //   }
//   // }, [addressInfo]);
//   useEffect(() => {
//     if (addressInfo && typeof addressInfo === 'object' && !selectedAddress) {
//       const addressArray = Object.values(addressInfo);
//       if (addressArray.length > 0) {
//         setSelectedAddress(addressArray[0]);
//       }
//     }
//   }, [addressInfo]);

//   // Modify your handleSelectAddress to also store the selected address ID
//   const handleSelectAddress = (address) => {
//     setSelectedAddress(address);
//     setExpandAddress(false);
//     // Optionally store the selected address ID in AsyncStorage for persistence
//     // AsyncStorage.setItem('selectedAddressId', address.id.toString());
//   };

//   // console.log('data----', selectedAddress);

//   const fetchpaymentDetails = async () => {
//     try {
//       setisLoding(true);
//       const responce = await makeApiCall(API_URLS.getPaymentDetails, 'POST', {
//         jsonrpc: '2.0',
//         params: {},
//       });
//       console.log(responce, 'get');
//       setpaymentdetail(responce?.result?.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setisLoding(false);
//     }
//   };
//   const handleselectAddress = async selected_shipping_address => {
//     // console.log(selected_shipping_address,'ADdresssId')
//     try {
//       setisLoding(true);
//       const responce = await makeApiCall(
//         API_URLS.selectShippingAddress,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: {
//             selected_shipping_address: Number(selected_shipping_address),
//           },
//         },
//       );
//       console.log(responce, 'Change address');
//       if(responce?.result?.message==='success'){
//        await fetchpaymentDetails();
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setisLoding(false);
//     }
//   };
//   useEffect(() => {
//     if (selectedAddress) {
//       handleselectAddress(selectedAddress);
//     }
//   }, [selectedAddress]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Headercomp
//         title={'Payment Options'}
//         left={true}
//         onPress={() => navigation.goBack()}
//       />

//       <ScrollView style={styles.scrollContainer}>
//         {/* Delivery Address Section */}
//         <View style={styles.addressContainer}>
//           <View style={styles.addressHeader}>
//             <MaterialIcons
//               name="location-on"
//               size={24}
//               color={COLORS.primary}
//             />
//             <Text style={styles.sectionTitle}>Delivery Address</Text>
//           </View>

//           <TouchableOpacity
//             style={styles.addressContent}
//             onPress={() => setExpandAddress(!expandAddress)}
//           >
//             <View style={{ flex: 1, padding: 20 }}>
//               {selectedAddress ? (
//                 <View key={selectedAddress.id} style={styles.box}>
//                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Icon
//                       name="location-pin"
//                       size={24}
//                       color={COLORS.primaryColor}
//                       style={{ marginRight: 10 }}
//                     />
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.name}>{selectedAddress.name}</Text>
//                       <Text style={styles.addressText}>
//                         {selectedAddress.street}
//                       </Text>
//                       <Text style={styles.addressText}>
//                         {selectedAddress.street2}
//                       </Text>
//                       <Text style={styles.addressText}>
//                         {selectedAddress.city?.name},{' '}
//                         {selectedAddress.state?.name} - {selectedAddress.zip}
//                       </Text>

//                       <Text style={styles.addressText}>
//                         Phone: {selectedAddress.phone}
//                       </Text>
//                       <Text style={styles.addressText}>
//                         Email: {selectedAddress.email}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               ) : (
//                 <Text style={{ marginTop: 20, textAlign: 'center' }}>
//                   No Address Found
//                 </Text>
//               )}
//             </View>

//             <MaterialIcons
//               name={expandAddress ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//               size={24}
//               color="#666"
//             />
//           </TouchableOpacity>

//           {expandAddress && (
//             <TouchableOpacity
//               style={styles.changeAddressBtn}
//               onPress={() => setaddresschangeModala(true)}
//             >
//               <Text style={styles.changeAddressText}>
//                 CHANGE DELIVERY ADDRESS
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Payment Methods Section */}
//         <View style={styles.paymentContainer}>
//           <Text style={styles.sectionTitle}>Choose Payment Method</Text>

//           {/* {paymentMethods.map(method => (
//             <TouchableOpacity
//               key={method.id}
//               style={[
//                 styles.paymentMethod,
//                 selectedPayment === method.id && styles.selectedPayment,
//               ]}
//               onPress={() => setSelectedPayment(method.id)}
//             >
//               <View style={styles.methodLeft}>
//                 <method.iconType
//                   name={method.icon}
//                   size={20}
//                   color={COLORS.primary}
//                 />
//                 <View style={styles.methodInfo}>
//                   <Text style={styles.methodName}>{method.name}</Text>
//                   <Text style={styles.methodDesc}>{method.description}</Text>
//                 </View>
//               </View>
//               <View
//                 style={[
//                   styles.radioOuter,
//                   selectedPayment === method.id && styles.radioOuterSelected,
//                 ]}
//               >
//                 {selectedPayment === method.id && (
//                   <View style={styles.radioInner} />
//                 )}
//               </View>
//             </TouchableOpacity>
//           ))} */}
//         </View>

//         {/* Order Summary Section */}
//         {/* <View style={styles.summaryContainer}>
//           <Text style={styles.sectionTitle}>Order Summary</Text>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryText}>Item Total</Text>
//             <Text style={styles.summaryAmount}>₹ 450</Text>
//           </View>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryText}>Delivery Fee</Text>
//             <Text style={styles.summaryAmount}>₹ 30</Text>
//           </View>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryText}>GST and Restaurant Charges</Text>
//             <Text style={styles.summaryAmount}>₹ 52</Text>
//           </View>

//           <View style={styles.totalRow}>
//             <Text style={styles.totalText}>TO PAY</Text>
//             <Text style={styles.totalAmount}>₹ 532</Text>
//           </View>
//         </View> */}
//       </ScrollView>

//       {/* Proceed Button */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.proceedButton}>
//           <Text style={styles.proceedButtonText}>
//             PROCEED TO PAY ₹ {payableAmount}
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <Adressmodal
//         visible={addresschangeModal}
//         onClose={() => setaddresschangeModala(false)}
//         data={addressInfo}
//         handleSelectAddress={handleSelectAddress}
//       />
//     </SafeAreaView>
//   );
// };

// export default PaymentOption;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   scrollContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   addressContainer: {
//     backgroundColor: COLORS.whiteColor,
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   addressHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.darkText,
//     marginLeft: 8,
//   },
//   addressContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   addressType: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.darkText,
//     marginBottom: 4,
//   },
//   addressText: {
//     fontSize: 13,
//     color: COLORS.grayText,
//     marginBottom: 2,
//   },
//   phoneText: {
//     fontSize: 13,
//     color: COLORS.grayText,
//     marginTop: 6,
//   },
//   changeAddressBtn: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   changeAddressText: {
//     color: COLORS.primary,
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   paymentContainer: {
//     backgroundColor: COLORS.whiteColor,
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   paymentMethod: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   selectedPayment: {
//     backgroundColor: COLORS.primaryLight,
//   },
//   methodLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   methodInfo: {
//     marginLeft: 12,
//   },
//   methodName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: COLORS.darkText,
//   },
//   methodDesc: {
//     fontSize: 12,
//     color: COLORS.grayText,
//     marginTop: 2,
//   },
//   radioOuter: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: COLORS.gray,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   radioOuterSelected: {
//     borderColor: COLORS.primary,
//   },
//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: COLORS.primary,
//   },
//   summaryContainer: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   summaryText: {
//     fontSize: 14,
//     color: COLORS.grayText,
//   },
//   summaryAmount: {
//     fontSize: 14,
//     color: COLORS.darkText,
//     fontWeight: '500',
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.lightGray,
//   },
//   totalText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.darkText,
//   },
//   totalAmount: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: COLORS.white,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.lightGray,
//   },
//   proceedButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   proceedButtonText: {
//     color: COLORS.white,
//     fontWeight: '700',
//     fontSize: 16,
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Entypo';
import {
  fetchAddressInfo,
  setSelectedAddressId,
} from '../../../redux/reducers/addressSlice';
import {useDispatch, useSelector} from 'react-redux';
import Adressmodal from '../../../constant/Adressmodal';
import makeApiCall from '../../../utils/apiHelper';
import {API_URLS} from '../../../utils/apiurls';

const PaymentOption = ({navigation, route}) => {
  const {payableAmount} = route?.params;
  const [selectedPayment, setSelectedPayment] = useState('');
  const [expandAddress, setExpandAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentdetails, setpaymentdetail] = useState([]);
  const [isLoding, setisLoding] = useState(false);
  const dispatch = useDispatch();
  const cartData = useSelector(state => state.cartinfo.cartData);
  console.log(cartData, 'CartDataaa');

  const paymentMethods = paymentdetails?.payment_acquirers;

  const {addressInfo, loading} = useSelector(state => state.address);
  const [addresschangeModal, setaddresschangeModala] = useState(false);

  useEffect(() => {
    dispatch(fetchAddressInfo());
    fetchpaymentDetails();
  }, []);

  useEffect(() => {
    if (addressInfo && typeof addressInfo === 'object' && !selectedAddress) {
      const addressArray = Object.values(addressInfo);
      if (addressArray.length > 0) {
        setSelectedAddress(addressArray[0]);
      }
    }
  }, [addressInfo]);

  const handleSelectAddress = address => {
    setSelectedAddress(address);
    setExpandAddress(false);
  };

  const fetchpaymentDetails = async () => {
    try {
      setisLoding(true);
      const responce = await makeApiCall(API_URLS.getPaymentDetails, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(responce, 'get');
      setpaymentdetail(responce?.result?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoding(false);
    }
  };

  const handleselectAddress = async selected_shipping_address => {
    try {
      setisLoding(true);
      const responce = await makeApiCall(
        API_URLS.selectShippingAddress,
        'POST',
        {
          jsonrpc: '2.0',
          params: {
            selected_shipping_address: Number(selected_shipping_address),
          },
        },
      );
      console.log(responce, 'Change address');
      if (responce?.result?.message === 'success') {
        await fetchpaymentDetails();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoding(false);
    }
  };

  useEffect(() => {
    if (selectedAddress) {
      handleselectAddress(selectedAddress);
    }
  }, [selectedAddress]);

  // Helper function to get an icon based on the provider name
  const getPaymentIcon = provider => {
    switch (provider) {
      case 'payumoney':
        return (
          <MaterialIcons name="credit-card" size={20} color={COLORS.primary} />
        );
      case 'transfer':
        return <FontAwesome name="money" size={20} color={COLORS.primary} />;
      case 'razorpay':
        return (
          <MaterialIcons name="payment" size={20} color={COLORS.primary} />
        );
      default:
        return (
          <MaterialIcons name="help-outline" size={20} color={COLORS.primary} />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'Payment Options'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollContainer}>
        {/* Delivery Address Section */}
        <View style={styles.addressContainer}>
          <View style={styles.addressHeader}>
            <MaterialIcons
              name="location-on"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>

          <TouchableOpacity
            style={styles.addressContent}
            onPress={() => setExpandAddress(!expandAddress)}>
            <View style={{flex: 1, padding: 20}}>
              {selectedAddress ? (
                <View key={selectedAddress.id} style={styles.box}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="location-pin"
                      size={24}
                      color={COLORS.primaryColor}
                      style={{marginRight: 10}}
                    />
                    <View style={{flex: 1}}>
                      <Text style={styles.name}>{selectedAddress.name}</Text>
                      <Text style={styles.addressText}>
                        {selectedAddress.street}
                      </Text>
                      <Text style={styles.addressText}>
                        {selectedAddress.street2}
                      </Text>
                      <Text style={styles.addressText}>
                        {selectedAddress.city?.name},{' '}
                        {selectedAddress.state?.name} - {selectedAddress.zip}
                      </Text>
                      <Text style={styles.addressText}>
                        Phone: {selectedAddress.phone}
                      </Text>
                      <Text style={styles.addressText}>
                        Email: {selectedAddress.email}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text style={{marginTop: 20, textAlign: 'center'}}>
                  No Address Found
                </Text>
              )}
            </View>

            <MaterialIcons
              name={expandAddress ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>

          {expandAddress && (
            <TouchableOpacity
              style={styles.changeAddressBtn}
              onPress={() => setaddresschangeModala(true)}>
              <Text style={styles.changeAddressText}>
                CHANGE DELIVERY ADDRESS
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentContainer}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>
          {isLoding ? (
            <ActivityIndicator
              style={{marginTop: 20}}
              size="large"
              color={COLORS.primary}
            />
          ) : // **Conditional rendering with a safety check**
          paymentMethods && paymentMethods.length > 0 ? (
            paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPayment === method.id && styles.selectedPayment,
                ]}
                onPress={() => setSelectedPayment(method.id)}>
                <View style={styles.methodLeft}>
                  {getPaymentIcon(method.provider)}
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDesc}>
                      {method.auth_msg.replace(/<[^>]+>/g, '')}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    selectedPayment === method.id && styles.radioOuterSelected,
                  ]}>
                  {selectedPayment === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20}}>
              No payment methods available.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>
            PROCEED TO PAY ₹ {payableAmount}
          </Text>
        </TouchableOpacity>
      </View>
      <Adressmodal
        visible={addresschangeModal}
        onClose={() => setaddresschangeModala(false)}
        data={addressInfo}
        handleSelectAddress={handleSelectAddress}
      />
    </SafeAreaView>
  );
};

export default PaymentOption;

// ... (rest of your StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addressContainer: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginLeft: 8,
  },
  addressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  addressType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.grayText,
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 13,
    color: COLORS.grayText,
    marginTop: 6,
  },
  changeAddressBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  changeAddressText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  paymentContainer: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedPayment: {
    backgroundColor: COLORS.primaryLight,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodInfo: {
    marginLeft: 12,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  methodDesc: {
    fontSize: 12,
    color: COLORS.grayText,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.grayText,
  },
  summaryAmount: {
    fontSize: 14,
    color: COLORS.darkText,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  proceedButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
