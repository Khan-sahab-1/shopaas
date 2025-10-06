// import {
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//   } from 'react-native';
//   import React, { useState, useEffect } from 'react';
//   import CheckBox from '@react-native-community/checkbox';
//   import DateTimePickerModal from 'react-native-modal-datetime-picker';
//   import moment from 'moment';
//   import { COLORS } from '../../../../../styles/colors';
//   import Headercomp from '../../../../../components/Headercomp';
//   import TextInputCompo from '../../../../../components/TextInputCompo';
//   import Dropdowncomp from '../../../../../components/Dropdowncomp';
//   import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
//   import ButtonCompo from '../../../../../components/ButtonCompo';
//   import makeApiCall from '../../../../../utils/apiHelper';
//   import { API_URLS } from '../../../../../utils/apiurls';
//   import Loader from '../../../../../components/Loader';
//   import { ApplyOn, CodeRequirement, CustomerScope, CustomerTargetOptions, DiscountType, ProductScope, ProgramType, TaxType } from './promotiondata';
  
//   const RewardType = [
//     { label: 'Discount', value: 'discount' },
//     { label: 'Free Product', value: 'product' },
//     { label: 'Free Shipping', value: 'free_shipping' },
//   ];
  
//   const UpdatePromotion = ({ navigation, route }) => {
//     const { promotion } = route?.params || {};
    
//     // Initialize state with default values
//     const [promotionData, setPromotionData] = useState({
//       programFor: null,
//       programName: '',
//       customerSelectionType: 'is_all_cust',
//       selectedCustomers: [],
//       numberOfTimes: '',
//       couponUsageMethod: null,
//       startDate: '',
//       endingDate: '',
//       productSelectionType: 'is_all',
//       selectedProducts: [],
//       quantity: '',
//       minPurchase: '',
//       taxExclude: null,
//       promoCodeUsage: 'no_code_needed',
//       promoCode: '',
//       rewardType: null,
//       discountPercentage: '',
//       maxDiscount: '',
//       freeProduct: null,
//       freeProductQty: '',
//       discountType: null,
//       applyOn: null,
//       description: '',
//       discountApplyOn: null,
//       specificProducts: [],
//       limitOfProduct: '',
//     });
  
//     const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
//     const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
  
//     // Initialize form with promotion data when component mounts
//     useEffect(() => {
//       if (promotion) {
//         setPromotionData({
//           programFor: ProgramType.find(item => item.value === promotion.program_type) || null,
//           programName: promotion.name,
//           customerSelectionType: promotion.base_on_customers,
//           selectedCustomers: [],
//           numberOfTimes: promotion.maximum_use_number.toString(),
//           couponUsageMethod: CustomerScope.find(item => item.value === promotion.coupon_use_type) || null,
//           startDate: promotion.rule_date_from,
//           endingDate: promotion.rule_date_to,
//           productSelectionType: promotion.base_on_products,
//           selectedProducts: [],
//           quantity: promotion.rule_min_quantity.toString(),
//           minPurchase: promotion.rule_minimum_amount.toString(),
//           taxExclude: TaxType.find(item => item.value === promotion.rule_minimum_amount_tax_inclusion) || null,
//           promoCodeUsage: promotion.promo_code_usage,
//           promoCode: promotion.promo_code || '',
//           rewardType: promotion.reward_type,
//           discountPercentage: promotion.discount_percentage.toString(),
//           maxDiscount: promotion.discount_max_amount.toString(),
//           freeProduct: null,
//           freeProductQty: promotion.reward_product_quantity.toString(),
//           discountType: DiscountType.find(item => item.value === promotion.discount_type) || null,
//           applyOn: ApplyOn.find(item => item.value === promotion.discount_apply_on) || null,
//           description: promotion.description,
//           discountApplyOn: null,
//           specificProducts: [],
//           limitOfProduct: promotion.limit_reward_product.toString(),
//         });
//       }
//     }, [promotion]);
  
//     const handleChange = (key, value) => {
//       setPromotionData(prevData => ({ ...prevData, [key]: value }));
//     };
  
//     // Date picker handlers
//     const showStartDatePicker = () => setStartDatePickerVisibility(true);
//     const hideStartDatePicker = () => setStartDatePickerVisibility(false);
//     const handleStartDateConfirm = date => {
//       handleChange('startDate', moment(date).format('YYYY-MM-DD'));
//       hideStartDatePicker();
//     };
  
//     const showEndDatePicker = () => setEndDatePickerVisibility(true);
//     const hideEndDatePicker = () => setEndDatePickerVisibility(false);
//     const handleEndDateConfirm = date => {
//       handleChange('endingDate', moment(date).format('YYYY-MM-DD'));
//       hideEndDatePicker();
//     };
  
//     const handleSave = async () => {
//       try {
//         setIsLoading(true);
        
