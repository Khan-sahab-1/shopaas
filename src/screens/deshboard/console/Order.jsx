

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headercomp from '../../../components/Headercomp';
import { API_URLS } from '../../../utils/apiurls';
import makeApiCall from '../../../utils/apiHelper';
import { useSelector } from 'react-redux';
import Ordercart from '../../../components/Ordercart';
import FilterModal from '../../../constant/FilterModal';
import Loader from '../../../components/Loader';
import navigationString from '../../../navigation/navigationString';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Order = ({ navigation }) => {
  const [orderData, setorderData] = useState([]);
  const [filterModal, setfilterModal] = useState(false);
  const [isLoding, setIsloding] = useState(false);
      const [currentPage, setCurrentPage] = useState(0);
      const [totalPages, settotalPage] = useState(null);
    console.log(totalPages)
  const [appliedFilters, setAppliedFilters] = useState({
    sortBy: null,
    filterBy: null,
    groupBy: null,
    filterType: null,
  });

  const filterByOptions = [
    { id: 1, name: 'Last 1 day', value: 'last_1_days' },
    { id: 2, name: 'Last 3 days', value: 'last_3_days' },
    { id: 3, name: 'Last 7 days', value: 'last_7_days' },
    { id: 4, name: 'Last 30 days', value: 'last_30_days' },
  ];

  const sortByOptions = [
    { id: 1, name: 'Order Date', value: 'date_order' },
    { id: 2, name: 'Delivery Date', value: 'commitment_date' },
    { id: 3, name: 'Expected Date', value: 'expected_date' },
    { id: 4, name: 'Order Value', value: 'amount_total' },
    { id: 5, name: 'Status', value: 'state' },
  ];

  const filterTypeOptions = [
    { id: 1, name: 'All', value: null },
    { id: 2, name: 'Orders to be confirmed', value: 'toConfirm' },
    { id: 3, name: 'Orders to be delivered', value: 'toDeliver' },
  ];

  const fetchorderData = async () => {
    // Construct payload according to API requirements
    const payload = {
      page: currentPage,
      type: appliedFilters.filterType,
      date_range: appliedFilters.filterBy,
      sort_by: appliedFilters.sortBy,
      group_by: appliedFilters.groupBy,
    };
    
    console.log('API Request Payload:', payload);
    
    try {
      setIsloding(true);
      const response = await makeApiCall(API_URLS.getStoreOrders, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      
      console.log('API Response:', response);
      
      if (response.result.message === 'success') {
        setorderData(response.result.data);
        settotalPage(response?.result?.data?.totalRecords)
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsloding(false);
    }
  };

  useEffect(() => {
    fetchorderData();
  }, [appliedFilters,currentPage]);

  const handleApplyFilters = (filters) => {
    console.log('Applying filters:', filters);
    setAppliedFilters(prev => ({
      ...prev,
      ...filters
    }));
    setfilterModal(false);
  };

  const handleFilterTypeChange = (filterType) => {
    console.log('Changing filter type to:', filterType);
    setAppliedFilters(prev => ({
      ...prev,
      filterType,
      // Reset other filters when changing type
      sortBy: null,
      filterBy: null,
      groupBy: null
    }));
  };

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Order'}
        left={true}
        onPress={() => navigation.goBack()}
        // right={true}
        onPressright={() => setfilterModal(true)}
      />
      
      <View style={styles.buttonContainer}>
        {filterTypeOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterButton,
              appliedFilters.filterType === option.value && styles.selectedButton,
            ]}
            onPress={() => handleFilterTypeChange(option.value)}
          >
            <Text
              style={[
                styles.filterText,
                appliedFilters.filterType === option.value && styles.selectedText,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
       <View style={{ ...styles.containerPagination }}>
                <TouchableOpacity
                  onPress={goPrev}
                  disabled={currentPage === 0}
                  style={[styles.arrowBtn, currentPage === 0 && styles.disabled]}
                >
                  <AntDesign
                    name="left"
                    size={24}
                    color={currentPage === 0 ? '#aaa' : '#007AFF'}
                  />
                </TouchableOpacity>
      
                <Text style={styles.pageText}>
                  {currentPage} / {totalPages}
                </Text>
      
                <TouchableOpacity
                  onPress={goNext}
                  disabled={currentPage === totalPages}
                  style={[
                    styles.arrowBtn,
                    currentPage === totalPages && styles.disabled,
                  ]}
                >
                  <AntDesign
                    name="right"
                    size={24}
                    color={currentPage === totalPages ? '#aaa' : '#007AFF'}
                  />
                </TouchableOpacity>
              </View>

      <Ordercart data={orderData} />
      
      {/* <TouchableOpacity style={styles.createButton}
      onPress={()=>navigation.navigate(navigationString.CREATEORDER)}>
        <Text style={{ fontSize: 18, color: COLORS.whiteColor }}>Create</Text>
      </TouchableOpacity> */}
      
      <FilterModal
        isVisible={filterModal}
        onClose={() => setfilterModal(false)}
        sortByOptions={sortByOptions}
        filterByOptions={filterByOptions}
        onApplyFilters={handleApplyFilters}
        initialFilters={appliedFilters}
      />
      
      <Loader visible={isLoding}/>
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  createButton: {
    position: 'absolute',
    backgroundColor: COLORS.blueLight,
    bottom: 40,
    right: 20,
    paddingHorizontal: 25,
    borderRadius: 50,
    padding: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    justifyContent: 'center',
  },
  filterButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: COLORS.blueColor,
  },
  filterText: {
    color: COLORS.blackColor,
    fontSize: 14,
  },
  selectedText: {
    color: COLORS.whiteColor,
    fontWeight: 'bold',
  },
  containerPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 20,
  },
  arrowBtn: {
    padding: 10,
    marginHorizontal: 20,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    // optional: reduce touch opacity for disabled
    opacity: 0.5,
  },
});