// // import { StyleSheet, Text, View } from 'react-native';
// // import React, { useEffect, useState } from 'react';
// // import Dropdowncomp from '../Dropdowncomp';
// // import MultiSelectorDropdownComp from '../Multiselectordropdowncomp';
// // import { COLORS } from '../../styles/colors';
// // import makeApiCall from '../../utils/apiHelper';
// // import { API_URLS } from '../../utils/apiurls';
// // import ButtonCompo from '../ButtonCompo';

// // const Varient = ({ variantData, setVariantData, data, onFieldChange ,item}) => {
// //   const product = data?.product || {};
// //   const [variantAttributes, setVariantAttributes] = useState([]);
// //   const [attributeValues, setAttributeValues] = useState([]);
// //   const [selectedAttribute, setSelectedAttribute] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   // console.log(item,'WWWWWWWWWWWW')

// //   // Format optional products for dropdown
// //   const formattedOptional = Object.entries(
// //     data?.form_options?.optional_product_ids || {}
// //   ).map(([value, label]) => ({ value, label }));

// //   // Prefill optional products from product
// //   useEffect(() => {
// //     if (product.optional_product_ids?.length) {
// //       const matched = formattedOptional.filter(opt =>
// //         product.optional_product_ids.includes(Number(opt.value))
// //       );
// //       setVariantData(prev => ({
// //         ...prev,
// //         optional_product_ids: matched.map(item => item.value),
// //       }));
// //     }
// //   }, [product]);

// //   // Fetch all variant attributes
// //   const fetchVariantAttributes = async () => {
// //     try {
// //       setIsLoading(true);
// //       const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
// //         jsonrpc: '2.0',
// //         params: { method: 'GET', valueData: [], variantData: 'attribute' },
// //       });
// //       const formatted = Object.entries(response?.result?.attribute_id || {}).map(
// //         ([value, label]) => ({ label: label.toString().trim(), value })
// //       );
// //       setVariantAttributes(formatted);
// //     } catch (error) {
// //       console.log('Error fetching variant attributes:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Fetch variant values for selected attribute
// //   const fetchVariantValues = async attributeId => {
// //     if (!attributeId) return;

// //     try {
// //       setIsLoading(true);
// //       const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
// //         jsonrpc: '2.0',
// //         params: {
// //           method: 'GET',
// //           variantData: 'values',
// //           valueData: { selectedItems: [attributeId] },
// //         },
// //       });
// // console.log(response,'RESPONCE')
// //       const formatted = Object.entries(response?.result?.values || {}).map(
// //         ([value, label]) => ({ label: label.toString().trim(), value })
// //       );

// //       setAttributeValues(formatted);

// //       // Prefill selected values for this attribute
// //       const prefilled = product.attribute_line_ids?.find(
// //         attr => attr.attribute_input?.[0] === Number(attributeId)
// //       );

// //       if (prefilled) {
// //         const matched = formatted.filter(opt =>
// //           Object.keys(prefilled.attribute_value || {}).includes(opt.value)
// //         );
// //         setVariantData(prev => ({
// //           ...prev,
// //           attribute_line_ids: matched.map(item => item.value),
// //         }));
// //       } else {
// //         setVariantData(prev => ({
// //           ...prev,
// //           attribute_line_ids: [],
// //         }));
// //       }
// //     } catch (error) {
// //       console.log('Error fetching variant values:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const hadleSave = async () => {
// //     try {
// //       const payload = {
// //         id: item?.id,  // Product ID
// //         attribute_value: variantData?.attribute_value || [], // structured array
// //       };
// //      console.log(payload,'PAYLOAD')
// //       // If you need file upload as well, use FormData
// //       const formData = new FormData();
// //       Object.keys(payload).forEach(key => {
// //         const value = payload[key];
// //         if (typeof value === 'object') {
// //           formData.append(key, JSON.stringify(value));
// //         } else {
// //           formData.append(key, value);
// //         }
// //       });
  
// //       const response = await makeApiCall(
// //         API_URLS.saveStoreProducts,
// //         'POST',
// //         formData,
// //         {
// //           'Content-Type': 'multipart/form-data',
// //           Accept: 'application/json',
// //         }
// //       );
  
