import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import makeApiCall from '../../../../utils/apiHelper';
import { API_URLS } from '../../../../utils/apiurls';
import Dropdowncomp from '../../../../components/Dropdowncomp';
import Loader from '../../../../components/Loader';
import { COLORS } from '../../../../styles/colors';
import Editproducts from './UpdateProdcts/Editproducts';
import Headercomp from '../../../../components/Headercomp';

const UpdateProduct = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const[openeditmodal,setopeneditmodal]=useState(false)
  const [selectedItemcard,setselectedItemcard]=useState(null)
  const [filters, setFilters] = useState([]);
  const [statedata, setStatedata] = useState({});
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [optiondata, setOptionData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [produtshowing,setproductshowing]=useState([])
  console.log(statedata,'Products')
  const formateAllData=statedata?.product_update_line_ids
  const ArrayAllData=Object.values(formateAllData)

  const formatted=produtshowing?.product_update_line_ids||{};
  const ArrayFormated=Object.values(formatted)
  // console.log(ArrayFormated,'Formated')


  const formattedOptindata =
    optiondata?.items?.map(item => ({
      label: item.name,
      value: item.id.toString(),
    })) || [];

  const fetchProductState = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.productDataUpdate, 'POST', {
        jsonrpc: '2.0',
        params: { page: 0 },
      });
    // console.log(response,'RESSSSSS')

      if (response?.result?.message === 'success') {
        setStatedata(response?.result?.data);
        const dropdownFormatted = Object.entries(
          response?.result?.form_options?.filter || {}
        ).map(([key, value]) => ({
          label: value,
          value: key,
        }));
        setFilters(dropdownFormatted);
      }
    } catch (error) {
      console.log('Error fetching product state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchproductOptions = async (id) => {
    if (!id || !selectedFilter) {
      setOptionData([]);
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        origin: 'product-data-update',
        id: id,
        type: selectedFilter === 'category' ? 'product_category' : selectedFilter,
        query: null,
      };
      const response = await makeApiCall(API_URLS.getProductOptions, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });

      setOptionData(response?.result?.data || {});
    } catch (error) {
      console.log('Error fetching product options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchproductdata = async (id, selectedItem) => {
    if (!id || !selectedItem) {
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        jsonrpc: '2.0',
        params: {
          page: 0,
          id: id,
          updateProductData: {
            action: 'start',
            selectedItem: selectedItem,
          },
        },
      };

      console.log('Request Payload:', payload);

      const response = await makeApiCall(
        API_URLS.saveProductDataUpdate,
        'POST',
        payload
      );
      console.log('Update Response:', response);
      if(response?.result?.message==='success'){
        setproductshowing(response?.result?.data)
      }
    } catch (error) {
      console.log('Error in fetchproductdata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductState();
  }, []);

  useEffect(() => {
    if (statedata?.id && selectedFilter) {
      fetchproductOptions(statedata.id);
      setSelectedItem(null); 
    } else {
      setOptionData([]);
      setSelectedItem(null);
    }
  }, [selectedFilter, statedata?.id]);

  useEffect(() => {
    if (statedata?.id && selectedItem) {
      fetchproductdata(statedata.id, selectedItem);
    }
  }, [selectedItem, statedata?.id]);

  const onSelectFilter = (value) => {
    setSelectedFilter(prev => (prev === value ? null : value));
  };
const renderItem=({item})=>{
  return(
    <TouchableOpacity style={{...styles.card}}
    onPress={()=>{
      setopeneditmodal(true)
      setselectedItemcard(item)
    }}>
      <Text style={{...styles.lable}}>Product:{item?.product_id?.name}</Text>
      <Text style={{...styles.lable}}>Type:{item?.type}</Text>
      <Text style={{...styles.lable}}>Product Category:{item?.categ_id?.name}</Text>
      <Text style={{...styles.lable}}>Price:{item?.price.toFixed(2)}</Text>
      <Text style={{...styles.lable}}>Lot/Serial:{item?.lot_id?.name}</Text>
      <Text style={{...styles.lable}}>Published:{item?.is_published?'Yes':'No'}</Text>
    </TouchableOpacity>
  )
}
  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.whiteColor}}>
      <Headercomp title={'Product data Update'} left={true} onPress={()=>navigation.goback()}/>

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Select One Product Filter</Text>

      {filters.map(item => (
        <TouchableOpacity
          key={item.value}
          style={styles.checkboxContainer}
          onPress={() => onSelectFilter(item.value)}
          activeOpacity={0.8}
        >
          <CheckBox
            value={selectedFilter === item.value}
            onValueChange={() => onSelectFilter(item.value)}
          />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ marginTop: 20 }}>
        {(selectedFilter === 'product' || selectedFilter === 'category') && formattedOptindata.length > 0 && (
          <Dropdowncomp
            key="commonDropdown"
            data={formattedOptindata}
            value={selectedItem}
            onChange={(item) => setSelectedItem(item.value)}
          />
        )}
      </View>
       {(selectedFilter === 'product' || selectedFilter === 'category') && <FlatList
        data={ArrayFormated}
        renderItem={renderItem}
        keyExtractor={(item)=>item.id.toString()}
        />}
        {selectedFilter==='none' &&
        <FlatList
        data={ArrayAllData}
        renderItem={renderItem}
        keyExtractor={(item)=>item.id.toString()}/>
        }
      <Loader visible={isLoading} />
      <Editproducts
      isVisible={openeditmodal}
      onclose={()=>setopeneditmodal(false)}
      item={selectedItemcard}/>
    </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProduct;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
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
  lable:{
    fontSize:16,
    fontWeight:'500',
    color:COLORS.blackColor
  }
});