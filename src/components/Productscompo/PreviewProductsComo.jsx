// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   Dimensions,
//   TouchableOpacity,
//   StatusBar,
//   Platform,
// } from 'react-native';
// import React, {useState} from 'react';
// import Headercomp from '../Headercomp';
// import {COLORS} from '../../styles/colors';
// import {API_URLS, BASE_URL} from '../../utils/apiurls';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {useDispatch, useSelector} from 'react-redux';
// import makeApiCall from '../../utils/apiHelper';
// import {
//   addToCart,
//   decrementQuantity,
//   incrementQuantity,
// } from '../../redux/reducers/addTocart';

// const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// const PreviewProductsComp = ({navigation, route}) => {
//   const productItem = route.params?.item;
//   const dispatch = useDispatch();
//   const cartData = useSelector(state => state.cartinfo.cartData);
//   const cartItem = cartData.find(cartItem => cartItem.id === productItem.id);
//   const quantity1 = cartItem?.quantity || 1;
//   // console.log(productIte1m, '--->>>>>>>>>>>>>>');
//   console.log(cartItem, 'cartttttttttttttt');

//   const {item, quantity} = route.params;
//   // const [quantities, setQuantities] = useState({route?.params?.quantity});
//   // console.log(item, quantity);
//   const [quantities, setQuantities] = useState({
//     [route?.params?.item?.id]: route?.params?.quantity || 1,
//   });
//   // const [selectedVariant, setSelectedVariant] = useState(variants[0]);
//   // console.log(selectedVariant);

//   console.log(item.id, quantity);
//   const images =
//     Array.isArray(productItem?.images) && productItem.images.length > 0
//       ? productItem.images.map(img => BASE_URL + img)
//       : [BASE_URL + productItem?.image];

//   const [isFavorite, setIsFavorite] = useState(false);
//   const [selectedSize, setSelectedSize] = useState('XL');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const variantData = item?.variant_data || [];
//   const [isLoding, setisLoding] = useState(false);

//   // Map to objects for easier handling
//   const variants = variantData.map(v => ({
//     id: v[0],
//     type: v[1],
//     quantityty: v[2],
//     price: v[3],
//     qty: '0',
//   }));
//   console.log(variants);
//   const [selectedVariant, setSelectedVariant] = useState(variants[0]);
//   console.log(selectedVariant, 'vvvvvv');

//   const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

//   const handleIncrement = () => {
//     dispatch(incrementQuantity(item.id));
//   };

//   const handleDecrement = () => {
//     dispatch(decrementQuantity(item.id));
//   };

//   const handlesubmit = () => {
//     dispatch(
//       addToCart({
//         ...item,
//         quantity: quantity1,
//         selectedVariant: selectedVariant,
//       }),
//     );
//   };
//   // const handlesubmit = async () => {
//   //   try {
//   //     setisLoding(true);
//   //     // const payload1 = {
//   //     //   jsonrpc: '2.0',
//   //     //   params: {
//   //     //     product_id: defaultVariant,
//   //     //     product_template_id: item.id,
//   //     //     set_qty: 0,
//   //     //     add_qty: item?.quantity || 1,
//   //     //   },
//   //     // };

//   //     const payload = {
//   //       jsonrpc: '2.0',
//   //       params: {
//   //         product_template_id: item.id,
//   //         product_id: selectedVariant.id,
//   //         add_qty: quantities[item.id],
//   //         set_qty: 0,
//   //       },
//   //     };
//   //     console.log(payload, 'payLoad');
//   //     const res = await makeApiCall(API_URLS.addToCart, 'POST', payload);
//   //     console.log(res, 'add to cart response');
//   //   } catch (error) {
//   //     console.log(error);
//   //   } finally {
//   //     setisLoding(false);
//   //   }
//   // };

//   const renderStarIcon = rating => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <Text key={i} style={styles.star}>
//           {i <= rating ? '★' : '☆'}
//         </Text>,
//       );
//     }
//     return <View style={styles.starsContainer}>{stars}</View>;
//   };

//   const handleScroll = event => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
//     setCurrentImageIndex(index);
//   };

//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
//       <View style={styles.container}>
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor={COLORS.whiteColor}
//         />

//         <Headercomp left={true} onPress={() => navigation.goBack()} />

//         {/* Image Carousel */}
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={styles.imageContainer}>
//             <ScrollView
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={handleScroll}
//               scrollEventThrottle={16}>
//               {images.length > 0 ? (
//                 images.map((imageUrl, index) => (
//                   <View key={index} style={styles.imageWrapper}>
//                     <Image
//                       source={{uri: imageUrl}}
//                       style={styles.image}
//                       resizeMode="cover"
//                     />
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.noImageContainer}>
//                   <Text style={styles.noImageText}>📷</Text>
//                   <Text style={styles.noImageSubtext}>No Image Available</Text>
//                 </View>
//               )}
//             </ScrollView>

