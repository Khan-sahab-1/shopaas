// import {
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { COLORS } from '../../../../../styles/colors';
// import Headercomp from '../../../../../components/Headercomp';
// import makeApiCall from '../../../../../utils/apiHelper';
// import { API_URLS } from '../../../../../utils/apiurls';
// import Loader from '../../../../../components/Loader';
// import ButtonCompo from '../../../../../components/ButtonCompo';
// import Commoncard from '../../../../../components/Commoncard';
// import TextInputCompo from '../../../../../components/TextInputCompo';
// import moment from 'moment';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import PickingsList from './PickingsList';

// const Delivery = ({ navigation, route }) => {
//   const [loding, setloding] = useState(false);
//   const [invoicedata, setInvoicedata] = useState({});
//   const [selectedTab, setSelectedTab] = useState('LINE');
//   const [note, setnote] = useState('');
//   const [locked, setiLoked] = useState(false);
//   const [editShow, seteditshow] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [deliveredData, setdeliveredData] = useState([]);
// const [qtyData,setQtyData]=useState([])
//   const move_line_ids_without_package = deliveredData.reduce((acc, line) => {
//     acc[line.id] = { qty_done: line.qty_done };
//     return acc;
//   }, {});

//   // console.log({ move_line_ids_without_package });

//   // const [selectedDate, setSelectedDate] = useState(new Date());

//   const { orderData } = route.params;
//   console.log(orderData,'ORDRDATA')
//   const { delivery_count } = route.params;
//   const firstOrderLine = Object.values(delivery_count)[0];

//   // ✅ Get qty_delivered
//   const qtyDelivered = firstOrderLine?.qty_delivered;

//   console.log('Qty Delivered:', qtyDelivered);

//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = date => {
//     const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
//     console.log('A date has been picked:', formattedDate);
//     setSelectedDate(formattedDate);
//     hideDatePicker();
//   };
//   //   console.log(invoicedata, 'Orderdata');
//   const fetchorderdata = async (orderId, pickingId, formData) => {
//     try {
//       setloding(true);
//       const responce = await makeApiCall(
//         API_URLS.getOrderDeliveryData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: { orderId, pickingId, formData },
//         },
//       );
//       console.log('Delivered data', responce);
//       if (responce?.result?.message === 'success') {
//         setInvoicedata(responce?.result?.data?.picking);
//         setQtyData(responce?.result?.data)
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setloding(false);
//     }
//   };

