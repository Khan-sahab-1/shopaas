import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from '../../redux/reducers/addTocart';
import {COLORS} from '../../styles/colors';
import {API_URLS, BASE_URL} from '../../utils/apiurls';
import {SafeAreaView} from 'react-native-safe-area-context';
import makeApiCall from '../../utils/apiHelper';
import {showMessage} from 'react-native-flash-message';
import MessageShow from '../../constant/MessageShow';
import {fetchCartData} from '../../redux/reducers/fetchCartData';
import Icon from 'react-native-vector-icons/Feather';
import {useDebouncedCallback} from 'use-debounce';
import {syncCartItem} from '../../utils/cartSync';
import axios from 'axios';
import Loader from '../../components/Loader';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../../navigation/navigationString';

const ItemCart = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {cartData, totalQuantity, totalAmount} = useSelector(
    state => state.cartinfo,
  );
  console.log(cartData, 'cartData in cart');
  const [isLoding, setIsLoding] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(true);
  // Debounced API sync (avoids calling backend too often)
  const debouncedSync = useDebouncedCallback(item => {
    syncCartItem(item);
  }, 700);

  // Toggle company expansion
  const toggleCompanyExpansion = companyId => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  // Toggle all companies
  const toggleAllCompanies = () => {
    if (Object.keys(expandedCompanies).length === companyGroups.length) {
      // All are expanded, so collapse all
      setExpandedCompanies({});
    } else {
      // Expand all
      const allExpanded = {};
      companyGroups.forEach(company => {
        allExpanded[company.companyId] = true;
      });
      setExpandedCompanies(allExpanded);
    }
  };

  // Toggle order summary
  const toggleOrderSummary = () => {
    setIsOrderSummaryExpanded(!isOrderSummaryExpanded);
  };

  // Group cart items by company with detailed calculations
  const groupedByCompany = cartData.reduce((acc, item) => {
    const companyId = item.company_id || 'default';
    if (!acc[companyId]) {
      acc[companyId] = {
        companyName: item.company_brand_id || `Company ${companyId}`,
        companyId: companyId,
        items: [],
        subtotal: 0,
        shipping: 50,
        tax: 0,
        quantity: 0,
        finalTotal: 0,
      };
    }

    const itemTotal = item.list_price * item.quantity;
    const itemTax = itemTotal * 0.18; // 18% GST example

    acc[companyId].items.push({
      ...item,
      itemTotal,
      itemTax,
    });

    acc[companyId].subtotal += itemTotal;
    acc[companyId].tax += itemTax;
    acc[companyId].quantity += item.quantity;
    acc[companyId].finalTotal =
      acc[companyId].subtotal + acc[companyId].shipping + acc[companyId].tax;

    return acc;
  }, {});

  const companyGroups = Object.values(groupedByCompany);

  // Calculate overall totals
  const overallSummary = {
    totalCompanies: companyGroups.length,
    totalItems: totalQuantity,
    subtotal: totalAmount,
    shipping: companyGroups.reduce(
      (total, company) => total + company.shipping,
      0,
    ),
    tax: companyGroups.reduce((total, company) => total + company.tax, 0),
    finalTotal: companyGroups.reduce(
      (total, company) => total + company.finalTotal,
      0,
    ),
  };

  const handleRemoveItem = (id, company_id, name) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${name} from cart?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeFromCart({id, company_id})),
        },
      ],
    );
  };

  const handleClearCart = () => {
    if (cartData.length === 0) return;

    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearCart()),
        },
      ],
    );
  };

  const handleAddToCartFromCompany = async item => {
    const defaultVariant = item?.variant_data?.[0]?.[0] || null;

    try {
      const payload = {
        jsonrpc: '2.0',
        params: {
          product_id: defaultVariant,
          product_template_id: item.id,
          set_qty: 0,
          add_qty: item?.quantity || 1,
        },
      };

      const res = await makeApiCall(API_URLS.addToCart, 'POST', payload);

      if (res?.result?.message === 'success' && !res?.result.errorMessage) {
        MessageShow.success('Product added to cart successfully!');
      } else {
        MessageShow.error(
          res?.result?.errorMessage || 'Failed to add product to cart.',
        );
      }
    } catch (error) {
      console.log(error);
      MessageShow.error('Something went wrong while adding to cart.');
    }
  };

  // const handleCheckoutCompany = async(companyId) => {
  //   console.log(companyId, 'companyId');
  //   try {
  //     const responce=await makeApiCall(API_URLS.addToCart, 'POST', {
  //       jsonrpc: '2.0',
  //       params: {
  //         product_id: productId,
  //         add_qty: addQty,
  //         set_qty: setQty,
  //       },
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  const handleCheckoutCompany = async companyData => {
    console.log(companyData, 'companyData ===>>>');

    try {
      const recordsPayload = {};
      companyData.items.forEach((item, index) => {
        const variantId = item?.variant_data?.[0]?.[0];
        recordsPayload[`records_${index + 1}`] = {
          company_id: companyData.companyId,
          product_id: String(variantId),
          set_qty: item.quantity,
          product_template_id: String(item.id),
          add_qty: 0,
        };
      });

      const payload = {
        jsonrpc: '2.0',
        params: recordsPayload,
      };

      console.log('✅ Payload being sent:', JSON.stringify(payload, null, 2));
      setIsLoding(true);
      const response = await makeApiCall(API_URLS.addToCart, 'POST', payload);

      console.log('🟢 API Response:', response);
      if (response?.result?.items?.every(item => item.status === 'ok')) {
        MessageShow.success('All products added successfully wowowowowowo');
        navigation.navigate(navigationString.BILLINGADDRESS);
      } else {
        MessageShow.error(
          response?.result?.errorMessage ||
            response?.result?.items[0]?.errorMessage,
        );
      }
    } catch (error) {
      console.error(
        '❌ Error adding products:',
        error?.response?.data || error.message,
      );
      MessageShow.error('Error', 'Something went wrong while adding products.');
    } finally {
      setIsLoding(false);
    }
  };

  // Render individual company order summary (collapsible)
  const CompanyOrderSummary = ({company}) => {
    const isExpanded = expandedCompanies[company.companyId];

    return (
      <View style={styles.companySummary}>
        <TouchableOpacity
          style={styles.summaryHeader}
          onPress={() => toggleCompanyExpansion(company.companyId)}>
          <Text style={styles.companySummaryTitle}>
            {company.companyName} - Order Summary
          </Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.blackColor}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items Total:</Text>
              <Text style={styles.summaryValue}>
                ₹ {company.subtotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>
                ₹ {company.shipping.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (18%):</Text>
              <Text style={styles.summaryValue}>
                ₹ {company.tax.toFixed(2)}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.companyTotalRow]}>
              <Text style={styles.companyTotalLabel}>Company Total:</Text>
              <Text style={styles.companyTotalValue}>
                ₹ {company.finalTotal.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.companyCheckoutButton}
              onPress={() => handleCheckoutCompany(company)}>
              <Text style={styles.companyCheckoutButtonText}>
                Checkout {company.companyName}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render each company group with collapsible items and summary
  const renderCompanyGroup = ({item: company}) => {
    const isExpanded = expandedCompanies[company.companyId];

    return (
      <View style={styles.companyCard}>
        {/* Company Header - Clickable to toggle */}
        <TouchableOpacity
          style={styles.companyHeader}
          onPress={() => toggleCompanyExpansion(company.companyId)}>
          <View style={styles.companyHeaderContent}>
            <Text style={styles.companyName}>{company.companyName}</Text>
            <Text style={styles.companyStats}>
              {company.quantity} items • ₹ {company.subtotal.toFixed(2)}
            </Text>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={COLORS.blackColor}
          />
        </TouchableOpacity>

        {/* Company Items - Only show when expanded */}
        {isExpanded && (
          <FlatList
            data={company.items}
            renderItem={({item}) => renderCartItem(item, company.companyId)}
            // keyExtractor={item => `${item.id}-${item.company_id}`}
            // In the company items FlatList - replace this:
            // keyExtractor={item => `${item.id}-${item.company_id}`}

            // With this:
            keyExtractor={(item, index) =>
              `item-${item.id}-${item.company_id}-${index}`
            }
            scrollEnabled={false}
            style={styles.companyItemsList}
          />
        )}

        {/* Individual Company Order Summary */}
        <CompanyOrderSummary company={company} />
      </View>
    );
  };

  // Render individual cart item
  const renderCartItem = (item, companyId) => (
    <View style={styles.cartItem}>
      <Image
        source={{uri: BASE_URL + item.image}}
        style={styles.productImage}
        resizeMode="contain"
      />

      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>
          ₹ {item.list_price} × {item.quantity}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => dispatch(decrementQuantity(item.id))}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => dispatch(incrementQuantity(item.id))}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{...styles.quantityButton, marginLeft: 30}}
            onPress={() => handleAddToCartFromCompany(item)}>
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity> */}
        </View>

        {/* <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => {
            dispatch(decrementQuantity(item.id));
            debouncedSync({
              ...item,
              quantity: item.quantity - 1,
              decremented: true,
            });
          }}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => {
            dispatch(incrementQuantity(item.id));
            debouncedSync({
              ...item,
              quantity: item.quantity + 1,
              incremented: true,
            });
          }}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.itemTotalContainer}>
        <Text style={styles.itemTotalPrice}>₹ {item.itemTotal.toFixed(2)}</Text>
      </View>
    </View>
  );

  // Overall Order Summary Component (Collapsible)
  const OverallOrderSummary = () => (
    <View style={styles.overallSummary}>
      <TouchableOpacity
        style={styles.overallSummaryHeader}
        onPress={toggleOrderSummary}>
        <Text style={styles.overallSummaryTitle}>Final Order Summary</Text>
        <Icon
          name={isOrderSummaryExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={COLORS.blackColor}
        />
      </TouchableOpacity>

      {isOrderSummaryExpanded && (
        <View style={styles.overallSummaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Companies:</Text>
            <Text style={styles.summaryValue}>
              {overallSummary.totalCompanies}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items:</Text>
            <Text style={styles.summaryValue}>{overallSummary.totalItems}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>
              ₹ {overallSummary.subtotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Shipping:</Text>
            <Text style={styles.summaryValue}>
              ₹ {overallSummary.shipping.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Tax:</Text>
            <Text style={styles.summaryValue}>
              ₹ {overallSummary.tax.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.finalTotalRow]}>
            <Text style={styles.finalTotalLabel}>Grand Total:</Text>
            <Text style={styles.finalTotalValue}>
              ₹ {overallSummary.finalTotal.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity style={styles.finalCheckoutButton}>
            <Text style={styles.finalCheckoutButtonText}>
              Checkout All Orders ({overallSummary.totalCompanies} Companies)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Empty cart component
  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyMessage}>
        Looks like you haven't added any items to your cart yet.
      </Text>
      <TouchableOpacity style={styles.shopButton}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Shopping Cart
            {companyGroups.length > 0
              ? ` (${companyGroups.length} companies)`
              : ''}
          </Text>
          <View style={styles.headerActions}>
            {cartData.length > 0 && companyGroups.length > 1 && (
              <TouchableOpacity
                onPress={toggleAllCompanies}
                style={styles.expandAllButton}>
                <Text style={styles.expandAllText}>
                  {Object.keys(expandedCompanies).length ===
                  companyGroups.length
                    ? 'Collapse All'
                    : 'Expand All'}
                </Text>
              </TouchableOpacity>
            )}
            {cartData.length > 0 && (
              <TouchableOpacity onPress={handleClearCart}>
                <Text style={styles.clearCartText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cart Items Grouped by Company or Empty State */}
        {cartData.length > 0 ? (
          <View style={styles.content}>
            <FlatList
              data={companyGroups}
              renderItem={renderCompanyGroup}
              // keyExtractor={company => company.companyId}
              keyExtractor={(company, index) =>
                `company-${company.companyId}-${index}`
              }
              showsVerticalScrollIndicator={false}
              style={styles.companyList}
              // ListFooterComponent={<OverallOrderSummary />}
            />
          </View>
        ) : (
          <EmptyCart />
        )}
        <Loader visible={isLoding} />
      </View>
    </SafeAreaView>
  );
};

