import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

import CreateQuentitymodal from './CreateQuentityModal';

const UpdateQuentity = ({ navigation, route }) => {
  // console.log(route)

  const [createModalVisible,setcratamodalvisible]=useState(false)
  const [updateddata, setupdateddata] = useState([]);
  const { item } = route?.params;
  console.log(item);
  const flatlistdata = updateddata?.qty_data;
  console.log(flatlistdata, 'GGGG');

  const fetchQuantityUpdate = async id => {
    try {
      const response = await makeApiCall(API_URLS.UpdateQty, 'POST', {
        jsonrpc: '2.0',
        params: { id: id },
      });
      console.log('Update response:', response);
      if (response?.result?.message === 'success') {
        setupdateddata(response?.result);
      }
    } catch (error) {
      console.log('Error updating quantity:', error);
    }
  };

  useEffect(() => {
    if (item?.id) {
      fetchQuantityUpdate(item.id);
    }
  }, [item]);


  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={{...styles.card}}
      >
        <View style={{...styles.insidecard}}>

        <Text style={{...styles.label}}>Product:</Text>
        <Text style={{...styles.label}}>{item?.product_id}</Text>
        </View>
        <View style={{...styles.insidecard}}>

        <Text style={{...styles.label}}>Location:</Text>
        <Text style={{...styles.label}}>{item?.location}</Text>
        </View>
        <View style={{...styles.insidecard}}>

        <Text style={{...styles.label}}>On Hand Quantity:</Text>
        <Text style={{...styles.label}}>{item?.quantity}</Text>
        </View>
        <View style={{...styles.insidecard}}>

        <Text style={{...styles.label}}>	Value:</Text>
        <Text style={{...styles.label}}>{item?.value}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor,  }}>
      <Headercomp
        title={'Update Quantity'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <View style={{paddingHorizontal:15,flex:1}}>

      <FlatList
        data={flatlistdata}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity style={{...styles.createbtn}}
      onPress={()=>setcratamodalvisible(true)}>
       <Text style={{...styles.btnlable}}>Create</Text>
      </TouchableOpacity>
      </View>
   
      {/* <CreateQuentitymodal
      visible={createModalVisible}
      onclose={()=>setcratamodalvisible(false)}
      item={updateddata}
      /> */}
      <CreateQuentitymodal
  visible={createModalVisible}
  onclose={() => {
    setcratamodalvisible(false);
    if (item?.id) {
      fetchQuantityUpdate(item.id);
    }
  }}
  item={updateddata}
/>

    </SafeAreaView>
  );
};

export default UpdateQuentity;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      insidecard:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:10
      },
      label:{
        fontSize:14,
        fontWeight:'500',
        color:COLORS.blackColor
      },
      createbtn:{
        position:'absolute',
        paddingHorizontal:20,
       backgroundColor:COLORS.blueColor,
       right:20,
       bottom:30,
       borderRadius:10,
       paddingVertical:15
      },
      btnlable:{
     color:COLORS.whiteColor,
     fontSize:16,
     fontWeight:'600'
      }
});
