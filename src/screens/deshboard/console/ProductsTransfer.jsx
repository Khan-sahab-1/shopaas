// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   SafeAreaView,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import makeApiCall from '../../../utils/apiHelper';
// import { API_URLS } from '../../../utils/apiurls';
// import Loader from '../../../components/Loader';
// import { COLORS } from '../../../styles/colors';
// import Headercomp from '../../../components/Headercomp';
// import Dropdowncomp from '../../../components/Dropdowncomp';
// import ButtonCompo from '../../../components/ButtonCompo';
// import CheckBox from '@react-native-community/checkbox';
// import axios from 'axios';
// const data = [
//   { id: 1, name: 'jamsed' },
//   { id: 2, name: 'jamsed' },
// ];

// // const ProductsTransfer = ({ navigation }) => {
// //   const [transferData, setTransferData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [fromtoData, setfromTodata] = useState([]);
// //   const [todata, setToData] = useState([]);
// //   const [slectedfromItem, setSelectedfromitem] = useState(null);
// //   const [toselectedItem, setToselecteditem] = useState(null);
// //   const [toggleCheckBox, setToggleCheckBox] = useState(false);
// //   const [selectedItems, setSelectedItems] = useState([]);
// //   const [Savetransferdata,setSaveTransferData]=useState()
// //   const [productList,setProductList]=useState(null)
// //   const [listData, setListData] = useState([]);

// //   console.log(productList, 'FROM DATA Transfer');

// //   const fetchCompanyDataTransfer = async () => {
// //     try {
// //       const payload = {
// //         jsonrpc: '2.0',
// //         params: {
// //           page: 0,
// //         },
// //       };
// //       setLoading(true);
      
// //       const response = await axios.post(API_URLS.companyDataTransfer, payload, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       console.log('Response ===', response);
// //       const fromCompanyData = Object.values(
// //         response.data.result.transfer_form_options.from_company_id || {},
// //       ).map(item => ({
// //         label: item.name,
// //         value: item.id,
// //       }));

// //       setfromTodata(fromCompanyData);
// //       const toCompanyData = Object.values(
// //         response.data.result.transfer_form_options.to_company_id || {},
// //       ).map(item => ({
// //         label: item.name,
// //         value: item.id,
// //       }));
// //       setToData(toCompanyData);

// //       if (response?.data.result?.data) {
// //         setTransferData(response.data.result);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchTransferdata = async (page, transferId, action) => {
// //     const URL =
// //       'https://shopaas.arkess.com/company/products/save_data_transfer';

// //     const payload = {
// //       jsonrpc: '2.0',
// //       params: {
// //         page: page,
// //         transferId: transferId,
// //         updatedTransferData: {
// //           action: action,
// //         },
// //       },
// //     };

// //     console.log('Payload ===', JSON.stringify(payload, null, 2));

// //     try {
// //       setLoading(true);
// //       const res = await axios.post(URL, payload, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       console.log('TransferData Response ===', res.data);
// //       setSaveTransferData(Object.values(res.data?.result?.data?.product_transfer_line_ids))
// //     } catch (error) {
// //       console.error('Axios error ===', error.message);
// //       if (error.response) {
// //         console.log('Server responded with:', error.response.data);
// //       } else if (error.request) {
// //         console.log('No response received:', error.request);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   const UpdateTransferdata = async (page, transferId, action, productList) => {
// //     const URL = 'https://shopaas.arkess.com/company/products/save_data_transfer';
  
// //     // Build selected and published data from productList
// //     const selected = [];
// //     const publishedData = {};
  
// //     productList.forEach(item => {
// //       if (item.selected) {
// //         selected.push(item.id);
// //       }
// //       publishedData[item.id] = {
// //         is_published: item.is_published,
// //       };
// //     });
  
// //     const payload = {
// //       jsonrpc: '2.0',
// //       params: {
// //         page,
// //         transferId,
// //         updatedTransferData: {
// //           action,
// //           allSelected: false,
// //           selected,
// //           notSelected: [], 
// //           publishedData,
// //         },
// //       },
// //     };
  
// //     console.log('Payload ===', JSON.stringify(payload, null, 2));
  
