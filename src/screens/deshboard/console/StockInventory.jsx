import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {COLORS} from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import Dropdowncomp from '../../../components/Dropdowncomp';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import makeApiCall from '../../../utils/apiHelper';
import {API_URLS} from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import MultiSelectorDropdownComp from '../../../components/Multiselectordropdowncomp';
import ButtonCompo from '../../../components/ButtonCompo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-gesture-handler';
import MessageShow from '../../../constant/MessageShow';

const StockInventory = ({navigation}) => {
  const [formData, setFormData] = useState({
    countedQty: null,
    accountingDate: '',
    location: [],
    category: [],
    product: [],
  });
  const [countedQtyOptions, setCountedQtyOptions] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [countedQuantities, setCountedQuantities] = useState({}); // 🔑 for live updates

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoding, stIsLoding] = useState(false);

  const [locationOptions, setLocationOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const lineIds = Array.isArray(inventoryData?.data?.line_ids)
    ? inventoryData.data.line_ids
    : Object.values(inventoryData?.data?.line_ids || {});

  const handleChange = (key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = date => {
    handleChange('accountingDate', moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };
  console.log(inventoryData, 'Inventry Dat');
  console.log(countedQuantities, 'Qty');
  const fetchInventory = async () => {
    try {
      stIsLoding(true);
      const response = await makeApiCall(API_URLS.stockInventory, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });

      const result = response?.result;
      if (!result) return;
      setInventoryData(result);

      const countedOptions = Object.entries(
        result.form_options?.prefill_counted_quantity || {},
      ).map(([key, label]) => ({
        label,
        value: key,
      }));
      setCountedQtyOptions(countedOptions);

      setFormData(prev => ({
        ...prev,
        countedQty:
          countedOptions.find(
            opt => opt.value === result.data?.prefill_counted_quantity,
          ) || null,
        accountingDate: result.data?.accounting_date || '',
      }));

      // initialize countedQuantities with on-hand
      const initialQuantities = {};
      Object.values(result?.data?.line_ids || {}).forEach(item => {
        initialQuantities[item.id] = item.product_qty;
      });
      setCountedQuantities(initialQuantities);
    } catch (error) {
      console.log(error);
    } finally {
      stIsLoding(false);
    }
  };

  const fetchOptions = async (id, origin, type, query = null) => {
    try {
      stIsLoding(true);
      const response = await makeApiCall(API_URLS.getProductOptions, 'POST', {
        jsonrpc: '2.0',
        params: {id, origin, query, type},
      });

      const formattedItems = (response?.result?.data?.items || []).map(
        item => ({
          label: item?.name || '',
          value: item?.id ?? null,
        }),
      );

      if (type === 'locations') setLocationOptions(formattedItems);
      else if (type === 'category') setCategoryOptions(formattedItems);
      else if (type === 'products') setProductOptions(formattedItems);
    } catch (error) {
      console.log(error);
    } finally {
      stIsLoding(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (inventoryData?.data?.id) {
      const id = inventoryData.data.id;
      const origin = 'stock_inventory';
      fetchOptions(id, origin, 'locations');
      fetchOptions(id, origin, 'category');
      fetchOptions(id, origin, 'products');
    }
  }, [inventoryData?.data?.id]);

  const handlesubmit = async () => {
    if (!inventoryData?.data?.id) return;

    try {
      stIsLoding(true);

      const payload = {
        jsonrpc: '2.0',
        params: {
          id: inventoryData.data.id,
          updatedData: {
            selectedItems: {
              locations: formData.location,
              category: formData.category,
              products: formData.product,
            },
            action: 'start_inventory',
          },
        },
      };

      const response = await makeApiCall(
        API_URLS.saveStockInventory,
        'POST',
        payload,
      );

      if (response?.result?.message === 'success') {
        setFormData({
          countedQty: null,
          accountingDate: '',
          location: [],
          category: [],
          product: [],
        });
        await fetchInventory();
      }
    } catch (error) {
      console.log('Submission Error:', error);
    } finally {
      stIsLoding(false);
    }
  };

  const handlevalidate = async (id, action) => {
    try {
      if (!inventoryData?.data?.id) return;
      stIsLoding(true);
      const line_ids = {};
      for (const lineId in countedQuantities) {
        // We are building the nested object format here
        line_ids[lineId] = {product_qty: Number(countedQuantities[lineId])};
      }
      const updatedData = {
        line_ids,
        action,
      };
      const response = await makeApiCall(API_URLS.saveStockInventory, 'POST', {
        jsonrpc: '2.0',
        params: {id, updatedData},
      });
      console.log(response, 'Stock Invent');
      if (response?.result?.message === 'success') {
        MessageShow.success('success', response?.result?.message);
        await fetchInventory();
      }
    } catch (error) {
      console.log(error);
    } finally {
      stIsLoding(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'StockInventory'}
        onPress={() => navigation.goBack()}
        left={true}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{paddingHorizontal: 15}}>
            {inventoryData?.data?.btnStatus?.show_start_inventory && (
              <>
                <Text style={styles.lable}>Counted Quantities</Text>
                <Dropdowncomp
                  data={countedQtyOptions}
                  value={formData.countedQty}
                  onChange={item => handleChange('countedQty', item)}
                />

                <Text style={styles.lable}>Accounting Date</Text>
                <TouchableOpacity
                  style={styles.inputbox}
                  onPress={showDatePicker}>
                  <Text style={{fontSize: 16, color: COLORS.blackColor}}>
                    {formData.accountingDate || 'Select Date'}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />

                {/* <View style={styles.rowContainer}>
                <Text style={styles.lable}>Select Location</Text>
                  <View style={styles.halfWidth}>
                    <MultiSelectorDropdownComp
                      data={locationOptions}
                      value={formData.location}
                      onChange={item => handleChange('location', item)}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                  <Text style={styles.lable}>Category</Text>
                    <MultiSelectorDropdownComp
                      data={categoryOptions}
                      value={formData.category}
                      onChange={item => handleChange('category', item)}
                    />
                  </View>
                </View> */}
                <View style={styles.rowContainer}>
                  {/* Location */}
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Select Location</Text>
                    <MultiSelectorDropdownComp
                      data={locationOptions}
                      value={formData.location}
                      onChange={item => handleChange('location', item)}
                    />
                  </View>

                  {/* Category */}
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Category</Text>
                    <MultiSelectorDropdownComp
                      data={categoryOptions}
                      value={formData.category}
                      onChange={item => handleChange('category', item)}
                    />
                  </View>
                </View>

                <Text style={styles.lable}>Select Products</Text>
                <MultiSelectorDropdownComp
                  data={productOptions}
                  value={formData.product}
                  onChange={item => handleChange('product', item)}
                  search={true}
                  style={{height: 60}}
                />
              </>
            )}

            {inventoryData?.data?.btnStatus?.show_start_inventory && (
              <ButtonCompo title="Start Inventory" onPress={handlesubmit} />
            )}

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {inventoryData?.data?.btnStatus?.show_validate && (
                <ButtonCompo
                  title="Start Validate"
                  onPress={() =>
                    handlevalidate(inventoryData?.data?.id, 'validate')
                  }
                  style={{width: '45%'}}
                />
              )}
              {inventoryData?.data?.btnStatus?.show_validate && (
                <ButtonCompo
                  title="Cancel"
                  onPress={() =>
                    handlevalidate(inventoryData?.data?.id, 'cancel')
                  }
                  style={{width: '45%'}}
                />
              )}
            </View>

            {/* 🔥 Cards per product */}
            {inventoryData?.data?.btnStatus?.show_validate &&
              lineIds.map(item => {
                const counted = countedQuantities[item.id] ?? item.product_qty;
                const difference = counted - item.product_qty;

                return (
                  <View key={item.id} style={styles.card}>
                    <Text style={styles.productName}>
                      {item?.product_id?.name}
                    </Text>
                    <Text style={styles.location}>
                      {item?.location_id?.name}
                    </Text>

                    <View style={styles.row}>
                      <Text style={styles.label}>On hand:</Text>
                      <Text style={styles.value}>{item?.product_qty}</Text>
                    </View>

                    <View style={styles.row}>
                      <Text style={styles.label}>Counted:</Text>
                      <TextInput
                        style={styles.input}
                        value={String(counted)}
                        keyboardType="numeric"
                        onChangeText={text => {
                          const val = parseInt(text || '0', 10);
                          setCountedQuantities(prev => ({
                            ...prev,
                            [item.id]: val,
                          }));
                        }}
                      />
                    </View>

                    <View style={styles.row}>
                      <Text style={styles.label}>Difference:</Text>
                      <Text
                        style={[
                          styles.value,
                          {
                            color:
                              difference > 0
                                ? 'green'
                                : difference < 0
                                ? 'red'
                                : 'black',
                          },
                        ]}>
                        {difference}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default StockInventory;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9'},
  lable: {fontSize: 14, fontWeight: '600', marginTop: 10},
  inputbox: {
    borderWidth: 1,
    borderColor: COLORS.blackColor,
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  rowContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  halfWidth: {width: '48%'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {fontSize: 16, fontWeight: 'bold', marginBottom: 4},
  location: {fontSize: 14, color: '#666', marginBottom: 10},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {fontSize: 14, color: '#444'},
  value: {fontSize: 14, fontWeight: '600'},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 100,
    textAlign: 'center',
    left: 5,
  },
});
