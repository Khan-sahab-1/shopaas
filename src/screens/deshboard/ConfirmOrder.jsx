import {

  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../styles/colors';
import Headercomp from '../../components/Headercomp';
import makeApiCall from '../../utils/apiHelper';
import { API_URLS } from '../../utils/apiurls';
import Loader from '../../components/Loader';
import axios from 'axios';
import navigationString from '../../navigation/navigationString';
import RazorpayCheckout from 'react-native-razorpay';
import { SafeAreaView } from 'react-native-safe-area-context';

// import PayUNonSeamless from '';

const ConfirmOrder = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isfinalLoding,setIsFinalLoding]=useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  console.log(selectedPaymentMethod,'Selected Mode')
  useEffect(() => {
    console.log('calling');
    // console.log('PayUBizSdk:', PayUBizSdk);
  }, []);

  // console.log(selectedPaymentMethod, 'PAYMENT');

  const getPaymentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getPaymentDetails, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(response, '====GetResponce');
      if (response?.result?.data) {
        setOrderData(response.result.data);
        setPaymentDetails(response?.result?.data);
        // Set first payment method as default if available
        if (response.result.data.payment_acquirers?.length > 0) {
          setSelectedPaymentMethod(response.result.data.payment_acquirers);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load payment details');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async id => {
    console.log(id, 'ID PAYMENT');
    try {
      if (!id) {
        Alert.alert('Error', 'Please select a payment method');
        return;
      }

      setIsFinalLoding(true);

      const response = await makeApiCall(API_URLS.payNow, 'POST', {
        jsonrpc: '2.0',
        params: { acquirer_id: parseInt(id, 10) },
      });
      console.log(response?.result, 'RESPONCE------------');
      if (response?.result?.errorMessage) {
        Alert.alert('Payment Error', response.result.errorMessage);
        return;
      }

      if (response?.result?.message === 'success') {
        navigation.navigate(navigationString.SUCCESS);
        // await handleAfterpaysuccess()
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsFinalLoding(false);
    }
  };
  // const handleRAzerpay = async id => {
  //   try {
  //     if (!id) {
  //       Alert.alert('Error', 'Please select a payment method');
  //       return;
  //     }

  //     setIsFinalLoding(true);

  //     const response = await makeApiCall(API_URLS.payNow, 'POST', {
  //       jsonrpc: '2.0',
  //       params: { acquirer_id: parseInt(id, 10) },
  //     });

  //     console.log('Razorpay Init Full Response:', JSON.stringify(response, null, 2));


  //     const paymentData = response?.result?.paymentData;

  //     if (response?.result?.payment === 'razorpay' && paymentData) {
  //       // const options = {
  //       //   description: 'Order Payment',
  //       //   currency: 'INR',
  //       //   key: paymentData.key,
  //       //   amount: paymentData.amount,
  //       //   email: paymentData.email || 'test@example.com',
  //       //   contact: paymentData?.contact,
  //       //   name: paymentData.name || 'My Store',
  //       //   order_id: paymentData.order_id,
  //       //   // order_id: 'order_JvhhVn8Yxxxyzz',
  //       //   image: 'https://dummyjson.com/image/150',
  //       //   razorpay_url: paymentData?.razorpay_url,
  //       //   merchant_name: paymentData.merchant_name,
  //       //   theme: { color: '#3399cc' },
  //       // };
  //               const options = {
  //           description: 'Credits towards consultation',
  //           image: 'https://i.imgur.com/3g7nmJC.png',
  //           currency: 'INR',
  //           key: paymentData.key,
  //           amount: paymentData.amount,
  //           name: paymentData.name,
  //           prefill: {
  //             email: paymentData.email,
  //             contact: paymentData.contact,
  //             name: paymentData.name
  //           },
  //           theme: {color: '#F37254'},
  //           notes: {
  //               'order_id': paymentData.order_id,
  //           },
         
  //         }
  //       console.log('Options:', options);

  //       RazorpayCheckout.open(options)
  //         .then(async data => {
  //           console.log('calling');
  //           console.log(data)
  //           setIsFinalLoding(true);
  //           const res = await makeApiCall(API_URLS.razorpay_api, 'POST', {
  //             jsonrpc: '2.0',
  //             params: { payment_id: data?.razorpay_payment_id },
  //           });
  //           console.log('Payment Success:', res);
  //           if(res?.result?.data?.success){
  //             navigation.navigate(navigationString.SUCCESS);
  //           }
  //         })
  //         .catch(error => {
  //           console.log('Payment Error (caught):', error);
  //         });
          
  //     }
  //   } catch (err) {
  //     console.error('Razorpay Exception:', err);
  //     Alert.alert('Error', 'Unable to start Razorpay');
  //   } finally {
  //     setIsFinalLoding(false);
  //   }
  // };

  // const handlePayUmaney=async(id)=>{
  //   try {

  //     setIsLoading(true)
  //     if (!id) {
  //       Alert.alert("Error", "Please select a payment method");
  //       return;
  //     }
  //     const responce=await makeApiCall(API_URLS.payNow,'POST',{
  //       jsonrpc: "2.0",
  //       params: { acquirer_id: parseInt(id, 10) },
  //     })
  //     console.log(responce,'PAUMANEY RESPONCE')
  //     if(responce?.result?.statusCode===201){
  //       const paymentData=responce?.result?.paymentData
  //       const paymentOptionData = {
  //         key: paymentData.key,
  //         txnid:paymentData?.txnid,
  //         amount: paymentData?.amount,
  //         productinfo: paymentData?.productinfo,
  //         firstname: paymentData?.firstname,
  //         email: paymentData?.email,
  //         phone: paymentData?.phone,
  //         hash: paymentData.hash,
  //         surl: paymentData.surl,
  //         furl: paymentData.furl,
  //         curl: paymentData.curl ,
  //         udf1: paymentData.udf1,
  //         url:paymentData.url ,
  //       };
  //       console.log("Payment Option Data:", paymentOptionData);
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally{
  //     setIsLoading(false)
  //   }
  // }

  // const handlePayUmaney = async (id) => {
  //   try {
  //     if (!id) {
  //       Alert.alert('Error', 'Please select a payment method');
  //       return;
  //     }

  //     setIsLoading(true);

  //     const response = await makeApiCall(API_URLS.payNow, 'POST', {
  //       jsonrpc: '2.0',
  //       params: { acquirer_id: parseInt(id, 10) },
  //     });
  //     console.log(response?.result, 'RESPONCE------------');
  //     if (response?.result?.errorMessage) {
  //       Alert.alert('Payment Error', response.result.errorMessage);
  //       return;
  //     }

  //     if (response?.result?.message === 'success') {
  //       navigation.navigate(navigationString.SUCCESS);
  //       // await handleAfterpaysuccess()
  //     }
  //   } catch (error) {
  //     console.error('Payment error:', error);
  //     Alert.alert('Error', 'Failed to process payment. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleRAzerpay = async id => {
    try {
      if (!id) {
        Alert.alert('Error', 'Please select a payment method');
        return;
      }
  
      setIsFinalLoding(true);
  
      const response = await makeApiCall(API_URLS.payNow, 'POST', {
        jsonrpc: '2.0',
        params: { acquirer_id: parseInt(id, 10) },
      });
  
      console.log(
        'Razorpay Init Full Response:',
        JSON.stringify(response, null, 2),
      );
  
      const paymentData = response?.result?.paymentData;
  
      if (response?.result?.payment === 'razorpay' && paymentData) {
        const options = {
          description: 'Credits towards consultation',
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: paymentData.key,
          amount: paymentData.amount,
          name: paymentData.name,
          prefill: {
            email: paymentData.email,
            contact: paymentData.contact,
            name: paymentData.name,
          },
          theme: { color: '#F37254' },
          notes: {
            order_id: paymentData.order_id,
          },
        };
  
        console.log('Options:', options);
  
        RazorpayCheckout.open(options)
          .then(async data => {
            console.log('calling');
            console.log(data);
  
            // 🔹 Start loader for verification API
            setIsFinalLoding(true);
  
            try {
              const res = await makeApiCall(API_URLS.razorpay_api, 'POST', {
                jsonrpc: '2.0',
                params: { payment_id: data?.razorpay_payment_id },
              });
              console.log('Payment Success:', res);
  
              if (res?.result?.data?.success) {
                navigation.navigate(navigationString.SUCCESS);
              } else {
                Alert.alert('Error', 'Payment verification failed');
              }
            } catch (verifyErr) {
              console.log('Verification API Error:', verifyErr);
              Alert.alert('Error', 'Unable to verify payment');
            } finally {
              // ✅ Stop loader after verification API
              setIsFinalLoding(false);
            }
          })
          .catch(error => {
            console.log('Payment Error (caught):', error);
          });
      }
    } catch (err) {
      console.error('Razorpay Exception:', err);
      Alert.alert('Error', 'Unable to start Razorpay');
    } finally {
      // ✅ Only stop loader if Razorpay didn’t start
      setIsFinalLoding(false);
    }
  };
  
  const handlePayUmaney = async (id) => {
    try {
      if (!id) {
        Alert.alert('Error', 'Please select a payment method');
        return;
      }
  
      setIsLoading(true);
  
      const response = await makeApiCall(API_URLS.payNow, 'POST', {
        jsonrpc: '2.0',
        params: { acquirer_id: parseInt(id, 10) },
      });
  
      const paymentData = response?.result?.paymentData;
      if (!paymentData) {
        Alert.alert('Payment Error', 'No payment data found');
        return;
      }
  
      // Navigate to WebView
      navigation.navigate(navigationString.PAYUWEBVIEW, { paymentData });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to initiate PayU payment');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  

  const getsessioinfo = async () => {
    try {
      const responce = await makeApiCall(API_URLS.getSessionInfo, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(responce, 'RESPONCE');
    } catch (error) {
      console.log(error);
    }
  };


 
  useEffect(() => {
    getPaymentDetails();
    getsessioinfo();
  }, []);
  const handleconfirm = () => {
    switch (selectedPaymentMethod?.name) {
      case 'Cash On Delivery':
        handlePayNow(selectedPaymentMethod.id);
        break;
      case 'Razorpay':
        handleRAzerpay(selectedPaymentMethod.id);
        break;
      case 'PayUmoney':
        handlePayUmaney(selectedPaymentMethod.id);
        break;
      case 'Wallet':
        handlePayNow(selectedPaymentMethod.id);
        break;
      default:
        Alert.alert('Error', 'Payment method not supported');
    }
    
  };
  const renderAddressCard = (address, title) => (
    <View style={styles.addressCard}>
      <Text style={styles.addressTitle}>{title}</Text>
      <Text style={styles.addressName}>{address.name}</Text>
      <Text style={styles.addressText}>
        {address.street}
        {address.street2 ? `, ${address.street2}` : ''}
      </Text>
      <Text style={styles.addressText}>
        {address.city.name}, {address.state.name} - {address.zip}
      </Text>
      <Text style={styles.addressText}>{address.country.name}</Text>
      <Text style={styles.phoneText}>📞 {address.phone_sanitized}</Text>
      <Text style={styles.emailText}>✉️ {address.email}</Text>
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      {orderData?.payment_acquirers?.map(payment => (
        <TouchableOpacity
          key={payment.id}
          style={[
            styles.paymentCard,
            selectedPaymentMethod?.id === payment.id && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPaymentMethod(payment)}
        >
          <View style={styles.paymentHeader}>
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod?.id === payment.id &&
                    styles.radioButtonSelected,
                ]}
              />
              <Text
                style={[
                  styles.paymentName,
                  selectedPaymentMethod?.id === payment.id &&
                    styles.selectedOptionText,
                ]}
              >
                {payment.name}
              </Text>
            </View>
            <View
              style={[
                styles.providerBadge,
                { backgroundColor: getProviderColor(payment.provider) },
              ]}
            >
              <Text style={styles.providerText}>
                {payment.provider.toUpperCase()}
              </Text>
            </View>
          </View>
          {payment.pre_msg && (
            <Text style={styles.paymentMessage}>
              {payment.pre_msg.replace(/<[^>]*>/g, '')}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const getProviderColor = provider => {
    switch (provider) {
      case 'razorpay':
        return '#3395FF';
      case 'payumoney':
        return '#00C851';
      case 'transfer':
        return '#FF6B35';
      default:
        return COLORS.primaryColor;
    }
  };

  if (!orderData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
        <Headercomp
          title={'Confirm Order'}
          left={true}
          onPress={() => navigation.goBack()}
        />
        <Loader visible={isLoading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Confirm Order'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        {renderAddressCard(orderData.shipping_address, 'Shipping Address')}

        {/* Billing Address */}
        {renderAddressCard(orderData.billing_address, 'Billing Address')}

        {/* Payment Methods */}
        {renderPaymentMethods()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleconfirm}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.confirmButtonText}>
            {isLoading ? 'Processing...' : 'Confirm Order'}
          </Text>
        </TouchableOpacity>
      </View>

      <Loader visible={isLoading} />
      <Loader visible={isfinalLoding} />
    </SafeAreaView>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  addressCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryColor || '#333',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    lineHeight: 18,
  },
  phoneText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  selectedOption: {
    borderColor: COLORS.primaryColor || '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: COLORS.primaryColor || '#007AFF',
    backgroundColor: COLORS.primaryColor || '#007AFF',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: COLORS.primaryColor || '#007AFF',
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPayment: {
    borderColor: COLORS.primaryColor || '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  providerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  providerText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: 'bold',
  },
  paymentMessage: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  confirmButton: {
    backgroundColor: COLORS.primaryColor || '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 20,
  },
});
