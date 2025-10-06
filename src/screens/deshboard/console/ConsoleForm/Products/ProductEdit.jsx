import {

  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';

import {API_URLS, BASE_URL} from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import ButtonCompo from '../../../../../components/ButtonCompo';
import Ecommercecomp from '../../../../../components/Tabcomponent/Ecommercecomp';
import {useGetProductsMutation} from '../../../../../redux/rtkQuery/Servicess';
import Sales from '../../../../../components/Tabcomponent/Sales';
import Varient from '../../../../../components/Tabcomponent/Varient';
import GeneralInfo from '../../../../../components/Tabcomponent/GeneralInfo';
import Inventory from '../../../../../components/Tabcomponent/Inventory';
import axios from 'axios';
import MessageShow from '../../../../../constant/MessageShow';
import makeApiCall from '../../../../../utils/apiHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
const ProductEdit = ({navigation, route}) => {
  const {item} = route.params;
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [ecommerceData, setEcommerceData] = useState({});
  const [salesData, setSalesData] = useState({});
  const [variantData, setVariantData] = useState({});
  const [generalData, setGeneralData] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [changedFields, setChangedFields] = useState({});

  const [getProducts, {data, error, isLoading}] = useGetProductsMutation();

  const singleProducts = data?.result?.data;
  // console.log(singleProducts?.product?.type,'SINGLEPRODUCT')

  useEffect(() => {
    getProducts({
      jsonrpc: '2.0',
      params: {id: item?.id},
      productType: null,
      searchbar: null,
    });
  }, []);

  // useEffect(() => console.log('Changed fields:', changedFields), [changedFields]);
  // console.log(data);
  const handleFieldChange = (field, value) => {
    setChangedFields(prev => ({...prev, [field]: value}));
  };

  const tabs = ['GENERAL INFO', 'VARIANTS', 'SALES', 'ECOMMERCE', 'INVENTORY'];

  // const handleSaveProduct = async () => {
  //   try {
  //     const fullPayload = {
  //       id: item?.id,
  //       ...changedFields,
  //       // ...variantData,
  //       // ...ecommerceData,
  //       // ...inventoryData,
  //     };
  // console.log(fullPayload)
  //     const formData = new FormData();

  //     Object.keys(fullPayload).forEach(key => {
  //       if (key === 'image') return; // skip image for now

  //       let value = fullPayload[key];

  //       // Multi-select fields like taxes_id
  //       if (['taxes_id', 'optional_product_ids'].includes(key)) {
  //         if (Array.isArray(value)) {
  //           value = value.map(v => (v?.value !== undefined ? v.value : v));
  //         } else if (value && typeof value === 'object' && 'value' in value) {
  //           value = [value.value];
  //         } else {
  //           value = [value];
  //         }
  //         formData.append(key, JSON.stringify(value));
  //       }
  //       // Single-select dropdowns
  //       else if (value && typeof value === 'object' && 'value' in value) {
  //         formData.append(key, value.value);
  //       }
  //       // Arrays (other than multi-select)
  //       else if (Array.isArray(value)) {
  //         formData.append(key, JSON.stringify(value));
  //       }
  //       // Primitives
  //       else {
  //         formData.append(key, value);
  //       }
  //     });

  //     setIsSaving(true);
  //     const response = await axios(API_URLS.saveStoreProducts, {
  //       method: 'POST',
  //       data: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Accept: 'application/json',
  //       },
  //     });

  //     console.log('✅ Submit Response:', response.data);

  //     if (response?.data.message === 'success') {
  //       MessageShow.success('Success', response?.data.message);
  //       // Optionally reset states here
  //     } else {
  //       Alert.alert('❌ Error', response.data.errorMessage);
  //     }
  //   } catch (error) {
  //     console.error('❌ Save Error:', error.message);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // ... (rest of your component code)

  // const handleSaveProduct = async () => {
  //   try {
  //     const fullPayload = {
  //       id: item?.id,
  //       ...changedFields,
  //       ...generalData,
  //       // ...variantData,
  //       ...salesData,
  //       ...ecommerceData,
  //       ...inventoryData,
  //     };

  //     const formData = new FormData();

  //     Object.keys(fullPayload).forEach(key => {
  //       const value = fullPayload[key];

  //       if (key === 'image' && value) {
  //         formData.append('reference_image', {
  //           uri: value.path,
  //           type: value.mime || 'image/jpeg',
  //           name: value.filename || 'image.jpg',
  //         });
  //       } else if (typeof value === 'object' && value !== null) {
  //         formData.append(key, JSON.stringify(value));
  //       } else if (value !== undefined && value !== null) {
  //         formData.append(key, value);
  //       }
  //     });

  //     setIsSaving(true);
  //    console.log(formData,'PAYLOAD')
  //     const response = await axios(API_URLS.saveStoreProducts, {
  //       method: 'POST',
  //       data: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Accept: 'application/json',
  //       },
  //     });

  //     console.log('✅ Raw Axios Response:', response); // will always run if no exception
  //     console.log('📦 Response Data:', response.data);
  //     if (response?.data?.message === 'success') {
  //       MessageShow.success('Success', 'Product updated successfully!');
  //       navigation.goBack();
  //     } else {
  //       Alert.alert('❌ Error', response.data?.errorMessage || 'Unknown error');
  //     }
  //   } catch (error) {
  //     console.error('❌ Update Error:', error);
  //     MessageShow.success('success','success')
  //     // navigation.goBack();
     
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
//  const handleSaveProduct = async () => {
//   try {
//     const fullPayload = {
//       id: item?.id,
//       ...changedFields,
//       ...generalData,
//       ...salesData,
//       ...ecommerceData,
//       ...inventoryData,
//     };

//     const formData = new FormData();

//     Object.keys(fullPayload).forEach(key => {
//       const value = fullPayload[key];

//       if (key === 'image') {
//         // ✅ Sirf tab append kare jab naya image ho (path available ho)
//         if (value && value.path) {
//           formData.append('reference_image', {
//             uri: value.path,
//             type: value.mime || 'image/jpeg',
//             name: value.filename || 'image.jpg',
//           });
//         }
//       } 
//       else if (key === 'taxes_id') {
//         // ✅ Extract only value (id) from [{label, value}]
//         if (Array.isArray(value)) {
//           const ids = value.map(v => v?.value || v);
//           formData.append('taxes_id', JSON.stringify(ids));
//         } else if (typeof value === 'string') {
//           // In case it's already JSON string
//           try {
//             const parsed = JSON.parse(value);
//             const ids = parsed.map(v => v?.value || v);
//             formData.append('taxes_id', JSON.stringify(ids));
//           } catch {
//             formData.append('taxes_id', value);
//           }
//         }
//       } else if (typeof value === 'object' && value !== null) {
//         formData.append(key, JSON.stringify(value));
//       } else if (value !== undefined && value !== null) {
//         formData.append(key, value);
//       }
//     });

//     setIsSaving(true);
//     console.log('📤 Final FormData:', formData);

//     const response = await axios(API_URLS.saveStoreProducts, {
//       method: 'POST',
//       data: formData,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Accept: 'application/json',
//       },
//     });

//     console.log('✅ Raw Axios Response:', response);
//     console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));

//     if (response?.data?.message === 'success') {
//       MessageShow.success('Success', 'Product updated successfully!');
//       navigation.goBack();
//     } else {
//       const errorMsg =
//         response?.data?.errorMessage ||
//         response?.data?.message ||
//         JSON.stringify(response?.data);

//       Alert.alert('❌ Error', errorMsg);
//     }
//   } catch (error) {
//     console.error('❌ Update Error:', error);
//     Alert.alert('❌ Exception', 'Please Select Brand' || 'Something went wrong');
//   } finally {
//     setIsSaving(false);
//   }
// };

const handleSaveProduct = async () => {
  try {
    // Build payload with only changed fields
    const fullPayload = {
      id: item?.id,
      ...changedFields, // 👈 only changed fields will be sent
    };

    const formData = new FormData();

    Object.keys(fullPayload).forEach((key) => {
      const value = fullPayload[key];

      if (key === "image") {
        if (value && value.path) {
          formData.append("reference_image", {
            uri: value.path,
            type: value.mime || "image/jpeg",
            name: value.filename || "image.jpg",
          });
        }
      } else if (key === "taxes_id") {
        if (Array.isArray(value)) {
          const ids = value.map((v) => v?.value || v);
          formData.append("taxes_id", JSON.stringify(ids));
        }
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    setIsSaving(true);
    console.log("📤 Sending FormData:", fullPayload);

    const response = await axios(API_URLS.saveStoreProducts, {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    console.log("✅ Response:", response.data);

    if (response?.data?.message === "success") {
      MessageShow.success("Success", "Product updated successfully!");
      navigation.goBack();
    } else {
      MessageShow.error("❌ Error", response.data?.errorMessage || "Unknown error")
    }
  } catch (error) {
    console.error("❌ Update Error:", error);
    // Alert.alert("❌ Exception", error.message || "Something went wrong");
    MessageShow.error("❌ Exception", error.message || "Something went wrong")
  } finally {
    setIsSaving(false);
  }
};

  

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === index && styles.activeTab]}
          onPress={() => setActiveTab(index)}>
          <Text
            style={[
              styles.tabText,
              activeTab === index
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <GeneralInfo
            data={singleProducts}
            generalData={generalData}
            setGeneralData={setGeneralData}
            onFieldChange={handleFieldChange}
          />
        );
      case 1:
        return (
          <Varient
            data={singleProducts}
            variantData={variantData}
            setVariantData={setVariantData}
            onFieldChange={handleFieldChange}
            item={item}
          />
        );
      case 2:
        return (
          <Sales
            data={singleProducts}
            salesData={salesData}
            setSalesData={setSalesData}
            onFieldChange={handleFieldChange}
          />
        );
      case 3:
        return (
          <Ecommercecomp
            data={data}
            isLoding={isLoading}
            iserror={error}
            EcommerceData={ecommerceData}
            setEcommerceData={setEcommerceData}
            onFieldChange={handleFieldChange}
            item={item}
          />
        );
      case 4:
        return (
          <>
            {singleProducts?.product?.type === 'product' && (
              <Inventory
                data={singleProducts}
                setInventoryData={setInventoryData}
                inventoryData={inventoryData}
                item={item}
              />
            )}
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'Edit Product'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      {renderTabBar()}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <ButtonCompo
            title="Cancel"
            style={[styles.bottomButton, styles.cancelButton]}
            textStyle={styles.cancelButtonText}
            onPress={() => navigation.goBack()}
          />

          <ButtonCompo
            title={isSaving ? 'Saving...' : 'Save Changes'}
            style={[styles.bottomButton, styles.saveButton]}
            onPress={handleSaveProduct}
            disabled={isSaving}
          />
        </View>
      </KeyboardAvoidingView>

      <Loader visible={isLoading || isSaving} />
    </SafeAreaView>
  );
};

export default ProductEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.whiteColor,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.blueColor,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.blueColor,
  },
  inactiveTabText: {
    color: COLORS.grayColor,
  },

  // Image Section
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    marginRight: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  placeholderEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: COLORS.grayColor,
  },
  fileUploadSection: {
    flex: 1,
  },
  fileButton: {
    backgroundColor: COLORS.gray2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  fileButtonText: {
    fontSize: 12,
    color: COLORS.blackColor,
  },
  fileText: {
    fontSize: 12,
    color: COLORS.grayColor,
  },

  // Checkbox Styles
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: COLORS.blueColor,
    borderRadius: 3,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.blueColor,
  },
  checkmark: {
    color: COLORS.whiteColor,
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 13,
    color: COLORS.blackColor,
  },

  // Form Styles
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.blackColor,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLORS.whiteColor,
    color: COLORS.blackColor,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Variants Styles
  variantsContainer: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginBottom: 10,
  },
  variantItem: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  variantText: {
    fontSize: 14,
    color: COLORS.blackColor,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.grayColor,
  },

  // Add Button
  addButton: {
    backgroundColor: COLORS.blueColor,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: COLORS.whiteColor,
    fontWeight: 'bold',
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    marginBottom: 15,
  },

  // SEO Preview
  seoPreview: {
    marginTop: 20,
  },
  seoPreviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    marginBottom: 8,
  },
  seoPreviewBox: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  seoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a0dab',
    marginBottom: 4,
  },
  seoDescription: {
    fontSize: 14,
    color: '#006621',
  },

  // Stock Status
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  stockStatusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    marginRight: 10,
  },
  stockStatusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  stockStatusGood: {
    backgroundColor: '#d4edda',
  },
  stockStatusLow: {
    backgroundColor: '#f8d7da',
  },
  stockStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Bottom Buttons
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray2,
    backgroundColor: COLORS.whiteColor,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.gray2,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  cancelButtonText: {
    color: COLORS.blackColor,
  },
  saveButton: {
    backgroundColor: COLORS.blueColor,
  },
});
