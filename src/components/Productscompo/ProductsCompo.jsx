import React, {memo} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {moderateScale} from '../../styles/responsiveSize';
import {COLORS} from '../../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../../utils/apiurls';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from '../../redux/reducers/addTocart';

const ProductCard = ({item, onAddPress, onPress, companyTypes}) => {
  const dispatch = useDispatch();
  const variants = item?.variant_data?.map(v => ({
    id: v[0],
    type: v[1],
    price: v[3],
  }));

  // Always use first variant, but ensure cart items are found by variant
  const selectedVariant = variants?.[0];

  const cartData = useSelector(state => state.cartinfo.cartData);

  // IMPORTANT: Find cart item by both product ID AND variant ID
  const cartItem = cartData.find(
    cartItem =>
      cartItem.id === item.id &&
      cartItem.selectedVariant?.id === selectedVariant?.id,
  );

  // console.log(companyTypes, 'uuwuuwu');
  // const variants = variantData.map(v => ({
  //   id: v[0],
  //   type: v[1],
  //   price: v[3],
  //   // qty: cartQuentity,
  // }));

  // console.log(variants[0], 'items------');

  // const cartData = useSelector(state => state.cartinfo.cartData);
  // const cartItem = cartData.find(cartItem => cartItem.id === item.id);

  const companeyTypeName =
    companyTypes.find(ct => ct.id === item?.company_type) || '';
  // console.log(companeyTypeName);
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
        selectedVariant: selectedVariant,
      }),
    );
  };

  // const handleIncrement = () => {
  //   dispatch(incrementQuantity(item.id));
  // };

  // const handleIncrement = () => {
  //   dispatch(
  //     incrementQuantity({
  //       productId: item.id,
  //       selectedVariant: selectedVariant,
  //     }),
  //   );
  // };
  // const handleDecrement = () => {
  //   dispatch(
  //     decrementQuantity({
  //       productId: item.id,
  //       selectedVariant: selectedVariant,
  //     }),
  //   );
  // };

  const handleIncrement = () => {
    if (selectedVariant) {
      dispatch(
        incrementQuantity({
          productId: item.id,
          variantId: selectedVariant.id,
        }),
      );
    }
  };

  const handleDecrement = () => {
    if (selectedVariant && quantity > 0) {
      dispatch(
        decrementQuantity({
          productId: item.id,
          variantId: selectedVariant.id,
        }),
      );
    }
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
        <Text style={styles.productDetail}>{companeyTypeName.name || ''}</Text>

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