// //       console.log('✅ Variant Save Response:', response);
// //     } catch (error) {
// //       console.log('❌ Variant Save Error:', error);
// //     }
// //   };
  

// //   useEffect(() => {
// //     fetchVariantAttributes();
// //   }, []);

// //   const handleInputChange = (field, value) => {
// //     setVariantData(prev => ({
// //       ...prev,
// //       [field]: value,
// //     }));
// //   };

// //   const handleForApi = (selectedAttrId, selectedValues) => {
// //     if (!selectedAttrId || !selectedValues?.length) return [];

// //     const attributeValueObj = selectedValues.reduce((acc, item) => {
// //       acc[item.value] = item.label; 
// //       return acc;
// //     }, {});

// //     const formattedPayload = [
// //       {
// //         id: data?.product?.id,
// //         attribute_input: [selectedAttrId],
// //         attribute_value: attributeValueObj,
// //         type: 'new',
// //       },
// //     ];

// //     onFieldChange && onFieldChange('attribute_value', formattedPayload);

// //     return formattedPayload;
// //   };

// //   // Render previous variants for display
// //   const renderPreviousVariants = () => {
// //     if (!product.attribute_line_ids?.length) return null;

// //     return product.attribute_line_ids.map(line => {
// //       const attrId = line.attribute_input?.[0];
// //       const attrLabel =
// //         variantAttributes.find(v => Number(v.value) === Number(attrId))?.label ||
// //         'Attribute';

// //       const valueIds = Object.keys(line.attribute_value || {});
// //       const valueLabels = valueIds
// //         .map(
// //           id =>
// //             attributeValues.find(v => String(v.value) === id)?.label ||
// //             line.attribute_value[id]
// //         )
// //         .join(', ');

// //       return (
// //         <View key={line.id} style={styles.card}>
// //           <Text style={styles.label}>{attrLabel}:</Text>
// //           <Text>{valueLabels}</Text>
// //         </View>
// //       );
// //     });
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {renderPreviousVariants()}

// //       <Text style={styles.label}>Attribute</Text>
// //       <Dropdowncomp
// //         data={variantAttributes}
// //         placeholder="Select Attribute"
// //         value={selectedAttribute}
// //         onChange={item => {
// //           setSelectedAttribute(item.value);
// //           fetchVariantValues(item.value);
// //         }}
// //       />

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Values</Text>
// //         {/* <MultiSelectorDropdownComp
// //           data={attributeValues}
// //           placeholder="Select Value"
// //           value={variantData?.attribute_line_ids || []}
// //           onChange={selectedItems => {
// //             handleInputChange('attribute_line_ids', selectedItems);
// //             handleForApi(selectedAttribute, selectedItems);
// //           }}
// //           disabled={!selectedAttribute}
// //         /> */}
// //         <MultiSelectorDropdownComp
// //   data={attributeValues}       // all possible values
// //   placeholder="Select Value"
// //   value={variantData?.attribute_line_ids?.map(v => v.value) || []}
// //   onChange={selectedIds => {
// //     // Convert selected IDs to objects with label
// //     const selectedItems = selectedIds.map(id => {
// //       const item = attributeValues.find(v => v.value === id);
// //       return item ? { value: item.value, label: item.label } : null;
// //     }).filter(Boolean); // remove any nulls

// //     // Update state
// //     handleInputChange('attribute_line_ids', selectedItems);

// //     // Build API payload
// //     handleForApi(selectedAttribute, selectedItems);
// //   }}
// //   disabled={!selectedAttribute}
// // />

// //       </View>
// //       <ButtonCompo title='Save' onPress={hadleSave}/>
// //     </View>
// //   );
// // };

// // export default Varient;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 16, backgroundColor: COLORS.whiteColor },
// //   inputContainer: { marginTop: 20 },
// //   label: { fontSize: 16, fontWeight: '600', color: COLORS.blackColor },
// //   addButton: {
// //     marginTop: 12,
// //     backgroundColor: COLORS.blueColor,
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   addButtonText: { color: COLORS.whiteColor, fontWeight: '600' },
// //   card: {
// //     backgroundColor: '#F9FAFB',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginTop: 20,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10,
// //   },
// // });



