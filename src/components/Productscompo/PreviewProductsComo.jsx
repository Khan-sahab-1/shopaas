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
import {useSelector} from 'react-redux';
import makeApiCall from '../../utils/apiHelper';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const PreviewProductsComp = ({navigation, route}) => {
  const productItem = route.params?.item;

  const {item, quantity} = route.params;
  // const [quantities, setQuantities] = useState({route?.params?.quantity});
  // console.log(item, quantity);
  const [quantities, setQuantities] = useState({
    [route?.params?.item?.id]: route?.params?.quantity || 1,
  });
  // const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  // console.log(selectedVariant);

  console.log(item.id, quantity);
  const images =
    Array.isArray(productItem?.images) && productItem.images.length > 0
      ? productItem.images.map(img => BASE_URL + img)
      : [BASE_URL + productItem?.image];

  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('XL');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const variantData = item?.variant_data || [];
  const [isLoding, setisLoding] = useState(false);

  // Map to objects for easier handling
  const variants = variantData.map(v => ({
    id: v[0],
    type: v[1],
    qty: v[2],
    price: v[3],
  }));
  console.log(variants);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  console.log(selectedVariant, 'vvvvvv');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleCountIncrement = id => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };
  const handleDecrement = id => {
    console.log(id);
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };
  const handlesubmit = async () => {
    try {
      setisLoding(true);
      // const payload1 = {
      //   jsonrpc: '2.0',
      //   params: {
      //     product_id: defaultVariant,
      //     product_template_id: item.id,
      //     set_qty: 0,
      //     add_qty: item?.quantity || 1,
      //   },
      // };

      const payload = {
        jsonrpc: '2.0',
        params: {
          product_template_id: item.id,
          product_id: selectedVariant.id,
          add_qty: quantities[item.id],
          set_qty: 0,
        },
      };
      console.log(payload, 'payLoad');
      const res = await makeApiCall(API_URLS.addToCart, 'POST', payload);
      console.log(res, 'add to cart response');
    } catch (error) {
      console.log(error);
    } finally {
      setisLoding(false);
    }
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

              {/* Size Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Size</Text>
                <View style={styles.sizesContainer}>
                  {/* {sizes.map(size => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.sizeButtonActive,
                      ]}
                      onPress={() => setSelectedSize(size)}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.sizeText,
                          selectedSize === size && styles.sizeTextActive,
                        ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))} */}
                  {variants.map(variant => (
                    <TouchableOpacity
                      key={variant.id}
                      style={[
                        styles.sizeButton,
                        selectedVariant.id === variant.id &&
                          styles.sizeButtonActive,
                      ]}
                      onPress={() => setSelectedVariant(variant)}>
                      <Text
                        style={[
                          styles.sizeText,
                          selectedVariant.id === variant.id &&
                            styles.sizeTextActive,
                        ]}>
                        {variant.type} ({variant.qty})
                      </Text>
                    </TouchableOpacity>
                  ))}
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
              style={styles.qtyBtn}
              onPress={() => handleDecrement(productItem?.id)}>
              <Text style={{...styles.qtyText, color: COLORS.whiteColor}}>
                -
              </Text>
            </TouchableOpacity>
            {/* <Text style={styles.qtyText}>{quantities}</Text> */}
            <Text style={styles.qtyText}>
              {quantities[productItem?.id] || 1}
            </Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleCountIncrement(productItem?.id)}>
              <Text style={{...styles.qtyText, color: COLORS.whiteColor}}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            activeOpacity={0.8}
            onPress={handlesubmit}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
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

// import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native'
// import React, { useState } from 'react'
// import Headercomp from '../Headercomp'
// import { COLORS } from '../../styles/colors'
// const { width: screenWidth } = Dimensions.get('window');

// const PreviewProductsComp = ({navigation, route}) => {
//     const productItem = route.params?.item;
//     console.log(productItem)
//     const images = [...productItem?.images]

//     const [isFavorite, setIsFavorite] = useState(false)
//     const [quantity, setQuantity] = useState(productItem?.minimumOrderQuantity || 1)
//     const [selectedTab, setSelectedTab] = useState('details')

//     const discountedPrice = (productItem?.price * (1 - (productItem?.discountPercentage || 0) / 100)).toFixed(2)

//     const renderStars = (rating) => {
//         return Array.from({ length: 5 }, (_, i) => (
//             <Text key={i} style={{color: i < Math.floor(rating) ? '#FCD34D' : '#D1D5DB', fontSize: 16}}>
//                 ★
//             </Text>
//         ))
//     }

