import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import { COLORS } from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import Loader from '../../../components/Loader';
import CreateproductcategoryModal from './ConsoleForm/Productcategory/CreateproductcategoryModal';
import TextInputCompo from '../../../components/TextInputCompo';
import Updateproductcategory from './ConsoleForm/Productcategory/Updateproductcategory';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductCategories = ({navigation}) => {
  const [Loding, setIsLoding] = useState(false);
  const [productcat,setProductcategory]=useState([])
  const [seraching,setsearching]=useState('')
  // console.log(productcat,'cat')
  const [iscreatingmodal,setiscreatingmodal]=useState(false)
  const [openUpdateModal,setupdateModal]=useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchproductcatagories = async () => {
    const payload = {
      data: {
        page: 0,
        searchbar: seraching,
        productType: 'product',
      },
      searchbar: seraching,
      productType: null,
    };
    try {
      setIsLoding(true);
      const res = await makeApiCall(API_URLS.storeCategories, 'POST', {
        jsonrpc:'2.0',
        params:payload,
      });
      // console.log('Product Categery',res)
      if(res?.result?.message==='success'){

         setProductcategory(Object.values(res.result.data.category))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };
  useEffect(()=>{
    fetchproductcatagories()
  },[])
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => {
        setSelectedCategory(item); 
        setupdateModal(true);      
      }}>
        <Text style={styles.name}>{item.name}</Text>
        
        <Text style={styles.detail}>Active: {item.active ? 'Yes' : 'No'}</Text>
      </TouchableOpacity>
    );
  };
  useEffect(()=>{
const timeout=setTimeout(()=>{
  fetchproductcatagories()
},600)
},[seraching])
  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.whiteColor}}>
      <Headercomp title={'Product Category'} left={true} onPress={()=>navigation.goBack()
      }/>
      <View style={{padding:10}}>

      
      <TextInputCompo style={{...styles.inputbox}}
      placeholder='search......'
      onChangeText={(text)=>setsearching(text)}
      value={seraching}/>
      <FlatList
      data={productcat}
      keyExtractor={(item)=>item.id.toString()}
      renderItem={renderItem}/>


      <Loader visible={Loding}/>
      <CreateproductcategoryModal
      isVisible={iscreatingmodal}
      onclose={()=>{setiscreatingmodal(false)
        fetchproductcatagories()
      }}/>
      <Updateproductcategory
      isVisible={openUpdateModal}
      onclose={()=>{setupdateModal(false)
        fetchproductcatagories()
      }}
      item={selectedCategory}/>
      </View>

   <TouchableOpacity style={{...styles.button}}
   onPress={()=>setiscreatingmodal(true)}>
    <Text style={{...styles.btnlabel}}>Create</Text>
   </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProductCategories;


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    // marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    fontWeight: '500',
  },
  button:{
  position:'absolute',
  paddingHorizontal:30,
  paddingVertical:15,
  backgroundColor:COLORS.blueColor,
  bottom:20,
  right:20,
  borderRadius:10,
  // zIndex:1
  },
  btnlabel:{
  fontSize:16,
  color:COLORS.whiteColor,

  },
  inputbox:{
    borderRadius:10,
    borderWidth:1,
    width:'90%',
    alignSelf:'center',
    height:50
  }
  
  
});

  
