import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import {API_URLS} from '../../../utils/apiurls';
import TextInputCompo from '../../../components/TextInputCompo';
import CreateBrand from './ConsoleForm/Brand/CreateBrand';
import EditBrandModal from './ConsoleForm/Brand/EditBrandModal';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Brands = ({navigation}) => {
  const [brandList, setBrandList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingmodalopen, setcreatingmodalopen] = useState(false);
  const [editmodalopen, seteditmodalopen] = useState(false);
  const [serching, setserching] = useState('');
  const [selectedItem, setSelectedItem] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, settotalPage] = useState(null);

  const fetchBrandInformation = async () => {
    try {
      setLoading(true);
      const payload = {
        page: currentPage,
        searchbar: serching,
        productType: 'product',
        CategoryType: 'public_product_category',
      };

      const response = await makeApiCall(API_URLS.storeBrands, 'POST', {
        jsonrpc: '2.0',
        params: payload, // <-- Use payload directly here, not nested inside `data`
      });

      console.log(response, 'response==');

      const categories = response?.result?.data?.category ?? {};
      const formattedBrands = Object.values(categories);
      settotalPage(response?.result?.data?.total_category)
      setBrandList(formattedBrands);
    } catch (error) {
      console.error('❌ Brand fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandInformation();
  }, [currentPage]);
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBrandInformation();
    }, 500);
    return () => clearTimeout(timer);
  }, [serching]);
  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        seteditmodalopen(true);
        setSelectedItem(item);
      }}>
      <Text style={styles.title}>Brand Name:{item.brand_name}</Text>
      <Text style={styles.detail}>Company Name {item.company_id_name}</Text>
      {/* <Text style={styles.detail}>Cost Method: {item.property_cost_method}</Text> */}
      <Text style={styles.detail}>Company type: {item.company_type_name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Headercomp
        title={'Company Brands'}
        onPress={() => navigation.goBack()}
        left={true}
      />
      <View style={styles.container}>
        <TextInputCompo
          style={{...styles.input}}
          onChangeText={text => setserching(text)}
          value={serching}
          placeholder="searching......"
        />
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <FlatList
            data={brandList}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
        <View style={{...styles.containerPagination}}>
          <TouchableOpacity
            onPress={goPrev}
            disabled={currentPage === 0}
            style={[styles.arrowBtn, currentPage === 0 && styles.disabled]}>
            <AntDesign
              name="left"
              size={24}
              color={currentPage === 0 ? '#aaa' : '#007AFF'}
            />
          </TouchableOpacity>

          <Text style={styles.pageText}>
            {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            onPress={goNext}
            disabled={currentPage === totalPages}
            style={[
              styles.arrowBtn,
              currentPage === totalPages && styles.disabled,
            ]}>
            <AntDesign
              name="right"
              size={24}
              color={currentPage === totalPages ? '#aaa' : '#007AFF'}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{...styles.button}}
          onPress={() => setcreatingmodalopen(true)}>
          <Text style={{...styles.btnlabel}}>Create</Text>
        </TouchableOpacity>

        <CreateBrand
          isVisible={creatingmodalopen}
          onclose={() => setcreatingmodalopen(false)}
        />
        <EditBrandModal
          isVisible={editmodalopen}
          onclose={() => seteditmodalopen(false)}
          selectedItem={selectedItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default Brands;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: COLORS.black,
  },
  detail: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  button: {
    position: 'absolute',
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: COLORS.blueColor,
    bottom: 60,
    right: 20,
    borderRadius: 10,
  },
  btnlabel: {
    fontSize: 16,
    color: COLORS.whiteColor,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    height: 50,
    padding: 15,
  },
  containerPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 20,
  },
  arrowBtn: {
    padding: 10,
    marginHorizontal: 20,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    // optional: reduce touch opacity for disabled
    opacity: 0.5,
  },
});
