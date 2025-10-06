import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import navigationString from '../../../navigation/navigationString';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PickOrder = ({ navigation }) => {
  const [Leading, setLoading] = useState(false);
  const [packOrderData, setpackOrderData] = useState([]);
  const handlefetchstorepick = async (type = null, currentPage = 0) => {
    try {
      setLoading(true);
      const response = await makeApiCall(
        API_URLS.fetch_stock_picking_pick,
        'POST',
        {
          params: {
            // ...filters,
            type: type,
            page: currentPage,
          },
        },
      );

      console.log('Responce-->', response);
      setpackOrderData(response?.result?.data);
    } catch (error) {
      console.error('API Error:', error);
      alert('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  useFocusEffect(
    React.useCallback(() => {
      handlefetchstorepick();
    }, [])
  );
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(navigationString.PREVIEWPICK, { item })}>
        <Text style={styles.title}>Reference: <Text style={styles.value}>{item.name}</Text></Text>
        <Text style={styles.label}>From: <Text style={styles.value}>{item.location_id?.[1]}</Text></Text>
        <Text style={styles.label}>To: <Text style={styles.value}>{item.location_dest_id?.[1]}</Text></Text>
        <Text style={styles.label}>Contact: <Text style={styles.value}>{item.partner_id?.[1]}</Text></Text>
        <Text style={styles.label}>Scheduled Date: <Text style={styles.value}>{item.scheduled_date}</Text></Text>
        <Text style={styles.label}>Source Document: <Text style={styles.value}>{item.origin}</Text></Text>
        <Text style={styles.label}>Status: <Text style={styles.status}>{item.state}</Text></Text>
        <Text style={styles.label}>Company: <Text style={styles.value}>{item.company_id?.[1]}</Text></Text>
      </TouchableOpacity>
    );
  };
  
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Pick Order'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={packOrderData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
       <Loader visible={Leading}/>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontWeight: '500',
    color: '#111',
  },
  status: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#007BFF',
  },
});


export default PickOrder

