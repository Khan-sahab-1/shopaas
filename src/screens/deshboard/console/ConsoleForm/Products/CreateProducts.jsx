import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import GeneralTab from './GeneralTab';
import Varient from './Varient';
import Sales from './Sales';
import Ecommerce from './Ecommerce';
import Inventory from './Inventory';

import Headercomp from '../../../../../components/Headercomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import { COLORS } from '../../../../../styles/colors';
import axios from 'axios';
import Loader from '../../../../../components/Loader';
import navigationString from '../../../../../navigation/navigationString';
import MessageShow from '../../../../../constant/MessageShow';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const CreateProducts = ({ navigation }) => {
  const [productData, setProductData] = useState([]);
  const [isLoding, setisLoding] = useState(false);
  // Data states for each tab
  const [generalData, setGeneralData] = useState({});
  const [variantData, setVariantData] = useState({});
  const [salesData, setSalesData] = useState({});
  const [ecommerceData, setEcommerceData] = useState({});
  const [inventoryData, setInventoryData] = useState({});

  // Fetch base product data
  const fetchSavedata = async () => {
    try {
      const response = await makeApiCall(API_URLS.storeProducts, 'POST', {
        jsonrpc: '2.0',
        params: { id: 'New' },
      });
      console.log('Response--', response);
      if (response?.result?.message === 'success') {
        setProductData(response?.result?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSavedata();
  }, []);

  // const handleSave = async () => {
  //   try {
  //     const fullPayload = {
  //       ...generalData,
  //       ...variantData,
  //       ...salesData,
  //       ...ecommerceData,
  //       ...inventoryData,
  //     };
  //     console.log(generalData,'DATA')

  //     const formData = new FormData();

  //     Object.keys(fullPayload).forEach(key => {
  //       const value = fullPayload[key];

  //       if (typeof value === 'object') {
  //         formData.append(key, JSON.stringify(value));
  //         console.log(`${key}:`, JSON.stringify(value));
  //       } else {
  //         formData.append(key, value);
  //         console.log(`${key}:`, value);
  //       }
  //     });

  //     // 👇 Optional: add reference image if needed
  //     // if (referenceImage) {
  //     //   formData.append('reference_image', {
  //     //     uri: referenceImage.uri,
  //     //     type: referenceImage.type,
  //     //     name: referenceImage.name,
  //     //   });
  //     // }
  //     setisLoding(true);
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
  //       MessageShow.success('success', response?.data.message);
  //       setGeneralData({});
  //       setVariantData({});
  //       setSalesData({});
  //       setEcommerceData({});
  //       setInventoryData({});
  //       navigation.goBack();
  //     } else {
  //       Alert.alert('❌ Error', response.data.errorMessage);
  //     }
  //   } catch (error) {
  //     console.error('❌ Save Error:', error.message);
  //   } finally {
  //     setisLoding(false);
  //   }
  // };


  const handleSave = async () => {
    try {
      const fullPayload = {
        ...generalData,
        ...variantData,
        ...salesData,
        ...ecommerceData,
        ...inventoryData,
      };
  
      const formData = new FormData();
  
      Object.keys(fullPayload).forEach(key => {
        const value = fullPayload[key];
  
        // Handle image separately
        if (key === 'image' && value) {
          formData.append("reference_image", {
            uri: value.path,      // local file URI
            type: value.mime,     // mime type like 'image/jpeg'
            name: value.filename, // original filename
          });
          console.log(`Image appended: ${value.filename}`);
        }
        // Handle arrays or objects (JSON fields)
        else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
          console.log(`${key}:`, JSON.stringify(value));
        }
        // Handle primitive fields
        else if (value !== undefined && value !== null) {
          formData.append(key, value);
          console.log(`${key}:`, value);
        }
      });
  
      setisLoding(true);
  
      const response = await axios(API_URLS.saveStoreProducts, {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
  
      console.log('✅ Submit Response:', response.data);
  
      if (response?.data?.message === 'success') {
        MessageShow.success('Success', 'Product saved successfully!');
        // Reset form data
        setGeneralData({});
        setVariantData({});
        setSalesData({});
        setEcommerceData({});
        setInventoryData({});
        navigation.goBack();
      } else {
        Alert.alert('❌ Error', response.data?.errorMessage || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Save Error:', error.response?.data || error.message);
      Alert.alert('❌ Save Error', error.response?.data?.errorMessage || error.message);
    } finally {
      setisLoding(false);
    }
  };
  
  
  
  
  
  
  
  
  return (
    <SafeAreaView style={{flex:1}}>

    <View style={{ flex: 1 }}>
      <Headercomp
        title={'Products'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.whiteColor,
        }}
      >
        <ButtonCompo
          title="Save"
          style={{ width: '40%' }}
          onPress={handleSave}
        />
        <ButtonCompo
          title="Product Attribute"
          style={{ width: '40%' }}
          onPress={() => navigation.navigate(navigationString.PRODUCTATTRIBUTE)}
        />
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
          tabBarStyle: { backgroundColor: COLORS.whiteColor },
          tabBarIndicatorStyle: { backgroundColor: COLORS.blueColor },
          tabBarScrollEnabled: true,
        }}
      >
        <Tab.Screen name="General">
          {props => (
            <GeneralTab
              {...props}
              data={productData}
              generalData={generalData}
              setGeneralData={setGeneralData}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Varient">
          {props => (
            <Varient
              {...props}
              variantData={variantData}
              setVariantData={setVariantData}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Sales">
          {props => (
            <Sales
              {...props}
              salesData={salesData}
              setSalesData={setSalesData}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Ecommerce">
          {props => (
            <Ecommerce
              {...props}
              ecommerceData={ecommerceData}
              setEcommerceData={setEcommerceData}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Inventory">
          {props => (
            <Inventory
              {...props}
              inventoryData={inventoryData}
              setInventoryData={setInventoryData}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <Loader visible={isLoding} />
    </View>
    </SafeAreaView>
  );
};

export default CreateProducts;
