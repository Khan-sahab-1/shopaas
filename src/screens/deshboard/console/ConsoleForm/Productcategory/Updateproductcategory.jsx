// import {
//   Alert,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import TextInputCompo from '../../../../../components/TextInputCompo';
// import {COLORS} from '../../../../../styles/colors';
// import Dropdowncomp from '../../../../../components/Dropdowncomp';
// import CheckBox from '@react-native-community/checkbox';
// import ButtonCompo from '../../../../../components/ButtonCompo';
// import makeApiCall from '../../../../../utils/apiHelper';
// import {API_URLS} from '../../../../../utils/apiurls';
// import axios from 'axios';

// const Updateproductcategory = ({isVisible, onclose, item}) => {
//   console.log(item, 'Item');
//   const [toggleCheckBox, setToggleCheckBox] = useState(false);
//   const [selecedparentcategory, setparentcatogery] = useState(null);
//   const [selectedcosting, setselectedcosting] = useState(null);
//   const [selectedremoval, setselectedremoval] = useState(null);
//   const [productcatogory, setproductcategory] = useState(item?.name);
//   const [isLoading, setisLoading] = useState(false);
//   const [products, setproducts] = useState([]);
//   console.log(products, 'PPPPP');
//   const fetchcreateproduct = async id => {
//     const StringId = id.toString();
//     console.log(typeof StringId, 'STRING');
//     try {
//       const payload = {
//         id: StringId,
//       };
//       console.log(payload, 'Payload');
//       setisLoading(true);
//       const responce = await makeApiCall(API_URLS.storeCategories, 'POST', {
//         jsonrpc: '2.0',
//         params: {id: StringId},
//         productType: null,
//         searchbar: null,
//       });
//       console.log(responce, 'RESPPPPPPPPPPPPPP');
//       if (responce?.result?.message === 'success') {
//         setproducts(responce?.result?.data);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setisLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (item?.id) {
//       fetchcreateproduct(item?.id);
//     }
//   }, [item?.id]);
//   const categoryData = products?.form_options?.parent_id || {};

//   const categoryDropdown = Object.entries(categoryData).map(([key, value]) => ({
//     label: value,
//     value: key,
//   }));

//   const castingmedthod = products?.form_options?.property_cost_method || {};
//   const castingDropdown = Object.entries(castingmedthod).map(
//     ([key, value]) => ({
//       label: value,
//       value: key,
//     }),
//   );
//   const formatedstrategy = products?.form_options?.removal_strategy_id || {};
//   const stragegydropdown = Object.entries(formatedstrategy).map(
//     ([key, value]) => ({
//       label: value,
//       value: key,
//     }),
//   );

//   const handlesubmit = async id => {
//     console.log(id);
//     try {
//       setisLoading(true);

//       const formdata = new FormData();
//       formdata.append('id', id);
//       formdata.append('name', productcatogory || '');
//       formdata.append('active', toggleCheckBox ? 'true' : 'false');
//       formdata.append('property_cost_method', selectedcosting || '');
//       formdata.append('parent_id', String(selecedparentcategory?.value || ''));
//       formdata.append('removal_strategy_id', selectedremoval || '');
//       formdata._parts.forEach(([key, value]) => {
//         console.log(key, value);
//       });

//       const response = await axios.post(API_URLS.saveStoreCategory, formdata, {
//         headers: {'Content-Type': 'multipart/form-data'},
//       });

//       console.log(response.data, 'RESPONSE');
//       // Alert.alert(response)
//       if (response?.data?.message?.toLowerCase() === 'success') {
//         Alert.alert('Success', response?.data?.message);
//         onclose();
//       } else {
//         Alert.alert('Error', response?.data?.errorMessage || 'Unknown error');
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Network Error', error.message);
//     } finally {
//       setisLoading(false);
//     }
//   };
//   const handleSubmitForm = () => {
//     if (item?.id) {
//       handlesubmit(item?.id);
//     }
//   };
//   useEffect(() => {
//     if (item) {
//       // Prefill values from passed item
//       setproductcategory(item.name);
//       setToggleCheckBox(Boolean(item.active));
//       setselectedcosting(item.property_cost_method || '');
//       //   setparentcatogery(item.parent_id || '');
//       setselectedremoval(item.removal_strategy_id || '');
//       //   console.log(stragegydropdown.find(s)=>s.value===item?.removal_strategy_id)
//       const matched = categoryDropdown.find(
//         s => String(s.value) === String(item?.parent_id),
//       );

