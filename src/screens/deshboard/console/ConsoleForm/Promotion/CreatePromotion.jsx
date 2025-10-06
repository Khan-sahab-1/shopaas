




import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
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
import { fetchSpecificData } from '../../../../../utils/fetchSpecificData';
  
  const RewardType = [
    { label: 'Discount', value: 'discount' },
    { label: 'Free Product', value: 'product' },
    { label: 'Free Shipping', value: 'free_shipping' },
  ];
  
  const CreatePromotion = ({ navigation }) => {
    // Complete state initialization
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
    const [customerOptions, setCustomerOptions] = useState([]);
    const [productOptions,setProductOptions]=useState([])
    console.log(productOptions,'Products')
   
  
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
  
    const fetchPromotion = async () => {
      try {
        setIsLoading(true);
        const res = await makeApiCall(API_URLS.getPromotionData, 'POST', {
          jsonrpc: '2.0',
          params: { userId: null, method: 'GET' },
        });
        console.log(res, 'RESPONSE');
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // const handleSave = async () => {
    //     try {
    //       setIsLoading(true);
          
    //       // Prepare the data structure according to API requirements
    //       const requestData = {
    //         jsonrpc: "2.0",
    //         params: {
    //           id: {
    //             updatedData: {
    //               promotion_name: promotionData.programName,
    //               program_type: promotionData.programFor?.value || '',
    //               productID: "New", 
    //               base_on_customers: promotionData.customerSelectionType,
    //               maximum_use_number: promotionData.numberOfTimes,
    //               coupon_use_type: promotionData.couponUsageMethod?.value || '',
    //               rule_date_from: promotionData.startDate,
    //               rule_date_to: promotionData.endingDate,
    //               rule_min_quantity: promotionData.quantity,
    //               rule_minimum_amount: promotionData.minPurchase,
    //               rule_minimum_amount_tax_inclusion: promotionData.taxExclude?.value || 'tax_included',
    //               base_on_products: promotionData.productSelectionType,
    //               promo_code_usage: promotionData.promoCodeUsage === 'code_needed' ? 'code_needed' : 'no_code_needed',
    //               promo_code: promotionData.promoCode,
    //               reward_type: promotionData.rewardType,
    //               discount_type: promotionData.discountType?.value || '',
    //               discount_percentage: promotionData.discountPercentage,
    //               discount_apply_on: promotionData.applyOn?.value || '',
    //               discount_max_amount: promotionData.maxDiscount,
    //               // Add additional fields as needed
    //             }
    //           }
    //         }
    //       };
      
    //       console.log('Sending data to API:', requestData);
          
    //       const response = await makeApiCall(API_URLS.savePromtionData, 'POST', requestData);
          
    //       console.log('API Response:', response);
    //     //   navigation.goBack(); // Navigate back after successful save
          
    //     } catch (error) {
    //       console.error('Error saving promotion:', error);
    //       // Handle error (show alert, etc.)
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
      const handleSave = async () => {
        try {
          setIsLoading(true);
          
          const numericFields = [
            'numberOfTimes', 
            'quantity', 
            'minPurchase',
            'discountPercentage',
            'maxDiscount'
          ];
          
          const cleanedData = {...promotionData};
          
          numericFields.forEach(field => {
            if (cleanedData[field] === '') {
              cleanedData[field] = null;
            } else if (cleanedData[field]) {
              cleanedData[field] = Number(cleanedData[field]);
            }
          });
      
          // Prepare the data structure according to API requirements
          const requestData = {
            jsonrpc: "2.0",
            params: {
              id: {
                updatedData: {
                  promotion_name: cleanedData.programName,
                  program_type: cleanedData.programFor?.value || '',
                  productID: "New",
                  base_on_customers: cleanedData.customerSelectionType,
                  maximum_use_number: cleanedData.numberOfTimes || 0, // Default to 0 if null
                  coupon_use_type: cleanedData.couponUsageMethod?.value || '',
                  rule_date_from: cleanedData.startDate,
                  rule_date_to: cleanedData.endingDate,
                  rule_min_quantity: cleanedData.quantity || 0,
                  rule_minimum_amount: cleanedData.minPurchase || 0,
                  rule_minimum_amount_tax_inclusion: cleanedData.taxExclude?.value || 'tax_included',
                  base_on_products: cleanedData.productSelectionType,
                  promo_code_usage: cleanedData.promoCodeUsage === 'code_needed' ? 'code_needed' : 'no_code_needed',
                  promo_code: cleanedData.promoCode,
                  reward_type: cleanedData.rewardType,
                  discount_type: cleanedData.discountType?.value || '',
                  discount_percentage: cleanedData.discountPercentage || 0,
                  discount_apply_on: cleanedData.applyOn?.value || '',
                  discount_max_amount: cleanedData.maxDiscount || 0,
                  description: cleanedData.description || '',
                  // Add any additional required fields
                }
              }
            }
          };
      
          console.log('Sending data to API:', requestData);
          
          const response = await makeApiCall(API_URLS.savePromtionData, 'POST', requestData);
          
          if (response.result && response.result.errorMessage) {
            throw new Error(response.result.errorMessage);
          }
          
          console.log('API Response:', response);
          navigation.goBack();
          
        } catch (error) {
          console.error('Error saving promotion:', error);
          alert(`Error: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      const fetchspecificData=async(userId)=>{
          try {
            setIsLoading(true)
            const responce=await makeApiCall(API_URLS.getSpecificData,'POST',{
              jsonrpc: "2.0",
              params: {
                  userId: userId,
                  rt: null,
                  id: null,
                  origin: null,
                  method: "GET"
              }
          })
          console.log(responce,'Specific')
          const formattedData = responce?.result?.items?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
          
          setCustomerOptions(formattedData);
          
          } catch (error) {
            console.log(error)
          } finally{
            setIsLoading(false)
          }
        }
 useEffect(()=>{
  fetchPromotion()
 },[])
 useEffect(() => {
  fetchPromotion();
  
  // Fetch customer data using the reusable utility function
  fetchSpecificData('partner_id', setIsLoading, setCustomerOptions);
  
  // Fetch product data using the same reusable utility function
  fetchSpecificData('product_id', setIsLoading, setProductOptions);
 }, []);

    return (
      <SafeAreaView style={styles.container}>
        <Headercomp
          title={'Create Promotion'}
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
                  data={customerOptions}
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
                  data={productOptions}
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
            {/* <Text style={styles.sectionSubtitle}>Promo Code Usage</Text>
            <View style={styles.checkboxRow}>
              <View style={styles.checkboxItem}>
                <CheckBox
                  value={promotionData.promoCodeUsage === 'no_code_needed'}
                  onValueChange={() => handleChange('promoCodeUsage', 'no_code_needed')}
                />
                <Text>No Code Needed</Text>
              </View>
              <View style={styles.checkboxItem}>
                <CheckBox
                  value={promotionData.promoCodeUsage === 'code_needed'}
                  onValueChange={() => handleChange('promoCodeUsage', 'code_needed')}
                />
                <Text>Code Needed</Text>
              </View>
            </View> */}
            <Text style={styles.sectionSubtitle}>Promo Code Usage</Text>
<View style={styles.checkboxRow}>
  {CodeRequirement.map((option) => (
    <View key={option.value} style={styles.checkboxItem}>
      <CheckBox
        value={promotionData?.promoCodeUsage === option.value}
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
                              data={productOptions}
                              placeholder="Select Products"
                              value={promotionData.specificProducts}
                              onChange={value => handleChange('specificProducts', value)}
                              style={{height:60}}
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
                      data={productOptions}
                      placeholder="Select Product"
                      value={promotionData.freeProduct}
                      onChange={value => handleChange('freeProduct', value)}
                      style={{height:60}}
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
            <ButtonCompo title="Save" onPress={handleSave} />
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
  
  export default CreatePromotion;