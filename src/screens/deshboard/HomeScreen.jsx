// import React, {useEffect, useMemo, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   StatusBar,
// } from 'react-native';
// import {COLORS} from '../../styles/colors';
// import {moderateScale} from '../../styles/responsiveSize';
// import Slider from '../../components/Slider';
// import makeApiCall from '../../utils/apiHelper';
// import {API_URLS, BASE_URL} from '../../utils/apiurls';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import navigationString from '../../navigation/navigationString';
// import {getCurrentLocation} from '../../utils/getCurrentLocation';
// import {useSelector} from 'react-redux';
// import Icon from 'react-native-vector-icons/Ionicons';
// import ProductsCompo from '../../components/Productscompo/ProductsCompo';
// import FilteringModal from '../../components/Productscompo/FilteringModal';
// import Loader from '../../components/Loader';
// import HomeHeader from '../../components/Productscompo/HomeHeader';

// import {data} from '../../data/UserinfoData';
// import {
//   useGetHomeDataQuery,
//   useGetSlidersQuery,
// } from '../../redux/rtkQuery/ecommerceApi';
// // import Icon from 'react-native-vector-icons/Ionicons'

// const HomeScreen = ({navigation}) => {
//   const [sliderdata, setsliderdata] = useState([]);
//   const [homepageslider, sethomepageslider] = useState([]);
//   const [catagory, setcatagory] = useState([]);
//   const [isLoding, setIsLoding] = useState(false);
//   const [productData, setproductData] = useState([]);
//   const [isOpenModal, setIsOpenModal] = useState(false);
//   const [selectedcategory, setSelectedcategory] = useState(null);
//   const [selectedCompaney, setselectedCompaney] = useState(null);
//   const [filteredProductData, setFilteredProductData] = useState([]);
//   const [companees, setcompanees] = useState([]);
//   const [companeyType, setcompaneyType] = useState([]);

//   // console.log(filteredProductData, 'productData=++=+WOWWWWWWWW');
//   console.log(selectedCompaney?.item[0]);

//   const section = homepageslider['5'];
//   const sliderdatabestdeals = section?.sliders || [];

//   const userinfo = useSelector(state => state.auth);
//   const CompaneyId = userinfo?.user?.company_id;
//   const confirmedLocation = useSelector(state => state.location);

//   // console.log(confirmedLocation, 'location');
//   // console.log(CompaneyId, 'User Info data');
//   // console.log(BASE_URL, 'BaeUrls');

//   const fetcslidersdata = async () => {
//     try {
//       const responce = await makeApiCall(API_URLS.getSliders, 'POST', {
//         jsonrpc: '2.0',
//         params: {},
//       });
//       console.log(responce, 'getSlider');
//       if (!responce.result.errorMessage && !responce.error) {
//         setsliderdata(responce?.result?.data?.sliders?.main_slider);
//         sethomepageslider(responce.result.data.sliders.homepage_sliders);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const displayProducts = useMemo(() => {
//     return filteredProductData.length > 0 ? filteredProductData : productData;
//   }, [filteredProductData, productData]);
//   const filterProducts = () => {
//     // console.log('Filtering products...');
//     let filtered = [...productData];

//     // console.log('Initial products:', filtered.length);
//     // console.log('Selected category:', selectedcategory);
//     // console.log('Selected company:', selectedCompaney);

//     // Filter by category
//     if (selectedcategory) {
//       const categoryId = Array.isArray(selectedcategory)
//         ? selectedcategory[0]
//         : selectedcategory?.id || selectedcategory;

//       filtered = filtered.filter(product => {
//         const productCategoryId = Array.isArray(product.categ_id)
//           ? product.categ_id[0]
//           : product.categ_id;

//         return productCategoryId === categoryId;
//       });
//       console.log('After category filter:', filtered.length);
//     }

//     // Filter by company
//     if (selectedCompaney) {
//       const companyId = Array.isArray(selectedCompaney?.item)
//         ? selectedCompaney.item[0]
//         : selectedCompaney?.item?.id || selectedCompaney?.item;

//       filtered = filtered.filter(product => {
//         const productCompanyId = Array.isArray(product.company_id)
//           ? product.company_id[0]
//           : product.company_id;