// //     try {
// //       setLoading(true);
// //       const res = await axios.post(URL, payload, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //       });
// //       console.log('TransferData Response ===', res.data);
  
// //       // Update product list if needed
// //       const updatedList = Object.values(res.data?.result?.data?.product_transfer_line_ids || {});
// //       setSaveTransferData(updatedList);
// //     } catch (error) {
// //       console.error('Axios error ===', error.message);
// //       if (error.response) {
// //         console.log('Server responded with:', error.response.data);
// //       } else if (error.request) {
// //         console.log('No response received:', error.request);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  

// //   // const fetchTransferdata=async(page,transferId,action)=>{
// //   //   console.log(API_URLS.saveCompanyDataTransfer)
// //   //   try {
// //   //     const payload={
// //   //       page:page,
// //   //       transferId:transferId,
// //   //       updatedTransferData:{
// //   //         action:action
// //   //       }
// //   //     }
// //   //     console.log(payload,'PayLOad')
// //   //     const res=await makeApiCall(API_URLS.saveCompanyDataTransfer,"POST",{
// //   //       jsonrpc: '2.0',
// //   //       params:payload
// //   //     })
// //   //     console.log(res,'TransferData')
// //   //   } catch (error) {
// //   //     console.log(error)
// //   //   }
// //   // }

// //   useEffect(() => {
// //     fetchCompanyDataTransfer();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <View style={styles.centered}>
// //         <Loader visible={true} />
// //       </View>
// //     );
// //   }

// //   if (!transferData?.data) {
// //     return (
// //       <View style={styles.centered}>
// //         <Text style={styles.error}>No transfer data available</Text>
// //       </View>
// //     );
// //   }
// //   const toggleCheckbox = (itemId) => {
// //     if (selectedItems.includes(itemId)) {
// //       setSelectedItems(prev => prev.filter(id => id !== itemId));
// //     } else {
// //       setSelectedItems(prev => [...prev, itemId]);
// //     }
// //   };
// //   const handlePublishToggle = (newValue, itemId) => {
// //     console.log(itemId,'ITEM')
// //     const updatedData = listData.map(item => {
// //       if (item.id === itemId) {
// //         return { ...item, is_published: newValue };
// //       }
// //       return item;
// //     });
  
// //     setListData(updatedData);
  
    
// //   };
  
// //   const renderItem = ({ item, index }) => {
// //     const handleSelectToggle = (newValue) => {
// //       const updatedList = [...productList];
// //       updatedList[index].selected = newValue;
// //       setProductList(updatedList);
// //     };
  
// //     // const handlePublishToggle = (newValue) => {
// //     //   const updatedList = [...productList];
// //     //   updatedList[index].is_published = newValue;
// //     //   setProductList(updatedList);
// //     // };
// //     const isChecked = selectedItems.includes(item.id);
// //     return (
// //       <View style={styles.card}>
// //         {/* SELECT CheckBox */}
// //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
// //           <Text style={{ fontWeight: '600', fontSize: 16 }}>Select</Text>
// //           <CheckBox
// //     value={isChecked}
// //     onValueChange={() => toggleCheckbox(item.id)}
// //   />
// //         </View>
  
// //         {/* Product Info */}
// //         <View style={{ flexDirection: 'row', gap: 5 }}>
// //           <Text style={{ fontWeight: 'bold' }}>Product:</Text>
// //           <Text>{item.product_id?.name || 'N/A'}</Text>
// //         </View>
// //         <View style={{ flexDirection: 'row', gap: 5 }}>
// //           <Text style={{ fontWeight: 'bold' }}>Product Type:</Text>
// //           <Text>{item.type}</Text>
// //         </View>
// //         <View style={{ flexDirection: 'row', gap: 5 }}>
// //           <Text style={{ fontWeight: 'bold' }}>Product Category:</Text>
// //           <Text>{item.categ_id?.name || 'N/A'}</Text>
// //         </View>
// //         <View style={{ flexDirection: 'row', gap: 5 }}>
// //           <Text style={{ fontWeight: 'bold' }}>Price:</Text>
// //           <Text>{item.price}</Text>
// //         </View>
  
