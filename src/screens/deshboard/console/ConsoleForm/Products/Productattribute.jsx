import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import navigationString from '../../../../../navigation/navigationString';
import CreateProductAttribute from './Modals/CreateProductAttribute';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Productattribute = ({ navigation }) => {
  const [isloding, setisloding] = useState(false);
  const [attributedata, setattributedata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [isOpenModal, setOpneModal] = useState(false);
 const [currentPage, setCurrentPage] = useState(0);
  const [totalPages,settotalPage]=useState(null)

  const fetchproductattribute = async () => {
    try {
      setisloding(true);
      const responce = await makeApiCall(
        API_URLS.ProductAttributeTree,
        'POST',
        {
          jsonrpc: '2.0',
          params: { page: currentPage},
        },
      );
      console.log('RESPPPPP', responce);
      if (responce?.result?.message === 'success') {
        setattributedata(responce?.result?.data);
        setFilteredData(responce?.result?.data);
        settotalPage(responce?.result?.total_data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloding(false);
    }
  };

  useEffect(() => {
    fetchproductattribute();
  }, [currentPage]);

  // Filter data based on search text and selected company
  useEffect(() => {
    let filtered = attributedata;

    if (searchText) {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.company_name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (selectedCompany !== 'All') {
      filtered = filtered.filter(item => item.company_name === selectedCompany);
    }

    setFilteredData(filtered);
  }, [searchText, selectedCompany, attributedata]);

  // Get unique companies for filter
  const getUniqueCompanies = () => {
    const companies = [
      ...new Set(attributedata.map(item => item.company_name)),
    ];
    return ['All', ...companies];
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
  
  
  const getCompanyColor = companyName => {
    const colors = {
      'Apollo Pharma': '#4A90E2',
      'Test Admin': '#7ED321',
    };
    return colors[companyName] || '#9B9B9B';
  };

  const renderCompanyFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Filter by Company:</Text>
      <View style={styles.companyFilters}>
        {getUniqueCompanies().map(company => (
          <TouchableOpacity
            key={company}
            style={[
              styles.filterChip,
              selectedCompany === company && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedCompany(company)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCompany === company && styles.activeFilterChipText,
              ]}
            >
              {company}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Icon
        name="search"
        size={20}
        color={COLORS.grayColor || '#9B9B9B'}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search attributes or companies..."
        placeholderTextColor={COLORS.grayColor || '#9B9B9B'}
        value={searchText}
        onChangeText={setSearchText}
      />
      {searchText ? (
        <TouchableOpacity onPress={() => setSearchText('')}>
          <Icon name="clear" size={20} color={COLORS.grayColor || '#9B9B9B'} />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderItem = ({ item, index }) => {
    const companyColor = getCompanyColor(item.company_name);

    return (
      <TouchableOpacity
        style={[styles.itemContainer, { borderLeftColor: companyColor }]}
        activeOpacity={0.7}
        onPress={() => {
          // Handle item press - navigate to details or perform action
          navigation.navigate(navigationString.ATTRIBUTEPREVIEW, { item }),
            console.log('Selected attribute:', item);
        }}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name.trim()}
            </Text>
            <View
              style={[styles.companyBadge, { backgroundColor: companyColor }]}
            >
              <Text style={styles.companyBadgeText} numberOfLines={1}>
                {item.company_name}
              </Text>
            </View>
          </View>

          <View style={styles.itemFooter}>
            <View style={styles.typeContainer}>
              <Icon
                name="local-pharmacy"
                size={14}
                color={COLORS.grayColor || '#9B9B9B'}
              />
              <Text style={styles.typeText}>{item.company_type_name}</Text>
            </View>
            {/* <Text style={styles.idText}>ID: {item.id}</Text> */}
          </View>
        </View>

        <Icon
          name="chevron-right"
          size={24}
          color={COLORS.grayColor || '#9B9B9B'}
        />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="inbox" size={64} color={COLORS.grayColor || '#9B9B9B'} />
      <Text style={styles.emptyTitle}>No attributes found</Text>
      <Text style={styles.emptySubtitle}>
        {searchText || selectedCompany !== 'All'
          ? 'Try adjusting your search or filter'
          : 'No product attributes available'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View>
      {renderSearchBar()}
      {renderCompanyFilter()}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredData.length} attribute{filteredData.length !== 1 ? 's' : ''}{' '}
          found
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Headercomp
        title={'Product Attributes'}
        left={true}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {isloding ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.primaryColor || '#4A90E2'}
            />
            <Text style={styles.loadingText}>Loading attributes...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              filteredData.length === 0 ? styles.emptyList : null
            }
          />
        )}



          <View style={{...styles.containerPagination}}>
        <TouchableOpacity
                onPress={goPrev}
                disabled={currentPage === 0}
                style={[styles.arrowBtn, currentPage === 0 && styles.disabled]}
              >
                <AntDesign name="left" size={24} color={currentPage === 0 ? '#aaa' : '#007AFF'} />
              </TouchableOpacity>
        
              <Text style={styles.pageText}>
                {currentPage} / {totalPages}
              </Text>
        
              <TouchableOpacity
                onPress={goNext}
                disabled={currentPage === totalPages}
                style={[styles.arrowBtn, currentPage === totalPages && styles.disabled]}
              >
                <AntDesign name="right" size={24} color={currentPage === totalPages ? '#aaa' : '#007AFF'} />
              </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ ...styles.buttonCreate }}
          onPress={() => setOpneModal(true)}
        >
          <Text style={{ ...styles.btntext }}>Create</Text>
        </TouchableOpacity>
        <CreateProductAttribute
        isVisible={isOpenModal}
        onClose={()=>setOpneModal(false)}/>
      </View>
    </SafeAreaView>
  );
};

export default Productattribute;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.whiteColor || '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.whiteColor || '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textColor || '#333333',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.whiteColor || '#FFFFFF',
    margin: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textColor || '#333333',
    paddingVertical: 0,
  },
  filterContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textColor || '#333333',
    marginBottom: 8,
  },
  companyFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.whiteColor || '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.grayColor || '#E0E0E0',
  },
  activeFilterChip: {
    backgroundColor: COLORS.primaryColor || '#4A90E2',
    borderColor: COLORS.primaryColor || '#4A90E2',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textColor || '#333333',
  },
  activeFilterChipText: {
    color: COLORS.whiteColor || '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.grayColor || '#666666',
    fontWeight: '500',
  },
  itemContainer: {
    backgroundColor: COLORS.whiteColor || '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textColor || '#333333',
    flex: 1,
    marginRight: 8,
    textTransform: 'capitalize',
  },
  companyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: 120,
    marginTop: 20,
  },
  companyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.whiteColor || '#FFFFFF',
    textAlign: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    color: COLORS.grayColor || '#666666',
    marginLeft: 4,
    fontWeight: '500',
  },
  idText: {
    fontSize: 12,
    color: COLORS.grayColor || '#999999',
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textColor || '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.grayColor || '#666666',
    textAlign: 'center',
    lineHeight: 20,
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
    opacity: 0.5,
  },
});
