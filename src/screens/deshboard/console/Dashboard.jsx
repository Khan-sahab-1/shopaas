import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import navigationString from '../../../navigation/navigationString';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const [ordersData, setOrdersData] = useState(null);
  const [otherInfo, setOtherInfo] = useState(null);
  const [getOtherInfo, setGetOtherInfo] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    time: 'month',
    sale_order_type: 'order',
  });

  const filters = {
    time: {
      year: 'Year',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      quarter: 'Quarter',
    },
    sale_order_type: {
      order: 'Sale Orders',
      return: 'Return Orders',
    },
  };

  useEffect(() => {
    fetchOrders();
  }, [appliedFilters]);

  const fetchOrders = async () => {
    setFetchingData(true);
    try {
      const response = await makeApiCall(API_URLS.dashboardOrdersData, 'POST', {
        jsonrpc: '2.0',
        params: {
          filters: appliedFilters,
          getOtherInfo: getOtherInfo,
        },
      });

      console.log('Dashboard', response);

      if (response?.error || response?.result?.errorMessage) {
        Alert.alert('Error', response?.error || response.result.errorMessage);
      } else {
        setOrdersData(response.result?.ordersData || null);
        if (response.result?.otherInfo) {
          setOtherInfo(response.result.otherInfo);
          setGetOtherInfo(false);
        }
      }
    } catch (error) {
      console.log('Dashboard fetch error:', error);
      Alert.alert('Error', 'Failed to fetch dashboard data');
    } finally {
      setFetchingData(false);
    }
  };

  const handleFilterChange = (value, filterType) => {
    setAppliedFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Prepare chart data
  const getChartData = () => {
    if (!ordersData || ordersData.length === 0) return null;

    return {
      labels: ordersData.map(item => {
        const label = item.labels || '';
        return label.split(' ')[0] || 'N/A';
      }),
      datasets: [
        {
          data: ordersData.map(item => item.amount_total || 0),
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const getBarChartData = () => {
    if (!ordersData || ordersData.length === 0) return null;

    return {
      labels: ordersData.map(item => {
        const label = item.labels || '';
        return label.split(' ')[0] || 'N/A';
      }),
      datasets: [
        {
          data: ordersData.map(item => item.count || 0),
          color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: COLORS.whiteColor,
    backgroundGradientFrom: COLORS.whiteColor,
    backgroundGradientTo: COLORS.whiteColor,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primaryColor || '#007AFF',
    },
  };

  const handleRenewMembership = () => {
    // Navigate to membership renewal page
    console.log('Renew Membership pressed');
    navigation.navigate(navigationString.RENEWMEMBERSHIP);
  };

  const handleOrdersToConfirm = () => {
    // Navigate to orders confirmation page
    console.log('Orders to Confirm pressed');
    navigation.navigate(navigationString.ORDER, { status: 'toConfirm' });
  };

  const handleOrdersToDeliver = () => {
    // Navigate to orders delivery page
    console.log('Orders to Deliver pressed');
    navigation.navigate(navigationString.ORDER, { status: 'toDeliver' });
  };

  const getTotalRevenue = () => {
    if (!ordersData) return 0;
    return ordersData.reduce(
      (sum, order) => sum + (order.amount_total || 0),
      0,
    );
  };

  const getTotalOrders = () => {
    if (!ordersData) return 0;
    return ordersData.reduce((sum, order) => sum + (order.count || 0), 0);
  };

  const lineChartData = getChartData();
  const barChartData = getBarChartData();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Dashboard'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container}>
        {/* Filters Section */}
        <View style={styles.filters}>
          <Text style={styles.label}>Time Period:</Text>
          <View style={styles.filterRow}>
            {Object.entries(filters.time).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterButton,
                  appliedFilters.time === key && styles.activeFilterButton,
                ]}
                onPress={() => handleFilterChange(key, 'time')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    appliedFilters.time === key &&
                      styles.activeFilterButtonText,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Order Type:</Text>
          <View style={styles.filterRow}>
            {Object.entries(filters.sale_order_type).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterButton,
                  appliedFilters.sale_order_type === key &&
                    styles.activeFilterButton,
                ]}
                onPress={() => handleFilterChange(key, 'sale_order_type')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    appliedFilters.sale_order_type === key &&
                      styles.activeFilterButtonText,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {fetchingData ? (
          <View style={styles.loadingContainer}>
            <Loader visible={true} text='Loading dashboard data...'/>
            {/* <Text style={styles.loadingText}>Loading dashboard data...</Text> */}
          </View>
        ) : (
          <>
            {/* Action Buttons Section */}
            {otherInfo && (
              <View style={styles.buttonsContainer}>
                {otherInfo.show_renew_membership_btn && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.renewButton]}
                    onPress={handleRenewMembership}
                  >
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonText}>Renew Membership</Text>
                      <Text style={styles.validityText}>
                        Valid till: {otherInfo.validity_date}
                      </Text>
                      <Text style={styles.validityText}>
                      Number Of Products: {otherInfo.products_count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {otherInfo.ordersToConfirm > 0 && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={handleOrdersToConfirm}
                  >
                    <Text style={styles.buttonText}>
                      Orders To Be Confirmed
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {otherInfo.ordersToConfirm}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {otherInfo.ordersToDeliver > 0 && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deliverButton]}
                    onPress={handleOrdersToDeliver}
                  >
                    <Text style={styles.buttonText}>
                      Orders To Be Delivered
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {otherInfo.ordersToDeliver}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{getTotalOrders()}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                ₹{getTotalRevenue().toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
              {otherInfo && (
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {otherInfo.products_count || 0}
                  </Text>
                  <Text style={styles.statLabel}>Products</Text>
                </View>
              )}
            </View>

            {/* Charts Section */}
            {ordersData && ordersData.length > 0 && (
              <View style={styles.chartsContainer}>
                <Text style={styles.sectionTitle}>Revenue Overview</Text>
                {lineChartData && (
                  <LineChart
                    data={lineChartData}
                    width={width - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                  />
                )}

                <Text style={styles.sectionTitle}>Orders Count</Text>
                {barChartData && (
                  <BarChart
                    data={barChartData}
                    width={width - 40}
                    height={220}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
                    }}
                    style={styles.chart}
                  />
                )}
              </View>
            )}

            {/* Orders Details */}
            {ordersData && ordersData.length > 0 && (
              <View style={styles.ordersContainer}>
                <Text style={styles.sectionTitle}>
                  {filters.time[appliedFilters.time]} Orders
                </Text>
                {ordersData.map((order, index) => (
                  <View key={index} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderMonth}>{order.labels}</Text>
                      <Text style={styles.orderCount}>
                        {order.count} orders
                      </Text>
                    </View>
                    <Text style={styles.orderAmount}>
                    ₹{(order.amount_total || 0).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* No Data Message */}
            {!ordersData || ordersData.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No data available for the selected filters
                </Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.backgroundColor || '#F8F9FA',
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
  filters: {
    marginBottom: 20,
    backgroundColor: COLORS.whiteColor,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
    color: COLORS.textColor || '#1C1C1E',
  },
  picker: {
    backgroundColor: '#f0f0f0',
    marginTop: 8,
    borderRadius: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  activeFilterButtonText: {
    color: COLORS.whiteColor || '#FFFFFF',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flex: 1,
  },
  renewButton: {
    backgroundColor: COLORS.primaryColor || '#007AFF',
  },
  confirmButton: {
    backgroundColor: COLORS.warningColor || '#FF9500',
  },
  deliverButton: {
    backgroundColor: COLORS.successColor || '#34C759',
  },
  buttonText: {
    color: COLORS.whiteColor || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  validityText: {
    color: COLORS.whiteColor || '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  badge: {
    backgroundColor: COLORS.whiteColor || '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.textColor || '#1C1C1E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: COLORS.whiteColor,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textColor || '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grayColor || '#8E8E93',
    textAlign: 'center',
  },
  chartsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textColor || '#1C1C1E',
    marginBottom: 12,
    marginTop: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginBottom: 20,
  },
  ordersContainer: {
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: COLORS.whiteColor,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textColor || '#1C1C1E',
  },
  orderCount: {
    fontSize: 14,
    color: COLORS.grayColor || '#8E8E93',
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryColor || '#007AFF',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.grayColor || '#8E8E93',
    textAlign: 'center',
  },
});

export default Dashboard;
