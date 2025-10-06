import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../styles/colors';
import MultiSelectorDropdown from '../../screens/deshboard/console/ConsoleForm/productsvarients/Multidropdown';
import Dropdowncomp from '../Dropdowncomp';
import ButtonCompo from '../ButtonCompo';
import { useGetProductsMutation } from '../../redux/rtkQuery/Servicess';
import Loader from '../Loader';

const Ecommercecomp = ({ item, setEcommerceData, EcommerceData,onFieldChange }) => {
  const [getProducts, { data, error, isLoading }] = useGetProductsMutation();

  const [dropdownOptions, setDropdownOptions] = useState({
    categories: [],
    alternatives: [],
    accessories: [],
    styles: [],
  });

  useEffect(() => {
    getProducts({
      jsonrpc: '2.0',
      params: { id: item?.id, getSpecificData: 'Ecommerce' },
      productType: null,
      searchbar: null,
    });
  }, []);
const [isOpenMedia,setisOpenMedia]=useState(false)

  useEffect(() => {
    if (data?.result?.all_ecommerce_data) {
      const ecommerceData = data.result.all_ecommerce_data.ecommerce_data || {};
      const formOptions = data.result.all_ecommerce_data.ecommerce_form_options || {};

      // Prefill product values
      setEcommerceData(ecommerceData);

      // Map options {id: label} → [{value, label}]
      const mapOptions = (obj = {}) =>
        Object.entries(obj).map(([id, label]) => ({
          value: Number(id),
          label,
        }));

      setDropdownOptions({
        categories: mapOptions(formOptions.public_categ_ids),
        alternatives: mapOptions(formOptions.alternative_product_ids),
        accessories: mapOptions(formOptions.accessory_product_ids),
        styles: mapOptions(formOptions.website_style_ids),
      });
    }
  }, [data]);

  const handleChange = (field, selected) => {
    let newValue;
  
    if (Array.isArray(selected)) {
      // Multi select
      newValue = selected.map(item => {
        if (typeof item === "object" && item !== null) {
          return item.value; // when item = {label, value}
        }
        return item; // when item = "12056031"
      });
    } else {
      // Single select
      if (typeof selected === "object" && selected !== null) {
        newValue = selected.value;
      } else {
        newValue = selected;
      }
    }
  
    setEcommerceData(prev => ({
      ...prev,
      [field]: newValue,
    }));
  
    onFieldChange && onFieldChange(field, newValue);
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
        {/* Categories */}
        <Text style={styles.label}>Categories</Text>
        <MultiSelectorDropdown
          data={dropdownOptions.categories}
          value={EcommerceData?.public_categ_ids || []}
          onChange={items => handleChange('public_categ_ids', items)}
        />

        {/* Availability */}
        <Text style={styles.label}>Availability</Text>
        <Dropdowncomp
          data={[
            { label: 'Sell regardless of inventory', value: 'never' },
            {
              label: 'Show inventory on website and prevent sales if not enough stock',
              value: 'always',
            },
            {
              label:
                'Show inventory below a threshold and prevent sales if not enough stock',
              value: 'threshold',
            },
            { label: 'Show product-specific notifications', value: 'custom' },
          ]}
          value={EcommerceData?.inventory_availability}
          onChange={item => handleChange('inventory_availability', item?.value)}
          style={{ height: 60 }}
        />

        {/* Alternative Products */}
        <Text style={styles.label}>Alternative Products</Text>
        <MultiSelectorDropdown
          data={dropdownOptions.alternatives}
          value={EcommerceData?.alternative_product_ids || []}
          onChange={items => handleChange('alternative_product_ids', items)}
        />

        {/* Accessory Products */}
        <Text style={styles.label}>Accessory Products</Text>
        <MultiSelectorDropdown
          data={dropdownOptions.accessories}
          value={EcommerceData?.accessory_product_ids || []}
          onChange={items => handleChange('accessory_product_ids', items)}
        />

        {/* Style */}
        <Text style={styles.label}>Style</Text>
        <MultiSelectorDropdown
          data={dropdownOptions.styles}
          value={EcommerceData?.website_style_ids || []}
          onChange={items => handleChange('website_style_ids', items)}
        />

        {/* <ButtonCompo title="+ Add A Media" /> */}
      </ScrollView>
      <Loader visible={isLoading} />
    </SafeAreaView>
  );
};

export default Ecommercecomp;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
});