// import { StyleSheet, Text, View } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import Dropdowncomp from '../Dropdowncomp';
// import MultiSelectorDropdownComp from '../Multiselectordropdowncomp';
// import { COLORS } from '../../styles/colors';
// import makeApiCall from '../../utils/apiHelper';
// import { API_URLS } from '../../utils/apiurls';
// import ButtonCompo from '../ButtonCompo';

// const Varient = ({ variantData, setVariantData, data, onFieldChange, item }) => {
//   const product = data?.product || {};
//   const [variantAttributes, setVariantAttributes] = useState([]);
//   const [attributeValues, setAttributeValues] = useState([]);
//   const [selectedAttribute, setSelectedAttribute] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formateddata,setFormatedData]=useState([])

//   // Format optional products for dropdown
//   const formattedOptional = Object.entries(
//     data?.form_options?.optional_product_ids || {}
//   ).map(([value, label]) => ({ value, label }));

//   // Prefill optional products from product
//   useEffect(() => {
//     if (product.optional_product_ids?.length) {
//       const matched = formattedOptional.filter(opt =>
//         product.optional_product_ids.includes(Number(opt.value))
//       );
//       setVariantData(prev => ({
//         ...prev,
//         optional_product_ids: matched.map(item => item.value),
//       }));
//     }
//   }, [product]);

//   // Fetch all variant attributes
//   const fetchVariantAttributes = async () => {
//     try {
//       setIsLoading(true);
//       const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
//         jsonrpc: '2.0',
//         params: { method: 'GET', valueData: [], variantData: 'attribute' },
//       });
//       const formatted = Object.entries(response?.result?.attribute_id || {}).map(
//         ([value, label]) => ({ label: label.toString().trim(), value })
//       );
//       setVariantAttributes(formatted);
//     } catch (error) {
//       console.log('Error fetching variant attributes:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch variant values for selected attribute
//   const fetchVariantValues = async attributeId => {
//     if (!attributeId) return;

//     try {
//       setIsLoading(true);
//       const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
//         jsonrpc: '2.0',
//         params: {
//           method: 'GET',
//           variantData: 'values',
//           valueData: { selectedItems: [attributeId] },
//         },
//       });

//       const formatted = Object.entries(response?.result?.values || {}).map(
//         ([value, label]) => ({ label: label.toString().trim(), value })
//       );

//       setAttributeValues(formatted);
//     } catch (error) {
//       console.log('Error fetching variant values:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Save variant API (if needed later)
//   const hadleSave = async () => {
//     try {
//      console.log(formateddata,'FormattedData')
//       const response = await makeApiCall(
//         API_URLS.saveStoreProducts,
//         'POST',
//         Object.values(formateddata),
//         {
//           'Content-Type': 'multipart/form-data',
//           Accept: 'application/json',
//         }
//       );
//       console.log('Save response:', response);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchVariantAttributes();
//   }, []);

//   const handleInputChange = (field, value) => {
//     setVariantData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // ✅ Build attribute_value payload
//   const handleForApi = (selectedAttrId, selectedItems) => {
//     if (!selectedAttrId || !selectedItems?.length) return;

//     const attributeValueObj = selectedItems.reduce((acc, item) => {
//       acc[item.value] = item.label; // e.g. {"9330":"0.5"}
//       return acc;
//     }, {});

//     const formattedPayload = {
//       id: item?.id || data?.product?.id,
//       attribute_input: [selectedAttrId],
//       attribute_value: attributeValueObj,
//       type: 'new',
//     };

//     setVariantData(prev => ({
//       ...prev,
//       attribute_value: [formattedPayload], 
//     }));
//     setFormatedData(formattedPayload)

//     onFieldChange && onFieldChange('attribute_value', [formattedPayload]);

//     return [formattedPayload];
//   };

//   // Debug watcher
//   useEffect(() => {
//     console.log('🟢 variantData', JSON.stringify(variantData, null, 2));
//   }, [variantData]);

