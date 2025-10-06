import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Dropdowncomp from '../Dropdowncomp';
import { COLORS } from '../../styles/colors';
import { BASE_URL } from '../../utils/apiurls';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-crop-picker';
import MultiSelectorDropdownComp from '../Multiselectordropdowncomp';
import MultiSelectorDropdown from '../../screens/deshboard/console/ConsoleForm/productsvarients/Multidropdown';

const GeneralInfo = ({ generalData, setGeneralData, data, setselectedType,onFieldChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatDropdownData = useCallback((optionsObj = {}) => {
    if (!optionsObj || typeof optionsObj !== 'object') return [];
  
    return Object.entries(optionsObj)
      .filter(([key, value]) => {
      
        return typeof value === 'string' && value.length > 0;
      })
      .map(([key, value]) => ({
        label: value,
        value: key, 
      }));
  }, []);

  // const handleFileSelect = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
      
  //   })
  //     .then(image => {
  //       // setGeneralData(prev => ({ ...prev, image: image.path }));
  //       setImageError(false);
  //     })
  //     .catch(err => {
  //       console.log('Image picker cancelled or error:', err);
  //     });
  // };


  const handleFileSelect = async () => {
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

  const getPrefilledDropdown = useCallback((optionsObj = {}, value) => {
    if (!value || !optionsObj || typeof optionsObj !== 'object') return null;
    const stringValue = String(value);
    const label = optionsObj[stringValue];
    return label ? { label, value: stringValue } : null;
  }, []);

  // Initialize state with prefilled data only once
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        if (data?.product) {
          const product = data.product;
          const opts = data.form_options || {};
          const taxesDropdownData = formatDropdownData(opts.taxes_id);
          const typeDropdownData = formatDropdownData(opts.type);
          const categDropdownData = formatDropdownData(opts.categ_id);

          // Prefill taxes
          const initialTaxes = Array.isArray(product.taxes_id)
            ? product.taxes_id
                .map(t => {
                  const val = t?.value ?? t;
                  return taxesDropdownData.find(d => d.value === String(val));
                })
                .filter(Boolean)
            : [];

          const initialData = {
            name: product.name || '',
            default_code: product.default_code || '',
            list_price: product.list_price?.toString() || '',
            standard_price: product.standard_price?.toString() || '',
            description_sale: product.description_sale || '',
            l10n_in_hsn_code: product.l10n_in_hsn_code || '',
            sale_ok: !!product.sale_ok,
            purchase_ok: !!product.purchase_ok,
            is_published: !!product.is_published,
            type: getPrefilledDropdown(opts.type, product.type)?.value || '',           // only value
            categ_id: getPrefilledDropdown(opts.categ_id, product.categ_id)?.value || '',
            company_brand_id: getPrefilledDropdown(opts.company_brand_id, product.company_brand_id)?.value || '',
            uom_id: getPrefilledDropdown(opts.uom_id, product.uom_id)?.value || '',
            taxes_id: initialTaxes,
            image: BASE_URL+product.image || null,
          };
          

          setGeneralData(initialData);
        }
      } catch (error) {
        console.error('Error initializing GeneralInfo data:', error);
        Alert.alert('Error', 'Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.product && Object.keys(generalData).length === 0) {
      initializeData();
    } else {
      setIsLoading(false);
    }
  }, [data, getPrefilledDropdown, setGeneralData, generalData]);

  const handleChange = (field, value) => {
    let finalValue = value;
  
    if (field === 'taxes_id') {
      // Always store as array of values
      if (Array.isArray(value)) {
        finalValue = value.map(v => v.value ?? v); // multi-select case
      } else if (value && typeof value === 'object' && 'value' in value) {
        finalValue = [value.value]; // single object case
      } else {
        finalValue = [value]; // fallback
      }
    } else if (Array.isArray(value)) {
      finalValue = value.map(v => (v?.value !== undefined ? v.value : v));
    } else if (value && typeof value === 'object' && 'value' in value) {
      finalValue = value.value;
    }
  
    setGeneralData(prev => ({
      ...prev,
      [field]: finalValue,
    }));
  
    onFieldChange && onFieldChange(field, finalValue); 
  };
  

  const handleImageError = () => {
    setImageError(true);
    handleChange('image', null);
  };
 
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading product information...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Upload */}
      <View style={styles.imageSection}>
        <TouchableOpacity style={styles.imageContainer} onPress={handleFileSelect} activeOpacity={0.7}>
          {generalData?.image && !imageError ? (
            <Image
            source={{
              uri: generalData?.image
                ? typeof generalData.image === 'string'
                  ? generalData.image.startsWith('http') || generalData.image.startsWith('https')
                    ? generalData.image // backend image URL
                    : `${BASE_URL}${generalData.image}` // backend relative path
                  : generalData.image.path // local picked image
                : null,
            }}
            style={styles.productImage}
            onError={handleImageError}
            resizeMode="cover"
          />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderEmoji}>📷</Text>
              <Text style={styles.placeholderText}>Add Product Image</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.fileUpload}>
          <TouchableOpacity style={styles.fileButton} onPress={handleFileSelect} activeOpacity={0.7}>
            <Text style={styles.fileButtonText}>Choose file</Text>
          </TouchableOpacity>
          <Text style={styles.fileText}>
            {generalData?.image && !imageError ? 'Image loaded' : 'No file chosen'}
          </Text>
        </View>
      </View>

      {/* Checkboxes */}
      <View style={styles.checkboxRow}>
        {['sale_ok', 'purchase_ok', 'is_published'].map((field, idx) => (
          <View style={styles.checkboxItem} key={field}>
            <CheckBox
              value={generalData[field] || false}
              onValueChange={val => handleChange(field, val)}
              tintColors={{ true: COLORS.primary, false: COLORS.grayColor }}
            />
            <Text style={styles.checkboxLabel}>
              {field === 'sale_ok' ? 'Can be Sold' : field === 'purchase_ok' ? 'Can be Purchased' : 'Publish'}
            </Text>
          </View>
        ))}
      </View>

      {/* Name & Reference */}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={generalData?.name || ''}
            onChangeText={val => handleChange('name', val)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Internal Reference</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reference code"
            value={generalData?.default_code || ''}
            onChangeText={val => handleChange('default_code', val)}
          />
        </View>
      </View>

      {/* Prices */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sales Price</Text>
        <TextInput
          style={styles.fullInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={generalData?.list_price || ''}
          onChangeText={val => handleChange('list_price', val)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cost</Text>
        <TextInput
          style={styles.fullInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={generalData?.standard_price || ''}
          onChangeText={val => handleChange('standard_price', val)}
        />
      </View>

      {/* Type & Category */}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type</Text>
          <Dropdowncomp
            data={formatDropdownData(data?.form_options?.type)}
            placeholder="Select type"
            value={generalData?.type}
            onChange={item => {
              handleChange('type', item);
              setselectedType && setselectedType(item.value);
            }}
            style={styles.dropdown}
           
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <Dropdowncomp
            data={formatDropdownData(data?.form_options?.categ_id)}
            placeholder="Select category"
            value={generalData?.categ_id}
            onChange={item => handleChange('categ_id', item.value)}
            style={styles.dropdown}
            search={true}
          />
        </View>
      </View>

      {/* Brand & UOM */}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Brand</Text>
          <Dropdowncomp
            data={formatDropdownData(data?.form_options?.company_brand_id)}
            // data={[{label:'1',value:1}]}
            placeholder="Select brand"
            value={generalData?.company_brand_id}
            onChange={item => handleChange('company_brand_id', item.value)}
            style={styles.dropdown}
            search={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unit of Measure</Text>
          <Dropdowncomp
            data={formatDropdownData(data?.form_options?.uom_id)}
            placeholder="Select UOM"
            value={generalData?.uom_id}
            onChange={item => handleChange('uom_id', item.value)}
            style={styles.dropdown}
            search={true}
          />
        </View>
      </View>

      {/* HSN & Description */}
      <View style={styles.row}>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Product description"
            multiline
            textAlignVertical="top"
            numberOfLines={4}
            value={generalData?.description_sale || ''}
            onChangeText={val => handleChange('description_sale', val)}
          />
        </View>
      </View>

      {/* Taxes */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Customer Taxes</Text>
       
         <MultiSelectorDropdown
          data={formatDropdownData(data?.form_options?.taxes_id)}
          placeholder="Select taxes"
          value={generalData?.taxes_id || []}
          onChange={item => handleChange('taxes_id', item)}
          multiple
          style={styles.fullDropdown}
         />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>HSN/SAC Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter HSN code"
            value={generalData?.l10n_in_hsn_code || ''}
            onChangeText={val => handleChange('l10n_in_hsn_code', val)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

GeneralInfo.propTypes = {
  generalData: PropTypes.object.isRequired,
  setGeneralData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    product: PropTypes.object,
    form_options: PropTypes.object,
  }),
  onImageSelect: PropTypes.func,
  setselectedType: PropTypes.func,
};

GeneralInfo.defaultProps = {
  data: { product: {}, form_options: {} },
  onImageSelect: null,
  setselectedType: () => {},
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COLORS.whiteColor, paddingBottom: 30 },
  centerContent: { justifyContent: 'center', alignItems: 'center', height: 200 },
  loadingText: { marginTop: 12, color: COLORS.grayColor, fontSize: 14 },
  imageSection: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  imageContainer: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  productImage: { width: '100%', height: '100%' },
  placeholderImage: { justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  placeholderEmoji: { fontSize: 24, marginBottom: 4 },
  placeholderText: { fontSize: 12, color: COLORS.grayColor, textAlign: 'center' },
  fileUpload: { justifyContent: 'center', marginLeft: 16 },
  fileButton: { backgroundColor: COLORS.gray2, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6, marginBottom: 8, minWidth: 120 },
  fileButtonText: { fontSize: 14, color: COLORS.whiteColor, textAlign: 'center' },
  fileText: { fontSize: 12, color: COLORS.grayColor, textAlign: 'center' },
  checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap' },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, minWidth: '30%' },
  checkboxLabel: { marginLeft: 8, fontSize: 14, color: COLORS.darkGray },
  row: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  inputContainer: { width: '100%', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: COLORS.darkGray },
  input: { borderWidth: 1, borderColor: COLORS.gray2, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, backgroundColor: COLORS.whiteColor, width: '100%' },
  textArea: { height: 100, textAlignVertical: 'top' },
  fullInput: { borderWidth: 1, borderColor: COLORS.gray2, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, backgroundColor: COLORS.whiteColor, width: '100%' },
  dropdown: { width: '100%' },
  fullDropdown: { width: '100%' },
});

export default GeneralInfo;