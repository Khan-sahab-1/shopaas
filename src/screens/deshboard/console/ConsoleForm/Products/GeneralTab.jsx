// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import { COLORS } from '../../../../../styles/colors';
// import Headercomp from '../../../../../components/Headercomp';
// import ImagePicker from 'react-native-image-crop-picker';
// import ButtonCompo from '../../../../../components/ButtonCompo';
// import CheckBox from '@react-native-community/checkbox';
// import TextInputCompo from '../../../../../components/TextInputCompo';
// import Dropdowncomp from '../../../../../components/Dropdowncomp';

// const GeneralTab = ({ navigation,generalData, setGeneralData  }) => {
//   const [pickedImage, setPickedImage] = useState(null);
//   const [isSoled, setIsSoled] = useState(false);
//   const [isPublished, setIsPublished] = useState(false);
//   const [ispurchased, setIspurchased] = useState(false);
//   const [productName,setproductName]=useState('')
//   const [refrenceName,setrefrenceName]=useState('')
//   const [hnnacode,sethnnacode]=useState('')
//   const [salesPrice,setSalesprice]=useState('')
//   const [price,setPrice]=useState('')
//   const [description,setDescriptin]=useState('')
//   const [selectedType,setSelectedType]=useState(null)
//   const [selectedcategory,setcelectedcatogery]=useState(null)
//   const [selectedbrand,setselectedbrand]=useState(null)
//   const [selectedunitofnmesure,setselectedunitofmeasure]=useState(null)
//   const [selectustomerTaxes,setselectcutomertaxes]=useState(null)

//   const toggleSold = () => {
//     setIsSoled(!isSoled);
//   };

//   const togglePublished = () => {
//     setIsPublished(!isPublished);
//   };

//   const togglePurchased = () => {
//     setIspurchased(!ispurchased);
//   };

//   const handleImagePick = async () => {
//     try {
//       const image = await ImagePicker.openPicker({
//         width: 300,
//         height: 400,
//         cropping: true,
//       });
//       console.log('📸 Picked Image:', image);
//       setPickedImage(image);
//     } catch (error) {
//       console.log('❌ Image pick cancelled or error:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>

//       <ScrollView style={{ flex: 1 }}>
//         <View style={styles.container}>

//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             {pickedImage && (
//               <Image
//                 source={{ uri: pickedImage.path }}
//                 style={styles.imagePreview}
//                 resizeMode="cover"
//               />
//             )}
//             <ButtonCompo
//               onPress={handleImagePick}
//               title="Pick Image"
//               style={{ width: '50%' }}
//             />
//           </View>
//           <View style={{ ...styles.checkboxContainer }}>
//             <CheckBox
//               value={isSoled}
//               onValueChange={toggleSold}
//               tintColors={{ true: COLORS.primaryColor, false: COLORS.grayText }}
//             />
//             <Text>Can be Sold</Text>
//             <CheckBox
//               value={ispurchased}
//               onValueChange={togglePurchased}
//               tintColors={{ true: COLORS.primaryColor, false: COLORS.grayText }}
//             />
//             <Text>Can be Purchased</Text>
//           </View>
//           <View style={{ ...styles.checkboxContainer }}>
//             <CheckBox
//               value={isPublished}
//               onValueChange={togglePublished}
//               tintColors={{ true: COLORS.primaryColor, false: COLORS.grayText }}
//             />
//             <Text>Publish        </Text>

//             <View />
//             <View />
//             <View />
//             <View />
//           </View>
//           <View>
//             <Text style={{ ...styles.label }}>Product Name</Text>
//             <TextInputCompo
//               value={productName}
//               placeholder="Product Name"
//               style={{ ...styles.inputBox }}
//               onChangeText={(item)=>setproductName(item)}
//             />
//             <Text style={{ ...styles.label }}>Internal Reference</Text>
//             <TextInputCompo

