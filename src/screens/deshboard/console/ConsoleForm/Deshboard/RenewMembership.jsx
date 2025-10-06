// import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {COLORS} from '../../../../../styles/colors';
// import Headercomp from '../../../../../components/Headercomp';
// import makeApiCall from '../../../../../utils/apiHelper';
// import {API_URLS} from '../../../../../utils/apiurls';
// import Loader from '../../../../../components/Loader';
// import CheckBox from '@react-native-community/checkbox';
// import Dropdowncomp from '../../../../../components/Dropdowncomp';

// const RenewMembership = ({navigation}) => {
//   const [isLoding, setisloding] = useState(false);
//   const [products, setProducts] = useState([]);
//   console.log(products);
//   const fetchRenewmembershiop = async () => {
//     try {
//       setisloding(true);
//       const responce = await makeApiCall(API_URLS.renewMembership, 'POST', {
//         jsonrpc: '2.0',
//         params: {data: {method: 'GET'}},
//       });
//       // console.log('GETRESPONCE',responce)
//       if (responce?.result?.products) {
//         setProducts(Object.values(responce.result.products));
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setisloding(false);
//     }
//   };
//   useEffect(() => {
//     fetchRenewmembershiop();
//   }, []);
//   const renderItem=({item})=>{
//     const variantOptions = Object.values(item?.variants || {}).map(variant => ({
//       label: variant.name, // "Unit: 1"
//       value: variant.id,   // 14200580
//       price: variant.price // 100
//     }));
// console.log(variantOptions,'iiiiiiii')
//     return(
//       <TouchableOpacity style={{...styles.card}}>
//         <Text style={{...styles.label}}>{item?.name}</Text>
//         <CheckBox/>
//         <Dropdowncomp
//         data={[{lebel:'1',value:1}]}/>
//         <Text>Price:{item?.variantOptions?.price}</Text>
//       </TouchableOpacity>
//     )
//   }
//   return (
//     <SafeAreaView style={{...styles.container}}>
//       <Headercomp
//         title={'Renew Membership'}
//         left={true}
//         onPress={() => navigation.goBack()}
//       />
//       <FlatList
//       data={products}
//       keyExtractor={(item)=>item?.id?.toString()}
//       renderItem={renderItem}
//       />
//       <Loader visible={isLoding} />
//     </SafeAreaView>
//   );
// };

// export default RenewMembership;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.whiteColor,
//     paddingHorizontal:10
//   },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
// });

import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import makeApiCall from '../../../../../utils/apiHelper';
import {API_URLS} from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import CheckBox from '@react-native-community/checkbox';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import {fetchCartData} from '../../../../../redux/reducers/fetchCartData';
import {useDispatch} from 'react-redux';
import MessageShow from '../../../../../constant/MessageShow';
import navigationString from '../../../../../navigation/navigationString';