// //         {/* PUBLISHED CheckBox */}
// //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
// //           <Text style={{ fontWeight: '600', fontSize: 16 }}>Published</Text>
// //           <CheckBox
// //           value={item.is_published}
// //           onValueChange={(val) => handlePublishToggle(val, item.id)}
// //         />
// //         </View>
// //       </View>
// //     );
// //   };
  
  

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
// //       <Headercomp
// //         title={'Product Transfer'}
// //         left={true}
// //         onPress={() => navigation.goBack()}
// //       />

// //       <View style={styles.container}>
// //         <Dropdowncomp
// //           data={fromtoData}
// //           value={slectedfromItem}
// //           onChange={item => {
// //             setSelectedfromitem(item.value);
// //           }}
// //         />
// //         {slectedfromItem && (
// //           <Dropdowncomp
// //             data={todata}
// //             onChange={item => {
// //               setToselecteditem(item.value);
// //             }}
// //             value={toselectedItem}
// //           />
// //         )}
// //         {toselectedItem && (
// //           <ButtonCompo
// //             title="Start"
// //             onPress={() =>
// //               fetchTransferdata(0, transferData?.data?.id, 'start')
// //             }
// //           />
// //         )}
// //        {toselectedItem&&Savetransferdata && <FlatList data={Savetransferdata} renderItem={renderItem} />}
// //         <Loader visible={loading} />
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // export default ProductsTransfer;



// // ...imports remain the same
// const ProductsTransfer = ({ navigation }) => {
//   const [transferData, setTransferData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fromtoData, setfromTodata] = useState([]);
//   const [todata, setToData] = useState([]);
//   const [slectedfromItem, setSelectedfromitem] = useState(null);
//   const [toselectedItem, setToselecteditem] = useState(null);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [Savetransferdata, setSaveTransferData] = useState([]);

//   const fetchCompanyDataTransfer = async () => {
//     try {
//       const payload = {
//         jsonrpc: '2.0',
//         params: { page: 0 },
//       };
//       setLoading(true);
//       const response = await axios.post(API_URLS.companyDataTransfer, payload, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       const fromCompanyData = Object.values(response.data.result.transfer_form_options.from_company_id || {}).map(item => ({
//         label: item.name,
//         value: item.id,
//       }));
//       setfromTodata(fromCompanyData);

//       const toCompanyData = Object.values(response.data.result.transfer_form_options.to_company_id || {}).map(item => ({
//         label: item.name,
//         value: item.id,
//       }));
//       setToData(toCompanyData);

//       if (response?.data.result?.data) {
//         setTransferData(response.data.result);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTransferdata = async (page, transferId, action) => {
//     const URL = 'https://shopaas.arkess.com/company/products/save_data_transfer';
//     const payload = {
//       jsonrpc: '2.0',
//       params: {
//         page,
//         transferId,
//         updatedTransferData: { action },
//       },
//     };

//     try {
//       setLoading(true);
//       const res = await axios.post(URL, payload, {
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const updatedList = Object.values(res.data?.result?.data?.product_transfer_line_ids || {});
//       setSaveTransferData(updatedList);
//     } catch (error) {
//       console.error('Axios error ===', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const UpdateTransferdata = async (page, transferId, action, productList) => {
//     const URL = 'https://shopaas.arkess.com/company/products/save_data_transfer';
//     const selected = [];
//     const publishedData = {};

//     productList.forEach(item => {
//       if (item.selected) selected.push(item.id);
//       publishedData[item.id] = { is_published: item.is_published };
//     });

//     const payload = {
//       jsonrpc: '2.0',
//       params: {
//         page,
//         transferId,
//         updatedTransferData: {
//           action,
//           allSelected: false,
//           selected,
//           notSelected: [],
//           publishedData,
//         },
//       },
//     };

//     try {
//       setLoading(true);
//       const res = await axios.post(URL, payload, {
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const updatedList = Object.values(res.data?.result?.data?.product_transfer_line_ids || {});
//       setSaveTransferData(updatedList);
//     } catch (error) {
//       console.error('Axios error ===', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyDataTransfer();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <Loader visible={true} />
//       </View>
//     );
//   }

//   if (!transferData?.data) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.error}>No transfer data available</Text>
//       </View>
//     );
//   }