//             {/* Image Pagination Dots */}
//             {images.length > 1 && (
//               <View style={styles.paginationContainer}>
//                 {images.map((_, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       styles.paginationDot,
//                       currentImageIndex === index && styles.paginationDotActive,
//                     ]}
//                   />
//                 ))}
//               </View>
//             )}

//             {/* Favorite Button */}
//             <TouchableOpacity
//               style={styles.favoriteButton}
//               onPress={() => setIsFavorite(!isFavorite)}
//               activeOpacity={0.7}>
//               <Text style={styles.favoriteIcon}>
//                 {isFavorite ? '❤️' : '🤍'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Product Details */}
//           <ScrollView
//             style={styles.detailsScrollView}
//             showsVerticalScrollIndicator={false}>
//             <View style={styles.detailsContainer}>
//               {/* Product Name & Price */}
//               <View style={styles.headerSection}>
//                 <View style={styles.titleContainer}>
//                   <Text style={styles.productTitle} numberOfLines={2}>
//                     {productItem?.name || 'Product Name'}
//                   </Text>
//                   <View style={styles.ratingContainer}>
//                     {renderStarIcon(4)}
//                     <Text style={styles.ratingText}>(4.0)</Text>
//                   </View>
//                 </View>

//                 <View style={styles.priceContainer}>
//                   <Text style={styles.priceLabel}>Price</Text>
//                   <Text style={styles.price}>
//                     ₹{selectedVariant?.price || '0'}
//                   </Text>
//                 </View>
//               </View>

//               {/* Divider */}
//               <View style={styles.divider} />

//               {/* Product Info */}
//               {productItem?.description && (
//                 <View style={styles.section}>
//                   <Text style={styles.sectionTitle}>Description</Text>
//                   <Text style={styles.description}>
//                     {productItem.description}
//                   </Text>
//                 </View>
//               )}

//               {/* Size Selection */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Select Size</Text>
//                 <View style={styles.sizesContainer}>
//                   {/* {sizes.map(size => (
//                     <TouchableOpacity
//                       key={size}
//                       style={[
//                         styles.sizeButton,
//                         selectedSize === size && styles.sizeButtonActive,
//                       ]}
//                       onPress={() => setSelectedSize(size)}
//                       activeOpacity={0.7}>
//                       <Text
//                         style={[
//                           styles.sizeText,
//                           selectedSize === size && styles.sizeTextActive,
//                         ]}>
//                         {size}
//                       </Text>
//                     </TouchableOpacity>
//                   ))} */}
//                   {variants.map(variant => (
//                     <TouchableOpacity
//                       key={variant.id}
//                       style={[
//                         styles.sizeButton,
//                         selectedVariant.id === variant.id &&
//                           styles.sizeButtonActive,
//                       ]}
//                       onPress={() => setSelectedVariant(variant)}>
//                       <Text
//                         style={[
//                           styles.sizeText,
//                           selectedVariant.id === variant.id &&
//                             styles.sizeTextActive,
//                         ]}>
//                         {variant.type} ({variant.qty})
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Product Details */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Product Details</Text>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Brand:</Text>
//                   <Text style={styles.detailValue}>
//                     {productItem?.company_brand_id || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>SKU:</Text>
//                   <Text style={styles.detailValue}>
//                     {productItem?.default_code || productItem?.id || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Availability:</Text>
//                   <Text style={[styles.detailValue, styles.availabilityText]}>
//                     {productItem?.active ? 'In Stock' : 'Out of Stock'}
//                   </Text>
//                 </View>
//               </View>

//               {/* Extra padding at bottom */}
//               <View style={{height: 100}} />
//             </View>
//           </ScrollView>
//         </ScrollView>

