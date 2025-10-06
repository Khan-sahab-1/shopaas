import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../../styles/colors';
import TextInputCompo from '../../../../../../components/TextInputCompo';
import Dropdowncomp from '../../../../../../components/Dropdowncomp';
import ButtonCompo from '../../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../../utils/apiurls';
import Loader from '../../../../../../components/Loader';

const LotCratingModal = ({ isVisible, onclose, item }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lotData, setLotData] = useState({ products_data: [] });
  const [formData, setFormData] = useState({
    name: '',
    product_id: '',
    ref: '',
  });

  // Safe dropdown mapping
  const dropDown = Array.isArray(lotData.products_data)
    ? lotData.products_data.map(p => ({ label: p.name, value: p.id }))
    : [];

  // Fetch lot data
  const fetchLot = async productId => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.prodcutLot, 'POST', {
        jsonrpc: '2.0',
        params: { lotId: 'New', productId: String(productId) },
      });
      if (!response?.result?.errorMessage) {
        setLotData(response.result.data || { products_data: [] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (item?.id) fetchLot(item.id);
  }, [item]);

  // Prefill form when lotData changes
  useEffect(() => {
    if (lotData) {
      setFormData({
        name: lotData.name || '',
        product_id: lotData.product_id || '',
        ref: lotData.ref || '',
      });
    }
  }, [lotData]);

  // Submit handler
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        jsonrpc: '2.0',
        params: {
          data: formData,
          lotId: 'New',
          productId: String(item.id),
        },
      };
      const response = await makeApiCall(API_URLS.saveProdcutLot, 'POST', payload);
      console.log('Saved response:', response);
      onclose && onclose(); // close modal after saving
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} onRequestClose={onclose} transparent animationType="slide">
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onclose}>
        <View style={styles.whiteBox}>
          <Text style={styles.lable}>Name</Text>
          <TextInputCompo
            placeholder="Name"
            style={styles.input}
            value={formData.name}
            onChangeText={val => setFormData(prev => ({ ...prev, name: val }))}
          />

          <Text style={styles.lable}>Product Name</Text>
          <Dropdowncomp
            data={dropDown}
            value={formData.product_id}
            onChange={item => setFormData(prev => ({ ...prev, product_id: item.value }))}
          />

          <Text style={styles.lable}>Internal Reference</Text>
          <TextInputCompo
            placeholder="Internal Reference"
            style={styles.input}
            value={formData.ref}
            onChangeText={val => setFormData(prev => ({ ...prev, ref: val }))}
          />

          <ButtonCompo title="Save" onPress={handleSubmit} />
          <Loader visible={isLoading} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default LotCratingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  whiteBox: {
    backgroundColor: COLORS.whiteColor,
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    gap: 10,
  },
  lable: { fontSize: 14, color: COLORS.blackColor, marginBottom: 4 },
  input: { borderRadius: 10, borderWidth: 1, borderColor: COLORS.gray2, padding: 10 },
});