const RenewMembership = ({navigation}) => {
  const [isLoding, setisloding] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({}); // Track selected products
  const [selectedVariants, setSelectedVariants] = useState({}); // Track selected variants
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();

  // console.log('Products:', products);
  console.log('Selected Products:', selectedProducts);
  // console.log('Selected Variants:', selectedVariants);

  const fetchRenewmembershiop = async () => {
    try {
      setisloding(true);
      const responce = await makeApiCall(API_URLS.renewMembership, 'POST', {
        jsonrpc: '2.0',
        params: {data: {method: 'GET'}},
      });

      if (responce?.result?.products) {
        const productsArray = Object.values(responce.result.products);
        setProducts(productsArray);

        // Initialize selected variants with default values
        const initialVariants = {};
        productsArray.forEach(product => {
          initialVariants[product.id] = product.default;
        });
        setSelectedVariants(initialVariants);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloding(false);
    }
  };

  // Function to handle checkbox toggle
  const handleProductSelection = (productId, isSelected) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: isSelected,
    }));
    calculateTotalPrice();
  };

  // Function to handle variant selection
  const handleVariantSelection = (productId, variantId) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId,
    }));
    calculateTotalPrice();
  };

  // Calculate total price based on selected products and variants
  const calculateTotalPrice = () => {
    let total = 0;
    products.forEach(product => {
      if (selectedProducts[product.id]) {
        const selectedVariantId = selectedVariants[product.id];
        const selectedVariant = product.variants[selectedVariantId];
        if (selectedVariant) {
          total += selectedVariant.price;
        }
      }
    });
    setTotalPrice(total);
  };

  const handleSubmit = async () => {
    try {
      setisloding(true);
      // collect only checked product IDs
      const selectedProductIds = Object.keys(selectedProducts)
        .filter(productId => selectedProducts[productId]) // only true
        .map(productId => Number(selectedVariants[productId] || productId));
      // use selected variant id, fallback product id

      const payload = {
        jsonrpc: '2.0',
        params: {
          data: {
            products: selectedProductIds,
            method: 'POST',
          },
        },
      };

      console.log('SUBMIT PAYLOAD', payload);

      const response = await makeApiCall(
        API_URLS.renewMembership,
        'POST',
        payload,
      );

      console.log('SUBMIT RESPONSE', response);
      if (response?.result?.message === 'message') {
        await dispatch(fetchCartData());
        setSelectedProducts({});
        MessageShow.success('success', response?.result?.message);

        navigation.navigate(navigationString.TABROUTE, {
          screen: navigationString.CARTSCREEN,
        });
      }
    } catch (error) {
      console.log('SUBMIT ERROR', error);
    } finally {
      setisloding(false);
    }
  };

  // Recalculate when selections change
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedProducts, selectedVariants, products]);

  const renderItem = ({item}) => {
    // Create variant options for dropdown
    const variantOptions = Object.values(item?.variants || {}).map(variant => ({
      label: variant.name || `Option ${variant.id}`, // Handle empty names
      value: variant.id,
      price: variant.price,
    }));

    // console.log('Variant Options for', item.name, ':', variantOptions);

    // Get currently selected variant
    const selectedVariantId = selectedVariants[item.id];
    const selectedVariant = item.variants?.[selectedVariantId];
    const currentPrice = selectedVariant?.price || 0;

    // Check if product is selected
    const isProductSelected = selectedProducts[item.id] || false;

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>{item?.name}</Text>
          <CheckBox
            value={isProductSelected}
            onValueChange={value => handleProductSelection(item.id, value)}
            tintColors={{true: COLORS.primaryColor, false: COLORS.borderColor}}
          />
        </View>

        {variantOptions.length > 1 && (
          <View style={styles.dropdownContainer}>
            <Text style={styles.subLabel}>Select Option:</Text>
            <Dropdowncomp
              data={variantOptions}
              selectedValue={selectedVariantId}
              // onChange={}
              onChange={value => handleVariantSelection(item.id, value)}
              placeholder="Choose variant"
            />
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price: </Text>
          <Text style={styles.priceValue}>₹{currentPrice}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchRenewmembershiop();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'Renew Membership'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <FlatList
        data={products}
        keyExtractor={item => item?.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Total Price Section */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total: ₹{totalPrice}</Text>
        <TouchableOpacity style={styles.renewButton} onPress={handleSubmit}>
          <Text style={styles.renewButtonText}>Renew Membership</Text>
        </TouchableOpacity>
      </View>

      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default RenewMembership;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingBottom: 100, // Space for total container
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textColor || '#000',
    flex: 1,
  },
  subLabel: {
    fontSize: 14,
    color: COLORS.textColor || '#666',
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textColor || '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryColor || '#007AFF',
  },
  totalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.whiteColor,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor || '#E5E5E5',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textColor || '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  renewButton: {
    backgroundColor: COLORS.primaryColor || '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  renewButtonText: {
    color: COLORS.whiteColor || '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