//               placeholder="Internal Reference"
//               style={{ ...styles.inputBox }}
//               onChangeText={(item)=>setrefrenceName(item)}
//               value={refrenceName}
//             />
//             <Text style={{ ...styles.label }}>Sales Price</Text>
//             <TextInputCompo
//               value={salesPrice}
//               placeholder="Sales Price"
//               style={{ ...styles.inputBox }}
//               onChangeText={(item)=>setSalesprice(item)}
//             />
//              <Text style={{ ...styles.label }}>Cost</Text>
//             <TextInputCompo
//               value={price}
//               placeholder="Cost"
//               style={{ ...styles.inputBox }}
//               onChangeText={(item)=>setPrice(item)}
//             />
//             <Text style={{ ...styles.label }}>HSN/SAC Code</Text>
//             <TextInputCompo
//               value={hnnacode}
//               placeholder="HSN/SAC Code"
//               style={{ ...styles.inputBox }}
//               onChangeText={(item)=>sethnnacode(item)}
//             />
//             <Text style={{ ...styles.label }}>Product Description</Text>
//             <TextInputCompo
//               value={description}
//               placeholder="Product Description"
//               style={{ ...styles.inputBox }}
//               onChangeText={(item)=>setDescriptin(item)}
//             />
//             <Text style={{ ...styles.label }}>Type</Text>
//             <Dropdowncomp
//               data={[
//                 { label: 'Option 1', value: '1' },
//                 { label: 'Option 2', value: '2' },
//                 { label: 'Option 3', value: '3' },
//               ]}
//             />
//             <Text style={{ ...styles.label }}>Product Category</Text>
//             <Dropdowncomp
//               data={[
//                 { label: 'Option 1', value: '1' },
//                 { label: 'Option 2', value: '2' },
//                 { label: 'Option 3', value: '3' },
//               ]}
//             />
//             <Text style={{ ...styles.label }}>Brand</Text>
//             <Dropdowncomp
//               data={[
//                 { label: 'Option 1', value: '1' },
//                 { label: 'Option 2', value: '2' },
//                 { label: 'Option 3', value: '3' },
//               ]}
//             />
//             <Text style={{ ...styles.label }}>Unit of Measure</Text>
//             <Dropdowncomp
//               data={[
//                 { label: 'Option 1', value: '1' },
//                 { label: 'Option 2', value: '2' },
//                 { label: 'Option 3', value: '3' },
//               ]}
//             />
//             <Text style={{ ...styles.label }}>Customer Taxes</Text>
//             <Dropdowncomp
//               data={[
//                 { label: 'Option 1', value: '1' },
//                 { label: 'Option 2', value: '2' },
//                 { label: 'Option 3', value: '3' },
//               ]}
//             />
//             <View style={{height:50}}/>
//             {/* <View/> */}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.whiteColor,
//     paddingHorizontal: 16,
//   },
//   pickButton: {
//     backgroundColor: COLORS.primaryColor ?? '#007bff',
//     padding: 12,
//     borderRadius: 8,
//     // marginBottom: 20,
//     alignItems: 'center',
//   },
//   pickButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.grayText,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   inputBox: {
//     borderWidth: 1,
//     borderColor: COLORS.borderColor,
//     borderRadius: 10,
//     padding: 10,
//     // marginVertical: 10,
//     color: COLORS.blackColor,
//     height: 50,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.blackColor,
//     marginTop: 10,
//   },
// });

// export default GeneralTab

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS} from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import ImagePicker from 'react-native-image-crop-picker';
import ButtonCompo from '../../../../../components/ButtonCompo';
import CheckBox from '@react-native-community/checkbox';
import TextInputCompo from '../../../../../components/TextInputCompo';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import makeApiCall from '../../../../../utils/apiHelper';
import {API_URLS} from '../../../../../utils/apiurls';
import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
import {useDispatch} from 'react-redux';
import {setSelectedType} from '../../../../../redux/reducers/productTypeSlice';