//     const renderReviews = () => {
//         return productItem?.reviews?.map((review, index) => (
//             <View key={index} style={styles.reviewCard}>
//                 <View style={styles.reviewHeader}>
//                     <Text style={styles.reviewerName}>{review.reviewerName}</Text>
//                     <View style={{flexDirection: 'row', gap: 2}}>
//                         {renderStars(review.rating)}
//                     </View>
//                 </View>
//                 <Text style={styles.reviewComment}>{review.comment}</Text>
//                 <Text style={styles.reviewDate}>
//                     {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                 </Text>
//             </View>
//         ))
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <Headercomp left={true} onPress={()=>navigation.goBack()}/>

//             <ScrollView showsVerticalScrollIndicator={false}>
//                 {/* Image Carousel */}
//                 <View style={styles.imagecontainer}>
//                     <ScrollView
//                         horizontal
//                         pagingEnabled
//                         showsHorizontalScrollIndicator={false}
//                     >
//                         {images.length > 0 ? (
//                             images.map((imageUrl, index) => (
//                                 <View
//                                     key={index.toString()}
//                                     style={styles.imageWrapper}
//                                 >
//                                     <Image
//                                         source={{ uri: imageUrl }}
//                                         style={styles.image}
//                                         resizeMode="contain"
//                                     />
//                                     <Text style={styles.imageIndex}>{index + 1} / {images.length}</Text>
//                                     {productItem?.discountPercentage > 0 && index === 0 && (
//                                         <View style={styles.discountBadge}>
//                                             <Text style={styles.discountText}>-{productItem.discountPercentage.toFixed(0)}%</Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={{...styles.imageWrapper, justifyContent: 'center', alignItems: 'center'}}>
//                                 <Text style={{color: COLORS.blackColor}}>No Image Available</Text>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </View>

//                 {/* Product Info Section */}
//                 <View style={styles.productInfoSection}>
//                     {/* Category & SKU */}
//                     <View style={styles.categoryRow}>
//                         <View style={styles.categoryBadge}>
//                             <Text style={styles.categoryText}>{productItem?.category}</Text>
//                         </View>
//                         <Text style={styles.skuText}>SKU: {productItem?.sku}</Text>
//                     </View>

//                     {/* Title */}
//                     <Text style={styles.productTitle}>{productItem?.title || 'NA'}</Text>

//                     {/* Rating & Favorite */}
//                     <View style={styles.ratingRow}>
//                         <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
//                             {renderStars(productItem?.rating || 0)}
//                             <Text style={styles.ratingText}>{productItem?.rating}</Text>
//                             <Text style={styles.reviewCount}>({productItem?.reviews?.length || 0} reviews)</Text>
//                         </View>
//                         <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
//                             <Text style={{fontSize: 28}}>{isFavorite ? '❤️' : '🤍'}</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Description */}
//                     <Text style={styles.productDescription}>{productItem?.description}</Text>

//                     {/* Price Section */}
//                     <View style={styles.priceCard}>
//                         <View style={{flexDirection: 'row', alignItems: 'baseline', gap: 10}}>
//                             <Text style={styles.discountedPrice}>${discountedPrice}</Text>
//                             <Text style={styles.originalPrice}>${productItem?.price}</Text>
//                             <View style={styles.saveBadge}>
//                                 <Text style={styles.saveText}>Save ${(productItem?.price - discountedPrice).toFixed(2)}</Text>
//                             </View>
//                         </View>
//                     </View>

//                     {/* Stock Status */}
//                     <View style={styles.stockRow}>
//                         <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
//                             <View style={[styles.stockDot, {backgroundColor: productItem?.stock > 0 ? '#10B981' : '#EF4444'}]} />
//                             <Text style={styles.stockText}>
//                                 {productItem?.availabilityStatus} - {productItem?.stock} units available
//                             </Text>
//                         </View>
//                     </View>

//                     {/* Quantity Selector */}
//                     <View style={styles.quantityRow}>
//                         <Text style={styles.quantityLabel}>Quantity:</Text>
//                         <View style={styles.quantitySelector}>
//                             <TouchableOpacity
//                                 style={styles.quantityButton}
//                                 onPress={() => setQuantity(Math.max(productItem?.minimumOrderQuantity || 1, quantity - 1))}
//                             >
//                                 <Text style={styles.quantityButtonText}>-</Text>
//                             </TouchableOpacity>
//                             <Text style={styles.quantityValue}>{quantity}</Text>
//                             <TouchableOpacity
//                                 style={styles.quantityButton}
//                                 onPress={() => setQuantity(Math.min(productItem?.stock || 999, quantity + 1))}
//                             >
//                                 <Text style={styles.quantityButtonText}>+</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <Text style={styles.minOrderText}>Min: {productItem?.minimumOrderQuantity || 1}</Text>
//                     </View>

