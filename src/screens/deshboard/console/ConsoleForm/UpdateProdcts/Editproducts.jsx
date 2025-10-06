import { Modal, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../../../styles/colors';
import TextInputCompo from '../../../../../components/TextInputCompo';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

const Editproducts = ({ isVisible, onclose, item, parentId = 210, refreshList }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [updatePrice, setUpdatePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setUpdatePrice(item.price?.toString() || '');
      setToggleCheckBox(!!item.is_published);
    }
  }, [item]);

  const handlesave = async () => {
    try {
      if (!updatePrice) {
        Alert.alert('Validation', 'Please enter a valid price.');
        return;
      }

      setIsLoading(true);

      const payload = {
        jsonrpc: '2.0',
        params: {
          page: 0,
          id: parentId,
          updateProductData: {
            [item?.id]: {
              is_published: toggleCheckBox,
              price: updatePrice,
            },
            action: 'update',
          },
        },
      };

      const res = await makeApiCall(API_URLS.saveProductDataUpdate, 'POST', payload);

      if (res?.result?.message === 'success') {
        Alert.alert('Success', 'Product updated successfully');
        refreshList && refreshList(); // Refresh parent list if provided
        onclose();
      } else {
        Alert.alert('Error', res?.result?.errmessage || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Something went wrong while updating the product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose}>
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onclose}>
        <View style={styles.whiteBox}>
          <Text style={{ ...styles.label, fontSize: 20 }}>Edit Products</Text>

          <Text style={styles.label}>Product</Text>
          <TextInputCompo
            placeholder="Product"
            style={styles.input}
            value={item?.product_id?.name || ''}
            editable={false}
          />

          <Text style={styles.label}>Product Type</Text>
          <TextInputCompo
            placeholder="Product Type"
            style={styles.input}
            value={item?.type || ''}
            editable={false}
          />

          <Text style={styles.label}>Product Category</Text>
          <TextInputCompo
            placeholder="Product Category"
            style={styles.input}
            value={item?.categ_id?.name || ''}
            editable={false}
          />

          <Text style={styles.label}>Price</Text>
          <TextInputCompo
            placeholder="Price"
            style={styles.input}
            value={updatePrice}
            onChangeText={(text) => setUpdatePrice(text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Lot/Serial</Text>
          <TextInputCompo
            placeholder="Lot/Serial"
            style={styles.input}
            value={item?.lot_id?.name || ''}
            editable={false}
          />

          <View style={styles.checkbox}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
            <Text style={styles.label}>Published</Text>
          </View>

          <ButtonCompo title={isLoading ? 'Updating...' : 'Update'} onPress={handlesave} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default Editproducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  whiteBox: {
    padding: 15,
    backgroundColor: COLORS.whiteColor,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blackColor,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    height: 50,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});