const GeneralTab = ({navigation, generalData, setGeneralData}) => {
  const [isLoding, setisloding] = useState(false);
  const [productData, setProductData] = useState([]);
  const dispatch = useDispatch();
  const fetchSavedata = async () => {
    try {
      setisloding(true);
      const response = await makeApiCall(API_URLS.storeProducts, 'POST', {
        jsonrpc: '2.0',
        params: {id: 'New'},
      });
      console.log('Response--', response);
      if (response?.result?.message === 'success') {
        setProductData(response?.result?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloding(false);
    }
  };

  useEffect(() => {
    fetchSavedata();
  }, []);
  const formattedType = productData?.form_options?.type;
  const typeOptions = formattedType
    ? Object.entries(formattedType).map(([value, label]) => ({
        label,
        value,
      }))
    : [];

  const formattedProducts = productData?.form_options?.categ_id;

  // const categOptions = Object.entries(formattedProducts).map(([value, label]) => ({
  //   label,
  //   value
  // }));
  const categOptions = formattedProducts
    ? Object.entries(formattedProducts).map(([value, label]) => ({
        label,
        value,
      }))
    : [];
  const brandformatted = productData?.form_options?.company_brand_id;
  const formatedProductBrand = brandformatted
  ? Object.entries(brandformatted)
      .filter(([value, label]) => typeof label === "string" && label.trim() !== "") // only valid strings
      .map(([value, label]) => ({
        label,
        value: String(value), 
      }))
  : [];


  // console.log(formatedProductBrand,'00000')
  const unitformatted = productData?.form_options?.uom_id;

  const unitformattedformate = unitformatted
    ? Object.entries(unitformatted).map(([value, label]) => ({
        label,
        value,
      }))
    : [];
  // console.log(unitformattedformate,'00000')
  const textformatted = productData?.form_options?.taxes_id;

  const textformatteddata = textformatted
    ? Object.entries(textformatted).map(([value, label]) => ({
        label,
        value,
      }))
    : [];
  // console.log(unitformattedformate,'00000')

  // const handleImagePick = async () => {
  //   try {
  //     const image = await ImagePicker.openPicker({
  //       width: 300,
  //       height: 400,
  //       cropping: true,
  //     });
  //     console.log('📸 Picked Image:', image);
  //     setGeneralData(prev => ({ ...prev, image }));
  //   } catch (error) {
  //     console.log('❌ Image pick cancelled or error:', error);
  //   }
  // };
  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      });
      console.log('Picked Image:', image);
      setGeneralData(prev => ({
        ...prev,
        image: {
          path: image.path,
          mime: image.mime,
          filename: image.filename || image.path.split('/').pop(),
        },
      }));
    } catch (error) {
      console.log('Image pick cancelled or error:', error);
    }
  };

  const handleChange = (field, value) => {
    setGeneralData(prev => ({...prev, [field]: value}));
  };
  const handleChange1 = (field, value) => {
    setGeneralData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80} // adjust if header exists
      >
        <ScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <View style={styles.container}>
            {/* Image Picker */}
            <View style={styles.imageRow}>
              {generalData?.image && (
                <Image
                  source={{uri: generalData.image.path}}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              )}
              <ButtonCompo
                onPress={handleImagePick}
                title="Pick Image"
                style={{width: '50%'}}
              />
            </View>

            {/* Checkboxes */}
            <View style={styles.checkboxContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  value={generalData?.sale_ok || false}
                  onValueChange={val => handleChange('sale_ok', val)}
                  tintColors={{
                    true: COLORS.primaryColor,
                    false: COLORS.grayText,
                  }}
                />

                <Text>Can be Sold</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  value={generalData?.purchase_ok || false}
                  onValueChange={val => handleChange('purchase_ok', val)}
                  tintColors={{
                    true: COLORS.primaryColor,
                    false: COLORS.grayText,
                  }}
                />
                <Text>Can be Purchased</Text>
              </View>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  value={generalData?.is_published || false}
                  onValueChange={val => handleChange('is_published', val)}
                  tintColors={{
                    true: COLORS.primaryColor,
                    false: COLORS.grayText,
                  }}
                />
                <Text>Publish</Text>
              </View>
            </View>

            {/* Inputs */}
            <Text style={styles.label}>Product Name</Text>
            <TextInputCompo
              value={generalData?.name || ''}
              placeholder="Product Name"
              style={styles.inputBox}
              onChangeText={text => handleChange('name', text)}
            />

            <Text style={styles.label}>Internal Reference</Text>
            <TextInputCompo
              value={generalData?.default_code || ''}
              placeholder="Internal Reference"
              style={styles.inputBox}
              onChangeText={text => handleChange('default_code', text)}
            />

            <Text style={styles.label}>Sales Price</Text>
            <TextInputCompo
              value={generalData?.list_price || ''}
              placeholder="Sales Price"
              style={styles.inputBox}
              onChangeText={text => handleChange('list_price', text)}
            />

            <Text style={styles.label}>Cost</Text>
            <TextInputCompo
              value={generalData?.standard_price || ''}
              placeholder="Cost"
              style={styles.inputBox}
              onChangeText={text => handleChange('standard_price', text)}
            />

            <Text style={styles.label}>Product Description</Text>
            <TextInputCompo
              value={generalData?.l10n_in_hsn_description || ''}
              placeholder="Product Description"
              style={styles.inputBox}
              onChangeText={text =>
                handleChange('l10n_in_hsn_description', text)
              }
            />

            {/* Dropdowns */}
            <Text style={styles.label}>Type</Text>
            <Dropdowncomp
              data={typeOptions}
              value={generalData?.type}
              onChange={item => {
                handleChange('type', item.value);
                dispatch(setSelectedType(item));
              }}
              // search={true}
            />

            <Text style={styles.label}>Product Category</Text>
            <Dropdowncomp
              data={categOptions}
              value={generalData?.categ_id}
              onChange={item => handleChange('categ_id', item.value)}
              search={true}
            />

            <Text style={styles.label}>Brand</Text>
            <Dropdowncomp
              data={formatedProductBrand}
              value={generalData?.company_brand_id?.toString() ?? ''}
              onChange={item =>
                handleChange('company_brand_id', item.value.toString())
              }
              search={true}
              dropdownPosition="top"
            />

            <Text style={styles.label}>Unit of Measure</Text>
            <Dropdowncomp
              data={unitformattedformate}
              value={generalData?.uom_id}
              onChange={item => handleChange('uom_id', item.value)}
              search={true}
              dropdownPosition={'top'}
            />

            <Text style={styles.label}>Customer Taxes</Text>
            {/* <Dropdowncomp
            data={textformatteddata}
            value={generalData?.taxes_id}
            onChange={item => handleChange('taxes_id', item.value)}
          /> */}
            <MultiSelectorDropdownComp
              data={textformatteddata}
              value={generalData?.taxes_id || []}
              onChange={selectedItems =>
                handleChange1('taxes_id', selectedItems)
              }
              placeholder="Select Options"
            />
            <Text style={styles.label}>HSN/SAC Code</Text>
            <TextInputCompo
              value={generalData?.l10n_in_hsn_code || ''}
              placeholder="HSN/SAC Code"
              style={styles.inputBox}
              onChangeText={text => handleChange('l10n_in_hsn_code', text)}
            />
            <View style={{height: 50}} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
    paddingHorizontal: 16,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.grayText,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    padding: 10,
    color: COLORS.blackColor,
    height: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginTop: 10,
  },
});

export default GeneralTab;
