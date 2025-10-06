import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';

const Faqs = () => {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaqs = async () => {
    try {
      const response = await makeApiCall(API_URLS.getFAQS, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });

      const data = response?.result?.data || {};
      const list = Object.values(data);
      setFaqList(list);
    } catch (error) {
      console.log('FAQ Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff5722" />
      </View>
    );
  }

  if (faqList.length === 0) {
    return (
      <View style={styles.centered}>
        <Icon name="help-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No FAQs available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {faqList.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{item.question || 'No Question'}</Text>
          <Text style={styles.answer}>{item.answer || 'No Answer'}</Text>
        </View>
      ))}
    </View>
  );
};



const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  answer: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default Faqs

