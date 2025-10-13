import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import {API_URLS} from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import EcommerceCategoryCreatemodal from './ConsoleForm/Ecommereccategory/EcommerceCategoryCreatemodal';
import UpdateEcommerecModal from './ConsoleForm/Ecommereccategory/UpdateEcommerecModal';
import TextInputCompo from '../../../components/TextInputCompo';
import {SafeAreaView} from 'react-native-safe-area-context';

const EcommerceCategries = ({navigation}) => {
  const [isLoading, setisLoading] = useState(false);
  const [Ecommrcecategory, setecommerceCategory] = useState([]);
  const [creatingmodalopen, setcreatingmodalopen] = useState(false);
  const [openupdatemodal, setopenupdatemodal] = useState(false);
  const [selectredItem, setselecteditem] = useState(null);
  // console.log('first',Ecommrcecategory)
  const [search, setsearch] = useState('');

  const fetcEcommerecCategories = async () => {
    try {
      setisLoading(true);

      const payload = {
        page: 0,
        searchbar: search,
        productType: 'product',
        CategoryType: 'public_product_category',
      };

      const response = await makeApiCall(API_URLS.storeCategories, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });

      console.log('Response:', response);

      if (response?.result?.message === 'success') {
        setecommerceCategory(Object.values(response?.result?.data?.category));
      } else {
        console.warn('API returned error:', response);
      }
    } catch (error) {
      console.error('❌ Category Fetch Error:', error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetcEcommerecCategories();
  }, []);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetcEcommerecCategories(); // or filter data here
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setselecteditem(item);
        setopenupdatemodal(true);
      }}>
      <Text style={styles.name}>Name:{item.name}</Text>
      <Text style={styles.detail}>Sequence: {item.sequence}</Text>
      <Text style={styles.detail}>
        Active: {item.active ? '✅ Yes' : '❌ No'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <Headercomp
        title={'Ecommerce Categories'}
        onPress={() => navigation.goBack()}
        left={true}
      />
      <View style={{paddingHorizontal: 10}}>
        <TextInputCompo
          style={{...styles.InputBox}}
          placeholder="Search......"
          onChangeText={item => setsearch(item)}
          value={search}
        />
      </View>
      <FlatList
        data={Ecommrcecategory}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
      <TouchableOpacity
        style={{...styles.button}}
        onPress={() => setcreatingmodalopen(true)}>
        <Text style={{...styles.btnlabel}}>Create</Text>
      </TouchableOpacity>
      <Loader visible={isLoading} />
      <EcommerceCategoryCreatemodal
        isVisible={creatingmodalopen}
        onclose={() => {
          setcreatingmodalopen(false);
          fetcEcommerecCategories();
        }}
      />
      <UpdateEcommerecModal
        isVisible={openupdatemodal}
        onclose={() => {
          setopenupdatemodal(false);
          fetcEcommerecCategories();
        }}
        item={selectredItem}
      />
    </SafeAreaView>
  );
};

export default EcommerceCategries;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: COLORS.cardBg || '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: COLORS.border || '#ddd',
    borderWidth: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text || '#333',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: COLORS.grayText || '#666',
  },
  button: {
    position: 'absolute',
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: COLORS.blueColor,
    bottom: 20,
    right: 20,
    borderRadius: 10,
  },
  btnlabel: {
    fontSize: 16,
    color: COLORS.whiteColor,
  },
  InputBox: {
    borderWidth: 1,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    height: 50,
  },
});
