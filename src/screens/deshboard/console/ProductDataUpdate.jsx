// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'
// // import UpdateProduct from './ConsoleForm/DataUpdate/UpdateProduct'

// // const ProductDataUpdate = () => {
// //   return (
// //     <View style={{flex:1}}>
// //   <UpdateProduct/>
// //     </View>
// //   )
// // }

// // export default ProductDataUpdate

// // const styles = StyleSheet.create({})

// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   TextInput
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import Dropdowncomp from '../../../components/Dropdowncomp';
// import Loader from '../../../components/Loader';
// import makeApiCall from '../../../utils/apiHelper';
// import { API_URLS } from '../../../utils/apiurls';
// import Headercomp from '../../../components/Headercomp';
// import { COLORS } from '../../../styles/colors';
// import ButtonCompo from '../../../components/ButtonCompo';
// import SelectedModal from './ConsoleForm/DataUpdate/SelectedModal';
// import axios from 'axios';
// import { Card } from 'react-native-elements';
// import CheckBox from '@react-native-community/checkbox';

// const ProductDataUpdate = ({ navigation }) => {
//   const [selectedValue, setSelectedValue] = useState(null);
//   const [isLoding, setisLoding] = useState(false);
//   const [Productdata, setProductData] = useState([]);
//   const [ProductOptions, setProductoptions] = useState([]);
//   const [isOpneModal, setIsOpenModal] = useState(false);
//   const [selectedOption, setselectedOptions] = useState(null);
//   console.log(selectedOption?.id, 'OPTIN MIL RAHA H');

//   const dropdownData = Object.entries(ProductOptions.filter).map(
//     ([key, value]) => ({
//       label: value,
//       value: key,
//     }),
//   );

//   const getProductUpdatedata = async () => {
//     try {
//       setisLoding(true);
//       const responce = await makeApiCall(API_URLS.productDataUpdate, 'POST', {
//         jsonrpc: '2.0',
//         params: { page: 0 },
//       });
//       console.log('GET PRODUCT INFO', responce);
//       if (responce?.result?.message === 'success') {
//         setProductData(responce?.result?.data);
//         setProductoptions(responce?.result?.form_options);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setisLoding(false);
//     }
//   };
//   // const getLineData = (field, row) => {
//   //   const line = updateProductData?.lines?.[row?.id] || {};
//   //   if (field === 'price')
//   //     return (line?.price ?? row?.price ?? '').toString();
//   //   if (field === 'is_published')
//   //     return line?.is_published ?? row?.is_published ?? false;
//   //   return '';
//   // };

//   // const handleLineChange = (value, key, row) => {
//   //   const lines = { ...(updateProductData?.lines || {}) };
//   //   const line = { ...(lines[row?.id] || {}), [key]: value };

//   //   if (key === 'price' && value !== '') {
//   //     const numericValue = parseFloat(value);
//   //     if (isNaN(numericValue)) return;
//   //   }

//   //   lines[row?.id] = line;
//   //   setUpdateProductData({ ...updateProductData, lines });
//   // };
//   const handleSubmit = async (id, action, selectedItem) => {
//     // ✅ Check mandatory fields
//     if (!selectedItem) {
//       alert('Please select an item before submitting');
//       return;
//     }

//     const payLoad = {
//       id: id,
//       page: 0,
//       updateProductData: {
//         action: action,
//         selectedItem: selectedItem,
//       },
//     };
//     console.log(payLoad, 'PAYLOAD');

//     try {
//       setisLoding(true);
//       const response = await axios.post(
//         API_URLS.saveProductDataUpdate,
//         {
//           jsonrpc: '2.0',
//           params: payLoad,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       console.log(response.data, 'SUBMIT');
//     } catch (error) {
//       console.log('API ERROR', error?.response?.data || error.message);
//     } finally {
//       setisLoding(false);
//     }
//   };

