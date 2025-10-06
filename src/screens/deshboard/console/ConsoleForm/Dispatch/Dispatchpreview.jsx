// import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import EditShippingInformation from './EditShippingInformation';
// import TextInputCompo from '../../../../../components/TextInputCompo';
// import { COLORS } from '../../../../../styles/colors';
// import ButtonCompo from '../../../../../components/ButtonCompo';
// import Headercomp from '../../../../../components/Headercomp';
// import makeApiCall from '../../../../../utils/apiHelper';
// import { API_URLS } from '../../../../../utils/apiurls';
// import Loader from '../../../../../components/Loader';

// const Dispatchpreview = ({ navigation, route }) => {
//   const { item } = route?.params;
//   const [previewdata, setpreviewdata] = useState([]);
//   const [editmodalvisible, seteditmodalvisible] = useState(false);
//   const [note, setnote] = useState('');
//   console.log(previewdata?.id, 'Preview Data');
//   const [isLoding, setisLoding] = useState(false);
//   const fetchsignleproductinfo = async (orderId, pickingId) => {
//     try {
//       setisLoding(true);
//       const payload = {
//         formData: true,
//         orderId: orderId,
//         pickingId: pickingId,
//       };
//       const responce = await makeApiCall(
//         API_URLS.getOrderDeliveryData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: payload,
//         },
//       );
//       // console.log(responce,'Responce')
//       if (responce?.result?.message === 'success') {
//         setpreviewdata(responce?.result?.data?.picking);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setisLoding(false);
//     }
//   };
//   useEffect(() => {
//     if ((item?.id, item?.order_id))
//       fetchsignleproductinfo(item?.order_id, item?.id);
//   }, [item?.id, item?.order_id]);

//   const carrierId = previewdata?.additional_info_data?.[0]?.carrier_id ?? null;
//   const carrierOptions =
//     previewdata?.additional_info_data?.[1]?.carrier_id_options ?? {};
//   const matchCarrier =
//     carrierId != null ? carrierOptions[carrierId] ?? null : null;

//   const movetypeid =
//     previewdata?.additional_info_data?.[0]?.move_type?.trim() ?? null;
//   const movetypeOptions =
//     previewdata?.additional_info_data?.[1]?.move_type_options ?? {};
//   const matchTypeOptions =
//     movetypeid != null ? movetypeOptions[movetypeid] ?? null : null;
//   const userId = previewdata?.additional_info_data?.[0]?.user_id ?? null;
//   const userOptions =
//     previewdata?.additional_info_data?.[1]?.user_id_options ?? {};
//   const matchUser = userId != null ? userOptions[userId] ?? null : null;
//   console.log(matchUser, '<<<<<');

//   const PriorityStars = ({ priority }) => (
//     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//       {[1, 2, 3].map(star => (
//         <Text
//           key={star}
//           style={{
//             fontSize: 20,
//             color: priority >= star ? '#FFD700' : '#D3D3D3',
//             marginHorizontal: 2,
//           }}
//         >
//           ★
//         </Text>
//       ))}
//     </View>
//   );

//   const saveDeliverydata = async (pickingId, action) => {
//     try {
//       setisLoding(true);
//       const responce = await makeApiCall(
//         API_URLS.saveOrderDeliveryData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: {
//             pickingId: pickingId,
//             updatedDeliveryData: {
//               action: action,
//             },
//           },
//         },
//       );
//       console.log(responce, 'Toggle');
//       if(responce?.result?.message==='success'){
//         fetchsignleproductinfo(item?.order_id, item?.id);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setisLoding(false);
//     }
//   };
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
//       <Headercomp
//         title={'Oreder Dispatch'}
//         onPress={() => navigation.goBack()}
//         left={true}
//       />
//       <ScrollView>
//         <View style={{ ...styles.buttoncaonatinor }}>
//           {previewdata?.btnStatus?.show_lock && (
//             <ButtonCompo
//               title="Lock"
//               style={{ width: '45%' }}
//               onPress={() =>
//                 saveDeliverydata(previewdata?.id, 'action_toggle_is_locked')
//               }
//             />
//           )}
//           {previewdata?.btnStatus?.show_unlock && (
//             <ButtonCompo
//               title="Unlock"
//               style={{ width: '45%' }}
//               onPress={() =>
//                 saveDeliverydata(previewdata?.id, 'action_toggle_is_locked')
//               }
//             />
//           )}
//           {previewdata?.btnStatus?.show_edit && (
//             <ButtonCompo
//               title="Edit"
//               style={{ width: '45%' }}
//               onPress={() => seteditmodalvisible(true)}
//             />
//           )}
//         </View>
//         <View style={{ ...styles.buttoncaonatinor }}>
//           {previewdata?.btnStatus?.show_cancel && (
//             <ButtonCompo title="Cancel" style={{ width: '45%' }}
//             onPress={() =>saveDeliverydata(previewdata?.id, 'action_cancel')} />
            
