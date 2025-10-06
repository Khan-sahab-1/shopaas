// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
// } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { COLORS } from "../../../../../styles/colors";
// import TextInputCompo from "../../../../../components/TextInputCompo";
// import Dropdowncomp from "../../../../../components/Dropdowncomp";
// import moment from "moment";
// import makeApiCall from "../../../../../utils/apiHelper";
// import { API_URLS } from "../../../../../utils/apiurls";
// import MessageShow from "../../../../../constant/MessageShow";

// const UpdateRule = ({ isVisible, onClose, initialData = {} ,id}) => {
//   console.log(id, 'Initial Data');

//   // --- Local States
//   const [priceRule, setPriceRule] = useState("");
//   const [minqty, setMinqty] = useState("");
//   const [productLimit, setProductLimit] = useState("");
//   const [selectcomputePrice, setComputePrice] = useState("");
//   const [FixedPrice, setFixedPrice] = useState("");
//   const [selectapplyon, setSelectapplyon] = useState(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [isLoding,setIsLoading]=useState(false)

//   // --- Date pickers
//   const [isStartPickerVisible, setStartPickerVisible] = useState(false);
//   const [isEndPickerVisible, setEndPickerVisible] = useState(false);

//   // Populate form with initial data
//   useEffect(() => {
//     if (initialData && isVisible) {
//       setPriceRule(initialData?.name || "");
//       setMinqty(initialData?.min_quantity?.toString() || "");
//       setProductLimit(initialData?.pricelist_product_limit?.toString() || "");
//       setComputePrice(initialData?.compute_price || "");
//       setFixedPrice(initialData?.fixed_price?.toString() || "");
//       setSelectapplyon(
//         initialData?.applied_on
//           ? {
//               value: initialData.applied_on,
//               label: initialData.name || "All Products"
//             }
//           : null
//       );
//       setStartDate(initialData?.date_start || "");
//       setEndDate(initialData?.date_end || "");
//     }
//   }, [initialData, isVisible]);

//   const showStartPicker = () => setStartPickerVisible(true);
//   const hideStartPicker = () => setStartPickerVisible(false);

//   const handleConfirmStart = (date) => {
//     setStartDate(moment(date).format('YYYY-MM-DD'));
//     hideStartPicker();
//   };

//   const showEndPicker = () => setEndPickerVisible(true);
//   const hideEndPicker = () => setEndPickerVisible(false);

//   const handleConfirmEnd = (date) => {
//     setEndDate(moment(date).format('YYYY-MM-DD'));
//     hideEndPicker();
//   };

//   // Input validation
//   const handleMinQtyChange = (text) => {
//     if (/^\d*$/.test(text)) {
//       setMinqty(text);
//     }
//   };

//   const handleFixedPriceChange = (text) => {
//     if (/^\d*\.?\d*$/.test(text)) {
//       setFixedPrice(text);
//     }
//   };

//   const handleProductLimitChange = (text) => {
//     if (/^\d*$/.test(text)) {
//       setProductLimit(text);
//     }
//   };

//   // --- Handle Save
// // inside UpdateRule component

// // --- Handle Save
// const handleSave = async () => {
//     try {
//       setIsLoading(true);

//       // Collect the latest values from state
//       const updatedRuleData = {
//         id: initialData?.id, // Item ID
//         name: priceRule,
//         min_quantity: parseInt(minqty) || 0,
//         pricelist_product_limit: parseInt(productLimit) || 0,
//         date_start: startDate,
//         date_end: endDate,
//         applied_on: selectapplyon?.value || "",
//         compute_price: selectcomputePrice,
//         fixed_price: parseFloat(FixedPrice) || 0,
//       };

//       // Create payload for API
//       const payload = {
//         id: id, // Pricelist ID (parent)
//         updatedData: {
//           item_ids: {
//             [initialData?.id]: {
//               ...updatedRuleData,
//               percent_price:
//                 updatedRuleData.compute_price === "percentage"
//                   ? updatedRuleData.fixed_price
//                   : 0,
//               price: "₹ 0.00", // optional display field
//             },
//           },
//         },
//       };

