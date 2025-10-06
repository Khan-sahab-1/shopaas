import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import navigationString from '../../../../../navigation/navigationString';
import LotCratingModal from './Modals/LotCratingModal';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import { FlatList } from 'react-native-gesture-handler';
import EditLot from './Modals/EditLot';

const Serials = ({ navigation ,route}) => {
    console.log(route)
    const [isOpen,setisOpen]=useState(false)
    const [opneEdit,setOpenEdit]=useState(false)
    const [isLoding,setIsloding]=useState(false)
    const [selectedId,setselectedId]=useState(null)

    const [LotData,setLotData]=useState([])

const {item}=route?.params

const fetchserallot=async(id)=>{
    try {
        setIsloding(true)
        const responce=await makeApiCall(API_URLS.LotSerialTree,'POST',{
            jsonrpc:'2.0',
            params:{id:id}
        })
        console.log(responce)
        if(!responce?.result?.errorMessage){
            setLotData(responce?.result?.data)
        }
    } catch (error) {
        console.log(error)
    } finally{
        setIsloding(false)
    }
}
useEffect(()=>{
    if(item?.id)
    fetchserallot(item?.id)
},[item])
   
const renderItem=({item})=>{
return(
    <TouchableOpacity style={styles.card}
    onPress={()=>{setOpenEdit(true)
        setselectedId(item)
    }}>
  <Text style={styles.title}>Lot / Serial Number: <Text style={styles.value}>{item?.name}</Text></Text>
  <Text style={styles.title}>Internal Reference: <Text style={styles.value}>{item?.ref}</Text></Text>
  <Text style={styles.title}>Product: <Text style={styles.value}>{item?.product_name}</Text></Text>
  <Text style={styles.title}>Created On: <Text style={styles.value}>{item?.create_date}</Text></Text>
</TouchableOpacity>
)
}


  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={{ padding: 15, flex: 1 }}>
        <Headercomp
          title={'Products Serials/Lot'}
          left={true}
          onPress={() => navigation.goBack()}
        />

        <FlatList 
        data={LotData}
        renderItem={renderItem}
        keyExtractor={(item)=>item.id.toString()}
        ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: 'gray' }}>
                No lots found
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={{ ...styles.buttonCreate }}
          onPress={() => setisOpen(true)}
        >
          <Text style={{ ...styles.btntext }}>Create</Text>
        </TouchableOpacity>
        <LotCratingModal
        isVisible={isOpen}
        onclose={()=>setisOpen(false)}
        item={item}/>
        <EditLot
        isVisible={opneEdit}
        onclose={()=>setOpenEdit(false)}
        item={item}
        data={selectedId}
        />
      </View>
      <Loader visible={isLoding}/>
    </SafeAreaView>
  );
};

export default Serials;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  buttonCreate: {
    position: 'absolute',
    backgroundColor: COLORS.blueColor,
    width: 100,
    height: 50,
    right: 20,
    bottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntext: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.whiteColor,
  },
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
  label:{
    fontSize:16,
    fontWeight:'700',
    color:COLORS.blackColor
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555',
  },
});
