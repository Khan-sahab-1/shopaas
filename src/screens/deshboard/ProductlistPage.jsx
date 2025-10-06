import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Headercomp from '../../components/Headercomp';
import {COLORS} from '../../styles/colors';
import TextInputCompo from '../../components/TextInputCompo';
import makeApiCall from '../../utils/apiHelper';
import {API_URLS, BASE_URL} from '../../utils/apiurls';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../components/Loader';
import {useDispatch, useSelector} from 'react-redux';
import navigationString from '../../navigation/navigationString';
import DropDownPicker from 'react-native-dropdown-picker';
import Iconmaterials from 'react-native-vector-icons/MaterialIcons';
import {fetchCartData} from '../../redux/reducers/fetchCartData';
import MessageShow from '../../constant/MessageShow';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dropdowncomp from '../../components/Dropdowncomp';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';

const ProductlistPage = ({navigation, route}) => {
  const companeyid = route.params.item.id;
  const companeyTypeId = route.params.item.company_type[0];

  const [companeyinfo, setcompaneyinfo] = useState([]);
  const [companeyProduct, setcompaneyProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setisloading] = useState(false);
  const [searchProduct, setsearchproduct] = useState('');
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [sortOptions, setSortOptions] = useState([
    {label: 'Catalog Price: High to Low', value: 'list_price desc'},
    {label: 'Catalog Price: Low to High', value: 'list_price asc'},
    {label: 'Name: A to Z', value: 'name asc'},
    {label: 'Name: Z to A', value: 'name desc'},
  ]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCategory, setIscategory] = useState([]);
  const [isselectedCategort, setisSelectedcategory] = useState(false);
  const [Comparision, setComparision] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const {cartData, totalItems} = useSelector(state => state.cart);
  console.log(companeyinfo, 'COMPANEY INFO');

  /** ---------------- COMPANY INFO ---------------- */
  const getcompaneyinformation = async () => {
    try {
      const payload = {
        company_id: companeyid,
        company_type_id: companeyTypeId,
      };
      const responce = await makeApiCall(API_URLS.getCompanyInfo, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });

      if (responce?.result?.message === 'success') {
        setcompaneyinfo(responce.result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** ---------------- PRODUCT LIST ---------------- */
  const fetchProductInformation = async (
    companyTypeId,
    companyId,
    page = 1,
  ) => {
    const isFirstLoad = page === 1;

    try {
      const payLoad = {
        company_id: companyId,
        company_type_id: companyTypeId,
        first_time_page: {name: 'Offer'},
        page: page,
        loadingFirstTime: isFirstLoad,
        prod_categ: isselectedCategort,
        sortBy: selectedSort || false,
      };
      setIsProductLoading(true);
      const response = await makeApiCall(API_URLS.getProducts, 'POST', {
        jsonrpc: '2.0',
        params: payLoad,
      });
      console.log(response, 'PRODUCT LIST');
      if (response?.result) {
        setcompaneyProduct(response.result.products || []);
        setTotalPages(response.result.totalPages);
        setCurrentPage(page);
        setFilteredProducts(response.result.products || []);

        const categories = Array.isArray(response?.result?.categories)
          ? response.result.categories
          : Object.values(response?.result?.categories || {});
        setIscategory(
          categories.map(cat => ({label: cat.name, value: cat.id})),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchProductInformation(companeyTypeId, companeyid, currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      fetchProductInformation(companeyTypeId, companeyid, currentPage - 1);
    }
  };

  /** ---------------- CART ACTIONS ---------------- */
  const updateCartQtyAPI = async item => {
    try {
      setisloading(true);
      const response = await makeApiCall(API_URLS.addToCart, 'POST', {
        jsonrpc: '2.0',
        params: {
          product_id: item.defaultVariant,
          product_template_id: item.id,
          set_qty: 0,
          add_qty: 1,
        },
      });

      setisloading(false);

      if (response?.result?.header === 'Item already in cart') {
        Alert.alert(
          response.result.header,
          response.result.message,
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Reset Cart',
              onPress: async () => {
                try {
                  setisloading(true);
                  const resetResponse = await makeApiCall(
                    API_URLS.resetCart,
                    'POST',
                    {
                      jsonrpc: '2.0',
                      params: {
                        product_id: response.result.product_id,
                        product_template_id: item.id,
                        add_qty: response.result.add_qty,
                      },
                    },
                  );
                  if (resetResponse?.result?.message === 'success') {
                    dispatch(fetchCartData());
                  }
                } catch (error) {
                  console.error('Error resetting cart', error);
                } finally {
                  setisloading(false);
                }
              },
            },
          ],
          {cancelable: false},
        );
      } else if (response?.result?.message === 'success') {
        dispatch(fetchCartData());
        MessageShow.success('Success', 'Item added to cart');
      } else {
        Alert.alert(
          'Error',
          response?.result?.message || 'Something went wrong.',
        );
      }
    } catch (error) {
      setisloading(false);
      MessageShow.error(
        'Error',
        'Network error or an unexpected issue occurred.',
      );
    }
  };

  const removeCartQtyAPI = async (item, set_qty) => {
    const newSetQty = set_qty > 1 ? set_qty - 1 : -1;
    try {
      setisloading(true);
      const response = await makeApiCall(API_URLS.addToCart, 'POST', {
        jsonrpc: '2.0',
        params: {
          product_id: item.defaultVariant,
          product_template_id: item.id,
          return_updated_data: true,
          set_qty: newSetQty,
          add_qty: 0,
        },
      });
      if (response?.result?.message === 'success') {
        dispatch(fetchCartData());
      }
    } catch (error) {
      console.error('Error updating cart qty', error);
    } finally {
      setisloading(false);
    }
  };

  /** ---------------- COMPARISON ---------------- */
  const handlrcomparision = async product_id => {
    try {
      setisloading(true);
      const response = await makeApiCall(API_URLS.compareProduct, 'POST', {
        jsonrpc: '2.0',
        params: {method: 'POST', product_id, addToCompare: true},
      });
      if (response?.result?.message === 'success') {
        fetchcomparision();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };

  const fetchcomparision = async () => {
    try {
      setisloading(true);
      const response = await makeApiCall(API_URLS.compareProduct, 'POST', {
        jsonrpc: '2.0',
        params: {method: 'GET'},
      });
      if (response?.result?.message === 'success') {
        setComparision(response?.result?.compareProducts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };

  /** ---------------- EFFECTS ---------------- */
  useFocusEffect(
    useCallback(() => {
      fetchcomparision();
      dispatch(fetchCartData());
    }, []),
  );

  useEffect(() => {
    getcompaneyinformation();
  }, []);

  useEffect(() => {
    fetchProductInformation(companeyTypeId, companeyid, 1);
  }, [
    companeyTypeId,
    companeyid,
    isselectedCategort,
    selectedSort,
    searchProduct,
  ]);

  const handleSearch = query => {
    setSearchQuery(query); // Update the search query state

    if (query === '') {
      // If the search bar is empty, show all products
      setFilteredProducts(companeyProduct);
    } else {
      // Filter the original list based on the query
      const filtered = companeyProduct.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  // console.log(cartData?.sale_order_lines, 'CART DATA');
  /** ---------------- RENDER ITEM ---------------- */
  const renderItem = ({item}) => {
    const quantity =
      cartData?.sale_order_lines?.[item.defaultVariant]?.product_uom_qty ?? 0;
    // const imageProduct=BASE_URL+item.image
    // console.log(quantity,'QUANTITY')

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate(navigationString.PREVIEWPRODUCTORDER, {
            item,
            companeyinfo, // 👈 passing company info here
          })
        }

        // onPress={()=>navigation.navigate(navigationString.PREVIEWPRODUCTORDER,{item,companeyinfo})}
      >
        {/* <Image
          source={{uri: BASE_URL+item.image}}
          style={styles.productImage}
        /> */}
        <Image
          source={{
            uri: item.image
              ? `${BASE_URL.replace(/\/$/, '')}${encodeURI(item.image)}`
              : 'https://dummyjson.com/image/150',
          }}
          style={styles.productImage}
        />

        <View style={styles.productInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₹ {item.originalPrice.toFixed(2)}</Text>
          <Text style={styles.brand}>{item.brand_name}</Text>
          {/* <Text style={styles.uom}>{item.uom_name}</Text> */}
        </View>

        {quantity > 0 ? (
          <View>
            <View style={styles.quantityWrapper}>
              <TouchableOpacity
                onPress={() => removeCartQtyAPI(item, quantity)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityCount}>{quantity}</Text>
              <TouchableOpacity onPress={() => updateCartQtyAPI(item)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
            {item?.enable_comparison && (
              <TouchableOpacity
                style={{marginTop: 10, left: 30}}
                onPress={() => handlrcomparision(item.defaultVariant)}>
                <MaterialIcons
                  name="compare-arrows"
                  size={28}
                  color={COLORS.blackColor}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {item?.enable_comparison && (
              <TouchableOpacity
                style={{marginRight: 30}}
                onPress={() => handlrcomparision(item.defaultVariant)}>
                <MaterialIcons
                  name="compare-arrows"
                  size={28}
                  color={COLORS.blackColor}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.addButtonWrapper}
              onPress={() => updateCartQtyAPI(item)}>
              <Text style={styles.addButton}>ADD</Text>
            </TouchableOpacity>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      {/* <Headercomp left title={'Products'} onPress={() => navigation.goBack()} /> */}
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={COLORS.whiteColor}
          />
        </TouchableOpacity>

        {/* Cart Icon with Badge */}
        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() =>
            navigation.navigate(navigationString.TABROUTE, {
              screen: navigationString.CARTSCREEN,
            })
          }>
          <Ionicons name="cart-outline" size={28} color={COLORS.blackColor} />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Cart Icon */}
      {/* <TouchableOpacity
        style={styles.cartIconWrapper}
        onPress={() =>
          navigation.navigate(navigationString.TABROUTE, {
            screen: navigationString.CARTSCREEN,
          })
        }>
        <MaterialCommunityIcons name="cart" size={28} color="#000" />
        {totalItems > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity> */}

      <View style={styles.container}>
        {/* Search */}
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <View style={{flex: 1}}>
            {/* <TextInputCompo
              style={styles.input}
              placeholder="Search For Products"
              placeholderTextColor="#999"
              value={searchProduct}
              onChangeText={()=>handlesearch(companeyTypeId, companeyid)}
            /> */}
            <TextInputCompo
              style={styles.input}
              placeholder="Search For Products"
              placeholderTextColor="#999"
              value={searchQuery} // Use the new search state
              onChangeText={handleSearch} // Pass the new handler
            />
          </View>
          <TouchableOpacity>
            <Iconmaterials name="search" size={35} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Company Info */}
        <View style={styles.UpperBox}>
          <Text style={{fontSize: 20, fontWeight: '800'}}>
            {companeyinfo.name}
          </Text>
          <Text style={{fontSize: 16, fontWeight: '600'}}>
            📍 {companeyinfo.distance}
          </Text>
          <Text>{companeyinfo.address}</Text>
        </View>

        {/* Sort & Category */}
        <View style={styles.flexcontainer}>
          <Dropdowncomp
            data={[{label: 'ALL', value: false}, ...(isCategory || [])]}
            value={isselectedCategort}
            placeholder={'All'}
            style={{width: '35%', backgroundColor: '#ccc', borderWidth: 0}}
            onChange={item => setisSelectedcategory(item.value)}
          />
          <View style={{flex: 1, marginLeft: 80}}>
            <DropDownPicker
              open={sortOpen}
              value={selectedSort}
              items={sortOptions}
              setOpen={setSortOpen}
              setValue={setSelectedSort}
              setItems={setSortOptions}
              placeholder="Sort by"
              style={{backgroundColor: '#ccc', borderWidth: 0}}
              textStyle={{color: COLORS.blackColor}}
              ArrowDownIconComponent={() => (
                <Iconmaterials
                  name="keyboard-arrow-down"
                  size={24}
                  color={COLORS.blackColor}
                />
              )}
              ArrowUpIconComponent={() => (
                <Iconmaterials
                  name="keyboard-arrow-up"
                  size={24}
                  color={COLORS.blackColor}
                />
              )}
            />
          </View>
        </View>

        {/* Product List */}
        {isProductLoading ? (
          <View style={styles.loaderContainer}>
            <Loader visible={true} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : companeyProduct.length === 0 ? (
          <Text style={styles.noProductsText}>No products found</Text>
        ) : (
          <FlatList
            // data={companeyProduct}
            data={filteredProducts}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        )}

        {/* Pagination */}
        <View style={styles.containerPagination}>
          <TouchableOpacity
            onPress={goToPrevPage}
            disabled={currentPage === 1}
            style={[styles.arrowBtn, currentPage === 1 && styles.disabled]}>
            <AntDesign
              name="left"
              size={24}
              color={currentPage === 1 ? '#aaa' : '#007AFF'}
            />
          </TouchableOpacity>

          <Text style={styles.pageText}>
            {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            onPress={goToNextPage}
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

        {/* Compare Button */}
        {Comparision?.length > 0 && (
          <TouchableOpacity
            style={{...styles.spapshope, left: 10}}
            onPress={() =>
              navigation.navigate(navigationString.COMPAREPRODUCT, {
                Comparision,
              })
            }>
            <Text style={styles.lableSnapshot}>
              Compare ({Comparision.length})
            </Text>
          </TouchableOpacity>
        )}

        <Loader visible={isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default ProductlistPage;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15},
  input: {
    height: 45,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  UpperBox: {
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: COLORS.whiteColor,
    elevation: 11,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  productImage: {width: 100, height: 100, borderRadius: 6, marginRight: 10},
  productInfo: {flex: 1, justifyContent: 'center'},
  name: {fontSize: 18, fontWeight: '600'},
  price: {fontSize: 16, color: '#333'},
  brand: {fontSize: 12, color: '#777'},
  uom: {fontSize: 12, color: '#555'},
  addButtonWrapper: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButton: {color: '#fff', fontWeight: 'bold'},
  cartIconWrapper: {position: 'absolute', top: 35, right: 15, zIndex: 10},
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  quantityCount: {marginHorizontal: 10, fontSize: 16, fontWeight: 'bold'},
  flexcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ccc',
    marginTop: 10,
    borderRadius: 10,
  },
  containerPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtn: {padding: 10, marginHorizontal: 20},
  pageText: {fontSize: 16, fontWeight: '600'},
  disabled: {opacity: 0.5},
  spapshope: {
    position: 'absolute',
    backgroundColor: COLORS.blueColor,
    width: 160,
    height: 50,
    right: 20,
    bottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  lableSnapshot: {fontSize: 16, fontWeight: '600', color: COLORS.whiteColor},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: COLORS.primaryColor,
  },

  cartContainer: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.whiteColor,
    fontSize: 10,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
    backgroundColor: COLORS.gray2,
    borderRadius: 50,
  },
});