//       //   console.log(matched, 'Matched');
//       if (matched) {
//         setparentcatogery(matched);
//       }
//       //   console.log(categoryDropdown, 'strategy');
//       //   console.log(item?.parent_id, 'ParentId');
//     }
//   }, [item]);

//   return (
//     <Modal transparent visible={isVisible} onRequestClose={onclose}>
//       <TouchableOpacity style={{...styles.conataner}} onPress={onclose}>
//         <View style={{...styles.whitebox}}>
//           <Text
//             style={{
//               ...styles.label,
//               fontWeight: '800',
//               paddingVertical: 10,
//               fontStyle: 20,
//             }}>
//             Create Product Category
//           </Text>
//           <Text style={{...styles.label}}>Product Category</Text>
//           <TextInputCompo
//             placeholder="Product Category N...."
//             style={{...styles.input}}
//             value={productcatogory}
//             onChangeText={text => setproductcategory(text)}
//           />
//           <Text style={{...styles.label}}>Costing Method</Text>
//           <Dropdowncomp
//             data={castingDropdown}
//             onChange={item => setselectedcosting(item.value)}
//             value={selectedcosting}
//           />
//           <Text style={{...styles.label}}>Force Removal Strategy</Text>
//           <Dropdowncomp
//             data={stragegydropdown}
//             value={selectedremoval}
//             onChange={item => setselectedremoval(item.value)}
//           />
//           <Text style={{...styles.label}}>Parent Category</Text>
//           <Dropdowncomp
//             data={categoryDropdown}
//             value={selecedparentcategory}
//             onChange={item => setparentcatogery(item)}
//           />
//           <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
//             <Text style={{...styles.label}}>Active</Text>
//             <CheckBox
//               disabled={false}
//               value={toggleCheckBox}
//               onValueChange={newValue => setToggleCheckBox(newValue)}
//             />
//           </View>
//           <ButtonCompo title="Save" onPress={handleSubmitForm} />
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   conataner: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     // alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
//   whitebox: {
//     width: '100%',
//     backgroundColor: 'white',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     padding: 15,
//     // alignItems: 'center',
//     maxHeight: '70%',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     height: 50,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.blackColor,
//   },
// });

// export default Updateproductcategory;



import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextInputCompo from '../../../../../components/TextInputCompo';
import {COLORS} from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import {API_URLS} from '../../../../../utils/apiurls';
import axios from 'axios';
import MessageShow from '../../../../../constant/MessageShow';

