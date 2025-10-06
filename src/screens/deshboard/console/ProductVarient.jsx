


import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headercomp from '../../../components/Headercomp';
import { COLORS } from '../../../styles/colors';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS, BASE_URL } from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import TextInputCompo from '../../../components/TextInputCompo';
import navigationString from '../../../navigation/navigationString';
import { useFocusEffect } from '@react-navigation/native';
const filter = [
  { label: 'All', value: 'all' },
  { label: 'Storable Products', value: 'product' },
  { label: 'Consumable Type', value: 'consu' },
  { label: 'Service Type', value: 'service' },
];

const ProductVarient = ({ navigation }) => {
  const [productsVarients, setProductVarients] = useState([]);
  const [loading, setLoading] = useState(true);
   const [selectedFilter, setSelectedFilter] = useState('all');
    const [serchingdata,setserchingdata]=useState('')

  const arraydata = Object.values(productsVarients?.products || {});

  const fetchProductVariants = async () => {
    const payload = {
      page: 0,
      productId: false,
      searchbar:serchingdata?serchingdata:null,
      productType: selectedFilter,
      user_select: false,
    };
console.log(payload,'Payload')
    try {
      const response = await makeApiCall(API_URLS.storeProductVarientTree, 'POST', {
        jsonrpc: '2.0',
        params: payload,
        headers: { 'Content-Type': 'application/json' },
      });


      if (response?.result?.message === 'success') {
        setProductVarients(response?.result?.data);
      }
    } catch (error) {
      console.error('❌ Variant Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchProductVariants();
  // }, [selectedFilter]);
  useFocusEffect(
    useCallback(() => {
     
        fetchProductVariants();
      
    }, [selectedFilter])
  );
useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProductVariants();
    }, 600);
  
    return () => clearTimeout(timeout);
  }, [serchingdata]);
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: `${BASE_URL}${item.image}` }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.productInfo}
        onPress={()=>navigation.navigate(navigationString.EDITPTODUCTVARIENTS,{item})}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.price}>Varient Price:   ₹ {item.variant_price.toFixed(2)}</Text>
          <Text style={styles.price}>Sale Price:   ₹ {item.list_price.toFixed(2)}</Text>
          <Text style={styles.price}>Cost:   ₹ {item.standard_price.toFixed(2)}</Text>
          <Text style={styles.price}>Type:    {item.type}</Text>
          <Text style={styles.price}>Qty(on Hand):   {item.variant_price.toFixed(2)}</Text>
          <Text style={styles.price}>Qty(forecasted):  {item.qty_available.toFixed(2)}</Text>
          <Text style={styles.price}>
            Stock: {item.qty_available} unit{item.qty_available !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.price}>Internal Reference:   {item.default_code||''}</Text>
          <Text style={styles.price}>
            Active: {item.active} {item.active !== 1 ? 'Yes' : 'No'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp title="Products Variants" left onPress={() => navigation.goBack()} />
      
      <View style={{paddingHorizontal:15}}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {filter.map(item => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.button,
              selectedFilter === item.value && styles.selectedButton,
            ]}
            onPress={() => {
              setLoading(true); 
              setSelectedFilter(item.value);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                selectedFilter === item.value && styles.selectedButtonText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
   {<TextInputCompo style={{...styles.input}}
    value={serchingdata}
    // onChangeText={(text)=>setserchingdata(text)}
    onChangeText={(text) => {
      setLoading(true); 
      setserchingdata(text);
    }}
    placeholder='Search....'
    />}

        <FlatList
         
          data={arraydata}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 200 }} />}
          // ListEmptyComponent={<Text style={styles.noData}>No product variants found.</Text>}
        />
        </View>
      <Loader visible={loading}/>
    </SafeAreaView>
  );
};

export default ProductVarient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.success,
  },
  stock: {
    fontSize: 13,
    color: COLORS.greyText,
    marginTop: 4,
  },
  noData: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.greyText,
  },
  productInfoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.primaryColor || '#007AFF', 
    borderRadius: 20, 
    marginLeft: 15, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.whiteColor,
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  
  loaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)', 
  },
  buttonCreate:{
    position:'absolute',
    backgroundColor:COLORS.blueColor,
    width:100,
    height:50,
    right:20,
    bottom:20,
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center'
  },
  btntext:{
    fontWeight:'600',
    fontSize:16,
    color:COLORS.whiteColor
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    height:35
  },
  selectedButton: {
    backgroundColor: COLORS.blueColor,
  },
  buttonText: {
    color: COLORS.blackColor,
    fontSize: 14,
  },
  selectedButtonText: {
    color: COLORS.whiteColor,
    fontWeight: 'bold',
  },

  input:{
    borderWidth:1,
    borderRadius:10,
    padding:10,
    marginTop:10,
    // flex:1
  }
});