//   // Render previous variants for display
//   const renderPreviousVariants = () => {
//     if (!product.attribute_line_ids?.length) return null;

//     return product.attribute_line_ids.map(line => {
//       const attrId = line.attribute_input?.[0];
//       const attrLabel =
//         variantAttributes.find(v => Number(v.value) === Number(attrId))?.label ||
//         'Attribute';

//       const valueIds = Object.keys(line.attribute_value || {});
//       const valueLabels = valueIds
//         .map(
//           id =>
//             attributeValues.find(v => String(v.value) === id)?.label ||
//             line.attribute_value[id]
//         )
//         .join(', ');

//       return (
//         <View key={line.id} style={styles.card}>
//           <Text style={styles.label}>{attrLabel}:</Text>
//           <Text>{valueLabels}</Text>
//         </View>
//       );
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {renderPreviousVariants()}

//       <Text style={styles.label}>Attribute</Text>
//       <Dropdowncomp
//         data={variantAttributes}
//         placeholder="Select Attribute"
//         value={selectedAttribute}
//         onChange={item => {
//           setSelectedAttribute(item.value);
//           fetchVariantValues(item.value);
//         }}
//       />

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Values</Text>
//         <MultiSelectorDropdownComp
//           data={attributeValues}
//           placeholder="Select Value"
//           value={variantData?.attribute_line_ids?.map(v => v.value) || []}
//           onChange={selectedIds => {
//             const selectedItems = selectedIds
//               .map(id => attributeValues.find(v => v.value === id))
//               .filter(Boolean);

//             handleInputChange('attribute_line_ids', selectedItems);
//             handleForApi(selectedAttribute, selectedItems);
//           }}
//           disabled={!selectedAttribute}
//         />
//       </View>

//       <ButtonCompo title="Save" onPress={hadleSave} />
//     </View>
//   );
// };

// export default Varient;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: COLORS.whiteColor },
//   inputContainer: { marginTop: 20 },
//   label: { fontSize: 16, fontWeight: '600', color: COLORS.blackColor },
//   addButton: {
//     marginTop: 12,
//     backgroundColor: COLORS.blueColor,
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   addButtonText: { color: COLORS.whiteColor, fontWeight: '600' },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
// });




import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Dropdowncomp from '../Dropdowncomp';
import MultiSelectorDropdownComp from '../Multiselectordropdowncomp';
import { COLORS } from '../../styles/colors';
import makeApiCall from '../../utils/apiHelper';
import { API_URLS } from '../../utils/apiurls';
import ButtonCompo from '../ButtonCompo';
import MessageShow from '../../constant/MessageShow';
import { useNavigation } from '@react-navigation/native';
import Loader from '../Loader';

