// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Touchable,
//   TouchableOpacity,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// import { COLORS } from '../../../../../styles/colors';
// import Headercomp from '../../../../../components/Headercomp';
// import ButtonCompo from '../../../../../components/ButtonCompo';
// import Loader from '../../../../../components/Loader';
// import makeApiCall from '../../../../../utils/apiHelper';
// import { API_URLS } from '../../../../../utils/apiurls';
// import OperationComponent from '../Pick/OperationComponent';
// import DetailedOperation from '../Pick/DetailedOperation';
// import AdditionInfo from '../Pick/AdditionInfo';
// import Note from '../Pick/Note';
// import BackorderModal from '../Pick/BackorderModal';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const Tab = createMaterialTopTabNavigator();

// const Packpreview = ({ navigation, route }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isEditable, setIsEditable] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [backOrderdata, setBackOrderdata] = useState([]);

//   const [trackChanges, setTrackChanges] = useState({
//     move_line_ids_without_package: {},
//     move_ids_without_package: {},
//     additionInfo: {},
//     note: {},
//   });
//   // console.log(trackChanges,'TRACKCHANGE0')
//   // console.log(data,'DATAA')
//   const { item } = route.params;

//   const fetchSavedDeliveryData = async () => {
//     try {
//       setLoading(true);
//       const response = await makeApiCall(
//         API_URLS.getOrderDeliveryData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: {
//             formData: true,
//             pickingId: String(item.id),
//             orderId: String(item.order_id),
//           },
//         },
//       );
//       // console.log(response,'FETCH RESPONCE')
//       if (response?.result?.message === 'success') {
//         setData(response?.result?.data?.picking);
//       }
//     } catch (error) {
//       console.log('❌ Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const preparePayload = trackChanges => {
//     const payload = {};

//     Object.keys(trackChanges).forEach(key => {
//       const value = trackChanges[key];

//       if (value && Object.keys(value).length > 0) {
//         if (key === 'additionInfo' || 'note') {
//           // Flatten additionInfo
//           Object.keys(value).forEach(field => {
//             const fieldVal = value[field];
//             if (
//               fieldVal &&
//               typeof fieldVal === 'object' &&
//               'value' in fieldVal
//             ) {
//               payload[field] = fieldVal.value;
//             } else {
//               payload[field] = fieldVal;
//             }
//           });
//         } else {
//           // send other objects as-is if not empty
//           payload[key] = value;
//         }
//       }
//     });

//     return payload;
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       const updatedDeliveryData = preparePayload(trackChanges);

//       console.log('Final payload:', updatedDeliveryData);

