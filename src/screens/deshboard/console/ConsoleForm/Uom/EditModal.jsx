import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import TextInputCompo from '../../../../../components/TextInputCompo';
import CheckBox from '@react-native-community/checkbox';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import ButtonCompo from '../../../../../components/ButtonCompo';
import Loader from '../../../../../components/Loader';
import axios from 'axios';

const EditModal = ({ isVisible, onclose, item }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [uomName, setUomName] = useState('');
  const [precision, setPrecision] = useState('');
  const [ratio, setRatio] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalData, setEditModalData] = useState({});

  const fetcheditItem = async (id) => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.storeUomCategory, 'POST', {
        jsonrpc: '2.0',
        params: {
          id,
          CategoryType: 'public_product_category',
        },
        searchbar: null,
        productType: null,
      });

      if (response?.result?.message === 'success') {
        const data = response?.result?.data;
        setEditModalData(data);

        // Pre-fill states from API
        const category = data?.category || {};
        setUomName(category?.name || '');
        setPrecision(category?.rounding?.toString() || '');
        setRatio(category?.factor?.toString() || '');
        setToggleCheckBox(!!category?.active);
        setSelectedCategory(category?.category_id?.toString() || null);
        setSelectedType(category?.uom_type || null);
      }
    } catch (error) {
      console.log('Fetch Edit Item Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (item?.id) {
      fetcheditItem(item?.id);
    }
  }, [item?.id]);

  // Dropdown formatting
  const formattedCategory = Object.entries(editModalData?.form_options?.category_id || {}).map(
    ([key, value]) => ({
      label: value,
      value: key,
    })
  );

  const formattedTypeDropdown = Object.entries(editModalData?.form_options?.uom_type || {}).map(
    ([key, value]) => ({
      label: value,
      value: key,
    })
  );

  const handleSubmit = async (id) => {
    try {
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', uomName);
      formData.append('active', toggleCheckBox );
      formData.append('category_id', selectedCategory);
      formData.append('uom_type', selectedType);
      formData.append('factor_inv', ratio ? parseFloat(ratio) : 0);
      formData.append('rounding', precision ? parseFloat(precision) : 0);
      
      formData.append('CategoryType', 'public_product_category');
  
    
   console.log(formData)
      const response = await axios.post(
        API_URLS.saveUomCategory, // URL
        formData,                 // body
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data', // Required for Odoo HTTP controller
          },
          withCredentials: true, // if cookies/session needed
          timeout: 7000
        }
      );
  
      console.log('API Response:', response.data);
    
  
      if (response?.data?.result?.message === 'success') {
        
        onclose();
      } else {
        console.log('Update Failed:', response?.data);
      }
    } catch (error) {
      console.log('Update Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose} animationType="slide">
      <TouchableOpacity style={styles.container} onPress={onclose}>
        <View style={styles.whiteBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* UOM Name */}
            <Text style={styles.label}>UOM Name</Text>
            <TextInputCompo
              placeholder="Enter UOM Name"
              onChangeText={setUomName}
              value={uomName}
              style={styles.inputBox}
            />

            {/* Active Checkbox */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <CheckBox value={toggleCheckBox} onValueChange={setToggleCheckBox} />
              <Text style={styles.label}>Active</Text>
            </View>

            {/* Category Dropdown */}
            <Text style={styles.label}>Category</Text>
            <Dropdowncomp
              data={formattedCategory}
              value={selectedCategory}
              onChange={(item) => setSelectedCategory(item?.value)}
              labelField="label"
              valueField="value"
              placeholder="Select Category"
            />

            {/* Rounding Precision */}
            <Text style={styles.label}>Rounding Precision</Text>
            <TextInputCompo
              placeholder="Enter Precision"
              onChangeText={setPrecision}
              value={precision}
              style={styles.inputBox}
              keyboardType="numeric"
            />

            {/* Type Dropdown */}
            <Text style={styles.label}>Type</Text>
            <Dropdowncomp
              data={formattedTypeDropdown}
              value={selectedType}
              onChange={(item) => setSelectedType(item?.value)}
              labelField="label"
              valueField="value"
              placeholder="Select Type"
            />

            {/* Ratio */}
            {selectedType === 'smaller' && (
              <>
                <Text style={styles.label}>Ratio</Text>
                <TextInputCompo
                  placeholder="Enter Ratio"
                  onChangeText={setRatio}
                  value={ratio}
                  style={styles.inputBox}
                  keyboardType="numeric"
                />
              </>
            )}

            {selectedType === 'bigger' && (
              <>
                <Text style={styles.label}>Bigger Ratio</Text>
                <TextInputCompo
                  placeholder="Bigger Ratio"
                  onChangeText={setRatio}
                  value={ratio}
                  style={styles.inputBox}
                  keyboardType="numeric"
                />
              </>
            )}

            {/* Update Button */}
            <ButtonCompo title="Update" onPress={() => handleSubmit(item?.id)} />
          </ScrollView>
        </View>
      </TouchableOpacity>

      {/* Loader */}
      <Loader visible={isLoading} />
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  whiteBox: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    // marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
});
