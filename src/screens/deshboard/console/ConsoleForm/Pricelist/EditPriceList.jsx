import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import Icon from 'react-native-vector-icons/AntDesign';
import MessageShow from '../../../../../constant/MessageShow';
import UpdateRule from './UpdateRule';
import { fetchproductoptions } from '../../../../../utils/fetchproductoptions';

const EditPriceList = ({ navigation, route }) => {
  const { item } = route?.params;
  const UpdatedItem = item;
  
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [showaddrule, setShowaddrule] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const showStartPicker = () => setStartPickerVisibility(true);
  const hideStartPicker = () => setStartPickerVisibility(false);
  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => setEndPickerVisibility(false);
  const [isLoding, setIsLoading] = useState(false);
  const [newprice, setnewprice] = useState([]);
  const [selecteddiscount, setselecteddiscount] = useState(null);
  const [name, setname] = useState(item?.name || '');
  const [priceRule, setpricerule] = useState('');
  const [minqty, setminqty] = useState('');
  const [productLimit, setproductLimit] = useState('');
  const [selectcomputePrice, setcomputePrice] = useState(null);
  const [FixedPrice, setFixedPrice] = useState('');
  const [selectapplyon, setselectapplyon] = useState(null);
  const [openEditrule, setOpeneditRule] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const [category, setcategory] = useState([]);
  const [selectedCatogory, setselectedcategory] = useState(null);
  const [product, setproduct] = useState([]);
  const [selectedProduct, setselectedProduct] = useState(null);
  const [varient, setVarient] = useState([]);
  const [selectedVarient, setselectedVarient] = useState(null);

  const itemsArray = Object.entries(newprice?.pricelist?.item_ids || {}).map(
    ([id, details]) => ({
      id,
      ...(details || {}),
    }),
  );

  // Helper functions
  const getSelectedItem = () => {
    switch (selectapplyon?.label) {
      case 'Product Category':
        return selectedCatogory ? { id: selectedCatogory.value, name: selectedCatogory.lable } : { id: '', name: '' };
      case 'Product':
        return selectedProduct ? { id: selectedProduct.value, name: selectedProduct.label } : { id: '', name: '' };
      case 'Product Variant':
        return selectedVarient ? { id: selectedVarient.value, name: selectedVarient.label } : { id: '', name: '' };
      default:
        return { id: '', name: '' };
    }
  };

  const getItemName = () => {
    const selectedItem = getSelectedItem();
    return selectedItem.label || selectapplyon?.label || '';
  };

  const handleConfirmStart = date => {
    setStartDate(moment(date).format('YYYY-MM-DD'));
    hideStartPicker();
  };

  const handleConfirmEnd = date => {
    setEndDate(moment(date).format('YYYY-MM-DD'));
    hideEndPicker();
  };

  const fecthnewpricelist = async id => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.pricelists, 'POST', {
        jsonrpc: '2.0',
        params: {
          id: id,
        },
      });
      if (response?.result?.message === 'success') {
        setnewprice(response?.result?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlesubmit = async id => {
    try {
      setIsLoading(true);

      const updatedData = {};
      
      if (name !== item?.name) {
        updatedData.name = name;
      }

      if (selecteddiscount?.value !== item?.discount_policy) {
        updatedData.discount_policy = selecteddiscount?.value;
      }

      if (showaddrule) {
        const existingItems = newprice?.pricelist?.item_ids || {};
        const count = Object.keys(existingItems).length;
        const newKey = `New${count}`;

        updatedData.item_ids = {
          [newKey]: {
            compute_price: selectcomputePrice?.value || '',
            applied_on: selectapplyon?.value || '',
            pricelist_product_limit: productLimit || '',
            min_quantity: minqty || '',
            date_start: startDate || '',
            date_end: endDate || '',
            percent_price: FixedPrice || '',
            name: getItemName(),
            selectedItem: getSelectedItem()
          },
        };
      }

      const response = await makeApiCall(API_URLS.savePricelist, 'POST', {
        jsonrpc: '2.0',
        params: {
          id: id,
          updatedData,
        },
      });

      if (response?.result?.message === 'success') {
        MessageShow.success('success', response?.result?.message);
        navigation.goBack();
      } else {
        MessageShow.error('error', response?.result?.errorMessage);
      }
    } catch (error) {
      console.log('Save Error:', error);
      Alert.alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleremove = async itemToRemove => {
    try {
      setIsLoading(true);

      const currentItemIds = { ...newprice?.pricelist?.item_ids };
      delete currentItemIds[itemToRemove.id];

      const payload = {
        id: newprice?.pricelist?.id,
        updatedData: {
          item_ids: currentItemIds,
          type: 'remove',
        },
      };

      const response = await makeApiCall(API_URLS.savePricelist, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });

      if (response?.result?.message === 'success') {
        fecthnewpricelist(newprice?.pricelist?.id);
        MessageShow.success('Success', 'Rule removed successfully');
      } else {
        MessageShow.error(
          'Error',
          response?.result?.errorMessage || 'Failed to remove rule',
        );
      }
    } catch (error) {
      console.log('Error removing item:', error);
      MessageShow.error('Error', 'An error occurred while removing the rule');
    } finally {
      setIsLoading(false);
    }
  };

  const handlesubmitted = () => {
    if (newprice?.pricelist?.id) {
      handlesubmit(newprice?.pricelist?.id);
    }
  };

  useEffect(() => {
    if (item?.id) fecthnewpricelist(item?.id);
  }, [item?.id]);

  useEffect(() => {
    const discountOptions = newprice?.form_options?.discount_policy ?? {};
    if (!item?.discount_policy) return;

    const matchedLabel = discountOptions[item.discount_policy];
    if (matchedLabel) {
      setselecteddiscount({
        label: matchedLabel,
        value: item.discount_policy,
      });
    }
  }, [item?.discount_policy, newprice?.form_options?.discount_policy]);

  useEffect(() => {
    fetchproductoptions('product_category', setIsLoading, setcategory, 'pricelist');
    fetchproductoptions('product', setIsLoading, setproduct, 'pricelist');
    fetchproductoptions('product_variant', setIsLoading, setVarient, 'pricelist');
  }, []);

  useEffect(() => {
    if (showaddrule) {
      setpricerule('');
      setminqty('');
      setproductLimit('');
      setcomputePrice(null);
      setFixedPrice('');
      setselectapplyon(null);
      setselectedcategory(null);
      setselectedProduct(null);
      setselectedVarient(null);
      setStartDate('');
      setEndDate('');
    }
  }, [showaddrule]);

  const formattedDiscountPolicy = newprice?.form_options?.discount_policy ?? {};
  const dropdownDiscountPolicy = Object.entries(formattedDiscountPolicy).map(
    ([value, label]) => ({
      label,
      value,
    }),
  );

  const formattedapplied_on = newprice?.form_options?.applied_on ?? {};
  const dropdownapplied_on = Object.entries(formattedapplied_on).map(
    ([value, label]) => ({
      label,
      value,
    }),
  );

  const formattedcompute_price = newprice?.form_options?.compute_price ?? {};
  const dropdowncompute_price = Object.entries(formattedcompute_price).map(
    ([value, label]) => ({
      label,
      value,
    }),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Edit Price List'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={{ ...styles.container }}>
          <Text style={{ ...styles.label }}>Name</Text>
          <TextInputCompo
            placeholder="Name"
            style={{ ...styles.inputbox }}
            onChangeText={text => setname(text)}
            value={name}
          />
          
          <Text style={{ ...styles.label }}>Discount Policy</Text>
          <Dropdowncomp
            data={dropdownDiscountPolicy}
            labelField="label"
            valueField="value"
            placeholder="Select an option"
            onChange={item => setselecteddiscount(item)}
            value={selecteddiscount}
            style={{ height: 60 }}
          />

          {itemsArray.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                setOpeneditRule(true);
                setselectedItem(item);
              }}
            >
              <Text style={styles.label}>Applied On: {item.name || '-'}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.label}>
                  Min Quantity: {item.min_quantity || '-'}
                </Text>
                <TouchableOpacity onPress={() => handleremove(item)}>
                  <Icon name={'delete'} size={30} color={COLORS.blackColor} />
                </TouchableOpacity>
              </View>
              <Text style={styles.label}>Price: {item.price || '-'}</Text>
              <Text style={styles.label}>
                Start Date: {item.date_start || '-'}
              </Text>
              <Text style={styles.label}>End Date: {item.date_end || '-'}</Text>
            </TouchableOpacity>
          ))}

          <ButtonCompo title="Add Rule" onPress={() => setShowaddrule(true)} />
          
          {showaddrule && (
            <View>
              <Text style={{ ...styles.label }}>Price Rule Name</Text>
              <TextInputCompo
                placeholder="Price Rule Name"
                style={{ ...styles.inputbox }}
                onChangeText={text => setpricerule(text)}
                value={priceRule}
                editable={false}
              />
              
              <Text style={{ ...styles.label }}>Min. Quantity</Text>
              <TextInputCompo
                placeholder="Min. Quantity"
                style={{ ...styles.inputbox }}
                onChangeText={text => setminqty(text)}
                value={minqty}
              />
              
              <Text style={{ ...styles.label }}>Product Limit</Text>
              <TextInputCompo
                placeholder="Product Limit"
                style={{ ...styles.inputbox }}
                onChangeText={text => setproductLimit(text)}
                value={productLimit}
              />
              
              <Text style={{ ...styles.label }}>Compute Price</Text>
              <Dropdowncomp
                data={dropdowncompute_price}
                labelField="label"
                valueField="value"
                placeholder="Select an option"
                onChange={item => setcomputePrice(item)}
                value={selectcomputePrice}
              />
              
              <Text style={{ ...styles.label }}>Fixed Price</Text>
              <TextInputCompo
                placeholder="Fixed Price"
                style={{ ...styles.inputbox }}
                onChangeText={text => setFixedPrice(text)}
                value={FixedPrice}
              />
              
              <Text style={{ ...styles.label }}>Apply On</Text>
              <Dropdowncomp
                data={dropdownapplied_on}
                labelField="label"
                valueField="value"
                placeholder="Select an option"
                value={selectapplyon}
                onChange={item => setselectapplyon(item)}
              />
              
              {selectapplyon?.label === 'Product Category' && (
                <>
                  <Text style={{ ...styles.label }}>Product Category</Text>
                  <Dropdowncomp
                    data={category}
                    onChange={item => setselectedcategory(item)}
                    value={selectedCatogory}
                  />
                </>
              )}
              
              {selectapplyon?.label === 'Product' && (
                <>
                  <Text style={{ ...styles.label }}>Select Product</Text>
                  <Dropdowncomp
                    data={product}
                    onChange={item => setselectedProduct(item)}
                    value={selectedProduct}
                    style={{ height: 60 }}
                  />
                </>
              )}
              
              {selectapplyon?.label === 'Product Variant' && (
                <>
                  <Text style={{ ...styles.label }}>Select Product Variant</Text>
                  <Dropdowncomp
                    data={varient}
                    onChange={item => setselectedVarient(item)}
                    value={selectedVarient}
                    style={{ height: 60 }}
                  />
                </>
              )}

              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                onPress={showStartPicker}
                style={{
                  ...styles.inputbox,
                  justifyContent: 'center',
                  padding: 10,
                }}
              >
                <Text style={{ fontSize: 14, color: COLORS.blackColor }}>
                  {startDate || 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartPickerVisible}
                mode="date"
                onConfirm={handleConfirmStart}
                onCancel={hideStartPicker}
              />

              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity
                onPress={showEndPicker}
                style={{
                  ...styles.inputbox,
                  justifyContent: 'center',
                  padding: 10,
                }}
              >
                <Text style={{ fontSize: 14, color: COLORS.blackColor }}>
                  {endDate || 'Select End Date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndPickerVisible}
                mode="date"
                onConfirm={handleConfirmEnd}
                onCancel={hideEndPicker}
                minimumDate={startDate ? new Date(startDate) : new Date()}
              />
            </View>
          )}
          
          <ButtonCompo title="Save" onPress={handlesubmitted} />
          <Loader visible={isLoding} />
          
          <UpdateRule
            isVisible={openEditrule}
            onClose={() => {
              setOpeneditRule(false);
              fecthnewpricelist(item?.id);
            }}
            initialData={selectedItem}
            id={item?.id}
          />
          
          <View style={{ marginBottom: 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blackColor,
    marginBottom: 8,
  },
  inputbox: {
    borderWidth: 1,
    borderColor: COLORS.grayColor,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default EditPriceList;