const Updateproductcategory = ({isVisible, onclose, item}) => {
  console.log(item, 'Item');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selecedparentcategory, setparentcatogery] = useState(null);
  const [selectedcosting, setselectedcosting] = useState(null);
  const [selectedremoval, setselectedremoval] = useState(null);
  const [productcatogory, setproductcategory] = useState(item?.name);
  const [isLoading, setisLoading] = useState(false);
  const [products, setproducts] = useState([]);
  const [originalValues, setOriginalValues] = useState({});
  
  console.log(products, 'PPPPP');
  const fetchcreateproduct = async id => {
    const StringId = id.toString();
    console.log(typeof StringId, 'STRING');
    try {
      const payload = {
        id: StringId,
      };
      console.log(payload, 'Payload');
      setisLoading(true);
      const responce = await makeApiCall(API_URLS.storeCategories, 'POST', {
        jsonrpc: '2.0',
        params: {id: StringId},
        productType: null,
        searchbar: null,
      });
      console.log(responce, 'RESPPPPPPPPPPPPPP');
      if (responce?.result?.message === 'success') {
        setproducts(responce?.result?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };
  
  useEffect(() => {
    if (item?.id) {
      fetchcreateproduct(item?.id);
      
      // Store original values for comparison
      setOriginalValues({
        name: item.name,
        active: Boolean(item.active),
        property_cost_method: item.property_cost_method || '',
        parent_id: item.parent_id || '',
        removal_strategy_id: item.removal_strategy_id || ''
      });
    }
  }, [item?.id]);
  
  const categoryData = products?.form_options?.parent_id || {};

  const categoryDropdown = Object.entries(categoryData).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  const castingmedthod = products?.form_options?.property_cost_method || {};
  const castingDropdown = Object.entries(castingmedthod).map(
    ([key, value]) => ({
      label: value,
      value: key,
    }),
  );
  const formatedstrategy = products?.form_options?.removal_strategy_id || {};
  const stragegydropdown = Object.entries(formatedstrategy).map(
    ([key, value]) => ({
      label: value,
      value: key,
    }),
  );

  const handlesubmit = async id => {
    console.log(id);
    try {
      setisLoading(true);

      const formdata = new FormData();
      formdata.append('id', id);
      
      // Only add fields that have changed
      if (productcatogory !== originalValues.name) {
        formdata.append('name', productcatogory || '');
      }
      
      if (toggleCheckBox !== originalValues.active) {
        formdata.append('active', toggleCheckBox ? 'true' : 'false');
      }
      
      if (selectedcosting !== originalValues.property_cost_method) {
        formdata.append('property_cost_method', selectedcosting || '');
      }
      
      if (selecedparentcategory?.value !== originalValues.parent_id) {
        formdata.append('parent_id', String(selecedparentcategory?.value || ''));
      }
      
      if (selectedremoval !== originalValues.removal_strategy_id) {
        formdata.append('removal_strategy_id', selectedremoval || '');
      }
      
      // Log what we're sending
      formdata._parts.forEach(([key, value]) => {
        console.log(key, value);
      });

      // Only make API call if something has changed
      if (formdata._parts.length > 1) { // More than just the ID
        const response = await axios.post(API_URLS.saveStoreCategory, formdata, {
          headers: {'Content-Type': 'multipart/form-data'},
        });

        console.log(response.data, 'RESPONSE');
        if (response?.data?.message?.toLowerCase() === 'success') {
          // Alert.alert('Success', response?.data?.message);
          MessageShow.success('Success', response?.data?.message)
          onclose();
        } else {
          // Alert.alert('Error', response?.data?.errorMessage || 'Unknown error');
          MessageShow.error('Error', response?.data?.errorMessage || 'Unknown error')
        }
      } else {
        MessageShow.error('Info', 'No changes were made');
        onclose();
      }
    } catch (error) {
      console.log(error);
      // Alert.alert('Network Error', error.message);
      MessageShow.error('Please Select Parents Category')
    } finally {
      setisLoading(false);
    }
  };
  
  const handleSubmitForm = () => {
    if (item?.id) {
      handlesubmit(item?.id);
    }
  };
  
  useEffect(() => {
    if (item) {
      // Prefill values from passed item
      setproductcategory(item.name);
      setToggleCheckBox(Boolean(item.active));
      setselectedcosting(item.property_cost_method || '');
      setselectedremoval(item.removal_strategy_id || '');
      
      const matched = categoryDropdown.find(
        s => String(s.value) === String(item?.parent_id),
      );

      if (matched) {
        setparentcatogery(matched);
      }
    }
  }, [item]);

  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose}>
      <TouchableOpacity style={{...styles.conataner}} onPress={onclose}>
        <View style={{...styles.whitebox}}>
          <Text
            style={{
              ...styles.label,
              fontWeight: '800',
              paddingVertical: 10,
              fontStyle: 20,
            }}>
            Update Product Category
          </Text>
          <Text style={{...styles.label}}>Product Category</Text>
          <TextInputCompo
            placeholder="Product Category N...."
            style={{...styles.input}}
            value={productcatogory}
            onChangeText={text => setproductcategory(text)}
          />
          <Text style={{...styles.label}}>Costing Method</Text>
          <Dropdowncomp
            data={castingDropdown}
            onChange={item => setselectedcosting(item.value)}
            value={selectedcosting}
          />
          <Text style={{...styles.label}}>Force Removal Strategy</Text>
          <Dropdowncomp
            data={stragegydropdown}
            value={selectedremoval}
            onChange={item => setselectedremoval(item.value)}
          />
          <Text style={{...styles.label}}>Parent Category</Text>
          <Dropdowncomp
            data={categoryDropdown}
            value={selecedparentcategory}
            onChange={item => setparentcatogery(item)}
          />
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <Text style={{...styles.label}}>Active</Text>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
          </View>
          <ButtonCompo title="Save" onPress={handleSubmitForm} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  conataner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  whitebox: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
    maxHeight: '70%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
});

export default Updateproductcategory;