import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

const Varient = ({ navigation, variantData, setVariantData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);

  // ✅ Update state
  const handleChange = (field, value) => {
    setVariantData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Format payload for backend
  const updateFormattedAttributeValue = (selectedAttrId, selectedValueIds) => {
    if (!selectedAttrId || !selectedValueIds?.length) {
      handleChange('attribute_value', []);
      return;
    }

    const valueObject = selectedValueIds.reduce((acc, id) => {
      const label = attributeValues.find(item => item.value === id)?.label || '';
      acc[id] = label.toString().trim();
      return acc;
    }, {});

    const formattedPayload = [
      {
        id: -1,
        attribute_input: [selectedAttrId],
        attribute_value: valueObject,
        type: 'new',
      },
    ];

    handleChange('attribute_value', formattedPayload); // ✅ API-ready payload
  };

  // ✅ Fetch attribute list
  const fetchVariantAttributes = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
        jsonrpc: '2.0',
        params: {
          method: 'GET',
          valueData: [],
          variantData: 'attribute',
        },
      });

      const formatted = Object.entries(response?.result?.attribute_id || {}).map(
        ([value, label]) => ({ label: label.trim(), value })
      );

      setVariantAttributes(formatted);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fetch values for selected attribute
  const fetchVariantValues = async selectedAttribute => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
        jsonrpc: '2.0',
        params: {
          method: 'GET',
          variantData: 'values',
          valueData: { selectedItems: [selectedAttribute] },
        },
      });

      const formatted = Object.entries(response?.result?.values || {}).map(
        ([value, label]) => ({
          label: label.toString().trim(),
          value,
        })
      );

      setAttributeValues(formatted);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchVariantAttributes();
  }, []);

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: COLORS.whiteColor }}>
      <Text style={styles.label}>Attribute</Text>
      <Dropdowncomp
        data={variantAttributes}
        value={variantData?.id}
        onChange={item => {
          handleChange('id', item?.value);
          handleChange('attribute_value', []); // reset when attribute changes
          fetchVariantValues(item?.value);
        }}
      />

      <Text style={styles.label}>Attribute Values</Text>
      <MultiSelectorDropdownComp
        data={attributeValues}
        value={
          variantData?.attribute_value?.[0]
            ? Object.keys(variantData.attribute_value[0].attribute_value)
            : []
        }
        onChange={items => updateFormattedAttributeValue(variantData?.id, items)}
        label="Select Attribute Values"
      />

      <ButtonCompo
        title="Save Table"
        onPress={() => {
          console.log('🧾 Final Variant Payload:', variantData);
        }}
      />
    </View>
  );
};

export default Varient;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginTop: 10,
  },
});