//         const numericFields = [
//           'numberOfTimes', 
//           'quantity', 
//           'minPurchase',
//           'discountPercentage',
//           'maxDiscount',
//           'limitOfProduct'
//         ];
        
//         const cleanedData = {...promotionData};
//         console.log(cleanedData,'CleanEd Data')
        
//         numericFields.forEach(field => {
//           if (cleanedData[field] === '') {
//             cleanedData[field] = null;
//           } else if (cleanedData[field]) {
//             cleanedData[field] = Number(cleanedData[field]);
//           }
//         });
  
//         // Prepare the data structure according to API requirements
//         const requestData = {
//           jsonrpc: "2.0",
//           params: {
//             id: { updatedData: {
//               promotion_name: cleanedData.programName,
//               program_type: cleanedData.programFor?.value || '',
//               productID:String(promotion?.id) ||"New",
//               base_on_customers: cleanedData.customerSelectionType,
//               maximum_use_number: cleanedData.numberOfTimes || 0,
//               coupon_use_type: cleanedData.couponUsageMethod?.value || '',
//               rule_date_from: cleanedData.startDate,
//               rule_date_to: cleanedData.endingDate,
//               rule_min_quantity: cleanedData.quantity || 0,
//               rule_minimum_amount: cleanedData.minPurchase || 0,
//               rule_minimum_amount_tax_inclusion: cleanedData.taxExclude?.value || 'tax_included',
//               base_on_products: cleanedData.productSelectionType,
//               promo_code_usage: cleanedData.promoCodeUsage === 'code_needed' ? 'code_needed' : 'no_code_needed',
//               promo_code: cleanedData.promoCode,
//               reward_type: cleanedData.rewardType,
//               discount_type: cleanedData.discountType?.value || '',
//               discount_percentage: cleanedData.discountPercentage || 0,
//               discount_apply_on: cleanedData.applyOn?.value || '',
//               discount_max_amount: cleanedData.maxDiscount || 0,
//               description: cleanedData.description || '',
//               limit_reward_product: cleanedData.limitOfProduct || 0,
//               reward_product_quantity: cleanedData.freeProductQty || 0,
//             }}, // Include promotion ID for update
           
//           }
//         };
  
//         console.log('Sending data to API:', requestData);
        
//         const response = await makeApiCall(
//           promotion?.id ? API_URLS.updatePromotionData : API_URLS.savePromtionData, 
//           'POST', 
//           requestData
//         );
        
//         if (response.result && response.result.errorMessage) {
//           throw new Error(response.result.errorMessage);
//         }
        
//         console.log('API Response:', response);
//         navigation.goBack();
        
//       } catch (error) {
//         console.error('Error saving promotion:', error);
//         alert(`Error: ${error.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     return (
//       <SafeAreaView style={styles.container}>
//         <Headercomp
//           title={promotion ? 'Update Promotion' : 'Create Promotion'}
//           left={true}
//           onPress={() => navigation.goBack()}
//         />
//         <ScrollView contentContainerStyle={styles.scrollViewContent}>
//           <View style={styles.formContainer}>
//             {/* Program Information */}
//             <Text style={styles.lable}>Program Name</Text>
//             <TextInputCompo
//               placeholder="Program Name"
//               style={styles.inputbox}
//               value={promotionData.programName}
//               onChangeText={value => handleChange('programName', value)}
//             />
  
//             <Text style={styles.lable}>Program For</Text>
//             <Dropdowncomp
//               data={ProgramType}
//               placeholder="Select Program Name"
//               value={promotionData.programFor}
//               onChange={value => handleChange('programFor', value)}
//             />
  
//             {/* Customer Selection */}
//             <Text style={styles.sectionTitle}>Condition</Text>
//             <Text style={styles.sectionSubtitle}>Based On Customers</Text>
//             <View style={styles.checkboxRow}>
//               {CustomerTargetOptions.map((option) => (
//                 <View key={option.value} style={styles.checkboxItem}>
//                   <CheckBox
//                     value={promotionData.customerSelectionType === option.value}
//                     onValueChange={() => handleChange('customerSelectionType', option.value)}
//                   />
//                   <Text>{option.label}</Text>
//                 </View>
//               ))}
//             </View>
  
//             {promotionData.customerSelectionType === 'is_specific_cust' && (
//               <>
//                 <Text style={styles.lable}>Select Customers</Text>
//                 <MultiSelectorDropdownComp
//                   data={[
//                     { label: 'Customer A', value: 'customer_a' },
//                     { label: 'Customer B', value: 'customer_b' },
//                   ]}
//                   placeholder={'Select Customers'}
//                   value={promotionData.selectedCustomers}
//                   onChange={value => handleChange('selectedCustomers', value)}
//                 />
//               </>
//             )}
  
//             {/* Validity Section */}
//             <Text style={styles.lable}>Validity</Text>
//             <Text style={styles.lable}>Number of Times:</Text>
//             <TextInputCompo
//               placeholder="Number of Times"
//               keyboardType="numeric"
//               style={styles.inputbox}
//               value={promotionData.numberOfTimes}
//               onChangeText={value => handleChange('numberOfTimes', value)}
//             />
  
