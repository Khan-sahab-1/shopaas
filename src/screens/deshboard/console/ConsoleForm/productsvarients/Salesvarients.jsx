import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import { API_URLS } from '../../../../../utils/apiurls';
import makeApiCall from '../../../../../utils/apiHelper';

const Salesvarients = ({ salesData, setSalesData, data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  console.log(productData,'PRODUCT DATA')

  // Fetch variant data
  const fetchSavedata = async (id) => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.storeProductVarientTree, 'POST', {
        jsonrpc: '2.0',
        params: { id: String(id) },
      });
  
      if (response?.result?.message === 'success') {
        const result = response.result.data;
  
        const rawOptional = result?.form_options?.optional_product_ids || {};
        const formattedOptions = Object.entries(rawOptional).map(([value, label]) => ({
          label,
          value: parseInt(value),
        }));
        setProductOptions(formattedOptions);
  
  
        setProductData(result); 
      }
    } catch (error) {
      console.log('❌ Error fetching variant data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Initial fetch
  useEffect(() => {
    if (data?.id) {
      fetchSavedata(data.id);
    }
  }, [data?.id]);


  

  // Dropdown options for invoice policy
  const policyOptions = productData?.form_options?.invoice_policy
    ? Object.entries(productData.form_options.invoice_policy).map(([value, label]) => ({
        label,
        value,
      }))
    : [];

  const handleChange = (field, value) => {
    setSalesData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(()=>{
   if(productData?.product&&Object.keys(productData?.product).length>0){
    const initialRnder={
      optional_product_ids:productData?.product?.optional_product_ids||[],
      invoice_policy:productData?.product?.invoice_policy||'',
      description_sale:productData?.product?.description_sale||'',

    }
    setSalesData(initialRnder)
   }
  },[productData])

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Invoicing Policy</Text>
      <Dropdowncomp
        data={policyOptions}
        value={salesData?.invoice_policy}
        onChange={(item) => handleChange('invoice_policy', item.value)}
      />

      <Text style={styles.label}>Optional Products</Text>
      {productOptions.length > 0 ? (
        <MultiSelectorDropdownComp
          data={productOptions}
          value={salesData?.optional_product_ids || []}
          onChange={(selectedItems) => handleChange('optional_product_ids', selectedItems)}
          label="Select Options"
          placeholder="Select Options"
        />
      ) : (
        <Text style={{ color: COLORS.greyColor, marginTop: 5 }}>
          No optional products available.
        </Text>
      )}

      <Text style={styles.label}>Sales Description</Text>
      <TextInputCompo
        title="Sales Price"
        placeholder="Enter Sales Price"
        style={styles.inputBox}
        value={salesData?.description_sale || ''}
        onChangeText={(text) => handleChange('description_sale', text)}
      />
    </View>
  );
};

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

export default Salesvarients;