//         return productCompanyId === companyId;
//       });
//       console.log('After company filter:', filtered.length);
//     }

//     console.log('Final filtered products:', filtered.length);
//     setFilteredProductData(filtered);
//   };

//   // Call filterProducts when selections change
//   useEffect(() => {
//     if (selectedcategory || selectedCompaney) {
//       filterProducts();
//     }
//   }, [selectedcategory, selectedCompaney]);

//   const handleReset = () => {
//     setFilteredProductData([]);
//     setSelectedcategory(null);
//     setselectedCompaney(null);
//   };

//   const fetchcompaneyTypeandProducts = async CompaneyId => {
//     console.log(CompaneyId, 'CompaneyId=======');
//     try {
//       setIsLoding(true);
//       const res = await makeApiCall(API_URLS.getcatagory, 'POST', {
//         jsonrpc: '2.0',
//         params: {pageNumber: 1},
//       });

//       console.log(res, 'Product Data');
//       if (!res.result.errorMessage && !res.error) {
//         // setCompanyTypes(res?.result?.companyTypes || []);
//         setcompanees(res?.result?.companies);
//         setcompaneyType(res?.result?.companyTypes);
//         // const productKeys = Object.keys(res.result?.products || {});
//         // console.log(productKeys, 'Product Keys');
//         // const productTemplates = productKeys.filter(
//         //   key =>
//         //     key.startsWith('product_template_') &&
//         //     Array.isArray(res.result.products[key]),
//         // );
//         // console.log(productTemplates,'productTemplates+++++++')
//         const productKeys = Object.keys(res.result?.products || {});

//         const productTemplates = productKeys.filter(key =>
//           key.startsWith('products_data_'),
//         );

//         // console.log(productTemplates, 'productTemplates+++++++');

//         // const mergedProducts = productTemplates.reduce((acc, key) => {
//         //   return acc.concat(res.result.products[key] || []);
//         // }, []);
//         // setproductData(mergedProducts);
//         const mergedProducts = productTemplates.reduce((acc, key) => {
//           const productObj = res.result.products[key] || {};

//           // Convert {436421: {...}} → [{id: 436421, ...}]
//           const productsWithId = Object.entries(productObj).map(
//             ([id, data]) => ({
//               id,
//               ...data,
//             }),
//           );

//           return acc.concat(productsWithId);
//         }, []);

//         setproductData(mergedProducts);

//         console.log(mergedProducts, 'mergedProducts+++++++++');
//         const categoryKeys = Object.keys(
//           res.result?.ecommerce_categories || {},
//         ).filter(key => key.startsWith('product_public_category_'));

//         const mergedCategories = categoryKeys.reduce((acc, key) => {
//           return acc.concat(res.result.ecommerce_categories[key] || []);
//         }, []);
//         setcatagory(mergedCategories);
//         let totalCount = 0;
//         productKeys.forEach(key => {
//           if (key.startsWith('product_template_count_')) {
//             totalCount += res.result.products[key] || 0;
//           }
//         });

//         const calculatedTotalPages = Math.ceil(totalCount / productsPerPage);
//         // settotalPages(calculatedTotalPages);
//       } else {
//         Alert.alert(res.result.errorMessage || res.error);
//       }
//     } catch (error) {
//       if (error.response) {
//         console.log('Status:', error.response.status);
//         console.log('Data:', error.response.data);
//       } else if (error.request) {
//         console.log('No response received:', error.request);
//       } else {
//         console.log('Error', error.message);
//       }
//     } finally {
//       setIsLoding(false);
//     }
//   };
//   const {
//     data: homeRaw,
//     isFetching: isHomeLoading,
//     error: homeError,
//   } = useGetHomeDataQuery({pageNumber: 1});
//   const {data: sliderRaw, isFetching: isSliderLoading} = useGetSlidersQuery();
//   console.log('Home Data (homeRaw):', homeRaw);
//   console.log('Is Home Loading (isHomeLoading):', isHomeLoading);
//   console.log('Home Error (homeError):', homeError);
//   console.log('-----------------------');
//   console.log('Slider Data (sliderRaw):', sliderRaw);
//   console.log('Is Slider Loading (isSliderLoading):', isSliderLoading);