//           )}
//           {previewdata?.btnStatus?.show_unreserve && (
//             <ButtonCompo title="Unreserve" style={{ width: '45%' }}
//             onPress={() =>saveDeliverydata(previewdata?.id, 'do_unreserve')} 
//             />
//           )}
//         </View>
//         <View style={{ ...styles.buttoncaonatinor }}>
//           {previewdata?.btnStatus?.show_validate && (
//             <ButtonCompo title="Validate" style={{ width: '45%' }}
//             onPress={() =>
//               saveDeliverydata(previewdata?.id,'button_validate')
             
//             } />
//           )}
//           {previewdata?.btnStatus?.show_check_availability && (
//             <ButtonCompo title="Check Aviliability" style={{ width: '45%' }} 
//             onPress={()=> saveDeliverydata(previewdata?.id,"action_assign")}
//             />
//           )}
//         </View>
//         <View style={{ flex: 1, padding: 15 }}>
//           <Text style={{ ...styles.lebel }}> Delivery Address</Text>
//           <TextInputCompo
//             placeholder="Delivery Address"
//             style={{ ...styles.input }}
//             value={previewdata?.partner_id?.name || ''}
//             editable={false}
//           />
//           <Text style={{ ...styles.lebel }}> Source location_id</Text>
//           <TextInputCompo
//             placeholder="Source location_id"
//             style={{ ...styles.input }}
//             value={previewdata?.location_id?.name || ''}
//             editable={false}
//           />
//           <Text style={{ ...styles.lebel }}> Scheduled Date</Text>
//           <TextInputCompo
//             placeholder="Scheduled Date"
//             style={{ ...styles.input }}
//             value={previewdata?.scheduled_date || ''}
//             editable={false}
//           />
//           <Text style={{ ...styles.lebel }}> Operation Type</Text>
//           <TextInputCompo
//             placeholder="Operation Type"
//             style={{ ...styles.input }}
//             value={
//               (previewdata &&
//                 previewdata.picking_type_id &&
//                 previewdata.picking_type_id.name) ||
//               ''
//             }
//             editable={false}
//           />
//           <Text style={{ ...styles.lebel }}>Origin</Text>
//           <TextInputCompo
//             placeholder="Origin"
//             style={{ ...styles.input }}
//             value={previewdata?.origin}
//             editable={false}
//           />
//           <Text style={{ ...styles.lebel, fontSize: 18 }}>
//             Detailed Operation
//           </Text>
//           {/* {previewdata?.move_ids_without_package&& <View style={{...styles.card}}>
//         <Text style={{...styles.lebel}}>Product:</Text>
//         <Text style={{...styles.lebel}}>From:</Text>
//         <Text style={{...styles.lebel}}>Lot/Serial Number:</Text>
//         <Text style={{...styles.lebel}}>Reserved:</Text>
//         <Text style={{...styles.lebel}}>Done:</Text>
//         </View>} */}
//           {previewdata?.move_ids_without_package &&
//             Object.values(previewdata.move_ids_without_package).length > 0 &&
//             Object.values(previewdata.move_ids_without_package).map(item => (
//               <View key={item.id} style={{ ...styles.card, marginBottom: 12 }}>
//                 <Text style={styles.lebel}>
//                   Product: {item?.product_id?.name || '-'}
//                 </Text>
//                 <Text style={styles.lebel}>
//                   From: {item?.location_id?.name || '-'}
//                 </Text>
//                 <Text style={styles.lebel}>
//                   Lot/Serial Number: {item?.lot_id?.name || '-'}
//                 </Text>
//                 <Text style={styles.lebel}>
//                   Reserved: {item?.product_uom_qty ?? '-'}
//                 </Text>
//                 <Text style={styles.lebel}>
//                   Done: {item?.quantity_done ?? '-'}
//                 </Text>
//               </View>
//             ))}

