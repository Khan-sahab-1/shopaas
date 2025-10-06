import React, { useEffect, useState } from 'react';
import {  ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import DetailsOperations from './Ordercomponent/DetailsOperations';
import Operations from './Ordercomponent/Operations';
import Note from './Ordercomponent/Note';
import AdditionInfo from './Ordercomponent/AdditionInfo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import ButtonCompo from '../../../../../components/ButtonCompo';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();
const { height: SCREEN_HEIGHT } = Dimensions.get('window');


const PreviewQtyUpdate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedPicking, orderData } = route.params || {};
  const [tableInfo,setTableinfo]=useState({})
  const [isLoding,setIsloding]=useState(false)

  const [setWithoUtPackage, setWithoutpackage] = useState({});
  const formate = Object.values(setWithoUtPackage?.move_line_ids_without_package || {});
  const formate1 = Object.values(setWithoUtPackage?.move_ids_without_package || {});
  const formate2 = Object.values(setWithoUtPackage?.additional_info_data|| {});
  console.log(tableInfo,'TableInfo')

  const fetchProductDetailsOperations = async (orderId, pickingId) => {
    try {
      const params = {
        orderId: String(orderId),
        formData: true,
        pickingId: String(pickingId)
      };
      const response = await makeApiCall(API_URLS.getOrderDeliveryData, 'POST', {
        jsonrpc: '2.0',
        params: params
      });
      setWithoutpackage(response?.result?.data?.picking || {});
    } catch (error) {
      console.log(error);
    }
  };
console.log(setWithoUtPackage)

