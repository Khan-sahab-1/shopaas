import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import TextInputCompo from '../../../../../components/TextInputCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';

const CreateQuentitymodal = ({ visible, onclose, item }) => {
  // console.log(item,'Itemm')
  const [isLoding, setIsLoding] = useState(false);
  const [selectedproduct, setselectedproducts] = useState(null);
  const [selectlocation, setselectlocation] = useState(null);
  const [handqty, sethandqty] = useState('');
  const formattedLocation = (item?.form_options?.locations || []).map(loc => ({
    label: loc?.location_name ?? 'Unnamed', // fallback if name is missing
    value: loc?.location_id ?? '', // fallback if id is missing
  }));
  //   console.log(formattedData)
  const formattedproducts = (item?.form_options?.product_variants || []).map(
    pro => ({
      label: pro?.product_name ?? 'Unnamed', // fallback if name is missing
      value: pro?.product_id ?? '',
    }),
  );

  const handlesubmit = async () => {
    try {
      setIsLoding(true);
      const payload = {
        product_id: selectedproduct,
        location_id: selectlocation,
        inventory_quantity: handqty,
      };
      console.log(payload, 'Payloda');
      const res = await makeApiCall(API_URLS.SaveUpdateQty, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      console.log(res, 'Ressss');
      if(res?.result?.message==="success"){
        onclose()
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onclose} transparent>
      <TouchableOpacity style={{ ...styles.container }} onPress={onclose}>
        <View style={{ ...styles.whitebox }}>
          <Text style={{ ...styles.label }}>Products</Text>
          <Dropdowncomp
            data={formattedproducts}
            value={selectedproduct}
            placeholder={'Select Products'}
            onChange={item => setselectedproducts(item.value)}
            style={{height:60}}
          />
          <Text style={{ ...styles.label }}>Location</Text>
          <Dropdowncomp
            data={formattedLocation}
            value={selectlocation}
            placeholder={'Select Location'}
            onChange={item => setselectlocation(item.value)}
          />
          <Text style={{ ...styles.label }}>On Hand Quantity</Text>
          <TextInputCompo
            placeholder="On Hand Quentity"
            style={{ ...styles.input }}
            value={handqty}
            onChangeText={text => sethandqty(text)}
          />
          <ButtonCompo title="Save" onPress={handlesubmit} />
        </View>
      </TouchableOpacity>
      <Loader visible={isLoding}/>
    </Modal>
  );
};

export default CreateQuentitymodal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  whitebox: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },
});
