import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import TextInputCompo from '../../../../../components/TextInputCompo';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import axios from 'axios';

const CreateproductcategoryModal = ({ isVisible, onclose }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selecedparentcategory,setparentcatogery]=useState(null)
  const [selectedcosting,setselectedcosting]=useState(null)
  const [selectedremoval,setselectedremoval]=useState(null)
  const [productcatogory,setproductcategory]=useState('')
  const [isLoading, setisLoading] = useState(false);
  const [products,setproducts]=useState([])
  // console.log(selectedremoval)
  const fetchcreateproduct = async () => {
    try {
      const payload = {
        id: 'New',
      };
      setisLoading(true);
      const responce = await makeApiCall(API_URLS.storeCategories, 'POST', {
        jsonrpc: '2.0',
        params: payload,
        productType: null,
        searchbar: null,
      });
      console.log(responce,'RESPPPPPPPPPPPPPP')
      if(responce?.result?.message==="success"){
        setproducts(responce?.result?.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };
useEffect(()=>{
  fetchcreateproduct()
},[])
const categoryData = products?.form_options?.parent_id || {};

const categoryDropdown = Object.entries(categoryData).map(([key, value]) => ({
  label: value,
  value: key
}));

const castingmedthod=products?.form_options?.property_cost_method||{};
const castingDropdown=Object.entries(castingmedthod).map(([key,value])=>({
  label: value,
  value: key
}))
const formatedstrategy=products?.form_options?.removal_strategy_id||{}
const stragegydropdown=Object.entries(formatedstrategy).map(([key,value])=>({
  label: value,
  value: key
}))

const handlesubmit = async () => {
  try {
    setisLoading(true);

    const formdata = new FormData();
    formdata.append('name', productcatogory || '');
    formdata.append('active', toggleCheckBox ? 'true' : 'false');
    formdata.append('property_cost_method', selectedcosting || '');
    formdata.append('parent_id', String(selecedparentcategory || ''));
    formdata.append('removal_strategy_id', String(selectedremoval?.value || ''));

    const response = await axios.post(API_URLS.saveStoreCategory, formdata, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    console.log(response.data, 'RESPONSE');
    // Alert.alert(response)
    if (response?.data?.message?.toLowerCase() === 'success') {
      Alert.alert('Success', response?.data?.message);
      onclose();
    } else {
      Alert.alert('Error', response?.data?.errorMessage || 'Unknown error');
    }
  } catch (error) {
    console.log(error);
    Alert.alert('Network Error', error.message);
  } finally {
    setisLoading(false);
  }
};


// const handleSubmit = async () => {
//   try {
//     setisLoading(true);

//     const formData = new FormData();
//     formData.append('name', products);
//     formData.append('active', toggleCheckBox);
//     formData.append('property_cost_method', selectedcosting);
//     formData.append('parent_id', selecedparentcategory);
//     formData.append('removal_strategy_id', selectedremoval);

//   console.log(formData,'WOOOOOOOO')
//     const responce =await axios.post(API_URLS.saveStoreCategory,formData,{
//       headers:{
//         'Content-Type': 'multipart/form-data',
//       }
//     })

//     console.log(responce, 'RESPONSE');
//   } catch (error) {
//     console.log(error);
//   } finally {
//     setisLoading(false);
//   }
// };

console.log(categoryDropdown,'PPPPPP')
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
            value={products}
            onChangeText={(text)=>setproductcategory(text)}
          />
          <Text style={{ ...styles.label }}>Costing Method</Text>
          <Dropdowncomp
            data={castingDropdown}
            onChange={(item)=>setselectedcosting(item.value)}
            value={selectedcosting}
          />
          <Text style={{ ...styles.label }}>Force Removal Strategy</Text>
          <Dropdowncomp
            data={stragegydropdown}
            value={selectedremoval}
            onChange={(item)=>setselectedremoval(item.value)}
          />
          <Text style={{ ...styles.label }}>Parent Category</Text>
          <Dropdowncomp
            data={categoryDropdown}
            value={selecedparentcategory}
            onChange={(item)=>setparentcatogery(item.value)}
          />
          <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
            <Text style={{ ...styles.label }}>Active</Text>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
          </View>
          <ButtonCompo title="Save" onPress={handlesubmit}/>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CreateproductcategoryModal;

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
