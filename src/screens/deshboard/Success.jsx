import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import makeApiCall from '../../utils/apiHelper';
import {API_URLS} from '../../utils/apiurls';
import {COLORS} from '../../styles/colors';
import Headercomp from '../../components/Headercomp';
import navigationString from '../../navigation/navigationString';
import {useDispatch} from 'react-redux';
import {clearCart, fetchCartData} from '../../redux/reducers/fetchCartData';
import {SafeAreaView} from 'react-native-safe-area-context';

const Success = ({navigation}) => {
  const [orderData, setOrderData] = useState(null);
  const dispatch = useDispatch();

  const handleAfterpaysuccess = async () => {
    try {
      const response = await makeApiCall(
        API_URLS.getPaymentConfirmationData,
        'POST',
        {
          jsonrpc: '2.0',
          params: {},
        },
      );
      console.log(response, 'After Success');
      if (response?.result?.message === 'success') {
        // dispatch(fetchCartData());
        // dispatch(clearCart());

        console.log('Clear');
      }
      if (response?.result?.data) {
        setOrderData(response.result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleAfterpaysuccess();
  }, []);

  if (!orderData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const {sale_order, shipping_address, billing_address, payment_acquirer} =
    orderData;

  const renderAddress = (title, address) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{address?.name}</Text>
      <Text style={styles.cardText}>
        {address?.street}, {address?.street2}
      </Text>
      <Text style={styles.cardText}>
        {address?.city?.name}, {address?.state?.name}
      </Text>
      <Text style={styles.cardText}>
        {address?.zip}, {address?.country?.name}
      </Text>
      <Text style={styles.cardText}>📞 {address?.phone}</Text>
      <Text style={styles.cardText}>✉️ {address?.email}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <Headercomp
        title={'Conform Order'}
        onPress={() => navigation.goBack()}
        left={true}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.header}>🎉 Order Placed Successfully!</Text> */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <Text style={styles.cardText}>Order ID: {sale_order?.name}</Text>
          <Text style={styles.cardText}>
            Amount: ₹{sale_order?.amount_total}
          </Text>
          <Text style={styles.cardText}>
            Expected Date: {sale_order?.expected_date}
          </Text>
        </View>

        {renderAddress('Shipping Address', shipping_address)}
        {renderAddress('Billing Address', billing_address)}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <Text style={styles.cardText}>{payment_acquirer?.name}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(navigationString.TABROUTE)}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.primary || '#2e7d32',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: COLORS.primary || '#2e7d32',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