//                     {/* Action Buttons */}
//                     <View style={styles.actionButtons}>
//                         <TouchableOpacity style={styles.addToCartButton}>
//                             <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.buyNowButton}>
//                             <Text style={styles.buyNowText}>Buy Now</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Info Cards */}
//                     <View style={styles.infoCardsGrid}>
//                         <View style={[styles.infoCard, {backgroundColor: '#DBEAFE'}]}>
//                             <Text style={styles.infoIcon}>🚚</Text>
//                             <Text style={styles.infoText}>{productItem?.shippingInformation}</Text>
//                         </View>
//                         <View style={[styles.infoCard, {backgroundColor: '#F3E8FF'}]}>
//                             <Text style={styles.infoIcon}>↩️</Text>
//                             <Text style={styles.infoText}>{productItem?.returnPolicy}</Text>
//                         </View>
//                         <View style={[styles.infoCard, {backgroundColor: '#FEF3C7'}]}>
//                             <Text style={styles.infoIcon}>📦</Text>
//                             <Text style={styles.infoText}>{productItem?.warrantyInformation}</Text>
//                         </View>
//                         <View style={[styles.infoCard, {backgroundColor: '#D1FAE5'}]}>
//                             <Text style={styles.infoIcon}>⚖️</Text>
//                             <Text style={styles.infoText}>Weight: {productItem?.weight} kg</Text>
//                         </View>
//                     </View>

//                     {/* Tabs */}
//                     <View style={styles.tabContainer}>
//                         <TouchableOpacity
//                             style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
//                             onPress={() => setSelectedTab('details')}
//                         >
//                             <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>
//                                 Details
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
//                             onPress={() => setSelectedTab('reviews')}
//                         >
//                             <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
//                                 Reviews ({productItem?.reviews?.length || 0})
//                             </Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Tab Content */}
//                     {selectedTab === 'details' ? (
//                         <View style={styles.detailsContent}>
//                             <View style={styles.detailRow}>
//                                 <Text style={styles.detailLabel}>Dimensions:</Text>
//                                 <Text style={styles.detailValue}>
//                                     {productItem?.dimensions?.width} x {productItem?.dimensions?.height} x {productItem?.dimensions?.depth} cm
//                                 </Text>
//                             </View>
//                             <View style={styles.detailRow}>
//                                 <Text style={styles.detailLabel}>Weight:</Text>
//                                 <Text style={styles.detailValue}>{productItem?.weight} kg</Text>
//                             </View>
//                             <View style={styles.detailRow}>
//                                 <Text style={styles.detailLabel}>Tags:</Text>
//                                 <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1}}>
//                                     {productItem?.tags?.map((tag, index) => (
//                                         <View key={index} style={styles.tagBadge}>
//                                             <Text style={styles.tagText}>{tag}</Text>
//                                         </View>
//                                     ))}
//                                 </View>
//                             </View>
//                         </View>
//                     ) : (
//                         <View style={styles.reviewsContent}>
//                             {renderReviews()}
//                         </View>
//                     )}
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     )
// }

