import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import { API_URLS } from '../../../../../utils/apiurls';
import makeApiCall from '../../../../../utils/apiHelper';

const Sales = ({ salesData, setSalesData }) => {
  const [isLoding, setIsLoding] = useState(false);
  const [productData, setProductData] = useState([]);

  const fetchSavedata = async () => {
    try {
      setIsLoding(true);
      const response = await makeApiCall(API_URLS.storeProducts, 'POST', {
        jsonrpc: '2.0',
        params: { id: 'New' },
      });
      console.log('Response--', response);
      if (response?.result?.message === 'success') {
        setProductData(response?.result?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchSavedata();
  }, []);

  const formattedpolicy = productData?.form_options?.invoice_policy;
  const policytypeOptions = formattedpolicy
    ? Object.entries(formattedpolicy).map(([value, label]) => ({
        label,
        value,
      }))
    : [];
    const formattedoptioonalproduct = productData?.form_options?.optional_product_ids;
    const productOptions = formattedoptioonalproduct
      ? Object.entries(formattedoptioonalproduct).map(([value, label]) => ({
          label,
          value,
        }))
      : [];

  const handleChange = (field, value) => {
    setSalesData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <View style={{ ...styles.container }}>
      <Text style={{ ...styles.label }}>Invoicing Policy</Text>
      <Dropdowncomp
        data={policytypeOptions}
        value={salesData?.invoice_policy}
        onChange={item => handleChange('invoice_policy', item.value)}
      />
      <Text style={{ ...styles.label }}>Optional</Text>
      <MultiSelectorDropdownComp
        data={productOptions}
        //   selectedValues={selectedValues}
        //   onSelectionsChange={setSelectedValues}
        label="Select Options"
        value={salesData?.optional_product_ids || []}
        onChange={selectedItems => handleChange('optional_product_ids', selectedItems)}
        placeholder="Select Options"
      />
      <Text style={{ ...styles.label }}>Sales Description</Text>
      <TextInputCompo
        title="Sales Price"
        placeholder="Enter Sales Price"
        style={{ ...styles.inputBox }}
        value={salesData?.description_sale || ''}
        
        onChangeText={text => handleChange('description_sale', text)}
      />
    </View>
  );
};

export default Sales;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
    padding: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginTop: 10,
  },
  inputBox: {
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
  },
});
