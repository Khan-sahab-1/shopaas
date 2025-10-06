import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import TextInputCompo from '../../../../../components/TextInputCompo';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import axios from 'axios';
import Loader from '../../../../../components/Loader';
import MessageShow from '../../../../../constant/MessageShow';

const UpdateEcommerecModal = ({ isVisible, onclose, item }) => {
  console.log(item, 'Item');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selecedparentcategory, setparentcatogery] = useState(null);
  const [sequence, setsequence] = useState('');
  const [productcatogory, setproductcategory] = useState(item?.name || '');
    const [originalValues, setOriginalValues] = useState({});

  const [isLoading, setisLoading] = useState(false);
  const [products, setproducts] = useState([]);
  // console.log(products, 'PPPPP');
  const fetchcreateproduct = async id => {
    const stringId = id.toString();
    // console.log(typeof stringId, 'STRING');
    try {
      const payload = {
        id: stringId,
        CategoryType: 'public_product_category',
        searchbar: null,
        productType: null,
      };
      console.log(payload, 'Payload');
      setisLoading(true);
      const response = await makeApiCall(API_URLS.storeCategories, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      // console.log(response, 'RESPPPPPPPPPPPPPP');
      if (response?.result?.message === 'success') {
        setproducts(response?.result?.data);
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
    }
  }, [item?.id]);
  const categoryData = products?.form_options?.parent_id || {};

  const categoryDropdown = Object.entries(categoryData).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  // const handlesubmit = async id => {
  //   console.log(id);
  //   try {
  //     setisLoading(true);

  //     const formdata = new FormData();
  //     formdata.append('id', id);
  //     formdata.append('name', productcatogory || '');
  //     formdata.append('active', toggleCheckBox ? 'true' : 'false');
  //     formdata.append('sequence', sequence || '');
  //     formdata.append('parent_id', String(selecedparentcategory.value || ''));
  //     formdata.append('CategoryType', 'public_product_category');
  //     // console.log('FormData Preview:');
  //     // console.log('FormData Debug:');
  //     // formdata._parts.forEach(([key, value]) => {
  //     //   console.log(key, value);
  //     // });

  //     // const response = await axios.post(API_URLS.saveStoreCategory, formdata, {
  //     //   headers: { 'Content-Type': 'multipart/form-data' },
  //     // });
  //     const response=await makeApiCall(API_URLS.saveStoreCategory,"POST",formdata,{
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     })
  //     console.log(response.data, 'RESPONSE');
  //     // Alert.alert(response)
  //     if (response?.data?.message?.toLowerCase() === 'success') {
  //       Alert.alert('Success', response?.data?.message);
  //       onclose();
  //     } else {
  //       Alert.alert('Error', response?.data?.errorMessage || 'Unknown error');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert('Network Error', error.message);
  //   } finally {
  //     setisLoading(false);
  //   }
  // };

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
      
      if (selecedparentcategory== originalValues.parent_id) {
        formdata.append('parent_id', String(selecedparentcategory?.value || ''));
      }
      
      if (sequence !== originalValues.removal_strategy_id) {

        formdata.append('sequence', sequence || '');
      }
      formdata.append('CategoryType', 'public_product_category');
     
      
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
      Alert.alert('Network Error', error.message);
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
      setsequence(item.sequence?.toString() || '');
      //   setparentcatogery(item.parent_id || '');
      // setselectedremoval(item.removal_strategy_id || '');
      //   console.log(stragegydropdown.find(s)=>s.value===item?.removal_strategy_id)
      const matched = categoryDropdown.find(
        s => String(s.value) === String(item?.parent_id),
      );

      //   console.log(matched, 'Matched');
      if (matched) {
        setparentcatogery(matched);
      }
      //   console.log(categoryDropdown, 'strategy');
      //   console.log(item?.parent_id, 'ParentId');
    }
  }, [item]);


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

  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose}>
      <TouchableOpacity style={{ ...styles.conataner }} onPress={onclose}>
        <View style={{ ...styles.whitebox }}>
          <Text
            style={{
              ...styles.label,
              fontWeight: '800',
              paddingVertical: 10,
              fontStyle: 20,
            }}
          >
            Create Product Category
          </Text>
          <Text style={{ ...styles.label }}>Product Category</Text>
          <TextInputCompo
            placeholder="Product Category N...."
            style={{ ...styles.input }}
            value={productcatogory}
            onChangeText={text => setproductcategory(text)}
          />

          <Text style={{ ...styles.label }}>Parent Category</Text>
          <Dropdowncomp
            data={categoryDropdown}
            value={selecedparentcategory}
            onChange={item => setparentcatogery(item)}
          />
          <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
            <Text style={{ ...styles.label }}>Active</Text>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
          </View>
          <TextInputCompo
            placeholder="Sequence"
            style={{ ...styles.input }}
            value={sequence}
            onChangeText={text => setsequence(text)}
          />
          <ButtonCompo title="Save" onPress={handleSubmitForm} />
        </View>
      </TouchableOpacity>
      <Loader visible={isLoading}/>
    </Modal>
  );
};

const styles = StyleSheet.create({
  conataner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },
  whitebox: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
    // alignItems: 'center',
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

export default UpdateEcommerecModal;
