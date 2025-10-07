// import React, {useState, useCallback, useMemo} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import {COLORS} from '../../styles/colors';
// import {BASE_URL} from '../../utils/apiurls';
// import {useDispatch} from 'react-redux';
// import {addToCart} from '../../redux/reducers/addTocart';
// import {useNavigation} from '@react-navigation/native';
// import navigationString from '../../navigation/navigationString';

// // Move ProductCard OUTSIDE the parent component
// const ProductCard = React.memo(
//   ({item, quantity, onIncrement, onDecrement, onAdd, onNavigate}) => {
//     return (
//       <TouchableOpacity
//         style={styles.card}
//         onPress={() => onNavigate(item)}
//         activeOpacity={0.9}>
//         {item.discountPercentage ? (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>
//               {Math.round(item.discountPercentage)}% Off
//             </Text>
//           </View>
//         ) : null}

//         <View style={styles.productImageContainer}>
//           <Image
//             source={{uri: BASE_URL + item.image}}
//             style={styles.productImage}
//             resizeMode="contain"
//           />
//         </View>

//         <View style={styles.productInfo}>
//           <Text style={styles.productTitle} numberOfLines={2}>
//             {item.name}
//           </Text>
//           <Text style={styles.productWeight}>{item.categ_id}</Text>

//           <View style={styles.priceContainer}>
//             <Text style={styles.originalPrice}>₹ {item.list_price}</Text>
//             <Text style={styles.discountedPrice}>
//               ₹ {(item.list_price - (item.list_price * 10) / 100).toFixed(0)}
//             </Text>
//           </View>

//           <View style={styles.plusMinusContainer}>
//             <TouchableOpacity style={styles.plusButton} onPress={onDecrement}>
//               <Text style={styles.plusMinusText}>-</Text>
//             </TouchableOpacity>

//             <Text style={{...styles.plusMinusText, color: COLORS.blackColor}}>
//               {quantity}
//             </Text>

//             <TouchableOpacity style={styles.plusButton} onPress={onIncrement}>
//               <Text style={styles.plusMinusText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.addButton} onPress={onAdd}>
//             <Text style={styles.addButtonText}>
//               Add {quantity > 1 ? `(${quantity})` : ''}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   },
//   // Custom comparison function - only re-render if quantity changes
//   (prevProps, nextProps) => {
//     return (
//       prevProps.item.id === nextProps.item.id &&
//       prevProps.quantity === nextProps.quantity
//     );
//   },
// );

// const ProductsCompo = ({productData}) => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const [quantities, setQuantities] = useState({});

//   // Memoize navigation handler
//   // const handleNavigate = useCallback(
//   //   item => {
//   //     navigation.navigate(navigationString.PREVIEWPRODUCTSCOMPO, {
//   //       item,
//   //       // quantity: quantities[item.id] || 1,
//   //       quantity: quantities || 1,
//   //     });
//   //   },
//   //   [navigation, quantities],
//   // );
//   const handleNavigate = useCallback(
//     item => {
//       navigation.navigate(navigationString.PREVIEWPRODUCTSCOMPO, {
//         item,
//         quantity: quantities[item.id] || 1,
//       });
//     },
//     [navigation, quantities],
//   );

//   const handleIncrement = useCallback(id => {
//     setQuantities(prev => ({
//       ...prev,
//       [id]: (prev[id] || 1) + 1,
//     }));
//   }, []);

//   const handleDecrement = useCallback(id => {
//     setQuantities(prev => ({
//       ...prev,
//       [id]: Math.max((prev[id] || 1) - 1, 1),
//     }));
//   }, []);

//   const handleAddToCart = useCallback(
//     (item, quantity) => {
//       dispatch(addToCart({...item, quantity}));
//     },
//     [dispatch],
//   );

//   const renderItem = useCallback(
//     ({item}) => {
//       const quantity = quantities[item.id] || 1;

//       return (
//         <ProductCard
//           item={item}
//           quantity={quantity}
//           onIncrement={() => handleIncrement(item.id)}
//           onDecrement={() => handleDecrement(item.id)}
//           onAdd={() => handleAddToCart(item, quantity)}
//           onNavigate={handleNavigate}
//         />
//       );
//     },
//     [
//       quantities,
//       handleIncrement,
//       handleDecrement,
//       handleAddToCart,
//       handleNavigate,
//     ],
//   );

//   const keyExtractor = useCallback(item => item.id.toString(), []);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={productData}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         showsVerticalScrollIndicator={false}
//         initialNumToRender={10}
//         maxToRenderPerBatch={10}
//         windowSize={5}
//         removeClippedSubviews={true}
//         updateCellsBatchingPeriod={50}
//         getItemLayout={(data, index) => ({
//           length: 280,
//           offset: 280 * Math.floor(index / 2),
//           index,
//         })}
//       />
//     </View>
//   );
// };