//           <Text style={{ ...styles.lebel, fontSize: 18 }}>Operation</Text>

//           {previewdata?.move_ids_without_package &&
//             Object.values(previewdata.move_ids_without_package).length > 0 &&
//             Object.values(previewdata.move_ids_without_package).map(item => (
//               <View key={item.id} style={{ ...styles.card, marginBottom: 12 }}>
//                 <Text style={styles.lebel}>
//                   Product: {item?.product_id?.name || '-'}
//                 </Text>
//                 <Text style={styles.lebel}>
//                   Demand: {item?.product_uom_qty ?? '-'}
//                 </Text>
//                 <Text style={styles.lebel}>
//                   Done: {item?.quantity_done ?? '-'}
//                 </Text>
//               </View>
//             ))}

//           <Text style={{ ...styles.lebel, fontSize: 18 }}>addition Info</Text>
//           <View style={{ ...styles.card }}>
//             <Text style={{ ...styles.lebel }}>Carrier:{matchCarrier}</Text>
//             <Text style={{ ...styles.lebel }}>
//               Tracking Reference:{previewdata?.carrier_tracking_ref}
//             </Text>
//             <Text style={{ ...styles.lebel }}>
//               Weight:{previewdata?.shipping_weight || 0}
//             </Text>
//             <Text style={{ ...styles.lebel }}>
//               Weight For Shipping:{previewdata?.shipping_weight || 0}
//             </Text>
//             <Text style={{ ...styles.lebel }}>
//               Shipping Policy:{matchTypeOptions}
//             </Text>
//             <Text style={{ ...styles.lebel }}>Priority:{matchUser}</Text>
//             <PriorityStars priority={Number(previewdata?.priority)} />

//             <Text style={{ ...styles.lebel }}>Responsible:</Text>
//             <Text style={{ ...styles.lebel }}>
//               Procurement Group:{previewdata?.origin}
//             </Text>
//           </View>
//           <Text style={{ ...styles.lebel, fontSize: 18 }}> Note</Text>
//           <View style={{ ...styles.card }}>
//             <TextInputCompo
//               placeholder="Origin"
//               style={{ ...styles.input }}
//               onChangeText={text => setnote(text)}
//               value={note}
//             />
//           </View>
//         </View>
//         <Loader visible={isLoding} />
//         <EditShippingInformation
//           isVisible={editmodalvisible}
//           item={previewdata?.additional_info_data}
//           previewdata={previewdata}
//           onclose={() => seteditmodalvisible(false)}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Dispatchpreview;

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 10,
//     height: 50,
//     color: COLORS.blackColor,
//   },
//   lebel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: COLORS.blackColor,
//   },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     // marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   buttoncaonatinor: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//   },
// });





import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Alert,
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
import MessageShow from '../../../../../constant/MessageShow';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

// const Dispatchpreview = ({ navigation, route }) => {
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
  
//       console.log(response?.result, 'STATE CHANGE RESPONSE');
  
//       if (response?.result?.message === 'success') {
//         fetchSavedDeliveryData();
//       }
  
//       if (response?.result?.statusCode === 201) {
//         setOpenModal(true);
//         setBackOrderdata(response?.result?.data || []);
//       }
//       if(response?.result?.errorMessage){
//               MessageShow.error('Error',response?.result?.errorMessage);
//             }
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
const Dispatchpreview = ({ navigation, route }) => {
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





export default Dispatchpreview