//   useEffect(() => {
//     getProductUpdatedata();
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
//       <View style={{ ...styles.container }}>
//         <Headercomp
//           title={'Product Data Update'}
//           left={true}
//           onPress={() => navigation.goBack()}
//         />
//         <TouchableOpacity style={{ ...styles.button }}
//        onPress={() =>
//         handleSubmit(Productdata?.id,'start',selectedOption?.id)
//       }
//         >
//           <Text style={{ ...styles.label, color: COLORS.whiteColor }}>
//             Start
//           </Text>
//         </TouchableOpacity>
//         <Text style={{ ...styles.label }}>Applied On</Text>
//         <Dropdowncomp
//           data={dropdownData}
//           onChange={item => setSelectedValue(item)}
//           value={selectedValue}
//         />
//         <ButtonCompo
//           title={selectedValue?.label}
//           onPress={() => setIsOpenModal(true)}
//         />
//         {selectedOption && (
//           <View style={{ ...styles.box }}>
//             <Text>{selectedOption.name}</Text>
//           </View>
//         )}
//         {Productdata?.total_line_ids > 0 && (
//             <ScrollView style={{ marginBottom: '-7%' }}>
//               {Object.values(Productdata?.product_update_line_ids || {}).map(
//                 row => (
//                   <Card
//                     key={row?.id}
//                     containerStyle={{ paddingVertical: 5, borderRadius: 5 }}>
//                     <View style={styles.cardDetailViewColumn}>
//                       <View style={styles.cardDetailViewRow}>
//                         <Text
//                           style={{
//                             width: '70%',
//                             fontSize: 18,
//                             fontWeight: 'bold',
//                           }}>
//                           {row?.product_id?.name ?? ''}
//                         </Text>
//                       </View>
//                       <View style={styles.cardDetailViewRow}>
//                         <Text style={{ fontSize: 17 }}>Product Type:</Text>
//                         <Text style={{ fontSize: 17 }}>{row?.type ?? ''}</Text>
//                       </View>
//                       <View style={styles.cardDetailViewRow}>
//                         <Text style={{ fontSize: 17 }}>Product Category:</Text>
//                         <Text style={{ fontSize: 17 }}>
//                           {row?.categ_id?.name ?? ''}
//                         </Text>
//                       </View>
//                       <View style={styles.cardDetailViewRow}>
//                         <Text style={{ fontSize: 17, marginTop: '2%' }}>
//                           Price:
//                         </Text>
//                         <TextInput
//                           style={[styles.input, { width: 200 }]}
//                           // value={getLineData('price', row)}
//                           keyboardType="numeric"
//                           // onChangeText={val =>
//                           //   handleLineChange(val, 'price', row)
//                           // }
//                         />
//                       </View>
//                       {row?.lot_id?.name && (
//                         <View style={styles.cardDetailViewRow}>
//                           <Text style={{ fontSize: 17 }}>
//                             Lot/Serial: {row.lot_id.name}
//                           </Text>
//                         </View>
//                       )}
//                       <View style={{ marginLeft: '-10%' }}>
//                         <CheckBox
//                           title="Published"
//                           iconRight
//                           textStyle={{ fontSize: 17 }}
//                           containerStyle={{
//                             marginTop: -6,
//                             backgroundColor: '#fff',
//                             borderColor: '#fff',
//                           }}
//                           // checked={getLineData('is_published', row)}
//                           // onPress={() =>
//                           //   handleLineChange(
//                           //     !getLineData('is_published', row),
//                           //     'is_published',
//                           //     row,
//                           //   )
//                           // }
//                         />
//                       </View>
//                     </View>
//                   </Card>
//                 ),
//               )}
//             </ScrollView>
//           )}
//       </View>
//       <SelectedModal
//         isVisible={isOpneModal}
//         onClose={() => setIsOpenModal(false)}
//         item={selectedValue}
//         id={Productdata?.id}
//         setselectedOptions={setselectedOptions}
//       />

//       <Loader visible={isLoding} />
//     </SafeAreaView>
//   );
// };

// export default ProductDataUpdate;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.blackColor,
//   },
//   box: {
//     padding: 10,
//     alignItems: 'center',
//     // borderWidth:1
//     backgroundColor: '#c7ecf0',
//     marginTop: 10,
//     borderRadius: 10,
//   },
//   button: {
//     padding: 10,
//     alignItems: 'center',
//     backgroundColor: COLORS.blueColor,
//     width: '30%',
//     borderRadius: 10,
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Dropdowncomp from '../../../components/Dropdowncomp';
import Loader from '../../../components/Loader';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import Headercomp from '../../../components/Headercomp';
import { COLORS } from '../../../styles/colors';
import ButtonCompo from '../../../components/ButtonCompo';
import SelectedModal from './ConsoleForm/DataUpdate/SelectedModal';
import axios from 'axios';
import { Card } from 'react-native-elements';
import CheckBox from '@react-native-community/checkbox';
import TextInputCompo from '../../../components/TextInputCompo';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageShow from '../../../constant/MessageShow';

