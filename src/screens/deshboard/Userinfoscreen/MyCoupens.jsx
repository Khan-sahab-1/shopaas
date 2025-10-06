import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import Headercomp from '../../../components/Headercomp';
import { COLORS } from '../../../styles/colors';

const MyCoupens = ({navigation}) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCoupon = async () => {
    try {
      const response = await makeApiCall(API_URLS.getUserCoupons, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });

      console.log('Coupon Response', response);

      // Extract data
      const data = response?.result?.data || {};
      const couponList = Object.values(data); // Convert object to array if needed

      setCoupons(couponList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCoupon();
  }, []);

  const renderCoupon = ({ item }) => (
    <View style={styles.couponItem}>
      <Text style={styles.couponText}>{item.name || 'Unnamed Coupon'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.whiteColor}}>
      <Headercomp title={'Coupens'} left={true} onPress={()=>navigation.goBack()}/>
    <View style={styles.container}>
    

      {loading ? (
        <Text>Loading...</Text>
      ) : coupons.length === 0 ? (
        <View style={styles.noCouponsContainer}>
          <Icon name="local-offer" size={60} color="#ccc" />
          <Text style={styles.noCouponsText}>No coupons available</Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCoupon}
        />
      )}
    </View>
    </SafeAreaView>
  );
};

export default MyCoupens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  couponItem: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  couponText: {
    fontSize: 16,
  },
  noCouponsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  noCouponsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
});
