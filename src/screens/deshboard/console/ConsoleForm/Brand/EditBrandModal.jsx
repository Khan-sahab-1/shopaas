import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../../../../styles/colors';
import TextInputCompo from '../../../../../components/TextInputCompo';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import axios from 'axios';
import {API_URLS} from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';

const EditBrandModal = ({isVisible, onclose, selectedItem}) => {
  console.log(selectedItem);
  const [name, setname] = useState('');
  const [isLoding, setisLoding] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handlesubmit = async () => {
    try {
      setisLoding(true);
      const formdata = new FormData();
      formdata.append('id',selectedItem?.id)
      formdata.append('brand_name', name || '');
      formdata.append('CategoryType', 'public_product_category');

      // Log formdata contents (optional)
      console.log(formdata);

      const response = await axios.post(API_URLS.saveStoreBrand, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data', // Fix here
        },
      });
      console.log(response, 'Response');
      if (response?.data?.message === 'success') {
        Alert.alert('success');
        onclose();
      } else {
        Alert.alert(response?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setisLoding(false);
    }
  };

  const fetchbrandInformation = async () => {
    try {
      setisLoding(true);
      const payLoad = {
        jsonrpc: '2.0',
        params: {
          id: selectedItem?.id,
          CategoryType: 'public_product_category',
        },
        searchbar: null,
        productType: null,
      };
      const responce = await makeApiCall(API_URLS.storeBrands, 'POST', payLoad);
      console.log(responce, 'RES');

      if (responce?.result?.data?.category) {
        const category = responce.result.data.category;
        // console.log(category,'category')
        setname(category.brand_name || '');
        setIsEditable(category.is_editable); 
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoding(false);
    }
  };

  useEffect(() => {
    if (selectedItem?.id) {
      fetchbrandInformation();
    }
  }, [selectedItem]);

  return (
    // <Modal transparent visible={isVisible} onRequestClose={onclose}>
    //   <TouchableOpacity style={{...styles.container}} activeOpacity={1}>
    //     <View style={{...styles.whitebox}}>
    //       <Text style={{...styles.label, fontSize: 20}}>Companey Brand</Text>
    //       <Text style={{...styles.label}}>Brand Name</Text>
    //       <TextInputCompo
    //         value={name}
    //         onChangeText={text => setname(text)}
    //         style={styles.input}
    //         placeholder="Name"
    //         editable={isEditable}
    //       />

    //       <ButtonCompo
    //         title="Save"
    //         onPress={handlesubmit}
    //         disabled={!isEditable}
    //       />
    //     </View>
    //   </TouchableOpacity>
    //   <Loader visible={isLoding} />
    // </Modal>
    <Modal transparent visible={isVisible} onRequestClose={onclose}>
  <View style={styles.container}>
    {/* Background overlay that closes modal */}
    <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={onclose} />

    {/* Modal content - taps here won't close modal */}
    <View style={styles.whitebox}>
      <Text style={{...styles.label, fontSize: 20}}>Company Brand</Text>
      <Text style={styles.label}>Brand Name</Text>
      <TextInputCompo
        value={name}
        onChangeText={text => setname(text)}
        style={styles.input}
        placeholder="Name"
        editable={isEditable}
      />

      <ButtonCompo
        title="Save"
        onPress={handlesubmit}
        disabled={!isEditable}
      />
    </View>
  </View>

  <Loader visible={isLoding} />
</Modal>

  );
};

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

export default EditBrandModal;