//       console.log("Update payload:", payload);

//       const response = await makeApiCall(API_URLS.savePricelist, "POST", {
//         jsonrpc: "2.0",
//         params: payload,
//       });

//       console.log("Update response:", response);

//       if (response?.result?.message === "success") {
//         MessageShow.success("Success", "Rule updated successfully");
//         onClose?.(); // close modal
//       } else {
//         MessageShow.error(
//           "Error",
//           response?.result?.errorMessage || "Failed to update rule"
//         );
//       }
//     } catch (error) {
//       console.log("Error updating rule:", error);
//       MessageShow.error("Error", "An error occurred while updating the rule");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Example dropdown data
//   const dropdowncompute_price = [
//     { label: "Fixed Price", value: "fixed" },
//     { label: "Percentage (discount)", value: "percentage" },
//   ];

//   const dropdownapplied_on = [
//     { label: "All Products", value: "3_global" },
//     { label: "Product Category", value: "2_product_category" },
//     { label: "Product", value: "1_product" },
//     { label: "Product Variant", value: "0_product_variant" },
//   ];

//   return (
//     <Modal visible={isVisible}  transparent animationType="slide">
//       <TouchableOpacity style={styles.container} activeOpacity={1} >
//         <View style={styles.whitebox}>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <Text style={styles.modalTitle}>Update Price Rule</Text>

//             <Text style={styles.label}>Price Rule Name</Text>
//             <TextInputCompo
//               placeholder="Price Rule Name"
//               style={styles.inputbox}
//               onChangeText={setPriceRule}
//               value={priceRule}
//               editable={false}
//             />

//             <Text style={styles.label}>Min. Quantity *</Text>
//             <TextInputCompo
//               placeholder="Min. Quantity"
//               style={styles.inputbox}
//               onChangeText={handleMinQtyChange}
//               value={minqty}
//               keyboardType="numeric"
//             />

//             <Text style={styles.label}>Product Limit *</Text>
//             <TextInputCompo
//               placeholder="Product Limit"
//               style={styles.inputbox}
//               onChangeText={handleProductLimitChange}
//               value={productLimit}
//               keyboardType="numeric"
//             />

//             <Text style={styles.label}>Compute Price *</Text>
//             <Dropdowncomp
//               data={dropdowncompute_price}
//               labelField="label"
//               valueField="value"
//               placeholder="Select compute price"
//               onChange={(item) => setComputePrice(item.value)}
//               value={selectcomputePrice}
//             />

//             <Text style={styles.label}>Fixed Price</Text>
//             <TextInputCompo
//               placeholder="Fixed Price"
//               style={styles.inputbox}
//               onChangeText={handleFixedPriceChange}
//               value={FixedPrice}
//               keyboardType="decimal-pad"
//             />

//             <Text style={styles.label}>Apply On *</Text>
//             <Dropdowncomp
//               data={dropdownapplied_on}
//               labelField="label"
//               valueField="value"
//               placeholder="Select application"
//               value={selectapplyon}
//               onChange={(item) => setSelectapplyon(item)}
//             />

//             {/* Start Date */}
//             <Text style={styles.label}>Start Date</Text>
//             <TouchableOpacity
//               onPress={showStartPicker}
//               style={styles.dateButton}
//             >
//               <Text style={styles.dateText}>
//                 {startDate || "Select Start Date"}
//               </Text>
//             </TouchableOpacity>
//             <DateTimePickerModal
//               isVisible={isStartPickerVisible}
//               mode="date"
//               onConfirm={handleConfirmStart}
//               onCancel={hideStartPicker}
//             />

//             {/* End Date */}
//             <Text style={styles.label}>End Date</Text>
//             <TouchableOpacity
//               onPress={showEndPicker}
//               style={styles.dateButton}
//             >
//               <Text style={styles.dateText}>
//                 {endDate || "Select End Date"}
//               </Text>
//             </TouchableOpacity>
//             <DateTimePickerModal
//               isVisible={isEndPickerVisible}
//               mode="date"
//               onConfirm={handleConfirmEnd}
//               onCancel={hideEndPicker}
//               minimumDate={startDate ? new Date(startDate) : new Date()}
//             />