//             <Text style={styles.lable}>Coupon Usage Method:</Text>
//             <Dropdowncomp
//               data={CustomerScope}
//               placeholder={'Coupon Usage method'}
//               value={promotionData.couponUsageMethod}
//               onChange={value => handleChange('couponUsageMethod', value)}
//             />
  
//             {/* Date Pickers */}
//             <Text style={styles.lable}>Start Date</Text>
//             <TouchableOpacity
//               style={styles.dateInputbox}
//               onPress={showStartDatePicker}
//             >
//               <Text style={styles.dateText}>
//                 {promotionData.startDate || 'Select Date'}
//               </Text>
//             </TouchableOpacity>
//             <DateTimePickerModal
//               isVisible={isStartDatePickerVisible}
//               mode="date"
//               onConfirm={handleStartDateConfirm}
//               onCancel={hideStartDatePicker}
//             />
  
//             <Text style={styles.lable}>Ending Date</Text>
//             <TouchableOpacity
//               style={styles.dateInputbox}
//               onPress={showEndDatePicker}
//             >
//               <Text style={styles.dateText}>
//                 {promotionData.endingDate || 'Select Date'}
//               </Text>
//             </TouchableOpacity>
//             <DateTimePickerModal
//               isVisible={isEndDatePickerVisible}
//               mode="date"
//               onConfirm={handleEndDateConfirm}
//               onCancel={hideEndDatePicker}
//             />
  
//             {/* Product Selection */}
//             <Text style={styles.sectionSubtitle}>Based On Products</Text>
//             <View style={styles.checkboxRow}>
//               {ProductScope.map((option) => (
//                 <View key={option.value} style={styles.checkboxItem}>
//                   <CheckBox
//                     value={promotionData.productSelectionType === option.value}
//                     onValueChange={() => handleChange('productSelectionType', option.value)}
//                   />
//                   <Text>{option.label}</Text>
//                 </View>
//               ))}
//             </View>
  
//             {promotionData.productSelectionType === 'is_specific' && (
//               <>
//                 <Text style={styles.lable}>Select Products</Text>
//                 <MultiSelectorDropdownComp
//                   data={[
//                     { label: 'Product X', value: 'product_x' },
//                     { label: 'Product Y', value: 'product_y' },
//                   ]}
//                   placeholder={'Select Products'}
//                   value={promotionData.selectedProducts}
//                   onChange={value => handleChange('selectedProducts', value)}
//                 />
//               </>
//             )}
  
//             {/* Purchase Requirements */}
//             <Text style={styles.lable}>Quantity</Text>
//             <TextInputCompo
//               placeholder="Quantity"
//               keyboardType="numeric"
//               style={styles.inputbox}
//               value={promotionData.quantity}
//               onChangeText={value => handleChange('quantity', value)}
//             />
//             <Text style={styles.lable}>Minimum Purchase of</Text>
//             <TextInputCompo
//               placeholder="Minimum Purchase"
//               keyboardType="numeric"
//               style={styles.inputbox}
//               value={promotionData.minPurchase}
//               onChangeText={value => handleChange('minPurchase', value)}
//             />
  
//             {/* Tax Section */}
//             <Text style={styles.lable}>Tax Exclude</Text>
//             <Dropdowncomp
//               data={TaxType}
//               placeholder="Select Option"
//               value={promotionData.taxExclude}
//               onChange={value => handleChange('taxExclude', value)}
//             />
  
//             {/* Promo Code Section */}
//             <Text style={styles.sectionSubtitle}>Promo Code Usage</Text>
//             <View style={styles.checkboxRow}>
//               {CodeRequirement.map((option) => (
//                 <View key={option.value} style={styles.checkboxItem}>
//                   <CheckBox
//                     value={promotionData.promoCodeUsage === option.value}
//                     onValueChange={() => handleChange('promoCodeUsage', option.value)}
//                   />
//                   <Text>{option.label}</Text>
//                 </View>
//               ))}
//             </View>
  
//             {promotionData.promoCodeUsage === 'code_needed' && (
//               <>
//                 <Text style={styles.lable}>Promo Code</Text>
//                 <TextInputCompo
//                   placeholder="Promo Code"
//                   style={styles.inputbox}
//                   value={promotionData.promoCode}
//                   onChangeText={value => handleChange('promoCode', value)}
//                 />
//               </>
//             )}
  
//             {/* Reward Section (only for coupon programs) */}
//             {promotionData?.programFor?.value === 'coupon_program' && (
//               <>
//                 <Text style={styles.sectionSubtitle}>Reward Section</Text>
//                 <View style={styles.checkboxRow}>
//                   {RewardType.map(option => (
//                     <View key={option.value} style={styles.checkboxItem}>
//                       <CheckBox
//                         value={promotionData.rewardType === option.value}
//                         onValueChange={() => handleChange('rewardType', option.value)}
//                       />
//                       <Text>{option.label}</Text>
//                     </View>
//                   ))}
//                 </View>
  