//   useEffect(() => {
//     fetcslidersdata();
//     // fetchcatagorydata();

//     fetchcompaneyTypeandProducts(CompaneyId);
//   }, []);

//   const handleNavigation = item => {
//     if (
//       confirmedLocation?.confirmedLocation &&
//       confirmedLocation.confirmedLocation.trim().length > 0
//     ) {
//       navigation.navigate(navigationString.COMPANESS, {item});
//     } else {
//       Alert.alert(
//         'Location Required',
//         'Please add your location before proceeding.',
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeAreaContainer}>
//       {/* Header Section */}
//       <HomeHeader user={userinfo} />

//       {/* Scrollable Content */}
//       <ScrollView
//         style={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}>
//         {/* Slider Component */}
//         {/* <Slider images={sliderdata} />   */}
//         <Slider images={sliderRaw} />
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             paddingHorizontal: 10,
//           }}>
//           <Text
//             style={{...styles.categoryText, fontSize: 18, fontWeight: '700'}}>
//             Products
//           </Text>
//           {/* <TouchableOpacity onPress={() => setIsOpenModal(true)}>
//             <Icon name="filter-outline" size={30} />
//           </TouchableOpacity> */}
//           {selectedCompaney ? (
//             <TouchableOpacity onPress={() => handleReset(true)}>
//               <Icon name="close" size={30} color={COLORS.blackColor} />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity onPress={() => setIsOpenModal(true)}>
//               <Icon name="filter-outline" size={30} />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Categories Section */}
//         {/* <Text style={styles.sectionTitle}>Categories</Text> */}
//         {/* <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.categoryScrollView}
//           contentContainerStyle={styles.categoryScrollContent}
//         >
//           {catagory.map(cat => (
//             <TouchableOpacity
//               key={cat.id}
//               style={styles.categoryItem}
//               onPress={() => handleNavigation(cat)}
//             >
//               <View style={styles.categoryIconContainer}>
//                 <Image
//                   source={{ uri: BASE_URL + cat.image }}
//                   style={styles.categoryIcon}
//                 />
//               </View>
//               <Text style={styles.categoryText}>{cat.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView> */}

//         {/* Quick Food Component */}
//         {/* <QuickFood item={homepageslider} /> */}

//         {/* Best Deals Section */}
//         {/* <Text style={styles.sectionTitle}>Best Deals</Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.dealsScrollView}
//           contentContainerStyle={styles.dealsScrollContent}
//         >
//           {sliderdatabestdeals.map(res => (
//             <TouchableOpacity key={res.id} style={styles.dealCard}>
//               <Image
//                 source={{ uri: BASE_URL + res.image }}
//                 style={styles.dealImage}
//               />
//               <View style={styles.dealCardContent}>
//                 <Text style={styles.dealTitle} numberOfLines={2}>
//                   {res.display_name}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView> */}

//         {/* <ProductsCompo productData={productData}/> */}
//         <ProductsCompo productData={displayProducts} />

