import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { COLORS } from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import navigationString from '../../../navigation/navigationString';
import { useFocusEffect } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

// Utility to parse DD-MM-YYYY to readable format (e.g. 09 Mar 2022)
const formatDate = dateStr => {
  if (!dateStr) return '';
  // Assuming dateStr "09-03-2022" (DD-MM-YYYY)
  const [day, month, year] = dateStr.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  // Format options
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const PriceList = ({ navigation }) => {
  const [pricelist, setPriceList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isActive,setIsactive]=useState(false)

  const fetchpricelist = async () => {
    try {
      setIsLoading(true);
      const payload = {
        data: {
          CategoryType: 'public_product_category',
          page: 0,
          productType: 'product',
          searchbar: null,
        },
      };
      const responce = await makeApiCall(API_URLS.pricelists, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      console.log('PriceList Data', responce);

      if (responce?.result?.message === 'success') {
        // Convert object to array sorted by id descending
        const pricelistsObj = responce.result.data.pricelists || {};
        // Sort by the provided orderedList for consistency
        const orderedIds = (responce.result.data.orderedList || []).flat();
        const sortedPricelists = orderedIds
          .map(id => pricelistsObj[id])
          .filter(Boolean); // filter out missing if any

        setPriceList(sortedPricelists);
      } else {
        setPriceList([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // useEffect(() => {
  //   fetchpricelist();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      fetchpricelist();
    }, []),
  );
  

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchpricelist();
  }, []);
  const handleActiveToggle = async (item, newValue) => {
    console.log(item?.id)
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.changeActivePriceList1, 'POST', {
        jsonrpc: '2.0',
        params: {
          pricelistId: [item.id]  
        }
      });
    console.log(response,'Update')
      if (response?.result?.message === 'success') {
        // Update the local state to reflect the change
        setPriceList(prevList =>
          prevList.map(listItem =>
            listItem.id === item.id
              ? { ...listItem, active: newValue }
              : listItem
          )
        );
       await fetchpricelist();
      } else {
        // If API call fails, revert the checkbox
        console.log('Failed to update active status');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(navigationString.EDITPRICELIST, { item })
      }
    >
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <Text style={styles.name}>NAME: {item.name}</Text>
        <CheckBox 
        value={item.active}
        onValueChange={(newValue) => handleActiveToggle(item, newValue)}
        // Add these props to customize the checkbox if needed
        tintColors={{ true: COLORS.blueColor, false: COLORS.grayText }}
        disabled={isLoading}
      />
      </View>
      <Text style={styles.detail}>
        CREATED ON: {formatDate(item.updated_on)}
      </Text>
      <Text style={styles.detail}>COMPANY: {item.company?.name || 'N/A'}</Text>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.active ? '#28a745' : '#dc3545' },
          ]}
        />
        <Text style={[styles.detail, { marginLeft: 6 }]}>
          {item.active ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Price Lists available.</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Price List'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={pricelist}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={ListEmptyComponent}
      />
      <TouchableOpacity
        style={{ ...styles.buttonCreate }}
        onPress={() => navigation.navigate(navigationString.CREATEPRICELIST)}
      >
        <Text style={{ ...styles.btntext }}>Create</Text>
      </TouchableOpacity>
      <Loader visible={isLoading} />
    </SafeAreaView>
  );
};

export default PriceList;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.cardBg || '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: COLORS.border || '#ddd',
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text || '#333',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  detail: {
    fontSize: 14,
    color: COLORS.grayText || '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.grayText || '#888',
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
