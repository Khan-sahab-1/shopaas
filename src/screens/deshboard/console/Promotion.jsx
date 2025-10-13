import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLORS} from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import {API_URLS} from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import navigationString from '../../../navigation/navigationString';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Promotion = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [promotionData, setPromotionData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fetchPromotion = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getPromotionData, 'POST', {
        jsonrpc: '2.0',
        params: {userId: null, method: 'GET', data: null},
      });
      console.log('Promotion', response);

      if (response?.result) {
        setPromotionData(response.result);
      } else {
        Alert.alert('Error', 'Failed to fetch promotion data');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while fetching promotions');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPromotion();
      return () => {
        console.log('Screen unfocused, cleanup here if needed');
      };
    }, []),
  );

  // const getFilteredPromotions = () => {
  //   if (!promotionData?.promotion_Data) return []

  //   const promotions = Object.values(promotionData.promotion_Data)

  //   let filtered = promotions.filter(promo => {
  //     const matchesSearch = promo.name.toLowerCase().includes(searchText.toLowerCase()) ||
  //                          (promo.promo_code && promo.promo_code.toLowerCase().includes(searchText.toLowerCase()))

  //     let matchesFilter = true
  //     if (selectedFilter === 'code_needed') {
  //       matchesFilter = promo.promo_code_usage === 'code_needed'
  //     } else if (selectedFilter === 'no_code') {
  //       matchesFilter = promo.promo_code_usage === 'no_code_needed'
  //     } else if (selectedFilter === 'discount') {
  //       matchesFilter = promo.reward_type === 'discount'
  //     } else if (selectedFilter === 'product') {
  //       matchesFilter = promo.reward_type === 'product'
  //     }

  //     return matchesSearch && matchesFilter && promo.active
  //   })

  //   return filtered
  // }

  const getFilteredPromotions = () => {
    if (!promotionData?.promotion_Data) return [];

    const promotions = Object.values(promotionData.promotion_Data);

    let filtered = promotions.filter(promo => {
      const matchesSearch =
        promo.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (promo.promo_code &&
          promo.promo_code.toLowerCase().includes(searchText.toLowerCase()));

      let matchesFilter = true;
      if (selectedFilter === 'code_needed') {
        matchesFilter = promo.promo_code_usage === 'code_needed';
      } else if (selectedFilter === 'no_code') {
        matchesFilter = promo.promo_code_usage === 'no_code_needed';
      } else if (selectedFilter === 'discount') {
        matchesFilter = promo.reward_type === 'discount';
      } else if (selectedFilter === 'product') {
        matchesFilter = promo.reward_type === 'product';
      }

      return matchesSearch && matchesFilter && promo.active;
    });

    // ✅ Sort newest first (based on created date OR ID)
    filtered.sort((a, b) => {
      const dateA = new Date(a.create_date || a.rule_date_from || 0);
      const dateB = new Date(b.create_date || b.rule_date_from || 0);
      return dateB - dateA; // newest on top
    });

    return filtered;
  };

  const formatDate = dateString => {
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPromotionTypeColor = (rewardType, discountType) => {
    if (rewardType === 'product') return COLORS.successColor || '#34C759';
    if (discountType === 'percentage') return COLORS.primaryColor || '#007AFF';
    return COLORS.warningColor || '#FF9500';
  };

  const getPromotionIcon = (rewardType, discountType) => {
    if (rewardType === 'product') return '🎁';
    if (discountType === 'percentage') return '%';
    return '₹';
  };

  const handlePromotionPress = promotion => {
    const details = `
Name: ${promotion.name}
${promotion.promo_code ? `Code: ${promotion.promo_code}` : 'No code required'}
Valid: ${formatDate(promotion.rule_date_from)} - ${formatDate(
      promotion.rule_date_to,
    )}
Min Amount: ₹${promotion.rule_minimum_amount}
${
  promotion.reward_type === 'discount'
    ? `Discount: ${
        promotion.discount_type === 'percentage'
          ? `${promotion.discount_percentage}%`
          : `₹${promotion.discount_fixed_amount}`
      }`
    : `Free Product: ${
        promotion.reward_product_id?.[0]?.name || 'Product reward'
      }`
}
${promotion.description ? `Description: ${promotion.description}` : ''}
    `.trim();

    Alert.alert('Promotion Details', details, [{text: 'OK', style: 'default'}]);
  };

  const renderPromotionCard = promotion => {
    const isExpired =
      promotion.rule_date_to && new Date(promotion.rule_date_to) < new Date();

    return (
      <TouchableOpacity
        key={promotion.id}
        style={[styles.promotionCard, isExpired && styles.expiredCard]}
        onPress={() => {
          handlePromotionPress(promotion);
          navigation.navigate(navigationString.UPDATEPROMOTION, {promotion});
        }}
        disabled={isExpired}>
        <View style={styles.cardHeader}>
          <View style={styles.promotionTypeContainer}>
            <View
              style={[
                styles.promotionIcon,
                {
                  backgroundColor: getPromotionTypeColor(
                    promotion.reward_type,
                    promotion.discount_type,
                  ),
                },
              ]}>
              <Text style={styles.iconText}>
                {getPromotionIcon(
                  promotion.reward_type,
                  promotion.discount_type,
                )}
              </Text>
            </View>
            <View style={styles.promotionInfo}>
              <Text
                style={[styles.promotionName, isExpired && styles.expiredText]}
                numberOfLines={2}>
                {promotion.name}
              </Text>
              <Text
                style={[styles.promotionCode, isExpired && styles.expiredText]}>
                {promotion.promo_code
                  ? `Code: ${promotion.promo_code}`
                  : 'No code required'}
              </Text>
            </View>
          </View>

          {promotion.order_count > 0 && (
            <View style={styles.usageBadge}>
              <Text style={styles.usageText}>{promotion.order_count} used</Text>
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.offerContainer}>
            {promotion.reward_type === 'discount' ? (
              <Text style={[styles.offerText, isExpired && styles.expiredText]}>
                {promotion.discount_type === 'percentage'
                  ? `${promotion.discount_percentage}% OFF`
                  : `₹${promotion.discount_fixed_amount} OFF`}
              </Text>
            ) : (
              <Text style={[styles.offerText, isExpired && styles.expiredText]}>
                Free Product
              </Text>
            )}

            {promotion.rule_minimum_amount > 0 && (
              <Text
                style={[styles.minAmountText, isExpired && styles.expiredText]}>
                Min order: ₹{promotion.rule_minimum_amount}
              </Text>
            )}
          </View>

          <View style={styles.validityContainer}>
            <Text
              style={[styles.validityLabel, isExpired && styles.expiredText]}>
              Valid until:
            </Text>
            <Text
              style={[
                styles.validityDate,
                isExpired ? styles.expiredText : styles.validDate,
              ]}>
              {formatDate(promotion.rule_date_to)}
            </Text>
          </View>
        </View>

        {promotion.promo_applicability === 'on_next_order' && (
          <View style={styles.nextOrderBadge}>
            <Text style={styles.nextOrderText}>Next Order</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filterOptions = [
    {key: 'all', label: 'All'},
    {key: 'code_needed', label: 'Code Required'},
    {key: 'no_code', label: 'Auto Apply'},
    {key: 'discount', label: 'Discounts'},
    {key: 'product', label: 'Free Products'},
  ];

  const filteredPromotions = getFilteredPromotions();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <Headercomp
        title={'Promotions'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search promotions..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={COLORS.grayColor || '#8E8E93'}
          />
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}>
          <View style={styles.filterContainer}>
            {[...filterOptions].reverse().map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterButton,
                  selectedFilter === option.key && styles.activeFilterButton,
                ]}
                onPress={() => setSelectedFilter(option.key)}>
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === option.key && styles.activeFilterText,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            {/* <ActivityIndicator size="large" color={COLORS.primaryColor || '#007AFF'} /> */}
            <Loader visible={true} />
            <Text style={styles.loadingText}>Loading promotions...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.promotionsContainer}
            showsVerticalScrollIndicator={false}>
            {filteredPromotions.length > 0 ? (
              <>
                <Text style={styles.promotionsCount}>
                  {filteredPromotions.length} promotion
                  {filteredPromotions.length !== 1 ? 's' : ''} available
                </Text>
                {filteredPromotions.map(renderPromotionCard)}
              </>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataIcon}>🎯</Text>
                <Text style={styles.noDataTitle}>No Promotions Found</Text>
                <Text style={styles.noDataText}>
                  {searchText || selectedFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No active promotions available at the moment'}
                </Text>
              </View>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
        <TouchableOpacity
          style={{...styles.buttonCreate}}
          onPress={() => navigation.navigate(navigationString.CREATEPROMOTION)}>
          <Text style={{...styles.btntext}}>Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Promotion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor || '#F8F9FA',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: COLORS.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterScrollView: {
    maxHeight: 50,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 8,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterButton: {
    backgroundColor: COLORS.primaryColor || '#007AFF',
    borderColor: COLORS.primaryColor || '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textColor || '#1C1C1E',
  },
  activeFilterText: {
    color: COLORS.whiteColor || '#FFFFFF',
  },
  promotionsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  promotionsCount: {
    fontSize: 14,
    color: COLORS.grayColor || '#8E8E93',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  promotionCard: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryColor || '#007AFF',
    position: 'relative',
  },
  expiredCard: {
    opacity: 0.6,
    borderLeftColor: COLORS.grayColor || '#8E8E93',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  promotionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promotionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    color: COLORS.whiteColor || '#FFFFFF',
    fontWeight: 'bold',
  },
  promotionInfo: {
    flex: 1,
  },
  promotionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textColor || '#1C1C1E',
    marginBottom: 4,
  },
  promotionCode: {
    fontSize: 12,
    color: COLORS.grayColor || '#8E8E93',
    fontFamily: 'monospace',
  },
  usageBadge: {
    backgroundColor: COLORS.successColor || '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  usageText: {
    fontSize: 10,
    color: COLORS.whiteColor || '#FFFFFF',
    fontWeight: '600',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  offerContainer: {
    flex: 1,
  },
  offerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryColor || '#007AFF',
    marginBottom: 4,
  },
  minAmountText: {
    fontSize: 12,
    color: COLORS.grayColor || '#8E8E93',
  },
  validityContainer: {
    alignItems: 'flex-end',
  },
  validityLabel: {
    fontSize: 10,
    color: COLORS.grayColor || '#8E8E93',
    marginBottom: 2,
  },
  validityDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  validDate: {
    color: COLORS.successColor || '#34C759',
  },
  expiredText: {
    color: COLORS.grayColor || '#8E8E93',
  },
  nextOrderBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.warningColor || '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nextOrderText: {
    fontSize: 10,
    color: COLORS.whiteColor || '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.grayColor || '#8E8E93',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noDataIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textColor || '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.grayColor || '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 20,
  },
  buttonCreate: {
    position: 'absolute',
    backgroundColor: COLORS.blueColor,
    width: 100,
    height: 50,
    right: 20,
    bottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntext: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.whiteColor,
  },
});