//             {/* Action Buttons */}
//             <View style={styles.btnRow}>
//               <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
//                 <Text style={styles.btnText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
//                 <Text style={styles.btnText}>Update</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   whitebox: {
//     backgroundColor: COLORS.whiteColor,
//     padding: 20,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     maxHeight: "90%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: COLORS.blackColor,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 5,
//     marginTop: 10,
//     color: COLORS.blackColor,
//     fontWeight: "500",
//   },
//   inputbox: {
//     borderWidth: 1,
//     borderColor: COLORS.gray,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 10,
//     height: 45,
//   },
//   dateButton: {
//     borderWidth: 1,
//     borderColor: COLORS.gray,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 10,
//     justifyContent: "center",
//   },
//   dateText: {
//     fontSize: 14,
//     color: COLORS.blackColor,
//   },
//   btnRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   btnCancel: {
//     backgroundColor: COLORS.gray2,
//     flex: 1,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginRight: 10,
//   },
//   btnSave: {
//     backgroundColor: COLORS.blueColor,
//     flex: 1,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   btnText: {
//     color: COLORS.whiteColor,
//     fontWeight: "bold",
//   },
// });

// export default UpdateRule;

import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLORS} from '../../../../../styles/colors';
import TextInputCompo from '../../../../../components/TextInputCompo';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import moment from 'moment';
import makeApiCall from '../../../../../utils/apiHelper';
import {API_URLS} from '../../../../../utils/apiurls';
import MessageShow from '../../../../../constant/MessageShow';
import Loader from '../../../../../components/Loader';
import {fetchproductoptions} from '../../../../../utils/fetchproductoptions';

