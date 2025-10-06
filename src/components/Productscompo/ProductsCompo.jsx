// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {COLORS} from '../../styles/colors';
// import makeApiCall from '../../utils/apiHelper';
// import navigationString from '../../navigation/navigationString';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { BASE_URL } from '../../utils/apiurls';
// import { addToCart } from '../../redux/reducers/addTocart';
// const ProductsCompo = ({productData}) => {
//   console.log(productData,'ppppppppppp')
 
//   const [quantities, setQuantities] = useState({});
//   const navigation=useNavigation()
//   const dispatch=useDispatch()
 
//   const handleCountIncrement = id => {
//     setQuantities(prev => ({
//       ...prev,
//       [id]: (prev[id] || 1) + 1,
//     }));
//   };
//   const handleDecrement = (id) => {
//     console.log(id)
//     setQuantities(prev=>({
//       ...prev,
//       [id]:prev[id]>1?prev[id]-1:1
//     }))
//   };



//   const renderProduct = ({item}) => {
//     return (
//       <TouchableOpacity style={styles.card} activeOpacity={0.9}
//       onPress={() => navigation.navigate(navigationString.PREVIEWPRODUCTSCOMPO,{item})}
//       >
//         {/* Discount Badge */}
//         {item.discountPercentage ? (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>
//               {Math.round(item.discountPercentage)} % Off
//             </Text>
//           </View>
//         ) : null}

//         {/* Product Image */}
//         <View style={styles.productImageContainer}>
//           <Image
//             source={{uri:BASE_URL+ item.image}}
//             style={styles.productImage}
//             resizeMode="contain"
            
//           />
//         </View>

//         {/* Product Info */}
//         <View style={styles.productInfo}>
//           <Text style={styles.productTitle} numberOfLines={2}>
//             {item.name}
//           </Text>
//           <Text style={styles.productWeight}>{item.categ_id}</Text>

//           <View style={styles.priceContainer}>
//             <Text style={styles.originalPrice}>₹ {item.price}10</Text>
//             <Text style={styles.discountedPrice}>
//               ₹{' '}
//               {(
//                 item.list_price
//                 -
//                 (item.list_price* 10) / 100
//               ).toFixed(0)}
//             </Text>
//           </View>
//           <View style={{...styles.plusMinusContainer}}>
//           <TouchableOpacity
//               style={{...styles.plusButton}}
//               onPress={() => handleDecrement(item.id)}>
//               <Text style={{...styles.plusMinusText, paddingHorizontal: 1}}>
//                 -
//               </Text>
//             </TouchableOpacity>
//             <Text style={{...styles.plusMinusText, color: COLORS.blackColor}}>
//             {quantities[item.id] || 1}
//             </Text>
//             <TouchableOpacity
//               style={{...styles.plusButton}}
//               onPress={() => handleCountIncrement(item.id)}>
//               <Text style={{...styles.plusMinusText}}>+</Text>
//             </TouchableOpacity>
          
          
//           </View>

//           <TouchableOpacity style={styles.addButton} onPress={() => dispatch(addToCart())}>
//             <Text style={styles.addButtonText}>Add</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={productData}
//         renderItem={renderProduct}
//         keyExtractor={item => item.id.toString()}
//         numColumns={2} // grid 2 columns
//         columnWrapperStyle={{justifyContent: 'space-between', gap: 10}}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default ProductsCompo;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: COLORS.whiteColor,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: '#ffffff',
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
//   discountText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   productImageContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//     height: 100,
//     justifyContent: 'center',
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     // tintColor:'red'
//   },
//   productInfo: {
//     gap: 8,
//   },
//   productTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333333',
//     lineHeight: 22,
//   },
//   productWeight: {
//     fontSize: 14,
//     color: '#666666',
//     fontWeight: '500',
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginTop: 5,
//   },
//   originalPrice: {
//     fontSize: 14,
//     color: '#999999',
//     textDecorationLine: 'line-through',
//   },
//   discountedPrice: {
//     fontSize: 18,
//     color: '#333333',
//     fontWeight: 'bold',
//   },
//   addButton: {
//     backgroundColor: '#ffffff',
//     borderColor: '#ff0000',
//     borderWidth: 2,
//     borderRadius: 25,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: '#ff0000',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   plusButton: {
//     padding: 12,
//     backgroundColor: COLORS.green,
//     borderRadius: 10,
//   },
//   plusMinusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 15,
//   },
//   plusMinusText: {
//     fontWeight: '600',
//     color: COLORS.whiteColor,
//     fontSize: 16,
//   },
// });




import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../styles/colors';
import makeApiCall from '../../utils/apiHelper';
import navigationString from '../../navigation/navigationString';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../utils/apiurls';
import { addToCart } from '../../redux/reducers/addTocart';

const ProductsCompo = ({productData}) => {
  console.log(productData,'ppppppppppp')
 
  const [quantities, setQuantities] = useState({});
  const navigation = useNavigation();
  const dispatch = useDispatch();
 
  const handleCountIncrement = id => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const handleDecrement = (id) => {
    console.log(id);
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    
    // Dispatch addToCart with the complete item data and quantity
    dispatch(addToCart({
      ...item, // Spread all product properties
      quantity: quantity // Add the quantity
    }));
    
    // Optional: Reset quantity after adding to cart
    // setQuantities(prev => ({
    //   ...prev,
    //   [item.id]: 1
    // }));
  };

  const renderProduct = ({item}) => {
    const quantity = quantities[item.id] || 1;
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate(navigationString.PREVIEWPRODUCTSCOMPO, {item})}
      >
        {/* Discount Badge */}
        {item.discountPercentage ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(item.discountPercentage)} % Off
            </Text>
          </View>
        ) : null}

        {/* Product Image */}
        <View style={styles.productImageContainer}>
          <Image
            source={{uri: BASE_URL + item.image}}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productWeight}>{item.categ_id}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>₹ {item.list_price}</Text>
            <Text style={styles.discountedPrice}>
              ₹ {(
                item.list_price -
                (item.list_price * 10) / 100
              ).toFixed(0)}
            </Text>
          </View>

          <View style={styles.plusMinusContainer}>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => handleDecrement(item.id)}>
              <Text style={{...styles.plusMinusText, paddingHorizontal: 1}}>
                -
              </Text>
            </TouchableOpacity>
            
            <Text style={{...styles.plusMinusText, color: COLORS.blackColor}}>
              {quantity}
            </Text>
            
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => handleCountIncrement(item.id)}>
              <Text style={styles.plusMinusText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>
              Add {quantity > 1 ? `(${quantity})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productData}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between', gap: 10}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductsCompo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#9c27b0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 1,
    borderTopLeftRadius: 12,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productImageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    height: 100,
    justifyContent: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    gap: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 22,
  },
  productWeight: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ffffff',
    borderColor: '#ff0000',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plusButton: {
    padding: 12,
    backgroundColor: COLORS.green,
    borderRadius: 10,
  },
  plusMinusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  plusMinusText: {
    fontWeight: '600',
    color: COLORS.whiteColor,
    fontSize: 16,
  },
});