//   const toggleCheckbox = (itemId) => {
//     if (selectedItems.includes(itemId)) {
//       setSelectedItems(prev => prev.filter(id => id !== itemId));
//     } else {
//       setSelectedItems(prev => [...prev, itemId]);
//     }
//   };

//   const handlePublishToggle = (newValue, itemId) => {
//     const updatedData = Savetransferdata.map(item => {
//       if (item.id === itemId) {
//         return { ...item, is_published: newValue };
//       }
//       return item;
//     });
//     setSaveTransferData(updatedData);
//   };

//   const renderItem = ({ item }) => {
//     const isChecked = selectedItems.includes(item.id);

//     return (
//       <View style={styles.card}>
//         {/* Select CheckBox */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Text style={{ fontWeight: '600', fontSize: 16 }}>Select</Text>
//           <CheckBox
//             value={isChecked}
//             onValueChange={() => toggleCheckbox(item.id)}
//           />
//         </View>

//         {/* Product Info */}
//         <View style={{ flexDirection: 'row', gap: 5 }}>
//           <Text style={{ fontWeight: 'bold' }}>Product:</Text>
//           <Text>{item.product_id?.name || 'N/A'}</Text>
//         </View>
//         <View style={{ flexDirection: 'row', gap: 5 }}>
//           <Text style={{ fontWeight: 'bold' }}>Product Type:</Text>
//           <Text>{item.type}</Text>
//         </View>
//         <View style={{ flexDirection: 'row', gap: 5 }}>
//           <Text style={{ fontWeight: 'bold' }}>Product Category:</Text>
//           <Text>{item.categ_id?.name || 'N/A'}</Text>
//         </View>
//         <View style={{ flexDirection: 'row', gap: 5 }}>
//           <Text style={{ fontWeight: 'bold' }}>Price:</Text>
//           <Text>{item.price}</Text>
//         </View>

//         {/* Published CheckBox */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
//           <Text style={{ fontWeight: '600', fontSize: 16 }}>Published</Text>
//           <CheckBox
//             value={item.is_published}
//             onValueChange={(val) => handlePublishToggle(val, item.id)}
//           />
//         </View>
//         <View>
          
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
//       <Headercomp
//         title={'Product Transfer'}
//         left={true}
//         onPress={() => navigation.goBack()}
//       />

//       <View style={styles.container}>
//         <Dropdowncomp
//           data={fromtoData}
//           value={slectedfromItem}
//           onChange={item => setSelectedfromitem(item.value)}
//         />
//         {slectedfromItem && (
//           <Dropdowncomp
//             data={todata}
//             value={toselectedItem}
//             onChange={item => setToselecteditem(item.value)}
//           />
//         )}
//         {toselectedItem && (
//           <ButtonCompo
//             title="Start"
//             onPress={() =>
//               fetchTransferdata(0, transferData?.data?.id, 'start')
//             }
//           />
//         )}
//         {toselectedItem && Savetransferdata && (
//           <FlatList
//             data={Savetransferdata}
//             renderItem={renderItem}
//             keyExtractor={(item) => item.id.toString()}
//           />
//         )}
//         {toselectedItem && Savetransferdata &&(<ButtonCompo title='Transfer'/>)}
//         <Loader visible={loading} />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ProductsTransfer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.whiteColor,
//     padding: 16,
//     gap: 10,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//   },
//   label: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 10,
//   },
//   value: {
//     fontSize: 16,
//     color: '#111',
//     fontWeight: '600',
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: '#007BFF',
//     padding: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFF',
//     fontWeight: '600',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   error: {
//     color: 'red',
//   },
//   card: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
//   cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
//   cardLabel: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
// });
import {  StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DataTransferModule from './ConsoleForm/DataTransfer/DataTransfer'
import Headercomp from '../../../components/Headercomp'
import { COLORS } from '../../../styles/colors'
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductsTransfer = ({navigation}) => {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.whiteColor}}>

    <View style={{flex:1,backgroundColor:COLORS.whiteColor,padding:10}}>
      <Headercomp title={'Data Transfer'} left={true} onPress={()=>navigation.goBack()} />
      <DataTransferModule/>
    </View>
    </SafeAreaView>
  )
}

export default ProductsTransfer

const styles = StyleSheet.create({})