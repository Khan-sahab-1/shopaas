import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

const AttributePreview = ({ navigation, route }) => {
  const [isLoding, setisLoding] = useState(false);
  const [attributedata,setattributedata]=useState([])
  console.log(attributedata,'---')
  const { item } = route?.params;
  const fetchattribute = async id => {
    try {
      setisLoding(true);
      const responce = await makeApiCall(
        API_URLS.ProductAttributeForm,
        'POST',
        {
          jsonrpc: '2.0',
          params: { attributeId: id },
        },
      );
      console.log(responce,'responce')
      if(responce?.result?.message){
        setattributedata(responce?.result)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoding(false);
    }
  };
  useEffect(() => {
    if (item?.id) {
      fetchattribute(item?.id);
    }
  }, [item?.id]);
  const renderItem=({item})=>{
    return(
      <View style={{...styles.card}}>
        <Text style={{...styles.label}}>value:{item.name}</Text>
        <Text style={{...styles.label}}>Is_custom:{item?.is_custom}</Text>
        <Text style={{...styles.label}}>Companey:{item?.company_name}</Text>
        <Text style={{...styles.label}}>Companey Type:{item?.company_type_name}</Text>
        {/* <Text style={{...styles.label}}>Companey Type</Text> */}
      </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Attribute Preview'}
        onPress={() => navigation.goBack()}
        left={true}
      />
      <View style={{ ...styles.container }}>
        <FlatList
        data={attributedata?.values_data}
        keyExtractor={(item)=>item?.id.toString()}
        renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default AttributePreview;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
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
    fontWeight:'600',
    color:COLORS.blackColor
  }
});
