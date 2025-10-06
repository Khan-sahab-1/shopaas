import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { COLORS } from '../../../../../styles/colors';
import ButtonCompo from '../../../../../components/ButtonCompo';
import CheckBox from '@react-native-community/checkbox';
import MultiSelectorDropdownComp from '../../../../../components/Multiselectordropdowncomp';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS, BASE_URL } from '../../../../../utils/apiurls';
import TextInputCompo from '../../../../../components/TextInputCompo';

const GeneralInfo = ({ generalData, setGeneralData, data }) => {
  console.log(data, 'generalInfo');
  const item = data ?? {};
  const hasInitialized = useRef(false);

  const [isloding, setisloding] = useState(false);
  const [productData, setProductData] = useState([]);
  console.log(productData, 'PPPPP');
  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      });
      console.log('📸 Picked Image:', image);
      setGeneralData(prev => ({ ...prev, image }));
    } catch (error) {
      console.log('❌ Image pick cancelled or error:', error);
    }
  };

  const fetchSavedata = async id => {
    try {
      setisloding(true);
      const response = await makeApiCall(
        API_URLS.storeProductVarientTree,
        'POST',
        {
          jsonrpc: '2.0',
          params: { id: id },
        },
      );
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
    if (item?.id) {
      fetchSavedata(item?.id);
    }
  }, [item?.id]);

  const handleChange = (field, value) => {
    setGeneralData(prev => ({ ...prev, [field]: value }));
  };
  const handleChange1 = (field, value) => {
    setGeneralData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
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
  // const initialRndermatched=categOptions.find(productData?.product?.categ_id())
  console.log('Category ID:', productData?.product?.categ_id);
  console.log('Category Options:', categOptions);

  const initialRndermatched = categOptions.find(
    option =>
      option?.value?.toString() === productData?.product?.categ_id?.toString(),
  );
  // console.log(initialRndermatched);
  const brandformatted = productData?.form_options?.company_brand_id;

  const formatedProductBrand = brandformatted
    ? Object.entries(brandformatted).map(([value, label]) => ({
        label,
        value,
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
  // useEffect(() => {
  //   if (
  //     hasInitialized.current ||
  //     !productData?.product ||
  //     categOptions.length === 0 ||
  //     textformatteddata.length === 0
  //   ) {
  //     return;
  //   }

  //   const { categ_id, taxes_id,type,} = productData.product;

  //   if (categ_id) {
  //     const matchedCategory = categOptions.find(
  //       option => option?.value?.toString() === categ_id?.toString()
  //     );

  //     if (matchedCategory) {
  //       setGeneralData(prev => ({
  //         ...prev,
  //         categ_id: matchedCategory.value,
  //       }));
  //     }
  //   }

  //   if (taxes_id) {
  //     const matchedTax = textformatteddata.find(
  //       option => option?.value?.toString() === taxes_id?.toString()
  //     );

  //     if (matchedTax) {
  //       setGeneralData(prev => ({
  //         ...prev,
  //         taxes_id: [matchedTax.value],
  //       }));
  //     }
  //   }
  // if(type){
  //   const matchhedtype=typeOptions.find(option=>option?.value?.toString()===type?.toString())
  //   if(matchhedtype){
  //     setGeneralData(prev=>({
  //       ...prev,
  //       type: matchhedtype.label,

  //     }))
  //   }
  // }
  //   hasInitialized.current = true;
  // }, [productData?.product, categOptions, textformatteddata]);

  // useEffect(() => {
  //   if (
  //     hasInitialized.current ||
  //     !productData?.product ||
  //     categOptions.length === 0 ||
  //     textformatteddata.length === 0
  //   ) {
  //     return;
  //   }

  //   const {
  //     categ_id,
  //     taxes_id,
  //     type,
  //     name,
  //     default_code,
  //     list_price,
  //     standard_price,
  //     l10n_in_hsn_code,
  //     l10n_in_hsn_description
  //   } = productData.product;

  //   // Init category
  //   if (categ_id) {
  //     const matchedCategory = categOptions.find(
  //       option => option?.value?.toString() === categ_id?.toString()
  //     );
  //     if (matchedCategory) {
  //       setGeneralData(prev => ({ ...prev, categ_id: matchedCategory.value }));
  //     }
  //   }

  //   // Init taxes
  //   if (taxes_id) {
  //     const matchedTax = textformatteddata.find(
  //       option => option?.value?.toString() === taxes_id?.toString()
  //     );
  //     if (matchedTax) {
  //       setGeneralData(prev => ({ ...prev, taxes_id: [matchedTax.value] }));
  //     }
  //   }

  //   // Init type
  //   if (type) {
  //     const matchedType = typeOptions.find(
  //       option => option?.value?.toString() === type?.toString()
  //     );
  //     if (matchedType) {
  //       setGeneralData(prev => ({ ...prev, type: matchedType.value }));
  //     }
  //   }

  //   // Init basic fields
  //   setGeneralData(prev => ({
  //     ...prev,
  //     name: name ?? '',
  //     default_code: default_code ?? '',
  //     list_price: list_price?.toString() ?? '',
  //     standard_price: standard_price?.toString() ?? '',
  //     l10n_in_hsn_code: l10n_in_hsn_code ?? '',
  //     l10n_in_hsn_description: l10n_in_hsn_description ?? '',
  //   }));

  //   hasInitialized.current = true;
  // }, [productData?.product, categOptions, textformatteddata]);

  useEffect(() => {
    if (
      hasInitialized.current ||
      !productData?.product ||
      categOptions.length === 0 ||
      textformatteddata.length === 0
    ) {
      return;
    }

    const {
      categ_id,
      taxes_id,
      type,
      name,
      default_code,
      list_price,
      standard_price,
      l10n_in_hsn_code,
      l10n_in_hsn_description,
      sale_ok,
      purchase_ok,
      is_published,
    } = productData.product;

    const initialState = {};

    if (categ_id) {
      const matchedCategory = categOptions.find(
        option => option?.value?.toString() === categ_id.toString(),
      );
      if (matchedCategory) {
        initialState.categ_id = matchedCategory.value;
      }
    }

    if (Array.isArray(taxes_id) && taxes_id.length > 0) {
      const matchedTaxes = taxes_id
        .map(id =>
          textformatteddata.find(opt => opt.value.toString() === id.toString()),
        )
        .filter(Boolean)
        .map(opt => opt.value);

      if (matchedTaxes.length > 0) {
        initialState.taxes_id = matchedTaxes;
      }
    }

    if (type) {
      const matchedType = typeOptions.find(
        option => option?.value?.toString() === type.toString(),
      );
      if (matchedType) {
        initialState.type = matchedType.value;
      }
    }

    initialState.name = name ?? '';
    initialState.default_code = default_code ?? '';
    initialState.list_price = list_price?.toString() ?? '';
    initialState.standard_price = standard_price?.toString() ?? '';
    initialState.l10n_in_hsn_code = l10n_in_hsn_code ?? '';
    initialState.l10n_in_hsn_description = l10n_in_hsn_description ?? '';
    initialState.sale_ok =
      sale_ok === true || sale_ok === 1 || sale_ok === 'true';
    initialState.purchase_ok =
      purchase_ok === true || purchase_ok === 1 || purchase_ok === 'true';
    initialState.is_published =
      is_published === true || is_published === 1 || is_published === 'true';
    initialState.image ?? null,
      setGeneralData(prev => ({
        ...prev,
        ...initialState,
      }));

    hasInitialized.current = true;
  }, [productData?.product, categOptions, textformatteddata]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      <View style={styles.imageRow}>
  {generalData?.image?.path ? (
    <>
      <Image
        source={{ uri: generalData.image.path }}
        style={styles.imagePreview}
        resizeMode="cover"
        
      />
      {/* <Text style={styles.imageLabel}>Updated</Text> */}
    </>
  ) : productData?.product?.image ? (
    <>
      <Image
        source={{ uri: `${BASE_URL}${productData.product.image}` }}
        style={styles.imagePreview}
        resizeMode="cover"
        
      />
      {/* <Text style={styles.imageLabel}>Initially show this</Text> */}
    </>
  ) : (
    <Text style={styles.imageLabel}>No image available</Text>
  )}

  <ButtonCompo
    onPress={handleImagePick}
    title="Pick Image"
    style={{ width: '50%', marginTop: 10 }}
  />
</View>

        <View style={styles.checkboxContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              value={generalData?.sale_ok || false}
              onValueChange={val => handleChange('sale_ok', val)}
              tintColors={{ true: COLORS.primaryColor, false: COLORS.grayText }}
            />

            <Text>Can be Sold</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              value={generalData?.purchase_ok || false}
              onValueChange={val => handleChange('purchase_ok', val)}
              tintColors={{ true: COLORS.primaryColor, false: COLORS.grayText }}
            />
            <Text>Can be Purchased</Text>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              value={generalData?.is_published || false}
              onValueChange={val => handleChange('is_published', val)}
              tintColors={{ true: COLORS.primaryColor, false: COLORS.grayText }}
            />
            <Text>Publish</Text>
          </View>
        </View>
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

        <Text style={styles.label}>HSN/SAC Code</Text>
        <TextInputCompo
          value={generalData?.l10n_in_hsn_code || ''}
          placeholder="HSN/SAC Code"
          style={styles.inputBox}
          onChangeText={text => handleChange('l10n_in_hsn_code', text)}
        />

        <Text style={styles.label}>Product Description</Text>
        <TextInputCompo
          value={generalData?.l10n_in_hsn_description || ''}
          placeholder="Product Description"
          style={styles.inputBox}
          onChangeText={text => handleChange('l10n_in_hsn_description', text)}
        />

        {/* Dropdowns */}
        <Text style={styles.label}>Type</Text>
        {/* <Dropdowncomp
          data={typeOptions}
          value={generalData?.type}
          onChange={item => handleChange('type', item.value)}
          onChangeText={text => handleChange('type', text)}
          
        /> */}
        <TextInputCompo
          value={generalData?.type}
          onChangeText={text => handleChange('type', text)}
          style={styles.inputBox}
          placeholder="Type"
          editable={false}
        />

        <Text style={styles.label}>Product Category</Text>
        <Dropdowncomp
          data={categOptions}
          value={generalData?.categ_id}
          onChange={item => handleChange('categ_id', item.value)}
        />

        {/* <Text style={styles.label}>Brand</Text>
        <Dropdowncomp
          data={formatedProductBrand}
          value={generalData?.company_brand_id}
          onChange={item => handleChange('company_brand_id', item.value)}
        /> */}

        {/* <Text style={styles.label}>Unit of Measure</Text>
        <Dropdowncomp
          data={unitformattedformate}
          value={generalData?.uom_id}
          onChange={item => handleChange('uom_id', item.value)}
        /> */}

        <Text style={styles.label}>Customer Taxes</Text>
        {/* <Dropdowncomp
            data={textformatteddata}
            value={generalData?.taxes_id}
            onChange={item => handleChange('taxes_id', item.value)}
          /> */}
        <MultiSelectorDropdownComp
          data={textformatteddata}
          value={
            Array.isArray(generalData?.taxes_id) ? generalData.taxes_id : []
          }
          onChange={selectedItems => handleChange('taxes_id', selectedItems)}
          placeholder="Select Options"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralInfo;

const styles = StyleSheet.create({
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
