import { FlatList, Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS, BASE_URL } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import navigationString from '../../../../../navigation/navigationString';

const Varientprod = ({ navigation, route }) => {
  const { item } = route.params;
  const dataItem=item
  console.log(dataItem, 'Item====>>>>>>');
  const [isLoding, setisloding] = useState(false);
  const [varientdata, setvarientdata] = useState([]);



  const arraydata = Object.values(varientdata?.products || {});
  console.log(arraydata, 'ArrayData');

  const fetchvariet = async productid => {
    try {
      setisloding(true);
      const responce = await makeApiCall(
        API_URLS.storeProductVarientTree,
        'POST',
        {
          jsonrpc: '2.0',
          params: {
            page: 0,
            productId: productid,
            producttype: null,
            searchbar: null,
            user_select: false,
          },
          searchbar: null,
        },
      );
      console.log(responce, 'Product varients');
      setvarientdata(responce?.result?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisloding(false);
    }
  };

  useEffect(() => {
    if (item) {
      fetchvariet(item?.id);
    }
  }, [item]);

  const renderItem = ({ item, index }) => {
    const isAvailable = item.qty_available > 0;
    const stockStatus = item.virtual_available > 0 ? 'In Stock' : 'Out of Stock';
    
    return (
      <TouchableOpacity 
        style={[
          styles.card,
          { opacity: isAvailable ? 1 : 0.7 }
        ]}
        activeOpacity={0.8}
        
        onPress={()=>navigation.navigate(navigationString.PREVIEWVARIENTPROD,{item:dataItem,itemData:item})}
      >
        <View style={styles.cardContent}>
          {/* Product Image Container */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: BASE_URL + item.image }}
              style={styles.productImage}
            />
            {!isAvailable && (
              <View style={styles.outOfStockOverlay}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.price}>₹{item.list_price.toFixed(2)}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Varient Price:</Text>
              <Text style={styles.price}>₹{item.variant_price.toFixed(2)}</Text>
            </View>

            <View style={styles.stockRow}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockLabel}>Available:</Text>
                <Text style={[
                  styles.stockQuantity,
                  { color: isAvailable ? COLORS.successColor || '#10B981' : COLORS.errorColor || '#EF4444' }
                ]}>
                  {item.qty_available} units
                </Text>
              </View>

              <View style={[
                styles.statusBadge,
                { backgroundColor: isAvailable ? '#ECFDF5' : '#FEF2F2' }
              ]}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: isAvailable ? '#10B981' : '#EF4444' }
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: isAvailable ? '#10B981' : '#EF4444' }
                ]}>
                  {stockStatus}
                </Text>
              </View>
            </View>

            {/* Product Code if available */}
            {item.default_code && (
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Code:</Text>
                <Text style={styles.codeValue}>{item.default_code}</Text>
              </View>
            )}
          </View>
        </View>

    
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Variants'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {arraydata.length > 0 ? (
          <FlatList
            data={arraydata}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          !isLoding && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No variants available</Text>
            </View>
          )
        )}
      </View>
      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default Varientprod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  productImage: {
    height: 80,
    width: 80,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    resizeMode: 'contain',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 6,
  },
  stockQuantity: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 6,
  },
  codeValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  actionButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});