//       const response = await makeApiCall(
//         API_URLS.saveOrderDeliveryData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: {
//             pickingId: String(item.id),
//             updatedDeliveryData,
//           },
//         },
//       );
//       console.log(response, 'SUBMIT RESPONCE');
//       if (response?.result?.message === 'success') {
//         fetchSavedDeliveryData();
//         setTrackChanges({
//           move_line_ids_without_package: {},
//           move_ids_without_package: {},
//           additionInfo: {},
//           note: {},
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleStateChange = async action => {
//   //   try {
//   //     setLoading(true);
//   //     const response = await makeApiCall(
//   //       API_URLS.saveOrderDeliveryData,
//   //       'POST',
//   //       {
//   //         jsonrpc: '2.0',
//   //         params: {
//   //           pickingId: String(item.id),
//   //           updatedDeliveryData: { action },
//   //         },
//   //       },
//   //     );
//   //     console.log(response, 'STATE CHANGE RESPONCE');
//   //     if (response?.result?.message === 'success') {
//   //       fetchSavedDeliveryData();
//   //     }
//   //     if (response?.result?.statusCode === 201) {
//   //       setOpenModal(true);
//   //       setBackOrderdata(response?.result?.data || []);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const handleStateChange = async (action, usePopup = false) => {
//     try {
//       setLoading(true);
  
//       const key = usePopup ? 'popupAction' : 'action'; 
  
//       const response = await makeApiCall(
//         API_URLS.saveOrderDeliveryData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: {
//             pickingId: String(item.id),
//             updatedDeliveryData: { [key]: action }, 
//           },
//         },
//       );
  
//       console.log(response, 'STATE CHANGE RESPONSE');
  
//       if (response?.result?.message === 'success') {
//         fetchSavedDeliveryData();
//       }
  
//       if (response?.result?.statusCode === 201) {
//         setOpenModal(true);
//         setBackOrderdata(response?.result?.data || []);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchSavedDeliveryData();
//   }, []);

//   if (!data) return <Loader visible={true} />;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
//       <Headercomp
//         title={'Preview Pick'}
//         left={true}
//         onPress={() => navigation.goBack()}
//       />

//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 20 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header Info */}
//         <View style={styles.headerRow}>
//           <Text style={styles.title}>{data?.name}</Text>
//           <Text style={styles.title}>{data?.state_picking}</Text>
//         </View>

//         {/* Lock / Unlock Buttons */}
//         <View
//           style={{
//             flexDirection: 'row',
//             paddingHorizontal: 20,
//             flexWrap: 'wrap',
//             gap: 10,
//           }}
//         >
//           {data?.btnStatus?.show_unlock && (
//             <TouchableOpacity
//               style={{ ...styles.button }}
//               onPress={() => handleStateChange('action_toggle_is_locked')}
//             >
//               <Text style={{ ...styles.buttonLabel }}>Unlock</Text>
//             </TouchableOpacity>
//           )}
//           {data?.btnStatus?.show_lock && (
//             <TouchableOpacity
//               style={{ ...styles.button }}
//               onPress={() => handleStateChange('action_toggle_is_locked')}
//             >
//               <Text style={{ ...styles.buttonLabel }}>Lock</Text>
//             </TouchableOpacity>
//           )}
//           {data?.btnStatus?.show_done && (
//             <TouchableOpacity
//               style={{ ...styles.button }}
//               onPress={() => handleStateChange('dispatch_to_delivered')}
//             >
//               <Text style={{ ...styles.buttonLabel }}>Done</Text>
//             </TouchableOpacity>
//           )}
//           {data?.btnStatus?.show_check_availability && (
//             <TouchableOpacity
//               style={{ ...styles.button }}
//               onPress={() => handleStateChange('action_assign')}
//             >
//               <Text style={{ ...styles.buttonLabel }}>Aviliability</Text>
//             </TouchableOpacity>
//           )}
//           {data?.btnStatus?.show_cancel && (
//             <TouchableOpacity
//               style={{ ...styles.button }}
//               onPress={() => handleStateChange('action_cancel')}
//             >
//               <Text style={{ ...styles.buttonLabel }}>Cancel</Text>
//             </TouchableOpacity>
//           )}
//           {/* {data?.btnStatus?.show_edit && (
//           <TouchableOpacity style={{...styles.button}}
//           //  onPress={handleSubmit}
//            onPress={setIsEditable(true)}
//            >
//             <Text style={{...styles.buttonLabel}}>Edit</Text>
//           </TouchableOpacity>
//           )} */}
//           {data?.btnStatus?.show_edit && (
//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => {
//                 if (isEditable) {
//                   handleSubmit();
//                   setIsEditable(false);
//                 } else {
//                   setIsEditable(true);
//                 }
//               }}
//             >
//               <Text style={styles.buttonLabel}>
//                 {isEditable ? 'Save' : 'Edit'}
//               </Text>
//             </TouchableOpacity>
//           )}

//           {data?.btnStatus?.show_unreserve && (
//             <TouchableOpacity
//               style={{ ...styles.button }}
//               onPress={() => handleStateChange('do_unreserve')}
//             >
//               <Text style={{ ...styles.buttonLabel }}>Unreserve</Text>
//             </TouchableOpacity>
//           )}
//           {data?.btnStatus?.show_validate && (
//             <TouchableOpacity
//               style={{ ...styles.button }}
//               onPress={() => handleStateChange('button_validate')}
//             >
//               <Text style={{ ...styles.buttonLabel }}>Validate</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Header Card */}
//         <View style={styles.card}>
//           <Text style={styles.title}>{data?.name}</Text>
//           <Text style={styles.label}>
//             Status: <Text style={styles.value}>{data?.state}</Text>
//           </Text>
//           <Text style={styles.label}>
//             Scheduled: <Text style={styles.value}>{data?.scheduled_date}</Text>
//           </Text>
//           <Text style={styles.label}>
//             Delivery Address:{' '}
//             <Text style={styles.value}>{data?.shipping_id?.name}</Text>
//           </Text>
//           <Text style={styles.label}>
//             Origin: <Text style={styles.value}>{data?.origin}</Text>
//           </Text>
//           <Text style={styles.label}>
//             Operation Type:{' '}
//             <Text style={styles.value}>{data?.picking_type_id?.name}</Text>
//           </Text>
//           <Text style={styles.label}>
//             Source location_id:{' '}
//             <Text style={styles.value}>{data?.location_id?.name}</Text>
//           </Text>
//         </View>

//         {/* Top Tabs */}
//         <View style={{ flex: 1, minHeight: 500 }}>
//           <Tab.Navigator
//             screenOptions={{
//               tabBarActiveTintColor: COLORS.primary,
//               tabBarInactiveTintColor: COLORS.grayText,
//               tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
//               tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
//               swipeEnabled: false,
//             }}
//           >
//             <Tab.Screen name="Detailed Operation">
//               {props => (
//                 <DetailedOperation
//                   {...props}
//                   data={data}
//                   trackChanges={trackChanges}
//                   setTrackChanges={setTrackChanges}
//                   isEditable={isEditable}
//                 />
//               )}
//             </Tab.Screen>
//             <Tab.Screen name="Operation">
//               {props => (
//                 <OperationComponent
//                   {...props}
//                   data={data}
//                   trackChanges={trackChanges}
//                   setTrackChanges={setTrackChanges}
//                   isEditable={isEditable}
//                 />
//               )}
//             </Tab.Screen>

//             <Tab.Screen name="Addition Info">
//               {props => (
//                 <AdditionInfo
//                   {...props}
//                   data={data}
//                   trackChanges={trackChanges}
//                   setTrackChanges={setTrackChanges}
//                   isEditable={isEditable}
//                 />
//               )}
//             </Tab.Screen>
//             <Tab.Screen name="Note">
//               {props => (
//                 <Note
//                   {...props}
//                   data={data}
//                   trackChanges={trackChanges}
//                   setTrackChanges={setTrackChanges}
//                   isEditable={isEditable}
//                 />
//               )}
//             </Tab.Screen>
//           </Tab.Navigator>
//         </View>
//       </ScrollView>

//       <Loader visible={loading} />

//       <BackorderModal
//         isvisible={openModal}
//         onclose={() => setOpenModal(false)}
//         data={backOrderdata}
//         onButtonPress={action => {
//           if (action === 'process') {
//             // Handle create backorder
//              handleStateChange(action, true); 
//             // console.log('Creating backorder...');
//           } else if (action === 'process_cancel_backorder') {
//             // Handle no backorder
//             handleStateChange(action, true);
//           } else if (action === 'apply') {
//             handleStateChange(action, true);
//           }
//         }}
//       />
//     </SafeAreaView>
//   );
// };



// const styles = StyleSheet.create({
//   headerRow: {
//     paddingHorizontal: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.darkText,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.grayText,
//     marginTop: 4,
//   },
//   value: {
//     fontWeight: '400',
//     color: COLORS.darkText,
//   },
//   button: {
//     padding: 10,
//     backgroundColor: COLORS.blueColor,
//     borderRadius: 8,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 10,
//   },
//   buttonLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.whiteColor,
//     // padding:5
//   },
// });


// export default Packpreview



import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import Loader from '../../../../../components/Loader';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import OperationComponent from '../Pick/OperationComponent';
import DetailedOperation from '../Pick/DetailedOperation';
import AdditionInfo from '../Pick/AdditionInfo';
import Note from '../Pick/Note';
import BackorderModal from '../Pick/BackorderModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const Packpreview = ({ navigation, route }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [backOrderdata, setBackOrderdata] = useState([]);

  const [trackChanges, setTrackChanges] = useState({
    move_line_ids_without_package: {},
    move_ids_without_package: {},
    additionInfo: {},
    note: {},
  });
  // console.log(trackChanges,'TRACKCHANGE0')
  // console.log(data,'DATAA')
  const { item } = route.params;

  const fetchSavedDeliveryData = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(
        API_URLS.getOrderDeliveryData,
        'POST',
        {
          jsonrpc: '2.0',
          params: {
            formData: true,
            pickingId: String(item.id),
            orderId: String(item.order_id),
          },
        },
      );
      console.log(response,'FETCH RESPONCE')
      if (response?.result?.message === 'success') {
        setData(response?.result?.data?.picking);
      }
    } catch (error) {
      console.log('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const preparePayload = (trackChanges) => {
    const payload = {};
  
    Object.keys(trackChanges).forEach((key) => {
      const value = trackChanges[key];
  
      if (value && Object.keys(value).length > 0) {
        if (key === 'additionInfo' || key === 'note') {
          // Flatten additionInfo and note
          Object.keys(value).forEach((field) => {
            const fieldVal = value[field];
            if (fieldVal && typeof fieldVal === 'object' && 'value' in fieldVal) {
              payload[field] = fieldVal.value;
            } else {
              payload[field] = fieldVal;
            }
          });
        } else {
          // keep nested object structure
          payload[key] = value;
        }
      }
    });
  
    return payload;
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const updatedDeliveryData = preparePayload(trackChanges);

      console.log('Final payload:', updatedDeliveryData);

      const response = await makeApiCall(
        API_URLS.saveOrderDeliveryData,
        'POST',
        {
          jsonrpc: '2.0',
          params: {
            pickingId: String(item.id),
            updatedDeliveryData,
          },
        },
      );
      console.log(response, 'SUBMIT RESPONCE');
      if (response?.result?.message === 'success') {
        fetchSavedDeliveryData();
        setTrackChanges({
          move_line_ids_without_package: {},
          move_ids_without_package: {},
          additionInfo: {},
          note: {},
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
 const handleStateChange = async (action, usePopup = false) => {
    try {
      setLoading(true);
  
      const key = usePopup ? 'popupAction' : 'action'; 
      const params= {
        pickingId: String(item.id),
        updatedDeliveryData: { [key]: action }, 
      }
  console.log(params,'PARAMS')
      const response = await makeApiCall(
        API_URLS.saveOrderDeliveryData,
        'POST',
        {
          jsonrpc: '2.0',
          params: params,
        },
      );
  
      console.log(response, 'STATE CHANGE RESPONSE');
      
  
      if (response?.result?.message === 'success') {
        fetchSavedDeliveryData();
      } 
      
  
      if (response?.result?.statusCode === 201) {
        setOpenModal(true);
        setBackOrderdata(response?.result?.data || []);
      }
      if(response?.result?.errorMessage){
        Alert.alert('Error','Error Occurred While Changing The State');
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSavedDeliveryData();
  }, []);

  if (!data) return <Loader visible={true} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Preview Pick'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Info */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{data?.name}</Text>
          <Text style={styles.title}>{data?.state_picking}</Text>
        </View>

        {/* Lock / Unlock Buttons */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {data?.btnStatus?.show_unlock && (
            <TouchableOpacity
              style={{ ...styles.button }}
              onPress={() => handleStateChange('action_toggle_is_locked')}
            >
              <Text style={{ ...styles.buttonLabel }}>Unlock</Text>
            </TouchableOpacity>
          )}
          {data?.btnStatus?.show_lock && (
            <TouchableOpacity
              style={{ ...styles.button }}
              onPress={() => handleStateChange('action_toggle_is_locked')}
            >
              <Text style={{ ...styles.buttonLabel }}>Lock</Text>
            </TouchableOpacity>
          )}
          {data?.btnStatus?.show_done && (
            <TouchableOpacity
              style={{ ...styles.button }}
              onPress={() => handleStateChange('dispatch_to_delivered')}
            >
              <Text style={{ ...styles.buttonLabel }}>Done</Text>
            </TouchableOpacity>
          )}
          {data?.btnStatus?.show_check_availability && (
            <TouchableOpacity
              style={{ ...styles.button }}
              onPress={() => handleStateChange('action_assign')}
            >
              <Text style={{ ...styles.buttonLabel }}>Aviliability</Text>
            </TouchableOpacity>
          )}
          {data?.btnStatus?.show_cancel && (
            <TouchableOpacity
              style={{ ...styles.button }}
              onPress={() => handleStateChange('action_cancel')}
            >
              <Text style={{ ...styles.buttonLabel }}>Cancel</Text>
            </TouchableOpacity>
          )}
          {/* {data?.btnStatus?.show_edit && (
          <TouchableOpacity style={{...styles.button}}
          //  onPress={handleSubmit}
           onPress={setIsEditable(true)}
           >
            <Text style={{...styles.buttonLabel}}>Edit</Text>
          </TouchableOpacity>
          )} */}
          {data?.btnStatus?.show_edit && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (isEditable) {
                  handleSubmit();
                  setIsEditable(false);
                } else {
                  setIsEditable(true);
                }
              }}
            >
              <Text style={styles.buttonLabel}>
                {isEditable ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          )}

          {data?.btnStatus?.show_unreserve && (
            <TouchableOpacity
              style={{ ...styles.button }}
              onPress={() => handleStateChange('do_unreserve')}
            >
              <Text style={{ ...styles.buttonLabel }}>Unreserve</Text>
            </TouchableOpacity>
          )}
          {data?.btnStatus?.show_validate && (
            <TouchableOpacity
              style={{ ...styles.button }}
              onPress={() => handleStateChange('button_validate')}
            >
              <Text style={{ ...styles.buttonLabel }}>Validate</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Header Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{data?.name}</Text>
          <Text style={styles.label}>
            Status: <Text style={styles.value}>{data?.state}</Text>
          </Text>
          <Text style={styles.label}>
            Scheduled: <Text style={styles.value}>{data?.scheduled_date}</Text>
          </Text>
          <Text style={styles.label}>
            Delivery Address:{' '}
            <Text style={styles.value}>{data?.shipping_id?.name}</Text>
          </Text>
          <Text style={styles.label}>
            Origin: <Text style={styles.value}>{data?.origin}</Text>
          </Text>
          <Text style={styles.label}>
            Operation Type:{' '}
            <Text style={styles.value}>{data?.picking_type_id?.name}</Text>
          </Text>
          <Text style={styles.label}>
            Source location_id:{' '}
            <Text style={styles.value}>{data?.location_id?.name}</Text>
          </Text>
        </View>

        {/* Top Tabs */}
        <View style={{ flex: 1, minHeight: 500 }}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: COLORS.primary,
              tabBarInactiveTintColor: COLORS.grayText,
              tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
              tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
              swipeEnabled: false,
            }}
          >
            <Tab.Screen name="Detailed Operation">
              {props => (
                <DetailedOperation
                  {...props}
                  data={data}
                  trackChanges={trackChanges}
                  setTrackChanges={setTrackChanges}
                  isEditable={isEditable}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Operation">
              {props => (
                <OperationComponent
                  {...props}
                  data={data}
                  trackChanges={trackChanges}
                  setTrackChanges={setTrackChanges}
                  isEditable={isEditable}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Addition Info">
              {props => (
                <AdditionInfo
                  {...props}
                  data={data}
                  trackChanges={trackChanges}
                  setTrackChanges={setTrackChanges}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Note">
              {props => (
                <Note
                  {...props}
                  data={data}
                  trackChanges={trackChanges}
                  setTrackChanges={setTrackChanges}
                  isEditable={isEditable}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </ScrollView>

      <Loader visible={loading} />

      <BackorderModal
        isvisible={openModal}
        onclose={() => setOpenModal(false)}
        data={backOrderdata}
        onButtonPress={action => {
          if (action === 'process') {
            // Handle create backorder
             handleStateChange(action, true); 
            // console.log('Creating backorder...');
          } 
          else if (action === 'apply') {
            handleStateChange(action, true);
          }
          else if (action === 'process_cancel_backorder') {
            // Handle no backorder
            console.log('No backorder created...');
          }
        }}
      />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grayText,
    marginTop: 4,
  },
  value: {
    fontWeight: '400',
    color: COLORS.darkText,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.blueColor,
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.whiteColor,
    // padding:5
  },
});


export default Packpreview

