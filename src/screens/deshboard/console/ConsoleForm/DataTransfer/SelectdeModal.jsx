




import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    FlatList
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import CheckBox from '@react-native-community/checkbox'; 
  import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

  
  const SelectedModal = ({ isVisible, onClose, item, id, setselectedOptions }) => {
    const [options, setOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
  
    const fetchOptions = async (id, product) => {
      try {
        const response = await makeApiCall(API_URLS.getProductOptions, 'POST', {
          jsonrpc: '2.0',
          params: {
            origin: 'product-transfer',
            id: id,
            type: product === 'category' ? 'product_category' : product,
            query: null,
          },
        });
        setOptions(response?.result?.data?.items || []);
      } catch (error) {
        console.log('API ERROR', error);
      }
    };
  
    useEffect(() => {
      if (item?.value && id) {
        fetchOptions(id, item?.value);
      }
    }, [item, id]);
  
    const handleSelect = (option) => {
      setSelectedId(option.id); // for checkbox
      setselectedOptions(option); // update parent state
    };
  
    return (
      <Modal
        visible={isVisible}
        onRequestClose={onClose}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Option</Text>
  
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(item)}
                >
                  <CheckBox
                    value={selectedId === item.id} 
                    onValueChange={() => handleSelect(item)}
                  />
                  <Text style={styles.rowText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
  
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  export default SelectedModal;
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      width: '85%',
      maxHeight: '70%',
      padding: 20,
      borderRadius: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
    },
    rowText: {
      fontSize: 16,
      marginLeft: 8,
      color: '#333',
    },
    closeBtn: {
      marginTop: 15,
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
    },
    closeBtnText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
    },
  });
  