// export default ProductsCompo;

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 10, backgroundColor: COLORS.whiteColor},
//   card: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//     position: 'relative',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     backgroundColor: '#9c27b0',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     zIndex: 1,
//     borderTopLeftRadius: 12,
//   },
//   discountText: {color: '#fff', fontSize: 14, fontWeight: 'bold'},
//   productImageContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//     height: 100,
//     justifyContent: 'center',
//   },
//   productImage: {width: 100, height: 100},
//   productInfo: {gap: 8},
//   productTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     lineHeight: 22,
//   },
//   productWeight: {fontSize: 14, color: '#666', fontWeight: '500'},
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginTop: 5,
//   },
//   originalPrice: {
//     fontSize: 14,
//     color: '#999',
//     textDecorationLine: 'line-through',
//   },
//   discountedPrice: {fontSize: 18, color: '#333', fontWeight: 'bold'},
//   addButton: {
//     backgroundColor: '#fff',
//     borderColor: '#ff0000',
//     borderWidth: 2,
//     borderRadius: 25,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButtonText: {color: '#ff0000', fontSize: 16, fontWeight: 'bold'},
//   plusButton: {padding: 12, backgroundColor: COLORS.green, borderRadius: 10},
//   plusMinusContainer: {flexDirection: 'row', alignItems: 'center', gap: 15},
//   plusMinusText: {fontWeight: '600', color: COLORS.whiteColor, fontSize: 16},
//   columnWrapper: {justifyContent: 'space-between', gap: 10},
// });

// src/components/ProductCard.js
import React, {memo} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {moderateScale} from '../../styles/responsiveSize';
import {COLORS} from '../../styles/colors'; // Assuming COLORS is defined with primary/green/black/white
import Icon from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../../utils/apiurls';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from '../../redux/reducers/addTocart';

const ProductCard = ({item, onAddPress, onPress}) => {
  const dispatch = useDispatch();
  const cartData = useSelector(state => state.cartinfo.cartData);
  const cartItem = cartData.find(cartItem => cartItem.id === item.id);
  const quantity = cartItem?.quantity || 0;
  const discountPercentage = item.discountPercentage || 10;
  const discountedPrice = item.list_price
    ? (item.list_price - (item.list_price * discountPercentage) / 100).toFixed(
        0,
      )
    : item.list_price;
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      }),
    );
  };

  const handleIncrement = () => {
    dispatch(incrementQuantity(item.id));
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity(item.id));
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)} // Use the passed onPress prop
      activeOpacity={0.8}>
      {/* 1. Discount Badge (Top Left) */}
      {discountPercentage > 0 ? (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {Math.round(discountPercentage)}% OFF
          </Text>
        </View>
      ) : null}

      {/* 2. Product Image */}
      <View style={styles.productImageContainer}>
        <Image
          source={{uri: BASE_URL + item.image}}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* 3. Product Info */}
      <View style={styles.productInfo}>
        <Text
          style={styles.productTitle}
          numberOfLines={2}
          ellipsizeMode="tail">
          {item.name}
        </Text>

        <Text style={styles.productDetail}>{item.category_name || 'Unit'}</Text>

        <View style={styles.priceActionContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>₹ {discountedPrice}</Text>

            {item.list_price > discountedPrice && (
              <Text style={styles.originalPrice}>₹ {item.list_price}</Text>
            )}
          </View>

          {/* Action Button: Add/Quantity */}
          {/* Implement quantity control logic here */}
          {/* Example: quantity === 0 ? AddButton : QuantityControl */}

          {/* Placeholder for ADD button */}
          {/* <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
            activeOpacity={0.7}>
            <Icon name="add" size={18} color={COLORS.whiteColor} />
          </TouchableOpacity> */}

          {/* Placeholder for Quantity Control (if quantity > 0) */}
          {/* <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.minusButton}>
              <Text style={styles.plusMinusText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>1</Text>
            <TouchableOpacity style={styles.plusButton}>
              <Text style={styles.plusMinusText}>+</Text>
            </TouchableOpacity>
          </View> */}
          {quantity > 0 ? (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.minusButton}
                onPress={handleDecrement}
                activeOpacity={0.7}>
                <Text style={styles.plusMinusText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.plusButton}
                onPress={handleIncrement}
                activeOpacity={0.7}>
                <Text style={styles.plusMinusText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              activeOpacity={0.7}>
              <Icon name="add" size={18} color={COLORS.whiteColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProductCard);

const styles = StyleSheet.create({
  // --- CARD & LAYOUT STYLES ---
  card: {
    flex: 1,
    backgroundColor: COLORS.whiteColor || '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    marginBottom: moderateScale(15),

    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.blackColor || '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },

  productImageContainer: {
    alignItems: 'center',
    height: moderateScale(100),
    justifyContent: 'center',
    marginBottom: moderateScale(10),
  },
  productImage: {
    width: '100%',
    height: '100%',
  },

  // --- INFO STYLES ---
  productInfo: {
    gap: moderateScale(4),
  },
  productTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.blackColor || '#333',
    lineHeight: moderateScale(18),
    // width: '50%',
  },
  productDetail: {
    fontSize: moderateScale(12),
    color: COLORS.gray || '#666',
    fontWeight: '500',
  },

  priceActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderateScale(8),
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: moderateScale(2),
  },
  originalPrice: {
    fontSize: moderateScale(12),
    color: COLORS.gray || '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: moderateScale(16),
    color: COLORS.darkGreen || '#228B22',
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.red || '#ff0000',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    zIndex: 1,
    borderTopRightRadius: moderateScale(12),
    borderBottomLeftRadius: moderateScale(12),
  },
  discountText: {
    color: COLORS.whiteColor || '#fff',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: COLORS.primary || '#4CAF50',
    borderRadius: moderateScale(25),
    padding: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    overflow: 'hidden',
  },
  minusButton: {padding: 8},
  plusButton: {padding: 8},
  quantityText: {
    paddingHorizontal: 10,
    color: COLORS.whiteColor || '#fff',
    fontWeight: 'bold',
  },
  plusMinusText: {fontWeight: 'bold', color: COLORS.whiteColor, fontSize: 16},
});