//                 {/* Discount Reward */}
//                 {promotionData.rewardType === 'discount' && (
//                   <View>
//                     <Text style={styles.lable}>Description</Text>
//                     <TextInputCompo
//                       placeholder="Description"
//                       style={styles.inputbox}
//                       value={promotionData.description}
//                       onChangeText={value => handleChange('description', value)}
//                     />
                    
//                     <Text style={styles.lable}>Discount Type</Text>
//                     <Dropdowncomp
//                       data={DiscountType} 
//                       placeholder="Select Discount Type"
//                       value={promotionData.discountType}
//                       onChange={value => handleChange('discountType', value)}
//                     />
                    
//                     {promotionData?.discountType?.value === 'percentage' && (
//                       <>
//                         <Text style={styles.lable}>Discount Percentage</Text>
//                         <TextInputCompo
//                           placeholder="Enter percentage"
//                           keyboardType="numeric"
//                           style={styles.inputbox}
//                           value={promotionData.discountPercentage}
//                           onChangeText={value => handleChange('discountPercentage', value)}
//                         />
                        
//                         <Text style={styles.lable}>Apply Discount On</Text>
//                         <Dropdowncomp
//                           data={ApplyOn} 
//                           placeholder="Select Application"
//                           value={promotionData.applyOn}
//                           onChange={value => handleChange('applyOn', value)}
//                         /> 
                        
//                         {promotionData?.applyOn?.value === 'specific_products' && (
//                           <>
//                             <Text style={styles.lable}>Select Products</Text>
//                             <MultiSelectorDropdownComp
//                               data={[
//                                 { label: 'Product 1', value: 'product_1' },
//                                 { label: 'Product 2', value: 'product_2' },
//                               ]}
//                               placeholder="Select Products"
//                               value={promotionData.specificProducts}
//                               onChange={value => handleChange('specificProducts', value)}
//                             /> 
//                           </>
//                         )}
//                       </>
//                     )}
                    
//                     <Text style={styles.lable}>Maximum Discount Amount</Text>
//                     <TextInputCompo
//                       placeholder="Enter max amount"
//                       keyboardType="numeric"
//                       style={styles.inputbox}
//                       value={promotionData.maxDiscount}
//                       onChangeText={value => handleChange('maxDiscount', value)}
//                     />
//                   </View>
//                 )}
  
//                 {/* Free Product Reward */}
//                 {promotionData.rewardType === 'product' && (
//                   <View>
//                     <Text style={styles.lable}>Select Reward Product</Text>
//                     <Dropdowncomp
//                       data={[{ label: 'Product 1', value: 'product_1' }]}
//                       placeholder="Select Product"
//                       value={promotionData.freeProduct}
//                       onChange={value => handleChange('freeProduct', value)}
//                     />
  
//                     <Text style={styles.lable}>Limit of Product</Text>
//                     <TextInputCompo
//                       placeholder="Limit of Product"
//                       keyboardType="numeric"
//                       style={styles.inputbox}
//                       value={promotionData.limitOfProduct}
//                       onChangeText={value => handleChange('limitOfProduct', value)}
//                     />
                    
//                     <Text style={styles.lable}>Description</Text>
//                     <TextInputCompo
//                       placeholder="Description"
//                       style={styles.inputbox}
//                       value={promotionData.description}
//                       onChangeText={value => handleChange('description', value)}
//                     />
//                   </View>
//                 )}
  
//                 {/* Free Shipping Reward */}
//                 {promotionData.rewardType === 'free_shipping' && (
//                   <>
//                     <Text style={styles.lable}>Description</Text>
//                     <TextInputCompo
//                       placeholder="Description"
//                       style={styles.inputbox}
//                       value={promotionData.description}
//                       onChangeText={value => handleChange('description', value)}
//                     />
//                   </>
//                 )}
//               </>
//             )}
  
