import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import axios from 'axios';

const Ecommerce = ({ setEcommerceData, ecommerceData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [commerceData, setCommerceData] = useState([]);

  const fetchEcommerceData = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post(API_URLS.storeProducts, {
        jsonrpc: '2.0',
        params: {
          id: 'New',
          getSpecificData: 'Ecommerce',
        },
        productType: null,
        searchbar: null,
      });
      // console.log(response,'Caommerec---')
      const response = res?.data;
      if (response?.result?.message === 'success') {
        setCommerceData(
          response?.result?.all_ecommerce_data?.ecommerce_form_options,
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEcommerceData();
  }, []);

  const handleChange = (field, value) => {
    setEcommerceData(prev => ({ ...prev, [field]: value }));
  };

  // Formatting options
  const formatOptions = data =>
    data
      ? Object.entries(data).map(([value, label]) => ({ label, value }))
      : [];

  const typeOptions = formatOptions(commerceData?.public_categ_ids);
  const typeAlternativeProducts = formatOptions(
    commerceData?.alternative_product_ids,
  );
  const typeAccessoryProducts = formatOptions(
    commerceData?.accessory_product_ids,
  );
  const typeStyleProducts = formatOptions(commerceData?.website_style_ids);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <View style={styles.container}>
        <Text style={styles.label}>Categories</Text>
        <MultiSelectorDropdownComp
          data={typeOptions}
          value={ecommerceData?.public_categ_ids || []}
          onChange={items => handleChange('public_categ_ids', items)}
          label="Select Categories"
        />

        <Text style={styles.label}>Availability</Text>
        <Dropdowncomp
          data={[
            { label: 'Sell regardless of invertory', value: 'never' },
            {
              label:
                'Show invertory on website and prevent sales if not enough stock',
              value: 'always',
            },
            {
              label:
                'Show invertory below a thresold and prevent sales if not enough stock',
              value: 'threshold',
            },
            { label: 'Show product-specific notifications', value: 'custom' },
          ]}
          value={ecommerceData?.inventory_availability}
          onChange={item => handleChange('inventory_availability', item?.value)}
        />

        <Text style={styles.label}>Alternative Products</Text>
        <MultiSelectorDropdownComp
          data={typeAlternativeProducts}
          value={ecommerceData?.alternative_product_ids || []}
          onChange={items => handleChange('alternative_product_ids', items)}
          label="Select Alternative Products"
        />

        <Text style={styles.label}>Accessory Products</Text>
        <MultiSelectorDropdownComp
          data={typeAccessoryProducts}
          value={ecommerceData?.accessory_product_ids || []}
          onChange={items => handleChange('accessory_product_ids', items)}
          label="Select Accessory Products"
        />

        <Text style={styles.label}>Style</Text>
        <MultiSelectorDropdownComp
          data={typeStyleProducts}
          value={ecommerceData?.website_style_ids || []}
          onChange={items => handleChange('website_style_ids', items)}
          label="Select Styles"
        />

        <Loader visible={isLoading} />
      </View>
    </ScrollView>
  );
};

export default Ecommerce;

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
});
