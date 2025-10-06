// import { StyleSheet, Text, View } from 'react-native';
// import React, { useEffect } from 'react';
// import { COLORS } from '../../styles/colors';
// import Dropdowncomp from '../Dropdowncomp';
// import MultiSelectorDropdown from '../../screens/deshboard/console/ConsoleForm/productsvarients/Multidropdown';
// import TextInputCompo from '../TextInputCompo';

// const Sales = ({ salesData, setSalesData, data, onFieldChange }) => {
//   const product = data?.product || {};
//   const formOptions = data?.form_options || {};

//   // ---- Handlers ----
//   const handleChange = (field, value) => {
//     let finalValue = value;
//     if (Array.isArray(value)) {
//       // For multi-select dropdown: store only array of values
//       finalValue = value.map(v => v.value ?? v);
//     } else if (typeof value === 'object' && value?.value !== undefined) {
//       // For single dropdown: store only value
//       finalValue = value.value;
//     }
//     setSalesData(prev => ({
//       ...prev,
//       [field]: finalValue,
//     }));
//     onFieldChange && onFieldChange(field, finalValue);
//   };

//   // ---- Format options ----
//   const invoicePolicy = formOptions?.invoice_policy || {};
//   const formattedInvoice = Object.entries(invoicePolicy).map(
//     ([value, label]) => ({
//       label,
//       value,
//     }),
//   );

//   const optionalProducts = formOptions?.optional_product_ids || {};
//   const formattedOptional = Object.entries(optionalProducts).map(
//     ([value, label]) => ({
//       label,
//       value,
//     }),
//   );

//   useEffect(() => {
//     if (product && Object.keys(product).length > 0) {
//       const matchedOptionalProducts = (product.optional_product_ids || []).map(
//         id => ({ value: id }),
//       );

//       const options=formOptions.optional_product_ids;
//       const productID=product.optional_product_ids
//       const selectedOptions = Object.entries(options)
//   .filter(([key]) => productID.includes(Number(key)))
//   .map(([key, label]) => ({ value: key, label })); 

// console.log(selectedOptions);
     
//       console.log(options,productID,'0000');
//       setSalesData({
//         invoice_policy: product.invoice_policy || '',
//         optional_product_ids: selectedOptions,
//         description_sale: product.description_sale || '',
//       });
//     }
//   }, [product]);

//   return (
//     <View style={styles.container}>
//       {/* Invoicing Policy */}
//       <Text style={styles.label}>Invoicing Policy</Text>
//       <Dropdowncomp
//         data={formattedInvoice}
//         value={
//           formattedInvoice.find(f => f.value === salesData?.invoice_policy) ||
//           null
//         }
//         onChange={item => handleChange('invoice_policy', item)}
//         placeholder="Select Invoicing Policy"
//       />

//       {/* Optional Products */}
//       <Text style={styles.label}>Optional Products</Text>
//       <MultiSelectorDropdown
//         data={formattedOptional}
//         value={formattedOptional.filter(opt =>
//           (salesData?.optional_product_ids || []).includes(opt.value),
//         )}
//         onChange={selectedItems =>
//           handleChange('optional_product_ids', selectedItems)
//         }
//         label="Select Options"
//         placeholder="Select Options"
//       />

//       {/* Sales Description */}
//       <Text style={styles.label}>Sales Description</Text>
//       <TextInputCompo
//         title="Sales Description"
//         placeholder="Enter Sales Description"
//         style={styles.inputBox}
//         value={salesData?.description_sale || ''}
//         onChangeText={text => handleChange('description_sale', text)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.whiteColor,
//     padding: 15,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.blackColor,
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   inputBox: {
//     borderWidth: 1,
//     borderColor: COLORS.grayColor,
//     height: 50,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginTop: 5,
//   },
// });

// export default Sales;
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from '../../styles/colors';
import Dropdowncomp from '../Dropdowncomp';

import TextInputCompo from '../TextInputCompo';
import MultiSelectorDropdown from '../../screens/deshboard/console/ConsoleForm/productsvarients/Multidropdown';

const Sales = ({ salesData, setSalesData, data, onFieldChange }) => {
  const product = data?.product || {};
  const formOptions = data?.form_options || {};

  // ---- Handlers ----
  const handleChange = (field, value) => {
    let finalValue = value;
    if (Array.isArray(value)) {
      // For multi-select dropdown: store only array of values
      finalValue = value.map(v => v.value ?? v);
    } else if (typeof value === 'object' && value?.value !== undefined) {
      // For single dropdown: store only value
      finalValue = value.value;
    }
    setSalesData(prev => ({
      ...prev,
      [field]: finalValue,
    }));
    onFieldChange && onFieldChange(field, finalValue);
  };

  // ---- Format options ----
  const invoicePolicy = formOptions?.invoice_policy || {};
  const formattedInvoice = Object.entries(invoicePolicy).map(
    ([value, label]) => ({
      label,
      value,
    }),
  );

  const optionalProducts = formOptions?.optional_product_ids || {};
  const formattedOptional = Object.entries(optionalProducts).map(
    ([value, label]) => ({
      label,
      value,
    }),
  );

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      const productIDs = product.optional_product_ids || [];

      setSalesData({
        invoice_policy: product.invoice_policy || '',
        // The fix is here: Store only the values
        optional_product_ids: productIDs.map(String),
        description_sale: product.description_sale || '',
      });
    }
  }, [product]);

  return (
    <View style={styles.container}>
      {/* Invoicing Policy */}
      <Text style={styles.label}>Invoicing Policy</Text>
      <Dropdowncomp
        data={formattedInvoice}
        value={
          formattedInvoice.find(f => f.value === salesData?.invoice_policy) ||
          null
        }
        onChange={item => handleChange('invoice_policy', item)}
        placeholder="Select Invoicing Policy"
      />

      {/* Optional Products */}
      <Text style={styles.label}>Optional Products</Text>
      <MultiSelectorDropdown
        data={formattedOptional}
        value={
          // This logic now works correctly
          formattedOptional.filter(opt =>
            (salesData?.optional_product_ids || []).includes(opt.value),
          )
        }
        onChange={selectedItems =>
          handleChange('optional_product_ids', selectedItems)
        }
        label="Select Options"
        placeholder="Select Options"
      />

      {/* Sales Description */}
      <Text style={styles.label}>Sales Description</Text>
      <TextInputCompo
        title="Sales Description"
        placeholder="Enter Sales Description"
        style={styles.inputBox}
        value={salesData?.description_sale || ''}
        onChangeText={text => handleChange('description_sale', text)}
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
    marginBottom: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.grayColor,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
});

export default Sales;