//   const fetchOrderinfo=async(orderId, pickingId, formData)=>{
//     try {
//       const params={
//        formData:formData,
//        orderId:orderId,
//        pickingId:pickingId
//       }
//       console.log(params)
//       const responce=await makeApiCall(API_URLS.getOrderDeliveryData,'POST',{
//         jsonrpc:'2.0',
//         params:params
//       })
//       console.log(responce,'NEW UPDATED DATA')
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(()=>{
//     fetchOrderinfo(orderData.id, null, false)
//   },[])
//   useEffect(() => {
//     console.log(qtyDelivered, 'POST');

//     if (!orderData) return;

//     if (qtyDelivered > 0) {
//       fetchorderdata(orderData.id, null, false);
//     } else {
//       fetchorderdata(orderData.id, null, true);
//     }
//   }, [orderData, qtyDelivered]);

//   const handleLocked = async (pickingId, action, popupAction) => {
//     try {
//       setloding(true);

//       // ✅ dynamic updatedDeliveryData
//       let updatedDeliveryData = {};
//       if (action) {
//         updatedDeliveryData.action = action;
//       } else if (popupAction) {
//         updatedDeliveryData.popupAction = popupAction;
//       }

//       const payLoad = {
//         pickingId: pickingId,
//         updatedDeliveryData,
//       };

//       const responce = await makeApiCall(
//         API_URLS.saveOrderDeliveryData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: payLoad,
//         },
//       );

//       console.log(responce, 'Locked');

//       if (responce?.result?.message === 'success') {
//         fetchorderdata(orderData?.id, null, true);
//       }

//       if (responce?.result?.data?.message) {
//         const { message, buttons } = responce.result.data;

//         if (buttons) {
//           // When response has custom buttons
//           Alert.alert(
//             'Success',
//             message,
//             [
//               {
//                 text: 'Create Backorder',
//                 onPress: () => handleLocked(pickingId, null, 'process'),
//               },
//               {
//                 text: 'No Backorder',
//                 onPress: () =>
//                   handleLocked(pickingId, null, buttons['No Backorder']),
//               },
//             ],
//             { cancelable: false },
//           );
//         } else {
//           // Fallback default single button
//           Alert.alert(
//             'Success',
//             message,
//             [
//               {
//                 text: 'OK',
//                 onPress: () => handleLocked(pickingId, 'apply', null),
//               },
//             ],
//             { cancelable: false },
//           );
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setloding(false);
//     }
//   };

//   const handlelockedtoggle = action => {
//     if (invoicedata?.id) {
//       handleLocked(invoicedata?.id, action);

//       setiLoked(!locked);
//     }
//   };
//   const handleupdate = async pickingId => {
//     console.log(pickingId, 'ID');
//     try {
//       setloding(true);
//       const params = {
//         pickingId: pickingId,
//         updatedDeliveryData: {
//           scheduled_date: formattedDate,
//           move_line_ids_without_package,
//         },
//       };
//       console.log(params, 'PAYLOAD');
//       const formattedDate = selectedDate
//         ? moment(selectedDate).format('YYYY-MM-DD HH:mm:ss')
//         : null;
//       const res = await makeApiCall(API_URLS.saveOrderDeliveryData, 'POST', {
//         jsonrpc: '2.0',
//         params: params,
//       });
//       console.log(res);
//       if (res?.result?.message === 'success') {
//         seteditshow(false);
//         deliveredData([]);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setloding(false);
//     }
//   };
//   const handleconfirm = () => {
//     if (invoicedata?.id) {
//       handleupdate(invoicedata?.id);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
//       <Headercomp
//         title={'Delivery'}
//         left={true}
//         onPress={() => navigation.goBack()}
//       />
//       {!qtyDelivered > 0 ? (
//         <ScrollView style={{ flex: 1 }}>
//           <View style={{ ...styles.contaionetr }}>
//             {(invoicedata?.btnStatus?.show_edit ||
//               invoicedata?.btnStatus?.show_lock) && (
//               <View style={styles.row}>
//                 {invoicedata?.btnStatus?.show_edit && (
//                   <ButtonCompo
//                     title="Edit"
//                     style={styles.button}
//                     onPress={() => seteditshow(true)}
//                     // onPress={()=>handleLocked(invoicedata?.id,'action_toggle_is_locked')}
//                   />
//                 )}
//                 {invoicedata?.btnStatus?.show_lock && (
//                   <ButtonCompo
//                     title="Lock"
//                     style={styles.button}
//                     onPress={() =>
//                       handleLocked(invoicedata?.id, 'action_toggle_is_locked')
//                     }
//                   />
//                 )}
//               </View>
//             )}

//             {(invoicedata?.btnStatus?.show_unlock ||
//               invoicedata?.btnStatus?.show_validate) && (
//               <View style={styles.row}>
//                 {invoicedata?.btnStatus?.show_unlock && (
//                   <ButtonCompo
//                     title="Unlock"
//                     style={styles.button}
//                     onPress={() =>
//                       handleLocked(invoicedata?.id, 'action_toggle_is_locked')
//                     }
//                   />
//                 )}
//                 {invoicedata?.btnStatus?.show_validate && (
//                   <ButtonCompo
//                     title="Validate"
//                     style={styles.button}
//                     onPress={() =>
//                       handleLocked(invoicedata?.id, 'button_validate')
//                     }
//                   />
//                 )}
//               </View>
//             )}

//             {(invoicedata?.btnStatus?.show_cancel ||
//               invoicedata?.btnStatus?.show_unreserve) && (
//               <View style={styles.row}>
//                 {invoicedata?.btnStatus?.show_cancel && (
//                   <ButtonCompo
//                     title="Cancel"
//                     style={styles.button}
//                     onPress={() =>
//                       handleLocked(invoicedata?.id, 'action_cancel')
//                     }
//                   />
//                 )}
//                 {invoicedata?.btnStatus?.show_unreserve && (
//                   <ButtonCompo
//                     title="Unreserve"
//                     style={styles.button}
//                     onPress={() =>
//                       handleLocked(invoicedata?.id, 'do_unreserve')
//                     }
//                   />
//                 )}
//               </View>
//             )}

//             {(invoicedata?.btnStatus?.show_scrap ||
//               invoicedata?.btnStatus?.show_done) && (
//               <View style={styles.row}>
//                 {invoicedata?.btnStatus?.show_check_availability && (
//                   <ButtonCompo
//                     title="Check Aviailability"
//                     style={styles.button}
//                     onPress={() =>
//                       handleLocked(invoicedata?.id, 'action_assign')
//                     }
//                   />
//                 )}
//                 {invoicedata?.btnStatus?.show_done && (
//                   <ButtonCompo
//                     title="Done"
//                     style={styles.button}
//                     onPress={() =>
//                       handleLocked(invoicedata?.id, 'dispatch_to_delivered')
//                     }
//                   />
//                 )}
//               </View>
//             )}

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <Text style={styles.heading}>
//                 {invoicedata?.name || 'Loading...'}
//               </Text>
//               <Text style={styles.heading}>
//                 {invoicedata?.state_picking || 'Loading...'}
//               </Text>
//             </View>

//             {invoicedata?.id ? (
//               <View style={styles.card}>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Delivery Address</Text>
//                   <Text style={styles.value}>
//                     {invoicedata?.shipping_id.name}
//                   </Text>
//                 </View>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Operation Type</Text>
//                   <Text style={styles.value}>
//                     {invoicedata?.partner_shipping_id?.name || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Sourec Location Id</Text>
//                   <Text style={styles.value}>
//                     {invoicedata?.location_id.name || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Scheduled Date</Text>
//                   <Text style={styles.value}>
//                     {/* {editShow */}
//                     {/* // ? moment(selectedDate).format('YYYY-MM-DD HH:MM:ss') */}
//                     {/* // : invoicedata?.scheduled_date || 'N/A'} */}
//                   </Text>
//                   <Text style={styles.value}>
//                     {editShow
//                       ? selectedDate
//                         ? moment(selectedDate).format('YYYY-MM-DD HH:mm:ss')
//                         : 'N/A'
//                       : invoicedata?.scheduled_date
//                       ? moment(invoicedata.scheduled_date).format(
//                           'YYYY-MM-DD HH:mm:ss',
//                         )
//                       : 'N/A'}
//                   </Text>
//                 </View>
//                 {editShow && (
//                   <ButtonCompo
//                     title="Edit Scheduled Date"
//                     onPress={showDatePicker}
//                     style={styles.button}
//                   />
//                 )}
//                 <DateTimePickerModal
//                   isVisible={isDatePickerVisible}
//                   mode="date"
//                   onConfirm={handleConfirm}
//                   onCancel={hideDatePicker}
//                 />

//                 <View style={styles.row}>
//                   <Text style={styles.label}>Operation Type</Text>
//                   <Text style={styles.value}>
//                     {invoicedata?.origin || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Origin</Text>
//                   <Text style={styles.value}>
//                     {invoicedata?.scheduled_date || 'N/A'}
//                   </Text>
//                 </View>
//               </View>
//             ) : (
//               <Text style={{ marginTop: 20 }}>Loading invoice details...</Text>
//             )}
//             <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
//               <ButtonCompo
//                 title="Detailed Operation"
//                 onPress={() => setSelectedTab('LINE')}
//                 style={{ width: '50%' }}
//               />
//               <ButtonCompo
//                 title="Operation"
//                 onPress={() => setSelectedTab('INFO')}
//                 style={{ width: '45%' }}
//               />
//             </View>
//             <View style={{ flexDirection: 'row', gap: 10 }}>
//               <ButtonCompo
//                 title="Addition Info"
//                 onPress={() => setSelectedTab('ADD')}
//                 style={{ width: '50%' }}
//               />
//               <ButtonCompo
//                 title="Note"
//                 onPress={() => setSelectedTab('NOTE')}
//                 style={{ width: '45%' }}
//               />
//             </View>
//             {selectedTab === 'LINE' && (
//               <Commoncard
//                 item={invoicedata}
//                 editShow={editShow}
//                 setdeliveredData={setdeliveredData}
//               />
//             )}
//             {selectedTab === 'INFO' && (
//               <Commoncard
//                 item={invoicedata}
//                 editShow={editShow}
//                 setdeliveredData={setdeliveredData}
//               />
//             )}
//             {selectedTab === 'ADD' && (
//               <View>
//                 <View style={{ ...styles.card }}>
//                   <Text
//                     style={{ ...styles.label, fontWeight: '800', fontSize: 18 }}
//                   >
//                     Shipping Information
//                   </Text>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>Carrier</Text>
//                     {/* <Text style={styles.value}>{invoicedata.amount_untaxed_signed}</Text> */}
//                   </View>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>Tracking Reference</Text>
//                     {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
//                   </View>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>shipping Policy</Text>
//                     <Text style={styles.value}>
//                       {invoicedata.amount_untaxed_signed}
//                     </Text>
//                   </View>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>Priority</Text>
//                     <Text style={styles.value}>
//                       {invoicedata.amount_untaxed_signed}
//                     </Text>
//                   </View>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>Responsible</Text>
//                     <Text style={styles.value}>
//                       {invoicedata.amount_untaxed_signed}
//                     </Text>
//                   </View>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>Procurement Group</Text>
//                     <Text style={styles.value}>{invoicedata.origin}</Text>
//                   </View>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>weight</Text>
//                     <Text style={styles.value}>
//                       {invoicedata.invoice_origin}
//                     </Text>
//                   </View>
//                   <View style={styles.row}>
//                     <Text style={styles.label}>weight for shipping</Text>
//                     <Text style={styles.value}>
//                       {invoicedata.invoice_origin}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}
//             {selectedTab === 'NOTE' && (
//               <TextInputCompo
//                 style={{
//                   height: 100,
//                   borderWidth: 1,
//                   marginTop: 10,
//                   borderRadius: 10,
//                 }}
//                 placeholder="Note"
//                 value={note}
//                 onChangeText={item => setnote(item)}
//               />
//             )}
//             {editShow && (
//               <ButtonCompo
//                 title="Update"
//                 onPress={handleconfirm}
//                 style={{ ...styles.button, marginBottom: 20 }}
//               />
//             )}
//           </View>
//         </ScrollView>
//       ) : (
//         <PickingsList pickings={qtyData.pickings} orderData={orderData?.id}/>
//         // <View></View>

//       )}
//       <Loader visible={loding} />
//     </SafeAreaView>
//   );
// };

// export default Delivery;

// const styles = StyleSheet.create({
//   contaionetr: {
//     paddingHorizontal: 15,
//   },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.blackColor,
//     padding: 8,
//   },
//   value: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//     padding: 8,
//     maxWidth: '50%',
//     textAlign: 'right',
//   },
//   heading: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.blackColor,
//     marginTop: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   button: {
//     width: '48%',
//   },
// });

import {  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Loader from '../../../../../components/Loader';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import { FlatList } from 'react-native';
import navigationString from '../../../../../navigation/navigationString';
import { SafeAreaView } from 'react-native-safe-area-context';

const Delivery = ({ navigation, route }) => {
  const { orderData } = route.params;

  const [isLoding, setIsLoding] = useState(false);
  const [deliveryData, setDeliverydata] = useState([]);
  const fetchOrderinfo = async (orderId, pickingId, formData) => {
    try {
      const params = {
        formData: formData,
        orderId: orderId,
        pickingId: pickingId,
      };
      setIsLoding(true);
      console.log(params);
      const responce = await makeApiCall(
        API_URLS.getOrderDeliveryData,
        'POST',
        {
          jsonrpc: '2.0',
          params: params,
        },
      );
      console.log(responce, 'NEW UPDATED DATA');
      if (responce?.result?.message === 'success') {
        setDeliverydata(responce?.result?.data?.pickings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchOrderinfo(orderData.id, null, false);
  }, []);


  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}
      onPress={()=>navigation.navigate(navigationString.PREVIEWCONSOLEDELIVERY,{ item,orderID:orderData.id })}>
        {/* Header */}
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          {item.picking_type_id?.name} • {item.state_picking}
        </Text>
  
        {/* Partner Info */}
        <View style={styles.row}>
          <Text style={styles.label}>Customer:</Text>
          <Text style={styles.value}>{item.partner_id?.name}</Text>
        </View>
  
        {/* Origin */}
        <View style={styles.row}>
          <Text style={styles.label}>Origin:</Text>
          <Text style={styles.value}>{item.origin}</Text>
        </View>
  
        {/* Locations */}
        <View style={styles.row}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{item.location_id?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{item.location_dest_id?.name}</Text>
        </View>
  
        {/* Date */}
        <View style={styles.row}>
          <Text style={styles.label}>Scheduled:</Text>
          <Text style={styles.value}>{item.scheduled_date}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <Headercomp
        title={'Delivery Order'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <View style={{flex:1,paddingHorizontal:15}}>

      <FlatList
      data={deliveryData}
      keyExtractor={(item)=>item.id.toString()}
      renderItem={renderItem}
      />
      </View>
      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default Delivery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  value: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
    textAlign: 'right',
  },
});
