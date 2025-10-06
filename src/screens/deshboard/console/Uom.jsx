import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import Loader from '../../../components/Loader';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import EditModal from './ConsoleForm/Uom/EditModal';
import CreatingUomModal from './ConsoleForm/Uom/CreatingUomModal';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Uom = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uomData, setUomData] = useState([]);
  const [isVisible, setisvisible] = useState(false);
  const [selectedItem, setselecteditem] = useState(null);
  const [uomDatadata, setUomDatadata] = useState([]);
  const [opencreatemodal, setopencreatemodal] = useState(false);
  console.log(uomDatadata, 'JHJHHJHH');

  const fetchUomInfo = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.storeUomCategory, 'POST', {
        jsonrpc: '2.0',
        params: {
          page: 0,
          searchbar: null,
          productType: 'product',
          CategoryType: 'public_product_category',
        },
      });

      console.log(response, 'UOMResponse');

      if (response?.result?.message === 'success' && response.result.data) {
        setUomDatadata(response?.result?.data);
        const categories = response.result.data.category;
        const categoriesArray = Object.values(categories);
        setUomData(categoriesArray);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUomInfo();
  }, []);
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setselecteditem(item);
        setisvisible(true);
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.categoryName}>{item.name}</Text>
        {/* <Text style={styles.detailsText}>ID: {item.id}</Text> */}
        {/* <Text style={styles.detailsText}>Company Type: {item.company_type}</Text> */}
        <Text style={styles.detailsText}>UOM Type: {item.uom_type}</Text>
        {/* You can add more details here based on the data */}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Uom'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {uomData.length > 0 ? (
          <FlatList
            data={uomData}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        ) : (
          !isLoading && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No UOM categories found.</Text>
            </View>
          )
        )}

        {uomDatadata?.is_admin_company && (
          <TouchableOpacity
            style={{ ...styles.buttonCreate }}
            onPress={() => setopencreatemodal(true)}
          >
            <Text style={{ ...styles.btntext }}>Create</Text>
          </TouchableOpacity>
        )}
      </View>
      <Loader visible={isLoading} />
      <EditModal
        isVisible={isVisible}
        onclose={() => setisvisible(false)}
        item={selectedItem}
      />
      <CreatingUomModal
        isVisible={opencreatemodal}
        onclose={() =>{ setopencreatemodal(false)
          fetchUomInfo()
        }}
        item={selectedItem}
      />
    </SafeAreaView>
  );
};

export default Uom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  list: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary, // Using a theme color for a nice accent
  },
  cardContent: {
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.gray,
    fontStyle: 'italic',
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
