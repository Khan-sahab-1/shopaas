import {  StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import GeneralInformation from './GeneralInformation';
import ButtonCompo from '../../../../../components/ButtonCompo';
import navigationString from '../../../../../navigation/navigationString';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


const ProductsPreview = ({ navigation, route }) => {
  const { item } = route.params;
//   console.log(item, 'PAREMS');
  const [isLoding, setIsloding] = useState(false);
  const [productpreviewdata,setproductpreviewdata]=useState([])
  const [productsOption,setproductsOption]=useState([])
  const fetchsingleProductInfo = async id => {
   const payload={
     id:id
   }
   console.log(payload,'Pay')
    try {
      setIsloding(true);
      const response = await makeApiCall(API_URLS.storeProducts, 'POST', {
        jsonrpc: "2.0", params: payload, searchbar: null
      });
      console.log(response, 'Single Product Info');
      if(response?.result?.message==='success'){
        setproductpreviewdata(response?.result?.data)
        setproductsOption(response?.result?.form_options)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloding(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      if (item?.id) {
        fetchsingleProductInfo(String(item.id));
      }
    }, [item])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Product Preview'}
        left={true}
        onPress={() => navigation.goBack()}
      />
     <View style={styles.buttonGroupContainer}>
  <View style={styles.buttonRow}>
    <ButtonCompo title="Edit" style={styles.buttonHalf} 
    onPress={() => navigation.navigate(navigationString.PRODUCTSEDIT, { item })}/>
    <ButtonCompo title="Update Quantity" style={styles.buttonHalf}
     onPress={() => navigation.navigate(navigationString.UPDATEQUENTITY, { item })}
    />
  </View>

  <View style={styles.buttonRow}>
    <ButtonCompo title="Product Attribute" style={styles.buttonHalf}
      onPress={() => navigation.navigate(navigationString.PRODUCTATTRIBUTE, { item })}
     />
    <ButtonCompo
      title="Variant"
      style={styles.buttonHalf}
      onPress={() => navigation.navigate(navigationString.VARIENTPROD, { item })}
    />
  </View>
</View>

     <View style={{...styles.container}}>
       <GeneralInformation item={productpreviewdata} />
     </View>

      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default ProductsPreview;

const styles = StyleSheet.create({
    container: {
    flex: 1,
    // padding: 16,
    backgroundColor: COLORS.whiteColor,
  },
  buttonGroupContainer: {
    paddingHorizontal: 15,
    // marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 15,
  },
  buttonHalf: {
    width: '48%',
    height: 45,
    borderRadius: 8,
  },
});