//             {/* Save Button */}
//             <ButtonCompo 
//               title={promotion ? "Update" : "Save"} 
//               onPress={handleSave} 
//             />
//           </View>
//           <Loader visible={isLoading} />
//         </ScrollView>
//       </SafeAreaView>
//     );
//   };
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.whiteColor,
//     },
//     scrollViewContent: {
//       paddingBottom: 20,
//     },
//     formContainer: {
//       padding: 15,
//     },
//     lable: {
//       fontSize: 16,
//       fontWeight: '500',
//       color: COLORS.blackColor,
//       marginTop: 15,
//       marginBottom: 8,
//     },
//     sectionTitle: {
//       marginTop: 20,
//       fontWeight: 'bold',
//       fontSize: 18,
//       color: COLORS.blackColor,
//     },
//     sectionSubtitle: {
//       fontSize: 16,
//       fontWeight: '500',
//       color: COLORS.blackColor,
//       marginTop: 15,
//       marginBottom: 8,
//     },
//     inputbox: {
//       borderRadius: 10,
//       borderWidth: 1,
//       borderColor: COLORS.blackColor,
//       height: 50,
//       paddingHorizontal: 10,
//     },
//     dateInputbox: {
//       borderRadius: 10,
//       borderWidth: 1,
//       borderColor: COLORS.blackColor,
//       height: 50,
//       justifyContent: 'center',
//       paddingHorizontal: 10,
//     },
//     dateText: {
//       fontSize: 16,
//       color: COLORS.blackColor,
//     },
//     checkboxRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginTop: 10,
//     },
//     checkboxItem: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginRight: 20,
//     },
//   });
  
//   export default UpdatePromotion;







import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import { ApplyOn, CodeRequirement, CustomerScope, CustomerTargetOptions, DiscountType, ProductScope, ProgramType, TaxType } from './promotiondata';

const RewardType = [
  { label: 'Discount', value: 'discount' },
  { label: 'Free Product', value: 'product' },
  { label: 'Free Shipping', value: 'free_shipping' },
];

