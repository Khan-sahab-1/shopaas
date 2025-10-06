import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import TextInputCompo from '../../../../../components/TextInputCompo';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import axios from 'axios';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import MessageShow from '../../../../../constant/MessageShow';

const CreateBrand = ({ isVisible, onclose }) => {
  const [name, setname] = useState('');
  const [isLoding, setisLoding] = useState(false);

  const handlesubmit = async () => {
    try {
      setisLoding(true);
      const formdata = new FormData();
      formdata.append('brand_name', name || '');
      formdata.append('CategoryType', 'public_product_category');
  
      // Log formdata contents (optional)
      console.log(formdata)
  
      const response = await axios.post(API_URLS.saveStoreBrand, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Fix here
        },
      });
      console.log(response, 'Response');
      if(response?.data?.message==='success'){
        // Alert.alert('success',response?.data?.message)
        MessageShow.success('success',response?.data?.message)
        setname('')
        onclose()
      }
      else{
        // Alert.alert(response?.data?.errorMessage)
        MessageShow.error(response?.data?.errorMessage)
        setname('')
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setisLoding(false);
    }
  };
  

  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose}>
      <TouchableOpacity style={{ ...styles.container }} onPress={onclose}>
        <View style={{ ...styles.whitebox }}>
          <Text style={{ ...styles.label, fontSize: 20 }}>Companey Brand</Text>
          <Text style={{ ...styles.label }}>Brand Name</Text>
          <TextInputCompo
            value={name}
            onChangeText={text => setname(text)}
            style={{ ...styles.input }}
            placeholder="Name"
          />
          <ButtonCompo title="Save" onPress={handlesubmit} />
        </View>
      </TouchableOpacity>
      <Loader visible={isLoding}/>
    </Modal>
  );
};

export default CreateBrand;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  whitebox: {
    backgroundColor: COLORS.whiteColor,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
});