//         <FilteringModal
//           isVisible={isOpenModal}
//           onClose={() => setIsOpenModal(false)}
//           catagory={catagory}
//           companees={companees}
//           companeyType={companeyType}
//           setselectedCompaney={setselectedCompaney}
//           onApply={filterProducts}
//         />
//         <Loader visible={isLoding} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   safeAreaContainer: {
//     flex: 1,
//     backgroundColor: COLORS.whiteColor || '#fff',
//   },
//   headerSection: {
//     paddingHorizontal: moderateScale(16),
//     paddingVertical: moderateScale(10),
//     backgroundColor: COLORS.whiteColor || '#fff',
//   },
//   greetingText: {
//     fontSize: moderateScale(20),
//     fontWeight: '800',
//     color: '#333',
//     marginBottom: moderateScale(8),
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   locationButton: {
//     flex: 1,
//     marginRight: moderateScale(10),
//   },
//   locationText: {
//     fontSize: moderateScale(14),
//     color: '#333',
//   },
//   addLocationButton: {
//     flex: 1,
//     marginRight: moderateScale(10),
//   },
//   addLocationText: {
//     fontSize: moderateScale(14),
//     color: '#007AFF',
//     fontWeight: '500',
//   },
//   searchButton: {
//     padding: moderateScale(8),
//     borderRadius: moderateScale(20),
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: moderateScale(20),
//   },
//   sectionTitle: {
//     fontSize: moderateScale(18),
//     fontWeight: 'bold',
//     paddingHorizontal: moderateScale(16),
//     marginTop: moderateScale(20),
//     marginBottom: moderateScale(12),
//     color: '#333',
//   },
//   categoryScrollView: {
//     paddingHorizontal: moderateScale(16),
//   },
//   categoryScrollContent: {
//     paddingRight: moderateScale(16),
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: moderateScale(16),
//     width: moderateScale(80),
//   },
//   categoryIconContainer: {
//     width: moderateScale(60),
//     height: moderateScale(60),
//     borderRadius: moderateScale(30),
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: moderateScale(8),
//   },
//   categoryIcon: {
//     width: moderateScale(50),
//     height: moderateScale(50),
//     borderRadius: moderateScale(25),
//   },
//   categoryText: {
//     fontSize: moderateScale(12),
//     textAlign: 'center',
//     color: '#333',
//     lineHeight: moderateScale(16),
//   },
//   dealsScrollView: {
//     paddingHorizontal: moderateScale(16),
//   },
//   dealsScrollContent: {
//     paddingRight: moderateScale(16),
//   },
//   dealCard: {
//     width: moderateScale(200),
//     marginRight: moderateScale(16),
//     borderRadius: moderateScale(12),
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   dealImage: {
//     width: '100%',
//     height: moderateScale(120),
//     resizeMode: 'cover',
//   },
//   dealCardContent: {
//     padding: moderateScale(12),
//   },
//   dealTitle: {
//     fontSize: moderateScale(14),
//     fontWeight: '600',
//     color: '#333',
//     lineHeight: moderateScale(18),
//   },
// });

// src/screens/Home/HomeScreen.js
import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {View, Text, StatusBar, TouchableOpacity, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  useGetHomeDataQuery,
  useGetSlidersQuery,
} from '../../redux/rtkQuery/ecommerceApi';
import Slider from '../../components/Slider';

import Loader from '../../components/Loader';
import {
  normalizeProductList,
  filterProductsByCategoryAndCompany,
} from '../../utils/filterUtils';
import {COLORS} from '../../styles/colors';
import {moderateScale} from '../../styles/responsiveSize';
import navigationString from '../../navigation/navigationString';
import Icon from 'react-native-vector-icons/Ionicons';
import useDebouncedEffect from '../../utils/useDebouncedEffect';

import ProductsCompo from '../../components/Productscompo/ProductsCompo';
import FilteringModal from '../../components/Productscompo/FilteringModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import makeApiCall from '../../utils/apiHelper';
import {API_URLS} from '../../utils/apiurls';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const userinfo = useSelector(state => state.auth);
  const confirmedLocation = useSelector(state => state.location);

  const {
    data: homeRaw,
    isFetching: isHomeLoading,
    error: homeError,
  } = useGetHomeDataQuery({pageNumber: 1});
  const {data: sliderRaw, isFetching: isSliderLoading} = useGetSlidersQuery();
  console.log(homeError, isHomeLoading, 'Home Data (homeRaw)');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const products = useMemo(() => {
    const prodObj =
      homeRaw?.result?.products || homeRaw?.result?.products || {};
    return normalizeProductList(prodObj);
  }, [homeRaw]);

  const categories = useMemo(() => {
    const catObj = homeRaw?.result?.ecommerce_categories || {};
    const keys = Object.keys(catObj || {}).filter(k =>
      k.startsWith('product_public_category_'),
    );
    const merged = keys.reduce((acc, k) => acc.concat(catObj[k] || []), []);
    return merged;
  }, [homeRaw]);

  const companies = useMemo(() => {
    return homeRaw?.result?.companies || [];
  }, [homeRaw]);

  // filter calculation (debounced)
  useDebouncedEffect(
    () => {
      const result = filterProductsByCategoryAndCompany(
        products,
        selectedCategory,
        selectedCompany,
      );
      setFilteredProducts(result);
    },
    [products, selectedCategory, selectedCompany],
    300,
  );

  const displayProducts = useMemo(
    () => (filteredProducts.length ? filteredProducts : products),
    [filteredProducts, products],
  );
  console.log(displayProducts, 'Display Products');

  const handleAddToCart = useCallback(
    item => {
      // compute unitPrice robustly; backend may use any key
      const unitPrice =
        item.unit_price ?? item.price_per_unit ?? item.price ?? item.mrp ?? 0;
      const companyId = Array.isArray(item.company_id)
        ? item.company_id[0]
        : item.company_id;
      // dispatch(
      //   addItem({
      //     companyId,
      //     item: {
      //       id: item.id,
      //       name: item.display_name ?? item.name,
      //       unitPrice,
      //       ...item,
      //       qty: 1,
      //     },
      //   }),
      // );
    },
    [dispatch],
  );

  const handleOpenCompany = company => {
    if (
      confirmedLocation?.confirmedLocation &&
      confirmedLocation.confirmedLocation.trim().length > 0
    ) {
      navigation.navigate(navigationString.COMPANESS, {item: company});
    } else {
      Alert.alert(
        'Location Required',
        'Please add your location before proceeding.',
      );
    }
  };
  const fethhomdata = async () => {
    try {
      const responce = await makeApiCall(API_URLS.getcatagory, 'POST', {
        jsonrpc: '2.0',
        params: {pageNumber: 1},
      });
      console.log(responce, 'getcatagoryWOWOWOWOWOWOWOWWOOOOWOWOWOWOWO');
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fethhomdata();
  }, []);
  const renderItem = useCallback(
    ({item}) => (
      <ProductsCompo
        item={item}
        onAddPress={handleAddToCart}
        onPress={() =>
          navigation.navigate(navigationString.PREVIEWPRODUCTSCOMPO, {item})
        }
      />
    ),
    [handleAddToCart, navigation],
  );

  // if (homeError) {
  //   return (
  //     <SafeAreaView
  //       style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <Text>Failed to load. Please try again.</Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.whiteColor,
        paddingHorizontal: moderateScale(10),
      }}
      edges={['top', 'left', 'right']}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={COLORS.whiteColor} /> */}
      {/* Header */}
      <View
        style={{
          // padding: moderateScale(16),
          backgroundColor: COLORS.whiteColor,
        }}>
        <Text style={{fontSize: moderateScale(20), fontWeight: '800'}}>
          Hello, {userinfo?.user?.name ?? 'User'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationString.LOCATION)}
            style={{flex: 1}}>
            <Text numberOfLines={1} style={{color: '#333'}}>
              {confirmedLocation?.confirmedLocation
                ? `📍 ${confirmedLocation.confirmedLocation
                    .split(' ')
                    .slice(0, 5)
                    .join(' ')}...`
                : '➕ Add Location'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFilterOpen(true)}>
            <Icon name="filter-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <FlatList
        ListHeaderComponent={
          <>
            {/* Slider */}
            {isSliderLoading ? (
              <Loader visible={true} />
            ) : (
              <Slider
                images={sliderRaw?.result?.data?.sliders?.main_slider || []}
              />
            )}

            {/* Products header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                marginTop: 12,
              }}>
              <Text style={{fontSize: 18, fontWeight: '700'}}>Products</Text>
            </View>
          </>
        }
        data={displayProducts}
        renderItem={renderItem}
        keyExtractor={i => i.id?.toString() ?? JSON.stringify(i)}
        onEndReachedThreshold={0.5}
        numColumns={2}
        onEndReached={() => {
          // trigger pagination if you implement it via RTK query (not included in this example)
        }}
        contentContainerStyle={{paddingBottom: 80}}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Failed to load. Please try again.</Text>
          </View>
        )}
      />

      <FilteringModal
        isVisible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        companies={companies}
        selectedCategory={selectedCategory}
        selectedCompany={selectedCompany}
        onSelectCategory={c => setSelectedCategory(c)}
        onSelectCompany={c => setSelectedCompany(c)}
        onApply={() => {}}
        onReset={() => {
          setSelectedCategory(null);
          setSelectedCompany(null);
          setFilteredProducts([]);
        }}
      />

      {/* global loaders */}
      <Loader visible={isHomeLoading && !displayProducts.length} />
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = {
  columnWrapper: {
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
};
