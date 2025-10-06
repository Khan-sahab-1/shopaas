import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import makeApiCall from '../../../../utils/apiHelper';
import { API_URLS, BASE_URL } from '../../../../utils/apiurls';
import { COLORS } from '../../../../styles/colors';
import Headercomp from '../../../../components/Headercomp';
import MessageShow from '../../../../constant/MessageShow';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const PreviewProductorder = ({ route, navigation }) => {
  const { item } = route?.params;
  const { companeyinfo } = route?.params;

  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [relatedProductsList, setRelatedProductsList] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const dispatch = useDispatch();

  useEffect(() => {
    if (productDetails) {
      // Set the default variant as selected initially
      setSelectedVariant(productDetails.defaultVariant);
    }
  }, [productDetails]);

  const fetchProductDetails = async () => {
    try {
      const params = {
        companyId: companeyinfo.id,
        companyTypeId: companeyinfo.company_type?.[0],
        prodTmplId: item?.id,
      };

      setIsLoading(true);
      const res = await makeApiCall(API_URLS.getProductDetails, 'POST', {
        jsonrpc: '2.0',
        params: params,
      });

      if (res?.result?.productDetails) {
        setProductDetails(res.result.productDetails);
      }
    } catch (error) {
      console.log(error, 'ERROR');
    }
  };

  const fetchRelatedProducts = async (product_templ_id = null) => {
    try {
      const params = {
        company_id: companeyinfo.id,
        ...(product_templ_id || item?.id
          ? { product_templ_id: product_templ_id || item?.id }
          : {}),
      };

      const response = await makeApiCall(API_URLS.relatedProducts, 'POST', {
        jsonrpc: '2.0',
        params: params,
      });

      if (response?.result?.products) {
        setRelatedProductsList(response.result.products);
      }
    } catch (error) {
      console.log(error, 'ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, []);

  const updateCartQtyAPI = async (item, variantId = null) => {
    try {
      setIsLoading(true);
      const productVariantId = variantId || item.defaultVariant;

      const response = await makeApiCall(API_URLS.addToCart, 'POST', {
        jsonrpc: '2.0',
        params: {
          product_id: productVariantId,
          product_template_id: item.id,
          set_qty: 0,
          add_qty: quantity,
        },
      });
      console.log(response, 'RESPONSE CART');
      if(response?.result?.message === 'success'){
        MessageShow.success('Success', 'Item added to cart');
      }
      // setIsLoading(false);

      if (response?.result?.header === 'Item already in cart') {
        Alert.alert(
          response.result.header,
          response.result.message,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reset Cart',
              onPress: async () => {
                try {
                  setIsLoading(true);
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
                  setIsLoading(false);
                }
              },
            },
          ],
          { cancelable: false },
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
      console.log(error, 'ERROR');
    } finally{
      setIsLoading(false);
    }
  };

  const renderProductImage = () => {
    const variantId = selectedVariant || productDetails?.defaultVariant;
    const variant = productDetails?.prodVariants?.[variantId];
    const imageUri =
      BASE_URL +
      (variant?.displayImage?.[0] || productDetails?.displayImage?.[0]);

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              imageUri || 'https://via.placeholder.com/300x300?text=No+Image',
          }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  const renderVariants = () => {
    if (!productDetails?.prodVariants) return null;

    const variants = Object.values(productDetails.prodVariants);

    return (
      <View style={styles.variantsContainer}>
        <Text style={styles.sectionTitle}>Available Variants</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.variantsScroll}
        >
          {variants.map(variant => (
            <TouchableOpacity
              key={variant.id}
              style={[
                styles.variantItem,
                selectedVariant === variant.id && styles.selectedVariantItem,
              ]}
              onPress={() => setSelectedVariant(variant.id)}
            >
              <Text
                style={[
                  styles.variantText,
                  selectedVariant === variant.id && styles.selectedVariantText,
                ]}
              >
                {variant.variant_name}
              </Text>
              <Text
                style={[
                  styles.variantPrice,
                  selectedVariant === variant.id && styles.variantPriceActive,
                ]}
              >
                ₹{variant.discountedPrice || variant.originalPrice}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderProductInfo = () => {
    const variantId = selectedVariant || productDetails?.defaultVariant;
    const variant = productDetails?.prodVariants?.[variantId];

    return (
      <View style={styles.productInfoContainer}>
        <Text style={styles.productName}>{productDetails?.name}</Text>
        <Text style={styles.brandName}>{productDetails?.brand_name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.currency}>₹</Text>
          <Text style={styles.price}>
            {variant?.discountedPrice || variant?.originalPrice}
          </Text>
          {variant?.discountedPrice && (
            <Text style={styles.originalPrice}>₹{variant?.originalPrice}</Text>
          )}
        </View>

        <View style={styles.uomContainer}>
          <Text style={styles.uomLabel}>Unit:</Text>
          <Text style={styles.uomValue}>{productDetails?.uom_name}</Text>
        </View>

        {productDetails?.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {productDetails.description}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderRelatedProductItem = ({ item: relatedItem }) => (
    <TouchableOpacity
      style={styles.relatedProductCard}
      onPress={() => {
        setProductDetails(null);
        setIsLoading(true);
        fetchProductDetails(relatedItem.id);
        fetchRelatedProducts(relatedItem.id);
      }}
    >
      <Image
        source={{
          uri:
            BASE_URL +
            (relatedItem.image ||
              'https://dummyjson.com/image/150x150?text=No+Image'),
        }}
        style={styles.relatedProductImage}
        resizeMode="contain"
      />
      <View style={styles.relatedProductInfo}>
        <Text style={styles.relatedProductName} numberOfLines={2}>
          {relatedItem.name}
        </Text>
        <Text style={styles.relatedProductCompany} numberOfLines={1}>
          {relatedItem.company?.name}
        </Text>
        <View style={styles.relatedPriceContainer}>
          <Text style={styles.relatedPrice}>
            ₹{relatedItem.discountedPrice || relatedItem.originalPrice}
          </Text>
          {relatedItem.discountedPrice && (
            <Text style={styles.relatedOriginalPrice}>
              ₹{relatedItem.originalPrice}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => updateCartQtyAPI(relatedItem)}
        >
          <Text style={styles.buyNowText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <View style={styles.qtyContainer}>
        <Text style={styles.qtyLabel}>Quantity:</Text>
        <View style={styles.qtyControls}>
          <TouchableOpacity onPress={decrement} style={styles.qtyButton}>
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity onPress={increment} style={styles.qtyButton}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.buyNowButton}
        onPress={() => updateCartQtyAPI(productDetails, selectedVariant)}
      >
        <Text style={styles.buyNowText}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !productDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Headercomp
          title={'Preview Products'}
          left={true}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryColor} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'Preview Products'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {productDetails && (
          <View style={styles.productContainer}>
            {renderProductImage()}
            {renderVariants()}
            {renderProductInfo()}
            {renderActionButtons()}
          </View>
        )}

        {relatedProductsList.length > 0 && (
          <View style={styles.relatedProductsContainer}>
            <Text style={styles.relatedProductsTitle}>Related Products</Text>
            <FlatList
              data={relatedProductsList}
              renderItem={renderRelatedProductItem}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedProductsList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreviewProductorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  productContainer: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  variantsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  variantsScroll: {
    marginHorizontal: -4,
  },
  variantItem: {
    padding: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: COLORS.whiteColor,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedVariantItem: {
    backgroundColor: COLORS.blueColor,
    borderColor: COLORS.primaryColor,
  },
  variantText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  selectedVariantText: {
    color: COLORS.whiteColor,
  },
  variantPrice: {
    fontSize: 12,
    color: COLORS.blackColor,
    marginTop: 4,
  },
  variantPriceActive: {
    color: COLORS.whiteColor,
    fontSize: 12,

    marginTop: 4,
  },
  productInfoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primaryColor,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryColor,
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  uomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  uomLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  uomValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    // backgroundColor:COLORS.redColor
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginRight: 12,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  qtyButton: {
    padding: 5,
    backgroundColor: COLORS.blueLight,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  buyNowButton: {
    backgroundColor: COLORS.blueLight,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.whiteColor,
  },
  relatedProductsContainer: {
    marginBottom: 20,
  },
  relatedProductsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  relatedProductsList: {
    paddingRight: 16,
  },
  relatedProductCard: {
    width: 160,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  relatedProductImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
  },
  relatedProductInfo: {
    padding: 12,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginBottom: 4,
    minHeight: 36,
  },
  relatedProductCompany: {
    fontSize: 12,
    color: COLORS.blackColor,
    marginBottom: 8,
  },
  relatedPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  relatedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.blackColor,
  },
  relatedOriginalPrice: {
    fontSize: 12,
    color: COLORS.blackColor,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
});