const UpdatePromotion = ({ navigation, route }) => {
  const { promotion } = route?.params || {};
  
  // Store initial data for comparison
  const initialDataRef = useRef(null);
  
  // Initialize state with default values
  const [promotionData, setPromotionData] = useState({
    programFor: null,
    programName: '',
    customerSelectionType: 'is_all_cust',
    selectedCustomers: [],
    numberOfTimes: '',
    couponUsageMethod: null,
    startDate: '',
    endingDate: '',
    productSelectionType: 'is_all',
    selectedProducts: [],
    quantity: '',
    minPurchase: '',
    taxExclude: null,
    promoCodeUsage: 'no_code_needed',
    promoCode: '',
    rewardType: null,
    discountPercentage: '',
    maxDiscount: '',
    freeProduct: null,
    freeProductQty: '',
    discountType: null,
    applyOn: null,
    description: '',
    discountApplyOn: null,
    specificProducts: [],
    limitOfProduct: '',
  });

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with promotion data when component mounts
  useEffect(() => {
    if (promotion) {
      const initialData = {
        programFor: ProgramType.find(item => item.value === promotion.program_type) || null,
        programName: promotion.name,
        customerSelectionType: promotion.base_on_customers,
        selectedCustomers: [],
        numberOfTimes: promotion.maximum_use_number.toString(),
        couponUsageMethod: CustomerScope.find(item => item.value === promotion.coupon_use_type) || null,
        startDate: promotion.rule_date_from,
        endingDate: promotion.rule_date_to,
        productSelectionType: promotion.base_on_products,
        selectedProducts: [],
        quantity: promotion.rule_min_quantity.toString(),
        minPurchase: promotion.rule_minimum_amount.toString(),
        taxExclude: TaxType.find(item => item.value === promotion.rule_minimum_amount_tax_inclusion) || null,
        promoCodeUsage: promotion.promo_code_usage,
        promoCode: promotion.promo_code || '',
        rewardType: promotion.reward_type,
        discountPercentage: promotion.discount_percentage.toString(),
        maxDiscount: promotion.discount_max_amount.toString(),
        freeProduct: null,
        freeProductQty: promotion.reward_product_quantity.toString(),
        discountType: DiscountType.find(item => item.value === promotion.discount_type) || null,
        applyOn: ApplyOn.find(item => item.value === promotion.discount_apply_on) || null,
        description: promotion.description,
        discountApplyOn: null,
        specificProducts: [],
        limitOfProduct: promotion.limit_reward_product.toString(),
      };
      
      setPromotionData(initialData);
      initialDataRef.current = initialData;
    }
  }, [promotion]);

  const handleChange = (key, value) => {
    setPromotionData(prevData => ({ ...prevData, [key]: value }));
  };

  // Date picker handlers
  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);
  const handleStartDateConfirm = date => {
    handleChange('startDate', moment(date).format('YYYY-MM-DD'));
    hideStartDatePicker();
  };

  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);
  const handleEndDateConfirm = date => {
    handleChange('endingDate', moment(date).format('YYYY-MM-DD'));
    hideEndDatePicker();
  };

  // Helper function to compare objects and get only changed values
  const getChangedValues = (current, initial) => {
    if (!initial) return current;
    
    const changes = {};
    
    Object.keys(current).forEach(key => {
      // Handle object comparisons (like dropdown values)
      if (typeof current[key] === 'object' && current[key] !== null) {
        if (JSON.stringify(current[key]) !== JSON.stringify(initial[key])) {
          changes[key] = current[key];
        }
      } 
      // Handle primitive value comparisons
      else if (current[key] !== initial[key]) {
        changes[key] = current[key];
      }
    });
    
    return changes;
  };

  // Helper function to convert numeric strings to numbers or null
  const processNumericFields = (data) => {
    const numericFields = [
      'numberOfTimes', 
      'quantity', 
      'minPurchase',
      'discountPercentage',
      'maxDiscount',
      'limitOfProduct',
      'freeProductQty'
    ];
    
    const processedData = {...data};
    
    numericFields.forEach(field => {
      if (field in processedData) {
        if (processedData[field] === '') {
          processedData[field] = null;
        } else if (processedData[field]) {
          processedData[field] = Number(processedData[field]);
        }
      }
    });
    
    return processedData;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Get only the changed values
      const changedValues = getChangedValues(promotionData, initialDataRef.current);
      
      // Process numeric fields in the changed values only
      const processedChangedValues = processNumericFields(changedValues);
      
      // Map the changed values to the API format
      const apiMappedValues = {productID:promotion?.id || "New",partner_id :[],product_id:[]};
      
      // Program information
      if ('programName' in processedChangedValues) {
        apiMappedValues.promotion_name = processedChangedValues.programName;
      }
      
      if ('programFor' in processedChangedValues) {
        apiMappedValues.program_type = processedChangedValues.programFor?.value || '';
      }
      
      // Customer selection
      if ('customerSelectionType' in processedChangedValues) {
        apiMappedValues.base_on_customers = processedChangedValues.customerSelectionType;
      }
      
      if ('numberOfTimes' in processedChangedValues) {
        apiMappedValues.maximum_use_number = processedChangedValues.numberOfTimes || 0;
      }
      
      if ('couponUsageMethod' in processedChangedValues) {
        apiMappedValues.coupon_use_type = processedChangedValues.couponUsageMethod?.value || '';
      }
      
      // Dates
      if ('startDate' in processedChangedValues) {
        apiMappedValues.rule_date_from = processedChangedValues.startDate;
      }
      
      if ('endingDate' in processedChangedValues) {
        apiMappedValues.rule_date_to = processedChangedValues.endingDate;
      }
      
      // Product selection
      if ('productSelectionType' in processedChangedValues) {
        apiMappedValues.base_on_products = processedChangedValues.productSelectionType;
      }
      
      if ('quantity' in processedChangedValues) {
        apiMappedValues.rule_min_quantity = processedChangedValues.quantity || 0;
      }
      
      if ('minPurchase' in processedChangedValues) {
        apiMappedValues.rule_minimum_amount = processedChangedValues.minPurchase || 0;
      }
      
      if ('taxExclude' in processedChangedValues) {
        apiMappedValues.rule_minimum_amount_tax_inclusion = processedChangedValues.taxExclude?.value || 'tax_included';
      }
      
      // Promo code
      if ('promoCodeUsage' in processedChangedValues) {
        apiMappedValues.promo_code_usage = processedChangedValues.promoCodeUsage === 'code_needed' ? 'code_needed' : 'no_code_needed';
      }
      
      if ('promoCode' in processedChangedValues) {
        apiMappedValues.promo_code = processedChangedValues.promoCode;
      }
      
      // Reward section
      if ('rewardType' in processedChangedValues) {
        apiMappedValues.reward_type = processedChangedValues.rewardType;
      }
      
      if ('discountType' in processedChangedValues) {
        apiMappedValues.discount_type = processedChangedValues.discountType?.value || '';
      }
      
      if ('discountPercentage' in processedChangedValues) {
        apiMappedValues.discount_percentage = processedChangedValues.discountPercentage || 0;
      }
      
      if ('applyOn' in processedChangedValues) {
        apiMappedValues.discount_apply_on = processedChangedValues.applyOn?.value || '';
      }
      
      if ('maxDiscount' in processedChangedValues) {
        apiMappedValues.discount_max_amount = processedChangedValues.maxDiscount || 0;
      }
      
      if ('description' in processedChangedValues) {
        apiMappedValues.description = processedChangedValues.description || '';
      }
      
      if ('limitOfProduct' in processedChangedValues) {
        apiMappedValues.limit_reward_product = processedChangedValues.limitOfProduct || 0;
      }
      
      if ('freeProductQty' in processedChangedValues) {
        apiMappedValues.reward_product_quantity = processedChangedValues.freeProductQty || 0;
      }
      
      // Prepare the data structure according to API requirements
      const requestData = {
        jsonrpc: "2.0",
        params: {
          id: {
          updatedData: apiMappedValues}
        }
      };

      console.log('Sending only changed data to API:', requestData);
      
      const response = await makeApiCall(
        promotion?.id ? API_URLS.savePromtionData : API_URLS.savePromtionData, 
        'POST', 
        requestData
      );
      
      if (response.result && response.result.errorMessage) {
        throw new Error(response.result.errorMessage);
      }
      
      console.log('API Response:', response);
      // navigation.goBack();
      
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={promotion ? 'Update Promotion' : 'Create Promotion'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          {/* Program Information */}
          <Text style={styles.lable}>Program Name</Text>
          <TextInputCompo
            placeholder="Program Name"
            style={styles.inputbox}
            value={promotionData.programName}
            onChangeText={value => handleChange('programName', value)}
          />

          <Text style={styles.lable}>Program For</Text>
          <Dropdowncomp
            data={ProgramType}
            placeholder="Select Program Name"
            value={promotionData.programFor}
            onChange={value => handleChange('programFor', value)}
          />

          {/* Customer Selection */}
          <Text style={styles.sectionTitle}>Condition</Text>
          <Text style={styles.sectionSubtitle}>Based On Customers</Text>
          <View style={styles.checkboxRow}>
            {CustomerTargetOptions.map((option) => (
              <View key={option.value} style={styles.checkboxItem}>
                <CheckBox
                  value={promotionData.customerSelectionType === option.value}
                  onValueChange={() => handleChange('customerSelectionType', option.value)}
                />
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>

          {promotionData.customerSelectionType === 'is_specific_cust' && (
            <>
              <Text style={styles.lable}>Select Customers</Text>
              <MultiSelectorDropdownComp
                data={[
                  { label: 'Customer A', value: 'customer_a' },
                  { label: 'Customer B', value: 'customer_b' },
                ]}
                placeholder={'Select Customers'}
                value={promotionData.selectedCustomers}
                onChange={value => handleChange('selectedCustomers', value)}
              />
            </>
          )}

          {/* Validity Section */}
          <Text style={styles.lable}>Validity</Text>
          <Text style={styles.lable}>Number of Times:</Text>
          <TextInputCompo
            placeholder="Number of Times"
            keyboardType="numeric"
            style={styles.inputbox}
            value={promotionData.numberOfTimes}
            onChangeText={value => handleChange('numberOfTimes', value)}
          />

          <Text style={styles.lable}>Coupon Usage Method:</Text>
          <Dropdowncomp
            data={CustomerScope}
            placeholder={'Coupon Usage method'}
            value={promotionData.couponUsageMethod}
            onChange={value => handleChange('couponUsageMethod', value)}
          />

          {/* Date Pickers */}
          <Text style={styles.lable}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateInputbox}
            onPress={showStartDatePicker}
          >
            <Text style={styles.dateText}>
              {promotionData.startDate || 'Select Date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />

          <Text style={styles.lable}>Ending Date</Text>
          <TouchableOpacity
            style={styles.dateInputbox}
            onPress={showEndDatePicker}
          >
            <Text style={styles.dateText}>
              {promotionData.endingDate || 'Select Date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />

          {/* Product Selection */}
          <Text style={styles.sectionSubtitle}>Based On Products</Text>
          <View style={styles.checkboxRow}>
            {ProductScope.map((option) => (
              <View key={option.value} style={styles.checkboxItem}>
                <CheckBox
                  value={promotionData.productSelectionType === option.value}
                  onValueChange={() => handleChange('productSelectionType', option.value)}
                />
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>

          {promotionData.productSelectionType === 'is_specific' && (
            <>
              <Text style={styles.lable}>Select Products</Text>
              <MultiSelectorDropdownComp
                data={[
                  { label: 'Product X', value: 'product_x' },
                  { label: 'Product Y', value: 'product_y' },
                ]}
                placeholder={'Select Products'}
                value={promotionData.selectedProducts}
                onChange={value => handleChange('selectedProducts', value)}
              />
            </>
          )}

          {/* Purchase Requirements */}
          <Text style={styles.lable}>Quantity</Text>
          <TextInputCompo
            placeholder="Quantity"
            keyboardType="numeric"
            style={styles.inputbox}
            value={promotionData.quantity}
            onChangeText={value => handleChange('quantity', value)}
          />
          <Text style={styles.lable}>Minimum Purchase of</Text>
          <TextInputCompo
            placeholder="Minimum Purchase"
            keyboardType="numeric"
            style={styles.inputbox}
            value={promotionData.minPurchase}
            onChangeText={value => handleChange('minPurchase', value)}
          />

          {/* Tax Section */}
          <Text style={styles.lable}>Tax Exclude</Text>
          <Dropdowncomp
            data={TaxType}
            placeholder="Select Option"
            value={promotionData.taxExclude}
            onChange={value => handleChange('taxExclude', value)}
          />

          {/* Promo Code Section */}
          <Text style={styles.sectionSubtitle}>Promo Code Usage</Text>
          <View style={styles.checkboxRow}>
            {CodeRequirement.map((option) => (
              <View key={option.value} style={styles.checkboxItem}>
                <CheckBox
                  value={promotionData.promoCodeUsage === option.value}
                  onValueChange={() => handleChange('promoCodeUsage', option.value)}
                />
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>

          {promotionData.promoCodeUsage === 'code_needed' && (
            <>
              <Text style={styles.lable}>Promo Code</Text>
              <TextInputCompo
                placeholder="Promo Code"
                style={styles.inputbox}
                value={promotionData.promoCode}
                onChangeText={value => handleChange('promoCode', value)}
              />
            </>
          )}

          {/* Reward Section (only for coupon programs) */}
          {promotionData?.programFor?.value === 'coupon_program' && (
            <>
              <Text style={styles.sectionSubtitle}>Reward Section</Text>
              <View style={styles.checkboxRow}>
                {RewardType.map(option => (
                  <View key={option.value} style={styles.checkboxItem}>
                    <CheckBox
                      value={promotionData.rewardType === option.value}
                      onValueChange={() => handleChange('rewardType', option.value)}
                    />
                    <Text>{option.label}</Text>
                  </View>
                ))}
              </View>

              {/* Discount Reward */}
              {promotionData.rewardType === 'discount' && (
                <View>
                  <Text style={styles.lable}>Description</Text>
                  <TextInputCompo
                    placeholder="Description"
                    style={styles.inputbox}
                    value={promotionData.description}
                    onChangeText={value => handleChange('description', value)}
                  />
                  
                  <Text style={styles.lable}>Discount Type</Text>
                  <Dropdowncomp
                    data={DiscountType} 
                    placeholder="Select Discount Type"
                    value={promotionData.discountType}
                    onChange={value => handleChange('discountType', value)}
                  />
                  
                  {promotionData?.discountType?.value === 'percentage' && (
                    <>
                      <Text style={styles.lable}>Discount Percentage</Text>
                      <TextInputCompo
                        placeholder="Enter percentage"
                        keyboardType="numeric"
                        style={styles.inputbox}
                        value={promotionData.discountPercentage}
                        onChangeText={value => handleChange('discountPercentage', value)}
                      />
                      
                      <Text style={styles.lable}>Apply Discount On</Text>
                      <Dropdowncomp
                        data={ApplyOn} 
                        placeholder="Select Application"
                        value={promotionData.applyOn}
                        onChange={value => handleChange('applyOn', value)}
                      /> 
                      
                      {promotionData?.applyOn?.value === 'specific_products' && (
                        <>
                          <Text style={styles.lable}>Select Products</Text>
                          <MultiSelectorDropdownComp
                            data={[
                              { label: 'Product 1', value: 'product_1' },
                              { label: 'Product 2', value: 'product_2' },
                            ]}
                            placeholder="Select Products"
                            value={promotionData.specificProducts}
                            onChange={value => handleChange('specificProducts', value)}
                          /> 
                        </>
                      )}
                    </>
                  )}
                  
                  <Text style={styles.lable}>Maximum Discount Amount</Text>
                  <TextInputCompo
                    placeholder="Enter max amount"
                    keyboardType="numeric"
                    style={styles.inputbox}
                    value={promotionData.maxDiscount}
                    onChangeText={value => handleChange('maxDiscount', value)}
                  />
                </View>
              )}

              {/* Free Product Reward */}
              {promotionData.rewardType === 'product' && (
                <View>
                  <Text style={styles.lable}>Select Reward Product</Text>
                  <Dropdowncomp
                    data={[{ label: 'Product 1', value: 'product_1' }]}
                    placeholder="Select Product"
                    value={promotionData.freeProduct}
                    onChange={value => handleChange('freeProduct', value)}
                  />

                  <Text style={styles.lable}>Limit of Product</Text>
                  <TextInputCompo
                    placeholder="Limit of Product"
                    keyboardType="numeric"
                    style={styles.inputbox}
                    value={promotionData.limitOfProduct}
                    onChangeText={value => handleChange('limitOfProduct', value)}
                  />
                  
                  <Text style={styles.lable}>Description</Text>
                  <TextInputCompo
                    placeholder="Description"
                    style={styles.inputbox}
                    value={promotionData.description}
                    onChangeText={value => handleChange('description', value)}
                  />
                </View>
              )}

              {/* Free Shipping Reward */}
              {promotionData.rewardType === 'free_shipping' && (
                <>
                  <Text style={styles.lable}>Description</Text>
                  <TextInputCompo
                    placeholder="Description"
                    style={styles.inputbox}
                    value={promotionData.description}
                    onChangeText={value => handleChange('description', value)}
                  />
                </>
              )}
            </>
          )}

          {/* Save Button */}
          <ButtonCompo 
            title={promotion ? "Update" : "Save"} 
            onPress={handleSave} 
          />
        </View>
        <Loader visible={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  formContainer: {
    padding: 15,
  },
  lable: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blackColor,
    marginTop: 15,
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.blackColor,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blackColor,
    marginTop: 15,
    marginBottom: 8,
  },
  inputbox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.blackColor,
    height: 50,
    paddingHorizontal: 10,
  },
  dateInputbox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.blackColor,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.blackColor,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
});

export default UpdatePromotion;