const Varient = ({ variantData, setVariantData, data, onFieldChange, item }) => {
  const product = data?.product || {};
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]); 
  const navigation=useNavigation()
 

  // Format optional products for dropdown
  const formattedOptional = Object.entries(
    data?.form_options?.optional_product_ids || {}
  ).map(([value, label]) => ({ value, label }));

  // Prefill optional products
  useEffect(() => {
    if (product.optional_product_ids?.length) {
      const matched = formattedOptional.filter(opt =>
        product.optional_product_ids.includes(Number(opt.value))
      );
      setVariantData(prev => ({
        ...prev,
        optional_product_ids: matched.map(item => item.value),
      }));
    }
  }, [product]);

  // Fetch all variant attributes
  const fetchVariantAttributes = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
        jsonrpc: '2.0',
        params: { method: 'GET', valueData: [], variantData: 'attribute' },
      });
      const formatted = Object.entries(response?.result?.attribute_id || {}).map(
        ([value, label]) => ({ label: label.toString().trim(), value })
      );
      setVariantAttributes(formatted);
    } catch (error) {
      console.log('Error fetching variant attributes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch variant values for selected attribute
  const fetchVariantValues = async attributeId => {
    if (!attributeId) return;
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getVariantData, 'POST', {
        jsonrpc: '2.0',
        params: {
          method: 'GET',
          variantData: 'values',
          valueData: { selectedItems: [attributeId] },
        },
      });

      const formatted = Object.entries(response?.result?.values || {}).map(
        ([value, label]) => ({ label: label.toString().trim(), value })
      );

      setAttributeValues(formatted);
    } catch (error) {
      console.log('Error fetching variant values:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const formData = new FormData();
  
      // ✅ append id normally
      formData.append("id", item?.id);
  
      // ✅ stringify array/object before appending
      if (formattedData?.length) {
        formData.append("attribute_value", JSON.stringify(formattedData));
      }
  
      console.log("🟢 Final FormData", formattedData);
  
      const response = await makeApiCall(
        API_URLS.saveStoreProducts,
        "POST",
        formData,
        {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        }
      );
  
      console.log("✅ Save response:", response);
      if(response?.message==='success'){
        MessageShow.success('success','Products Attribute Created Successfully')
        navigation.goBack()
      }
      if(response?.errorMessage){
        MessageShow.error('error',response?.errorMessage)
      }
    } catch (error) {
      console.log("❌ Save error:", error);
    } finally{
      setIsLoading(false)
    }
  };
  
  
  

  useEffect(() => {
    fetchVariantAttributes();
  }, []);

  const handleInputChange = (field, value) => {
    setVariantData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Build payload correctly
  const handleForApi = (selectedAttrId, selectedItems) => {
    if (!selectedAttrId || !selectedItems?.length) return;

    const attributeValueObj = selectedItems.reduce((acc, item) => {
      acc[item.value] = item.label;
      return acc;
    }, {});

    const formattedPayload = {
      id: item?.id || data?.product?.id,
      attribute_input: [selectedAttrId],
      attribute_value: attributeValueObj,
      type: 'new',
    };

    const updatedData = [formattedPayload]; 

    setVariantData(prev => ({
      ...prev,
      attribute_value: updatedData,
    }));
    setFormattedData(updatedData);

    onFieldChange && onFieldChange('attribute_value', updatedData);

    return updatedData;
  };

  // Debug watcher
  useEffect(() => {
    console.log('🟢 variantData', JSON.stringify(variantData, null, 2));
  }, [variantData]);

  // Render previous variants
  const renderPreviousVariants = () => {
    if (!product.attribute_line_ids?.length) return null;

    return product.attribute_line_ids.map(line => {
      const attrId = line.attribute_input?.[0];
      const attrLabel =
        variantAttributes.find(v => Number(v.value) === Number(attrId))?.label ||
        'Attribute';

      const valueIds = Object.keys(line.attribute_value || {});
      const valueLabels = valueIds
        .map(
          id =>
            attributeValues.find(v => String(v.value) === id)?.label ||
            line.attribute_value[id]
        )
        .join(', ');

      return (
        <View key={line.id} style={styles.card}>
          <Text style={styles.label}>{attrLabel}:</Text>
          <Text>{valueLabels}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      

      <Text style={styles.label}>Attribute</Text>
      <Dropdowncomp
        data={variantAttributes}
        placeholder="Select Attribute"
        value={selectedAttribute}
        onChange={item => {
          setSelectedAttribute(item.value);
          fetchVariantValues(item.value);
        }}
        search={true}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Values</Text>
        <MultiSelectorDropdownComp
          data={attributeValues}
          placeholder="Select Value"
          value={variantData?.attribute_line_ids?.map(v => v.value) || []}
          onChange={selectedIds => {
            const selectedItems = selectedIds
              .map(id => attributeValues.find(v => v.value === id))
              .filter(Boolean);

            handleInputChange('attribute_line_ids', selectedItems);
            handleForApi(selectedAttribute, selectedItems);
          }}
          disabled={!selectedAttribute}
        />
      </View>
      <ButtonCompo title="Save" onPress={handleSave} />
      {renderPreviousVariants()}

      <Loader visible={isLoading}/>
    </View>
  );
};

export default Varient;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.whiteColor },
  inputContainer: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.blackColor },
  addButton: {
    marginTop: 12,
    backgroundColor: COLORS.blueColor,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: COLORS.whiteColor, fontWeight: '600' },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

