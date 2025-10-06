import {
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
import { fetchproductoptions } from '../../../../../utils/fetchproductoptions';

const CreatePriceList = ({ navigation }) => {
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
  const [name, setname] = useState('');
  const [priceRule, setpricerule] = useState('');
  const [minqty, setminqty] = useState('');
  const [productLimit, setproductLimit] = useState('');
  const [selectcomputePrice, setcomputePrice] = useState(null);
  const [FixedPrice, setFixedPrice] = useState('');
  const [selectapplyon, setselectapplyon] = useState(null);
  const [category, setcategory] = useState([]);
  const [selectedCatogory, setselectedcategory] = useState(null);
  const [product, setproduct] = useState([]);
  const [selectedProduct, setselectedProduct] = useState(null);
  const [varient, setVarient] = useState([]);
  const [selectedVarient,setselectedVarient]=useState(null)
  console.log(selectedVarient, 'categort');

  const handleConfirmStart = date => {
    setStartDate(moment(date).format('YYYY-MM-DD'));
    hideStartPicker();
  };

  const handleConfirmEnd = date => {
    setEndDate(moment(date).format('YYYY-MM-DD'));
    hideEndPicker();
  };
  const fecthnewpricelist = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.pricelists, 'POST', {
        jsonrpc: '2.0',
        params: {
          id: 'New',
        },
      });
      console.log('Create Price List Data', response);
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
  
      const updatedData = {
        name: name || '',
        discount_policy: selecteddiscount || '',
      };
  
      if (showaddrule) {
        // Determine selectedItem and name based on selection
        let selectedItem = { id: '', name: '' };
        let itemName = selectapplyon?.label || '';
        
        if (selectapplyon?.label === 'Product Category' && selectedCatogory) {
          selectedItem = { id: selectedCatogory.value, name: selectedCatogory.label };
          itemName = selectedCatogory.label || itemName;
        } else if (selectapplyon?.label === 'Product' && selectedProduct) {
          selectedItem = { id: selectedProduct.value, name: selectedProduct.lable };
          itemName = selectedProduct.label || itemName;
        } else if (selectapplyon?.label === 'Product Variant' && selectedVarient) {
          selectedItem = { id: selectedVarient.value, name: selectedVarient.label };
          itemName = selectedVarient.label || itemName;
        }
  
        updatedData.item_ids = {
          New0: {
            compute_price: selectcomputePrice || '',
            applied_on: selectapplyon?.value || '',
            pricelist_product_limit: productLimit || '',
            min_quantity: minqty || '',
            date_start: startDate || '',
            date_end: endDate || '',
            percent_price: FixedPrice || '',
            name: itemName, // Use selected item name or fallback to apply_on label
            selectedItem: selectedItem
          },
        };
      }
  console.log('Payload',updatedData)
      const response = await makeApiCall(API_URLS.savePricelist, 'POST', {
        jsonrpc: '2.0',
        params: {
          id: id,
          updatedData,
        },
      });
  console.log(response,'RESPONCE')
      if (response?.result?.message === 'success') {
        navigation.goBack();
      }
    } catch (error) {
      console.log('Save Error:', error);
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
    fecthnewpricelist();
  }, []);

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
  //   console.log(formattedapplied_on,'HHHH')
  const formattedcompute_price = newprice?.form_options?.compute_price ?? {};

  const dropdowncompute_price = Object.entries(formattedcompute_price).map(
    ([value, label]) => ({
      label,
      value,
    }),
  );

  useEffect(() => {
    // fetchPromotion();

    // Fetch customer data using the reusable utility function
    fetchproductoptions(
      'product_category',
      setIsLoading,
      setcategory,
      'pricelist',
    );

    // Fetch product data using the same reusable utility function
    fetchproductoptions('product', setIsLoading, setproduct, 'pricelist');
    fetchproductoptions(
      'product_variant',
      setIsLoading,
      setVarient,
      'pricelist',
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Create Price List'}
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
          <Text style={{ ...styles.label }}>Doscount Policy</Text>
          <Dropdowncomp
            data={dropdownDiscountPolicy}
            labelField="label"
            valueField="value"
            placeholder="Select an option"
            onChange={item => setselecteddiscount(item.value)}
            value={selecteddiscount}
            style={{ height: 60 }}
            //   value={selectedValue}
            //   onChange={item => setSelectedValue(item.value)}
          />
          <ButtonCompo title="Add Rule" onPress={() => setShowaddrule(true)} />
          {showaddrule && (
            <View>
              <Text style={{ ...styles.label }}>Price Rule Name</Text>
              <TextInputCompo
                placeholder="Price Rule Name"
                style={{ ...styles.inputbox }}
                onChangeText={text => setpricerule(text)}
                value={priceRule}
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
                onChange={item => setcomputePrice(item.value)}
                value={selectcomputePrice}
                //   value={selectedValue}
                //   onChange={item => setSelectedValue(item.value)}
              />
              <Text style={{ ...styles.label }}>Fixed Price</Text>
              <TextInputCompo
                placeholder="Product Limit"
                style={{ ...styles.inputbox }}
                onChangeText={text => setFixedPrice(text)}
                value={FixedPrice}
              />
              <Text style={{ ...styles.label }}>Apply On </Text>
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
                  <Text style={{ ...styles.label }}>Product Category </Text>
                  <Dropdowncomp
                    data={category}
                    onChange={item => setselectedcategory(item)}
                    value={selectedCatogory}
                  />
                </>
              )}
              {selectapplyon?.label === 'Product' && (
                <>
                  <Text style={{ ...styles.label }}>Select Product </Text>
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
                  <Text style={{ ...styles.label }}>
                    Select Product Variant{' '}
                  </Text>
                  <Dropdowncomp data={varient} 
                  onChange={(item)=>setselectedVarient(item)}
                  value={selectedVarient}
                  style={{height:60}}/>
                </>
              )}

              {/* Start Date */}
              <Text style={styles.label}>Start Date</Text>
              {/* <TextInputCompo
          placeholder="Start Date"
          value={startDate}
          style={styles.inputbox}
          onPressIn={showStartPicker}
        /> */}
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

              {/* End Date */}
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
          <View style={{ marginBottom: 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePriceList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blackColor,
  },
  inputbox: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },
});