const handleSubmit = async () => {
  try {
    setIsloding(true);

    const updatedLines = {};
    const items = Array.isArray(tableInfo) ? tableInfo : [tableInfo];

    items.forEach(item => {
      if (item.id && item.done !== undefined) {
        updatedLines[item.id] = { qty_done: parseFloat(item.done) || 0 };
      }
    });

    const payLoad = {
      pickingId: setWithoUtPackage.id,
      updatedDeliveryData: {
        move_line_ids_without_package: updatedLines, // <- wrap here
      },
    };

    console.log(payLoad, 'PAYLOAD');

    const responce = await makeApiCall(
      API_URLS.saveOrderDeliveryData,
      'POST',
      {
        jsonrpc: '2.0',
        params: payLoad,
      }
    );

    console.log('Responce', responce);
    if(responce?.result?.message==='success'){
      fetchProductDetailsOperations(orderData, selectedPicking?.id);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setIsloding(false);
  }
};


const handleStatechange=async(action)=>{
  try {
    setIsloding(true)
    const payLoad = {
      pickingId: setWithoUtPackage.id,
      updatedDeliveryData: {
        action:action, 
      },
    };

    const responce = await makeApiCall(
      API_URLS.saveOrderDeliveryData,
      'POST',
      {
        jsonrpc: '2.0',
        params: payLoad,
      }
    );
    console.log('RESPONCE',responce)
    if(responce?.result?.message==='success'){
      fetchProductDetailsOperations(orderData, selectedPicking?.id);
    }
  } catch (error) {
    console.log(error)
  }
  finally{
    setIsloding(false)
  }
}


  useEffect(() => {
    if (selectedPicking && orderData) {
      fetchProductDetailsOperations(orderData, selectedPicking?.id);
    }
  }, [selectedPicking, orderData]);
  const actions = [
    { key: 'show_edit', label: 'Edit' },
    { key: 'show_check_availability', label: 'Check Availability' },
    { key: 'show_validate', label: 'Validate' },
    { key: 'show_unreserve', label: 'Unreserve' },
    { key: 'show_unlock', label: 'Unlock' },
    // { key: 'show_scrap', label: 'Scrap' },
    { key: 'show_cancel', label: 'Cancel' },
    { key: 'show_done', label: 'Done' },
    { key: 'show_lock', label: 'Lock' },
  ];

  // Filter only true actions
  const visibleActions = actions.filter(
    action => setWithoUtPackage?.btnStatus?.[action.key]
  );
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <Headercomp title={'Delivery'} left={true} onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.containerButton}>
      {/* {visibleActions.map((action, index) => (
        <ButtonCompo
          key={index}
          title={action.label}
          style={styles.button}
          // onPress={handleSubmit()}
        />
      ))} */}
      {setWithoUtPackage?.btnStatus?.show_edit&&<ButtonCompo  
      style={styles.button}
      title='Edit'
      onPress={handleSubmit}
      // onPress={handleSubmit(setWithoUtPackage?.id,{setWithoUtPackage:{tableInfo?.id:{qty_done:tableInfo?.done
      // }}})}
      />}
      {setWithoUtPackage?.btnStatus?.show_validate&&<ButtonCompo  style={styles.button} 
      onPress={()=>handleStatechange("button_validate")}
      title='Validate'/>}
      {setWithoUtPackage?.btnStatus?.how_check_availability&&<ButtonCompo  
      style={styles.button} title='Aviliability'
      onPress={()=> handleStatechange("action_assign")}/>}
      {setWithoUtPackage?.btnStatus?.show_unreserve
&&<ButtonCompo  style={styles.button} title='Unreserved'
onPress={() =>handleStatechange('do_unreserve')} />}
      {setWithoUtPackage?.btnStatus?.show_unlock
&&<ButtonCompo  style={styles.button} title='Unlock'
onPress={()=>handleStatechange("action_toggle_is_locked")}/>}
      {/* {setWithoUtPackage?.btnStatus?.show_lock
&&<ButtonCompo  style={styles.button} title='Lock'
onPress={handleStatechange("action_toggle_is_locked")}/>} */}
      {setWithoUtPackage?.btnStatus?.show_cancel
&&<ButtonCompo  style={styles.button} title='Cancel'
onPress={()=>handleStatechange('action_cancel')}
/>}
      {setWithoUtPackage?.btnStatus?.show_done

&&<ButtonCompo  style={styles.button} title='Done'
onPress={()=>handleStatechange('dispatch_to_delivered')}/>}
    
      {/* <ButtonCompo  style={styles.button}/> */}
    </View>
  
        <View style={styles.container}>

          {/* Delivery Address */}
          <Text style={styles.label}>Delivery Address</Text>
          <TextInputCompo
            style={styles.inputBox}
            value={selectedPicking?.shipping_id?.street_1 || ''}
            editable={false}
            placeholder="Delivery Address"
          />

          {/* Operation Type & Source Location */}
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Operation Type</Text>
              <TextInputCompo
                style={styles.inputBox}
                value={selectedPicking?.picking_type_id?.name || ''}
                editable={false}
                placeholder="Operation Type"
              />
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Source Location</Text>
              <TextInputCompo
                style={styles.inputBox}
                value={selectedPicking?.location_id?.name || ''}
                editable={false}
                placeholder="Source Location"
              />
            </View>
          </View>

          {/* Origin & Scheduled Date */}
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Origin</Text>
              <TextInputCompo
                style={styles.inputBox}
                value={selectedPicking?.origin || ''}
                editable={false}
                placeholder="Origin"
              />
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Scheduled Date</Text>
              <TextInputCompo
                style={styles.inputBox}
                value={selectedPicking?.scheduled_date || ''}
                editable={false}
                placeholder="Scheduled Date"
              />
            </View>
          </View>

          {/* Partner Name & Contact */}
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Partner Name</Text>
              <TextInputCompo
                style={styles.inputBox}
                value={selectedPicking?.partner_id?.name || ''}
                editable={false}
                placeholder="Partner Name"
              />
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInputCompo
                style={styles.inputBox}
                value={selectedPicking?.shipping_id?.phone || ''}
                editable={false}
                placeholder="Contact Number"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: COLORS.blackColor,
            tabBarIndicatorStyle: { backgroundColor: COLORS.blueColor },
            tabBarStyle: { backgroundColor: COLORS.whiteColor },
            tabBarLabelStyle: { fontWeight: '600' },
          }}
        >
          <Tab.Screen name="DetailedOperation" options={{ title: 'DETAILED OPERATION' }}>
            {() => <DetailsOperations FormatedData={formate} 
            onDataChange={setTableinfo}/>}
          </Tab.Screen>

          <Tab.Screen name="Operation" options={{ title: 'OPERATION' }}>
            {() => <Operations FormatedData={formate1} ButtonStatus={setWithoUtPackage?.btnStatus} 
            setTableinfo={setTableinfo} 
            
            />}
          </Tab.Screen>

          <Tab.Screen name="AdditionalInfo" options={{ title: 'ADDITION INFO' }}>
            {() => <AdditionInfo FormatedData={formate2} />}
          </Tab.Screen>

          <Tab.Screen name="Note" component={Note} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default PreviewQtyUpdate;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.whiteColor },
  scrollContent: { paddingBottom: 20 },
  container: { padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  halfInputContainer: { flex: 1, marginRight: 10 },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.blackColor, marginBottom: 5 },
  inputBox: { borderWidth: 1, borderRadius: 10, padding: 10, backgroundColor: COLORS.whiteColor },
  tabContainer: { flex: 1, minHeight: SCREEN_HEIGHT * 0.5 },
  containerButton: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'flex-start',
    gap: 8, 
    paddingHorizontal:10
  },
  button: {
    flexBasis: '30%', 
    height: 45,
  },
});