const ProductDataUpdate = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoding, setisLoding] = useState(false);
  const [Productdata, setProductData] = useState([]);
  const [ProductOptions, setProductoptions] = useState([]);
  const [isOpneModal, setIsOpenModal] = useState(false);
  const [selectedOption, setselectedOptions] = useState(null);

  const [productLines, setProductLines] = useState([]);
  console.log(selectedValue,'LINESSSS')

  const dropdownData = Object.entries(ProductOptions.filter || {}).map(
    ([key, value]) => ({
      label: value,
      value: key,
    }),
  );

  const getProductUpdatedata = async () => {
    try {
      setisLoding(true);
      const response = await makeApiCall(API_URLS.productDataUpdate, 'POST', {
        jsonrpc: '2.0',
        params: { page: 0 },
      });
      if (response?.result?.message === 'success') {
        setProductData(response?.result?.data);
        setProductoptions(response?.result?.form_options);
        const initialLines = {};
        Object.values(
          response?.result?.data?.product_update_line_ids || {},
        ).forEach(row => {
          initialLines[row.id] = {
            price: row.price?.toString() || '',
            is_published: row.is_published || false,
          };
        });
        setProductLines(initialLines);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoding(false);
    }
  };
  const handleInputChange = (rowId, field, value) => {
    setProductLines(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const handleCheckboxToggle = rowId => {
    setProductLines(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        is_published: !prev[rowId]?.is_published,
      },
    }));
  };
  const handleSubmit = async (id, page, updatedData) => {
    if (!id) {
      alert('Product ID is missing');
      return;
    }
    console.log('calling');
    const payLoad = {
      id,
      page,
      updateProductData: updatedData,
    };

    console.log('PAYLOAD ===>', payLoad);

    try {
      setisLoding(true);
      const response = await axios.post(
        API_URLS.saveProductDataUpdate,
        {
          jsonrpc: '2.0',
          params: payLoad,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('SUBMIT SUCCESS ===>', response.data);
      if(response?.data?.result?.message==='success'){
        getProductUpdatedata()
        setselectedOptions(null)
      }
      // alert('Submitted successfully!');
    } catch (error) {
      console.log('API ERROR ===>', error?.response?.data || error.message);
    } finally {
      setisLoding(false);
    }
  };
  const handleUpdate = async (id, page, actionData = {}) => {
    if (!id) {
      alert('Product ID is missing');
      return;
    }
  
    // Build updateProductData
    const updateProductData = {
      ...actionData,
      // Spread productLines directly as root keys
      ...Object.keys(productLines || {}).reduce((acc, key) => {
        acc[key] = productLines[key];
        return acc;
      }, {}),
    };
  
    const payLoad = {
      id,
      page,
      updateProductData,
    };
  
    console.log('PAYLOAD ===>', JSON.stringify(payLoad, null, 2));
  
    try {
      setisLoding(true);
      const response = await axios.post(
        API_URLS.saveProductDataUpdate,
        {
          jsonrpc: '2.0',
          params: payLoad,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('SUBMIT SUCCESS ===>', response.data);
      if(response?.data?.result?.message==='success'){
        MessageShow.success('success',response?.data?.result?.message)
        getProductUpdatedata()
        setselectedOptions(null)
      }

    } catch (error) {
      console.log('API ERROR ===>', error?.response?.data || error.message);
    } finally {
      setisLoding(false);
    }
  };
  
  
  

  useEffect(() => {
    getProductUpdatedata();
  }, []);

 


  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'Product Data Update'}
        left={true}
        onPress={() => navigation.goBack()}
      />
     <View style={{flexDirection:'row',gap:20}}>

     {Productdata?.btnStatus?.show_update&&<TouchableOpacity
        style={styles.button}
        onPress={() =>
          handleUpdate(Productdata?.id, 0, {
            action: 'update',
            // ✅ no need to pass productLines manually
          })
        }
      >
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>}
      {Productdata?.btnStatus?.show_update&&<TouchableOpacity
        style={styles.button}
        onPress={() =>
          handleSubmit(Productdata?.id, 0, {
            action: 'cancel',
            // ✅ no need to pass productLines manually
          })
        }
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>}
      {Productdata?.btnStatus?.show_start&&<TouchableOpacity
        style={styles.button}
        onPress={() =>
          handleSubmit(Productdata?.id, 0, {
            action: 'start',
            selectedItem: selectedOption?.id,
          })
        }
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>}
      
     </View>

      <Text style={styles.label}>Applied On</Text>
      <Dropdowncomp
        data={dropdownData}
        onChange={async item => {
          setSelectedValue(item);
          await handleSubmit(Productdata?.id, 0, { filter: item.value });
        }}
        value={selectedValue}
        // search={true}
      />

{selectedValue?.value !== 'none' && (
  <ButtonCompo
    title={selectedValue?.label || 'Select Option'}
    onPress={() => setIsOpenModal(true)}
  />
)}


      {selectedOption && (
        <View style={styles.box}>
          <Text>{selectedOption.name}</Text>
        </View>
      )}

      {/* {Productdata?.total_line_ids > 0 && (
        <ScrollView style={{ marginBottom: '-7%' }}>
          {Object.values(Productdata?.product_update_line_ids || {}).map(
            row => (
              <Card
                key={row?.id}
                containerStyle={{ paddingVertical: 5, borderRadius: 5 }}
              >
                <View style={styles.cardDetailViewColumn}>
                  <View style={styles.cardDetailViewRow}>
                    <Text
                      style={{ width: '70%', fontSize: 18, fontWeight: 'bold' }}
                    >
                      {row?.product_id?.name ?? ''}
                    </Text>
                  </View>
                  <View style={styles.cardDetailViewRow}>
                    <Text style={{ fontSize: 17 }}>Product Type:</Text>
                    <Text style={{ fontSize: 17 }}>{row?.type ?? ''}</Text>
                  </View>
                  <View style={styles.cardDetailViewRow}>
                    <Text style={{ fontSize: 17 }}>Product Category:</Text>
                    <Text style={{ fontSize: 17 }}>
                      {row?.categ_id?.name ?? ''}
                    </Text>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{ fontSize: 17, marginTop: '2%' }}>
                      Price:
                    </Text>
                    
                    <TextInput
                    style={{...styles.inputBox}}
                    placeholder='Enter Price'
                    />
                  </View>
                  {row?.lot_id?.name && (
                    <View style={styles.cardDetailViewRow}>
                      <Text style={{ fontSize: 17 }}>
                        Lot/Serial: {row.lot_id.name}
                      </Text>
                    </View>
                  )}
                  <View style={{ }}>
                    <CheckBox
                      title="Published"
                      iconRight
                      textStyle={{ fontSize: 17 }}
                      containerStyle={{
                        marginTop: -6,
                        backgroundColor: '#fff',
                        borderColor: '#fff',
                      }}
                    />
                  </View>
                </View>
              </Card>
            ),
          )}
        </ScrollView>
      )} */}

      {Productdata?.total_line_ids > 0 && (
        <ScrollView style={{ marginBottom: 20 }}>
          {Object.values(Productdata?.product_update_line_ids || {}).map(
            row => (
              <Card
                key={row?.id}
                containerStyle={{ paddingVertical: 5, borderRadius: 5 }}
              >
                <View style={styles.cardDetailViewColumn}>
                  <View style={styles.cardDetailViewRow}>
                    <Text
                      style={{ width: '70%', fontSize: 18, fontWeight: 'bold' }}
                    >
                      {row?.product_id?.name ?? ''}
                    </Text>
                  </View>
                  <View style={styles.cardDetailViewRow}>
                    <Text style={{ fontSize: 17 }}>Product Type:</Text>
                    <Text style={{ fontSize: 17 }}>{row?.type ?? ''}</Text>
                  </View>
                  <View style={styles.cardDetailViewRow}>
                    <Text style={{ fontSize: 17 }}>Product Category:</Text>
                    <Text style={{ fontSize: 17 }}>
                      {row?.categ_id?.name ?? ''}
                    </Text>
                  </View>
                  <View style={styles.cardDetailViewRow}>
                    <Text style={{ fontSize: 17, marginTop: '2%' }}>
                      Price:
                    </Text>
                    <TextInput
                      style={[
                        {
                          width: 200,
                          borderWidth: 1,
                          borderRadius: 10,
                          marginTop: 6,
                          height: 40,
                        },
                      ]}
                      value={productLines[row.id]?.price || ''}
                      keyboardType="numeric"
                      onChangeText={value =>
                        handleInputChange(row.id, 'price', value)
                      }
                    />
                  </View>
                  {row?.lot_id?.name && (
                    <View style={styles.cardDetailViewRow}>
                      <Text style={{ fontSize: 17 }}>
                        Lot/Serial: {row.lot_id.name}
                      </Text>
                    </View>
                  )}
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      value={productLines[row.id]?.is_published || false}
                      onValueChange={() => handleCheckboxToggle(row.id)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.checkboxLabel}>Published</Text>
                  </View>
                </View>
              </Card>
            ),
          )}
        </ScrollView>
      )}

      <SelectedModal
        isVisible={isOpneModal}
        onClose={() => setIsOpenModal(false)}
        item={selectedValue}
        id={Productdata?.id}
        setselectedOptions={setselectedOptions}
      />

      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default ProductDataUpdate;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: COLORS.whiteColor },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.blackColor },
  box: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#c7ecf0',
    marginTop: 10,
    borderRadius: 10,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: COLORS.blueColor,
    width: '30%',
    borderRadius: 10,
  },

  cardDetailViewColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardDetailViewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1%',
  },
  inputBox: {
    // margin: 5,
    borderWidth: 1,
    borderColor: '#8080806e',
    padding: 2,
    borderRadius: 4,
    fontSize: 17,
    height: 40,
    width: 200,
  },
  buttonText:{
    fontWeight:'600',
    fontSize:16,
    color:COLORS.whiteColor
  }
});