const UpdateRule = ({isVisible, onClose, initialData = {}, id}) => {
  // --- Local States
  const [priceRule, setPriceRule] = useState('');
  const [minqty, setMinqty] = useState('');
  const [productLimit, setProductLimit] = useState('');
  const [selectcomputePrice, setComputePrice] = useState(null);
  const [FixedPrice, setFixedPrice] = useState('');
  const [percentage, setpersentage] = useState('');
  const [selectapplyon, setSelectapplyon] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoding, setIsLoading] = useState(false);
  console.log(percentage, 'InitialData');

  // --- Product selection states
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [varient, setVarient] = useState([]);
  const [selectedVarient, setSelectedVarient] = useState(null);

  // --- Date pickers
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  // Helper functions
  const getSelectedItem = () => {
    switch (selectapplyon?.label) {
      case 'Product Category':
        return selectedCategory
          ? {id: selectedCategory.value, name: selectedCategory.label}
          : {id: '', name: ''};
      case 'Product':
        return selectedProduct
          ? {id: selectedProduct.value, name: selectedProduct.label}
          : {id: '', name: ''};
      case 'Product Variant':
        return selectedVarient
          ? {id: selectedVarient.value, name: selectedVarient.label}
          : {id: '', name: ''};
      default:
        return {id: '', name: ''};
    }
  };

  const getItemName = () => {
    const selectedItem = getSelectedItem();
    return selectedItem.label || selectapplyon?.label || '';
  };

  // Populate form with initial data
  useEffect(() => {
    if (initialData && isVisible) {
      setPriceRule(initialData?.name || '');
      setMinqty(initialData?.min_quantity?.toString() || '');
      setProductLimit(initialData?.pricelist_product_limit?.toString() || '');

      // Set compute price as object
      if (initialData?.compute_price) {
        setComputePrice({
          label:
            initialData.compute_price === 'fixed'
              ? 'Fixed Price'
              : 'Percentage',
          value: initialData.compute_price,
        });
      }

      setFixedPrice(
        initialData?.fixed_price?.toString() ||
          initialData?.percent_price?.toString() ||
          '',
      );
      setpersentage(initialData?.percent_price?.toString() || '');
      // Set applied on as object
      if (initialData?.applied_on) {
        let appliedOnLabel = 'All Products';
        switch (initialData.applied_on) {
          case '2_product_category':
            appliedOnLabel = 'Product Category';
            break;
          case '1_product':
            appliedOnLabel = 'Product';
            break;
          case '0_product_variant':
            appliedOnLabel = 'Product Variant';
            break;
        }
        setSelectapplyon({
          value: initialData.applied_on,
          label: appliedOnLabel,
        });
      }

      setStartDate(initialData?.date_start || '');
      setEndDate(initialData?.date_end || '');

      // Set selected item if exists in initialData
      if (initialData.selectedItem) {
        const {selectedItem} = initialData;
        switch (selectapplyon?.label) {
          case 'Product Category':
            setSelectedCategory(selectedItem);
            break;
          case 'Product':
            setSelectedProduct(selectedItem);
            break;
          case 'Product Variant':
            setSelectedVarient(selectedItem);
            break;
        }
      }
    }
  }, [initialData, isVisible]);

  useEffect(() => {
    if (isVisible) {
      fetchproductoptions(
        'product_category',
        setIsLoading,
        setCategory,
        'pricelist',
      );
      fetchproductoptions('product', setIsLoading, setProduct, 'pricelist');
      fetchproductoptions(
        'product_variant',
        setIsLoading,
        setVarient,
        'pricelist',
      );
    }
  }, [isVisible]);

  const showStartPicker = () => setStartPickerVisible(true);
  const hideStartPicker = () => setStartPickerVisible(false);

  const handleConfirmStart = date => {
    setStartDate(moment(date).format('YYYY-MM-DD'));
    hideStartPicker();
  };

  const showEndPicker = () => setEndPickerVisible(true);
  const hideEndPicker = () => setEndPickerVisible(false);

  const handleConfirmEnd = date => {
    setEndDate(moment(date).format('YYYY-MM-DD'));
    hideEndPicker();
  };

  // Input validation
  const handleMinQtyChange = text => {
    if (/^\d*$/.test(text)) {
      setMinqty(text);
    }
  };

  const handleFixedPriceChange = text => {
    if (/^\d*\.?\d*$/.test(text)) {
      setFixedPrice(text);
    }
  };
  const handlePersentage = text => {
    if (/^\d*\.?\d*$/.test(text)) {
      setpersentage(text);
    }
  };

  const handleProductLimitChange = text => {
    if (/^\d*$/.test(text)) {
      setProductLimit(text);
    }
  };

  // --- Handle Save
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const selectedItem = getSelectedItem();
      const itemName = getItemName();

      const updatedRuleData = {
        compute_price: selectcomputePrice?.value || '',
        applied_on: selectapplyon?.value || '',
        pricelist_product_limit: productLimit || '',
        min_quantity: minqty || '',
        date_start: startDate || '',
        date_end: endDate || '',
        percent_price: percentage || '',
        name: itemName,
        selectedItem: selectedItem,
        fixed_price:FixedPrice||''
      };

      const payload = {
        id: id,
        updatedData: {
          item_ids: {
            [initialData?.id]: updatedRuleData,
          },
        },
      };

      console.log('Update payload:', payload);

      const response = await makeApiCall(API_URLS.savePricelist, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });

      console.log('Update response:', response);

      if (response?.result?.message === 'success') {
        MessageShow.success('Success', 'Rule updated successfully');
        onClose?.();
      } else {
        MessageShow.error(
          'Error',
          response?.result?.errorMessage || 'Failed to update rule',
        );
      }
    } catch (error) {
      console.log('Error updating rule:', error);
      MessageShow.error('Error', 'An error occurred while updating the rule');
    } finally {
      setIsLoading(false);
    }
  };

  // Example dropdown data
  const dropdowncompute_price = [
    {label: 'Fixed Price', value: 'fixed'},
    {label: 'Percentage (discount)', value: 'percentage'},
  ];

  const dropdownapplied_on = [
    {label: 'All Products', value: '3_global'},
    {label: 'Product Category', value: '2_product_category'},
    {label: 'Product', value: '1_product'},
    {label: 'Product Variant', value: '0_product_variant'},
  ];

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <TouchableOpacity style={styles.container} activeOpacity={1}>
        <View style={styles.whitebox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Update Price Rule</Text>

            <Text style={styles.label}>Price Rule Name</Text>
            <TextInputCompo
              placeholder="Price Rule Name"
              style={styles.inputbox}
              onChangeText={setPriceRule}
              value={priceRule}
              editable={false}
            />

            <Text style={styles.label}>Min. Quantity *</Text>
            <TextInputCompo
              placeholder="Min. Quantity"
              style={styles.inputbox}
              onChangeText={handleMinQtyChange}
              value={minqty}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Product Limit *</Text>
            <TextInputCompo
              placeholder="Product Limit"
              style={styles.inputbox}
              onChangeText={handleProductLimitChange}
              value={productLimit}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Compute Price *</Text>
            <Dropdowncomp
              data={dropdowncompute_price}
              labelField="label"
              valueField="value"
              placeholder="Select compute price"
              onChange={item => setComputePrice(item)}
              value={selectcomputePrice}
            />

            <Text style={styles.label}>
              {selectcomputePrice?.value === 'percentage'
                ? 'Percentage'
                : 'Fixed Price'}
            </Text>

            {selectcomputePrice?.value === 'percentage' ? (
              <TextInputCompo
                placeholder={
                  'Percentage'
                }
                style={styles.inputbox}
                onChangeText={handlePersentage}
                value={percentage}
                keyboardType="decimal-pad"
              />
            ) : (
              <TextInputCompo
                placeholder={'Fixed Price'}
                style={styles.inputbox}
                onChangeText={handleFixedPriceChange}
                value={FixedPrice}
                keyboardType="decimal-pad"
              />
            )}

            <Text style={styles.label}>Apply On *</Text>
            <Dropdowncomp
              data={dropdownapplied_on}
              labelField="label"
              valueField="value"
              placeholder="Select application"
              value={selectapplyon}
              onChange={item => setSelectapplyon(item)}
            />

            {selectapplyon?.label === 'Product Category' && (
              <>
                <Text style={styles.label}>Product Category</Text>
                <Dropdowncomp
                  data={category}
                  onChange={item => setSelectedCategory(item)}
                  value={selectedCategory}
                />
              </>
            )}

            {selectapplyon?.label === 'Product' && (
              <>
                <Text style={styles.label}>Select Product</Text>
                <Dropdowncomp
                  data={product}
                  onChange={item => setSelectedProduct(item)}
                  value={selectedProduct}
                  style={{height: 60}}
                />
              </>
            )}

            {selectapplyon?.label === 'Product Variant' && (
              <>
                <Text style={styles.label}>Select Product Variant</Text>
                <Dropdowncomp
                  data={varient}
                  onChange={item => setSelectedVarient(item)}
                  value={selectedVarient}
                  style={{height: 60}}
                />
              </>
            )}

            {/* Start Date */}
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={showStartPicker}
              style={styles.dateButton}>
              <Text style={styles.dateText}>
                {startDate || 'Select Start Date'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartPickerVisible}
              mode="date"
              onConfirm={handleConfirmStart}
              onCancel={hideStartPicker}
            />

            {/* End Date */}
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity onPress={showEndPicker} style={styles.dateButton}>
              <Text style={styles.dateText}>
                {endDate || 'Select End Date'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndPickerVisible}
              mode="date"
              onConfirm={handleConfirmEnd}
              onCancel={hideEndPicker}
              minimumDate={startDate ? new Date(startDate) : new Date()}
            />

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                <Text style={styles.btnText}>Update</Text>
              </TouchableOpacity>
            </View>

            <Loader visible={isLoding} />
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  whitebox: {
    backgroundColor: COLORS.whiteColor,
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.blackColor,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    color: COLORS.blackColor,
    fontWeight: '500',
  },
  inputbox: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 45,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: COLORS.blackColor,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  btnCancel: {
    backgroundColor: COLORS.gray2,
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  btnSave: {
    backgroundColor: COLORS.blueColor,
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: COLORS.whiteColor,
    fontWeight: 'bold',
  },
});

export default UpdateRule;
