import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GeneralInfo from './GeneralInfo';
import Salesvarients from './Salesvarients';
import Ecommercevarients from './Ecommercevarients';
import { API_URLS } from '../../../../../utils/apiurls';
import axios from 'axios';
import ButtonCompo from '../../../../../components/ButtonCompo';
import Loader from '../../../../../components/Loader';
const Tab = createMaterialTopTabNavigator();
const EditproductVarients = ({ navigation, route }) => {
  console.log(route, 'Route');
  const { item } = route?.params;
  console.log(item, 'ITEMS');
  const [generalData, setGeneralData] = useState({});
  const [salesData, setSalesData] = useState({});
  const [ecommerceData, setEcommerceData] = useState({});
  const [isLoding, setisLoding] = useState(false);

  const handleSave = async () => {
    try {
      const fullPayload = {
        id: item?.id,
        ...generalData,
        ...salesData,
        ...ecommerceData,
      };

      // const formData = new FormData();

      // Object.keys(fullPayload).forEach(key => {
      //   const value = fullPayload[key];

      //   if (typeof value === 'object') {
      //     formData.append(key, JSON.stringify(value));
      //     console.log(`${key}:`, JSON.stringify(value));
      //   } else {
      //     formData.append(key, value);
      //     console.log(`${key}:`, value);
      //   }
      // });
      const formData = new FormData();
  
      Object.keys(fullPayload).forEach(key => {
        const value = fullPayload[key];
  
        if (key === 'image' && value && value.path) {
          formData.append("reference_image", {
            uri: value.path,
            type: value.mime || 'image/jpeg',
            name: value.filename || 'image.jpg',
          });
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      setisLoding(true);
      const response = await axios(API_URLS.saveStoreProductsVarient, {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      console.log('✅ Submit Response:', response.data);
      if (response?.data?.errorMessage) {
        Alert.alert('❌ Error', response.data.errorMessage);
      } else {
        Alert.alert('✅ Success', 'Product saved successfully');
      }
    } catch (error) {
      console.error('❌ Save Error:', error.message);
    } finally {
      setisLoding(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Products'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <ButtonCompo
        title="Save"
        style={{ width: '40%', left: 15 }}
        onPress={handleSave}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
          tabBarStyle: { backgroundColor: COLORS.whiteColor },
          tabBarIndicatorStyle: { backgroundColor: COLORS.blueColor },
          tabBarScrollEnabled: true,
        }}
      >
        <Tab.Screen name="General Info">
          {props => (
            <GeneralInfo
              {...props}
              data={item}
              generalData={generalData}
              setGeneralData={setGeneralData}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Sales">
          {props => (
            <Salesvarients
              data={item}
              {...props}
              salesData={salesData}
              setSalesData={setSalesData}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Ecommerce">
          {props => (
            <Ecommercevarients
              data={item}
              {...props}
              ecommerceData={ecommerceData}
              setEcommerceData={setEcommerceData}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <Loader visible={isLoding} />
    </View>
  );
};

export default EditproductVarients;

const styles = StyleSheet.create({});