// export default PreviewProductsComp

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.whiteColor
//     },
//     imagecontainer: {
//         width: '100%',
//         height: screenWidth,
//         backgroundColor: COLORS.whiteColor,
//     },
//     imageWrapper: {
//         width: screenWidth,
//         height: '100%',
//         justifyContent: 'center',
//     },
//     image: {
//         height: '100%',
//         width: '100%',
//         backgroundColor: COLORS.whiteColor,
//     },
//     imageIndex: {
//         position: 'absolute',
//         bottom: 10,
//         color: COLORS.whiteColor,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 5,
//         alignSelf: 'center'
//     },
//     discountBadge: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//         backgroundColor: '#EF4444',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 20,
//     },
//     discountText: {
//         color: COLORS.whiteColor,
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     productInfoSection: {
//         padding: 16,
//     },
//     categoryRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 12,
//     },
//     categoryBadge: {
//         backgroundColor: '#D1FAE5',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//     },
//     categoryText: {
//         color: '#065F46',
//         fontSize: 12,
//         fontWeight: '600',
//     },
//     skuText: {
//         color: '#6B7280',
//         fontSize: 12,
//     },
//     productTitle: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: COLORS.blackColor,
//         marginBottom: 12,
//     },
//     ratingRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 12,
//     },
//     ratingText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.blackColor,
//         marginLeft: 4,
//     },
//     reviewCount: {
//         fontSize: 14,
//         color: '#6B7280',
//     },
//     productDescription: {
//         fontSize: 15,
//         color: '#4B5563',
//         lineHeight: 22,
//         marginBottom: 16,
//     },
//     priceCard: {
//         backgroundColor: '#F9FAFB',
//         padding: 16,
//         borderRadius: 12,
//         marginBottom: 16,
//     },
//     discountedPrice: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#10B981',
//     },
//     originalPrice: {
//         fontSize: 20,
//         color: '#9CA3AF',
//         textDecorationLine: 'line-through',
//     },
//     saveBadge: {
//         backgroundColor: '#D1FAE5',
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     saveText: {
//         color: '#065F46',
//         fontSize: 12,
//         fontWeight: '600',
//     },
//     stockRow: {
//         marginBottom: 16,
//     },
//     stockDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//     },
//     stockText: {
//         fontSize: 14,
//         color: '#374151',
//     },
//     quantityRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//         marginBottom: 20,
//     },
//     quantityLabel: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.blackColor,
//     },
//     quantitySelector: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#D1D5DB',
//         borderRadius: 8,
//     },
//     quantityButton: {
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         backgroundColor: '#F9FAFB',
//     },
//     quantityButtonText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#374151',
//     },
//     quantityValue: {
//         paddingHorizontal: 20,
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.blackColor,
//     },
//     minOrderText: {
//         fontSize: 12,
//         color: '#6B7280',
//     },
//     actionButtons: {
//         flexDirection: 'row',
//         gap: 12,
//         marginBottom: 20,
//     },
//     addToCartButton: {
//         flex: 1,
//         backgroundColor: COLORS.green || '#10B981',
//         paddingVertical: 16,
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     addToCartText: {
//         color: COLORS.whiteColor,
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     buyNowButton: {
//         backgroundColor: '#111827',
//         paddingHorizontal: 24,
//         paddingVertical: 16,
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     buyNowText: {
//         color: COLORS.whiteColor,
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     infoCardsGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         gap: 12,
//         marginBottom: 24,
//     },
//     infoCard: {
//         flex: 1,
//         minWidth: '45%',
//         padding: 12,
//         borderRadius: 10,
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         gap: 8,
//     },
//     infoIcon: {
//         fontSize: 18,
//     },
//     infoText: {
//         fontSize: 12,
//         fontWeight: '500',
//         color: '#374151',
//         flex: 1,
//     },
//     tabContainer: {
//         flexDirection: 'row',
//         borderBottomWidth: 1,
//         borderBottomColor: '#E5E7EB',
//         marginBottom: 16,
//     },
//     tab: {
//         flex: 1,
//         paddingVertical: 12,
//         alignItems: 'center',
//     },
//     activeTab: {
//         borderBottomWidth: 2,
//         borderBottomColor: COLORS.green || '#10B981',
//     },
//     tabText: {
//         fontSize: 15,
//         color: '#6B7280',
//         fontWeight: '500',
//     },
//     activeTabText: {
//         color: COLORS.green || '#10B981',
//         fontWeight: '600',
//     },
//     detailsContent: {
//         gap: 16,
//     },
//     detailRow: {
//         flexDirection: 'row',
//         gap: 12,
//     },
//     detailLabel: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#374151',
//         width: 100,
//     },
//     detailValue: {
//         fontSize: 14,
//         color: '#6B7280',
//         flex: 1,
//     },
//     tagBadge: {
//         backgroundColor: '#E0E7FF',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//     },
//     tagText: {
//         color: '#3730A3',
//         fontSize: 12,
//         fontWeight: '500',
//     },
//     reviewsContent: {
//         gap: 16,
//     },
//     reviewCard: {
//         backgroundColor: '#F9FAFB',
//         padding: 16,
//         borderRadius: 10,
//         gap: 8,
//     },
//     reviewHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     reviewerName: {
//         fontSize: 15,
//         fontWeight: '600',
//         color: COLORS.blackColor,
//     },
//     reviewComment: {
//         fontSize: 14,
//         color: '#4B5563',
//         lineHeight: 20,
//     },
//     reviewDate: {
//         fontSize: 12,
//         color: '#9CA3AF',
//     },
// })
