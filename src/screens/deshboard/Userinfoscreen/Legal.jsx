import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';


const Legal = () => {
  const [legalData, setLegalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLegal = async () => {
    try {
      const res = await makeApiCall(API_URLS.getLEGALS, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });

      const data = res?.result?.data || {};
      const arr = Object.values(data); // Convert to array
      setLegalData(arr);
    } catch (error) {
      console.log('Legal Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegal();
  }, []);

  if (loading) {
    return (
      <View style={styles.tabContent}>
        <ActivityIndicator size="large" color="#ff5722" />
      </View>
    );
  }

  if (legalData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="gavel" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No Legal content available</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {legalData.map((item, index) => (
        <Text key={index} style={{ marginBottom: 10 }}>{item.title || 'Untitled'}</Text>
      ))}
    </View>
  );
};

export default Legal;
export const styles = StyleSheet.create({
    tabContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: '#777',
    },
  });
  