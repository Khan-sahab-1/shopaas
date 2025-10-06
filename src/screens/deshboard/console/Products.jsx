import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLORS} from '../../../styles/colors';
import makeApiCall from '../../../utils/apiHelper';
import {API_URLS, BASE_URL} from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import Headercomp from '../../../components/Headercomp';
import navigationString from '../../../navigation/navigationString';
import TextInputCompo from '../../../components/TextInputCompo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const filter = [
  {label: 'All', value: 'all'},
  {label: 'Storable Products', value: 'product'},
  {label: 'Consumable Type', value: 'consu'},
  {label: 'Service Type', value: 'service'},
];

const Products = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('product');
  const [serchingdata, setserchingdata] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, settotalPage] = useState(null);

  const getFormattedProductNameByLength = (name, maxLength = 25) => {
    const productName = name || 'Unnamed Product';
    if (productName.length > maxLength) {
      return (
        productName.substring(0, maxLength) +
        '\n' +
        productName.substring(maxLength)
      );
    }
    return productName;
  };

  const fetchStoreProducts = async () => {
    const payload = {
      page: currentPage,
      searchbar: serchingdata ? serchingdata : null,
      productType: selectedFilter,
      user_select: false,
    };

    // console.log('Sending Payload:', payload);

    try {
      setIsLoading(true);
      setError(null);

      const response = await makeApiCall(API_URLS.storeProducts, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });

      console.log('Store Products Response:', response);

      const products = response?.result?.data?.products || {};
      settotalPage(response?.result?.data.total_products);

      // Convert object to array
      const productList = Object.values(products);
      setProductData(productList);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStoreProducts();
    }, 600);

    return () => clearTimeout(timeout);
  }, [serchingdata]);

  useFocusEffect(
    useCallback(() => {
      fetchStoreProducts();
  
      // Optional cleanup if needed
      return () => {
        console.log('Screen unfocused, cleanup here if needed');
      };
    }, [selectedFilter, currentPage])
  );

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
      style={styles.productItem}
      onPress={() =>
        navigation.navigate(navigationString.PRODUCTS_PREVIEW, {item})
      }>
      <Image
        source={{uri: BASE_URL + item.image}}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>
          {getFormattedProductNameByLength(item.name, 25)}
        </Text>

        <Text style={styles.productInfoText}>
          Sale Price ₹:{item.list_price || 'NA'}
        </Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={styles.productInfoText}>
          Cost ₹:{item.standard_price || ' 0'}
        </Text>
        <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>
          {item.active ? 'Active' : 'Not Active'}
        </Text>
      </TouchableOpacity>
        </View>
        <Text style={styles.productInfoText}>
          Variants: {item.product_variant_count || 'NA'}
        </Text>
        <Text style={styles.productInfoText}>Qty(On hand): {item.qty_available || '0'}</Text>
        <Text style={styles.productInfoText}>Qty(Forecasted): {item.virtual_available || '0'}</Text>
        <Text style={styles.productInfoText}>Type: {item.type || 'NA'}</Text>
      </View>
      {/* Example: A dummy action button or status indicator */}
      {/* <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>
          {item.active ? 'Active' : 'Not Active'}
        </Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{...styles.container}}>
      <Headercomp
        title={'Products'}
        left={true}
        // right={true}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{maxHeight: 50}}>
        <View style={styles.row}>
          {filter.map(item => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.button,
                selectedFilter === item.value && styles.selectedButton,
              ]}
              onPress={() => setSelectedFilter(item.value)}>
              <Text
                style={[
                  styles.buttonText,
                  selectedFilter === item.value && styles.selectedButtonText,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {
        <TextInputCompo
          style={{...styles.input}}
          value={serchingdata}
          onChangeText={text => setserchingdata(text)}
          placeholder="Search...."
        />
      }

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={{...styles.container}}>
          <FlatList
            data={productData}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
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
        </View>
      )}

      <Loader visible={isLoading} />

      <TouchableOpacity
        style={{...styles.buttonCreate}}
        onPress={() => navigation.navigate(navigationString.CREATE_PRODUCTS)}>
        <Text style={{...styles.btntext}}>Create</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingVertical: 10,
    // marginBottom:200
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.whiteColor,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  productImage: {
    height: 90,
    width: 90,
    resizeMode: 'contain',
    marginRight: 12,
    borderRadius: 4,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  productInfoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 3,
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
  buttonCreate: {
    position: 'absolute',
    backgroundColor: COLORS.blueColor,
    width: 100,
    height: 50,
    right: 20,
    bottom: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntext: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.whiteColor,
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
    height: 35,
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

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    // flex:1
  },
  containerPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // bottom:10
    // backgroundColor:'red'
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
    opacity: 0.5,
  },
});