//         {/* Bottom Action Bar */}
//         <View style={styles.bottomBar}>
//           <View style={styles.quantityContainer}>
//             <TouchableOpacity
//               style={styles.qtyBtn}
//               onPress={() => handleDecrement(productItem)}>
//               <Text style={{...styles.qtyText, color: COLORS.whiteColor}}>
//                 -
//               </Text>
//             </TouchableOpacity>
//             {/* <Text style={styles.qtyText}>{quantities}</Text> */}
//             {/* <Text style={styles.qtyText}>
//               {quantities[productItem?.id] || 1}
//             </Text> */}
//             <Text style={styles.qtyText}>{quantity1}</Text>
//             <TouchableOpacity
//               style={styles.qtyBtn}
//               onPress={() => handleIncrement(productItem)}>
//               <Text style={{...styles.qtyText, color: COLORS.whiteColor}}>
//                 +
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={styles.addToCartButton}
//             activeOpacity={0.8}
//             onPress={handlesubmit}>
//             <Text style={styles.addToCartText}>Add to Cart</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PreviewProductsComp;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.whiteColor,
//   },
//   imageContainer: {
//     width: screenWidth,
//     height: screenWidth * 0.9,
//     backgroundColor: '#F8F8F8',
//   },
//   imageWrapper: {
//     width: screenWidth,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   noImageContainer: {
//     width: screenWidth,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noImageText: {
//     fontSize: 64,
//     marginBottom: 8,
//   },
//   noImageSubtext: {
//     fontSize: 16,
//     color: '#999',
//   },
//   paginationContainer: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     flexDirection: 'row',
//   },
//   paginationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     marginHorizontal: 4,
//   },
//   paginationDotActive: {
//     backgroundColor: COLORS.whiteColor,
//     width: 24,
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 2},
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   favoriteIcon: {
//     fontSize: 24,
//   },
//   detailsScrollView: {
//     flex: 1,
//   },
//   detailsContainer: {
//     padding: 20,
//   },
//   headerSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   productTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1A1A1A',
//     marginBottom: 8,
//     lineHeight: 28,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   starsContainer: {
//     flexDirection: 'row',
//   },
//   star: {
//     fontSize: 16,
//     color: '#FFB800',
//     marginRight: 2,
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 6,
//     fontWeight: '600',
//   },
//   priceContainer: {
//     alignItems: 'flex-end',
//   },
//   priceLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 2,
//   },
//   price: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.green || '#00C853',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#E0E0E0',
//     marginVertical: 20,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A1A1A',
//     marginBottom: 12,
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 22,
//   },
//   sizesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   sizeButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     backgroundColor: COLORS.whiteColor,
//     minWidth: 60,
//     alignItems: 'center',
//   },
//   sizeButtonActive: {
//     borderColor: COLORS.green || '#00C853',
//     backgroundColor: COLORS.green || '#00C853',
//   },
//   sizeText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//   },
//   sizeTextActive: {
//     color: COLORS.whiteColor,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   detailValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1A1A1A',
//   },
//   availabilityText: {
//     color: '#00C853',
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: '#fff',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   qtyBtn: {
//     padding: 10,
//     backgroundColor: COLORS.green,
//     borderRadius: 5,
//   },
//   qtyText: {
//     marginHorizontal: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.blackColor,
//   },
//   addToCartButton: {
//     backgroundColor: COLORS.green,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   addToCartText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Headercomp from '../Headercomp';
import {COLORS} from '../../styles/colors';
import {API_URLS, BASE_URL} from '../../utils/apiurls';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import makeApiCall from '../../utils/apiHelper';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from '../../redux/reducers/addTocart';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const PreviewProductsComp = ({navigation, route}) => {
  const productItem = route.params?.item;
  const dispatch = useDispatch();
  const cartData = useSelector(state => state.cartinfo.cartData);
  // const [cartQuentity, setCartQuentity] = useState(0);

  // Get the selected variant from route params or use default
  const [selectedVariant, setSelectedVariant] = useState(
    route.params?.selectedVariant || null,
  );

  // Map to objects for easier handling
  const variantData = productItem?.variant_data || [];
  const variants = variantData.map(v => ({
    id: v[0],
    type: v[1],
    price: v[3],
    // qty: cartQuentity,
  }));

  // Initialize selected variant if not set
  if (!selectedVariant && variants.length > 0) {
    setSelectedVariant(variants[0]);
  }

  // Find cart item with the same product ID AND variant ID
  // A cart item is now uniquely identified by BOTH the product ID and the selected variant ID.
  const cartItem = cartData.find(
    cartItem =>
      // 1. Check for the same product
      cartItem.id === productItem.id &&
      // 2. Check for the same selected variant ID
      cartItem.selectedVariant?.id === selectedVariant?.id,
  );

  console.log(cartItem, 'cartttttttttttttt');

  const quantity1 = cartItem?.quantity || 0;
  // console.log(quantity1, 'quantity1');

  const images =
    Array.isArray(productItem?.images) && productItem.images.length > 0
      ? productItem.images.map(img => BASE_URL + img)
      : [BASE_URL + productItem?.image];

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoding, setisLoding] = useState(false);

  const handleIncrement = () => {
    if (selectedVariant) {
      dispatch(
        incrementQuantity({
          productId: productItem.id,
          variantId: selectedVariant.id,
        }),
      );
    }
  };

  const handleDecrement = () => {
    if (selectedVariant && quantity1 > 0) {
      dispatch(
        decrementQuantity({
          productId: productItem.id,
          variantId: selectedVariant.id,
        }),
      );
    }
  };

  const handlesubmit = () => {
    if (!selectedVariant) {
      console.log('No variant selected');
      return;
    }

    dispatch(
      addToCart({
        ...productItem,
        quantity: 1, // Start with quantity 1 when adding new variant
        selectedVariant: selectedVariant,
      }),
    );
  };

  const renderStarIcon = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? '★' : '☆'}
        </Text>,
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const handleScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentImageIndex(index);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.whiteColor}
        />

        <Headercomp left={true} onPress={() => navigation.goBack()} />

        {/* Image Carousel */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}>
              {images.length > 0 ? (
                images.map((imageUrl, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{uri: imageUrl}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                ))
              ) : (
                <View style={styles.noImageContainer}>
                  <Text style={styles.noImageText}>📷</Text>
                  <Text style={styles.noImageSubtext}>No Image Available</Text>
                </View>
              )}
            </ScrollView>

            {/* Image Pagination Dots */}
            {images.length > 1 && (
              <View style={styles.paginationContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      currentImageIndex === index && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Favorite Button */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.7}>
              <Text style={styles.favoriteIcon}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Product Details */}
          <ScrollView
            style={styles.detailsScrollView}
            showsVerticalScrollIndicator={false}>
            <View style={styles.detailsContainer}>
              {/* Product Name & Price */}
              <View style={styles.headerSection}>
                <View style={styles.titleContainer}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {productItem?.name || 'Product Name'}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {renderStarIcon(4)}
                    <Text style={styles.ratingText}>(4.0)</Text>
                  </View>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Price</Text>
                  <Text style={styles.price}>
                    ₹{selectedVariant?.price || '0'}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Product Info */}
              {productItem?.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>
                    {productItem.description}
                  </Text>
                </View>
              )}

              {/* Variant Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Variant</Text>
                <View style={styles.sizesContainer}>
                  {variants.map(variant => {
                    // Check if this variant is in cart
                    const variantInCart = cartData.find(
                      cartItem =>
                        cartItem.id === productItem.id &&
                        cartItem.selectedVariant?.id === variant.id,
                    );
                    const cartQuantity = variantInCart?.quantity || 0;
                    // setCartQuentity(cartQuantity);

                    return (
                      <TouchableOpacity
                        key={variant.id}
                        style={[
                          styles.sizeButton,
                          selectedVariant?.id === variant.id &&
                            styles.sizeButtonActive,
                        ]}
                        onPress={() => setSelectedVariant(variant)}>
                        <Text
                          style={[
                            styles.sizeText,
                            selectedVariant?.id === variant.id &&
                              styles.sizeTextActive,
                          ]}>
                          {variant.type}
                          {cartQuantity > 0 && ` (${cartQuantity} in cart)`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Product Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Brand:</Text>
                  <Text style={styles.detailValue}>
                    {productItem?.company_brand_id || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>SKU:</Text>
                  <Text style={styles.detailValue}>
                    {productItem?.default_code || productItem?.id || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Availability:</Text>
                  <Text style={[styles.detailValue, styles.availabilityText]}>
                    {productItem?.active ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
                {selectedVariant && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Selected Variant:</Text>
                    <Text style={styles.detailValue}>
                      {selectedVariant.type} - ₹{selectedVariant.price}
                    </Text>
                  </View>
                )}
              </View>

              {/* Extra padding at bottom */}
              <View style={{height: 100}} />
            </View>
          </ScrollView>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.qtyBtn, quantity1 === 0 && styles.qtyBtnDisabled]}
              onPress={handleDecrement}
              disabled={quantity1 === 0}>
              <Text style={{...styles.qtyText, color: COLORS.whiteColor}}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity1}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={handlesubmit}>
              <Text style={{...styles.qtyText, color: COLORS.whiteColor}}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            activeOpacity={0.8}
            onPress={handlesubmit}>
            <Text style={styles.addToCartText}>{'Add to Cart'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PreviewProductsComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  imageContainer: {
    width: screenWidth,
    height: screenWidth * 0.9,
    backgroundColor: '#F8F8F8',
  },
  imageWrapper: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 64,
    marginBottom: 8,
  },
  noImageSubtext: {
    fontSize: 16,
    color: '#999',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.whiteColor,
    width: 24,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  favoriteIcon: {
    fontSize: 24,
  },
  detailsScrollView: {
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 28,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    color: '#FFB800',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.green || '#00C853',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.whiteColor,
    minWidth: 60,
    alignItems: 'center',
  },
  sizeButtonActive: {
    borderColor: COLORS.green || '#00C853',
    backgroundColor: COLORS.green || '#00C853',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sizeTextActive: {
    color: COLORS.whiteColor,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  availabilityText: {
    color: '#00C853',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    padding: 10,
    backgroundColor: COLORS.green,
    borderRadius: 5,
  },
  qtyBtnDisabled: {
    backgroundColor: '#ccc',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.blackColor,
  },
  addToCartButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
