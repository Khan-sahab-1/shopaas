import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_URLS, BASE_URL } from '../../../../utils/apiurls';
import { useDispatch } from 'react-redux';
import { fetchCartData } from '../../../../redux/reducers/fetchCartData';
import makeApiCall from '../../../../utils/apiHelper';
import ButtonCompo from '../../../../components/ButtonCompo';


const { width } = Dimensions.get('window');

const CompareProduct = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [isLoading,setIsLoding]=useState()
   const [Comparision,setComparision]=useState([])
  const dispatch = useDispatch();

  // Find the cheapest product
  console.log(Comparision,'Comparision')
  const cheapestProduct = Comparision?.length > 0 
    ? Comparision.reduce((min, product) => 
        product.originalPrice < min.originalPrice ? product : min, 
        Comparision[0]
      )
    : null;

  const formatPrice = (price) => {
    return `₹${price?.toFixed(2) || '0.00'}`;
  };

  const addToCart = async (product) => {
    setLoading(true);
    setLoadingProductId(product.id);
    
    try {
      // Prepare the API request payload
      const payload = {
        jsonrpc: '2.0',
        params: {
          product_id: product.defaultVariant,
          product_template_id: product.id,
          set_qty: 0,
          add_qty: 1,
        },
      };

      // Make API call to add to cart
      const response = await makeApiCall(API_URLS.addToCart, 'POST', payload);
      
      if (response?.result?.message === 'success') {
        // Refresh cart data
        dispatch(fetchCartData());
        
        Alert.alert('Success', 'Product added to cart successfully');
      } else {
        Alert.alert('Error', response?.result?.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'An error occurred while adding the product to cart');
    } finally {
      setLoading(false);
      setLoadingProductId(null);
    }
  };

  const fetchcomparision = async () => {
    try {
      setLoading(true);
  
      const payLoad = {
        jsonrpc: "2.0",
        params: {
         method: "GET"
         
        }
      };
  
      console.log("PAYLOAD:", JSON.stringify(payLoad, null, 2));
  
      const response = await makeApiCall(
        API_URLS.compareProduct,
        "POST",
        payLoad
      );
  
      console.log("RESPONSE:Get", response);
      if(response?.result?.message==='success'){
        setComparision(response?.result?.compareProducts)
      }
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
        setLoading(false);
    }
  };

  const removeComparision = async (product_id) => {
    try {
        setIsLoding(true);
  
      const payLoad = {
        jsonrpc: "2.0",
        params: {
          method: "POST",
          product_id: product_id,
          addToCompare: false
        }
      };
  
      console.log("PAYLOAD:", JSON.stringify(payLoad, null, 2));
  
      const response = await makeApiCall(
        API_URLS.compareProduct,
        "POST",
        payLoad
      );
  
      console.log("RESPONSE:", response);
      if(response?.result?.message==='success'){
        await fetchcomparision()
      }
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
        setIsLoding(false);
    }
  };

  useEffect(()=>{
    fetchcomparision()
  },[])



  
  const ProductCard = ({ product, isCheapest }) => {
    // console.log("Rendering Product:", product);
  
    return (
      <View style={[styles.productCard, isCheapest && styles.cheapestCard]}>
        {isCheapest && (
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueText}>Best Value</Text>
          </View>
        )}
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: `${BASE_URL}${product.image}` }} 
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text style={styles.companyName}>
            {product.company?.name || 'N/A'}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {formatPrice(product.originalPrice)}
            </Text>
            {product.discountPrice && product.discountPrice !== product.originalPrice && (
              <Text style={styles.discountPrice}>
                {formatPrice(product.discountPrice)}
              </Text>
            )}
          </View>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {product.companyType?.name || 'N/A'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => addToCart(product)}
            disabled={loading && loadingProductId === product.id}
          >
            {loading && loadingProductId === product.id ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.selectButtonText}>Add To Cart</Text>
            )}
          </TouchableOpacity>
          
          <ButtonCompo 
            title="Remove Compare"
            style={styles.selectButton} 
            onPress={() => removeComparision(product?.defaultVariant)} 
          />
        </View>
      </View>
    );
  };
  

  if (Comparision?.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compare Products</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products to compare</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Products</Text>
        <View style={styles.headerRight}>
          <Text style={styles.compareCount}>{Comparision?.length} items</Text>
        </View>
      </View>
      
      {/* Comparison Table */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Price Comparison Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Price Range</Text>
          <View style={styles.priceRange}>
          {Comparision && Comparision.length > 0 ? (
  <>
    <Text style={styles.minPrice}>
      Min: {formatPrice(
        Math.min(
          ...Comparision
            .map(p => p?.originalPrice)
            .filter(price => price !== null && price !== undefined)
        )
      )}
    </Text>

    <Text style={styles.maxPrice}>
      Max: {formatPrice(
        Math.max(
          ...Comparision
            .map(p => p?.originalPrice)
            .filter(price => price !== null && price !== undefined)
        )
      )}
    </Text>
  </>
) : (
  <Text style={styles.minPrice}>No prices available</Text>
)}

          </View>
        </View>
        
        {/* Products Grid */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        >
          {Comparision?.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              isCheapest={product.id === cheapestProduct?.id}
            
            />
          ))}
        </ScrollView>
        
        {/* Detailed Comparison Table */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Detailed Comparison</Text>
          
          <View style={styles.comparisonTable}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Feature</Text>
              {Comparision?.map((product) => (
                <Text key={product.id} style={styles.tableHeaderText} numberOfLines={2}>
                  {product.name}
                </Text>
              ))}
            </View>
            
            {/* Price Row */}
            <View style={styles.tableRow}>
              <Text style={styles.featureLabel}>Price</Text>
              {Comparision?.map((product) => (
                <Text key={product.id} style={styles.featureValue}>
                  {formatPrice(product.originalPrice)}
                </Text>
              ))}
            </View>
            
            {/* Company Row */}
            <View style={[styles.tableRow, styles.alternateRow]}>
              <Text style={styles.featureLabel}>Company</Text>
              {Comparision?.map((product) => (
                <Text key={product.id} style={styles.featureValue} numberOfLines={2}>
                  {product.company?.name || 'N/A'}
                </Text>
              ))}
            </View>
            
            {/* Category Row */}
            <View style={styles.tableRow}>
              <Text style={styles.featureLabel}>Category</Text>
              {Comparision?.map((product) => (
                <Text key={product.id} style={styles.featureValue}>
                  {product.companyType?.name || 'N/A'}
                </Text>
              ))}
            </View>
            
            {/* Variants Row */}
            <View style={[styles.tableRow, styles.alternateRow]}>
              <Text style={styles.featureLabel}>Variants</Text>
              {Comparision?.map((product) => (
                <Text key={product.id} style={styles.featureValue}>
                  {product.combination_indices?.length || 0}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompareProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  compareCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minPrice: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  maxPrice: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cheapestCard: {
    borderWidth: 2,
    borderColor: '#28a745',
  },
  bestValueBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  bestValueText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  discountPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  comparisonTable: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  alternateRow: {
    backgroundColor: '#f8f9fa',
  },
  featureLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  featureValue: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});