export default ItemCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    flex: 1,
  },
  expandAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  expandAllText: {
    fontSize: 14,
    color: COLORS.green,
    fontWeight: '600',
  },
  clearCartText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  companyList: {
    flex: 1,
  },
  companyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  companyHeaderContent: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    marginBottom: 4,
  },
  companyStats: {
    fontSize: 14,
    color: '#666',
  },
  companyItemsList: {
    marginTop: 12,
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    marginBottom: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    padding: 2,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    backgroundColor: COLORS.green,
    borderRadius: 4,
    padding: 6,
    minWidth: 30,
    alignItems: 'center',
  },
  quantityButtonText: {
    color: COLORS.whiteColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 10,
    color: COLORS.blackColor,
    minWidth: 16,
    textAlign: 'center',
  },
  addToCartText: {
    paddingHorizontal: 10,
    color: COLORS.whiteColor,
    fontSize: 12,
  },
  itemTotalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.blackColor,
  },
  // Company Order Summary Styles
  companySummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.green,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companySummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    flex: 1,
  },
  summaryContent: {
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
  companyTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
    marginTop: 4,
  },
  companyTotalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.blackColor,
  },
  companyTotalValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.green,
  },
  companyCheckoutButton: {
    backgroundColor: '#2196F3',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  companyCheckoutButtonText: {
    color: COLORS.whiteColor,
    fontSize: 14,
    fontWeight: '600',
  },
  // Overall Order Summary Styles
  overallSummary: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  overallSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    flex: 1,
  },
  overallSummaryContent: {
    marginTop: 16,
  },
  finalTotalRow: {
    borderTopWidth: 2,
    borderTopColor: '#2196F3',
    paddingTop: 12,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.blackColor,
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  finalCheckoutButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  finalCheckoutButtonText: {
    color: COLORS.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.blackColor,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: COLORS.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
