import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
} from 'react-native';
import { CheckBox, Chip, Card } from 'react-native-elements';
import {
  getProductDataUpdate,
  saveProductDataUpdate,
} from '../DataTransfer/Servicess';
import ItemPopup from '../DataTransfer/ItemPopup';
import style from '../DataTransfer/style';
import Headercomp from '../../../../../components/Headercomp';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../../../components/Loader';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import { COLORS } from '../../../../../styles/colors';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

const UpdateProduct = () => {
  const [productData, setProductData] = useState(null);
  const [updateProductData, setUpdateProductData] = useState({});
  const [form_options, setFormOptions] = useState({});
  const [fetchingData, setFetchingData] = useState(false);
  const [productUpdated, setProductUpdated] = useState(false);
  const [productPage, setProductPage] = useState(0);
  const [popupData, setPopupData] = useState({ open: false });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProductOption, setSelectedProductOption] = useState(null);
  const navigation = useNavigation();

  const options = Object.entries(form_options?.filter || {}).map(
    ([key, label]) => ({
      value: key,
      label: label,
    })
  );

  useEffect(() => {
    getProductFormData();
  }, []);

  const getProductFormData = async () => {
    setFetchingData(true);
    try {
      const res = await getProductDataUpdate(productPage);
      if (res.error || res.result.errorMessage) {
        alert(res.error || res.result.errorMessage);
      } else {
        setProductData(res.result.data || {});
        setFormOptions(res.result.form_options || {});
      }
    } catch (e) {
      console.error(e);
    }
    setFetchingData(false);
  };

  const handleSubmit = async (payloadData) => {
    if (!payloadData || Object.keys(payloadData).length === 0) return;
  
    setFetchingData(true);
  
    try {
      const cleanUpdateData = { ...payloadData };
  
      if (cleanUpdateData.lines) {
        Object.keys(cleanUpdateData.lines).forEach((lineId) => {
          const line = cleanUpdateData.lines[lineId];
          if (line.price !== undefined && line.price !== '') {
            const numericValue = parseFloat(line.price);
            if (!isNaN(numericValue)) line.price = numericValue.toString();
          }
          cleanUpdateData[lineId] = line;
        });
        delete cleanUpdateData.lines;
      }
  
      const payload = {
        page: productPage,
        id: productData?.id,
        updateProductData: cleanUpdateData,
      };
  
      console.log(payload, 'PAYLOAD-------');
  
      const res = await saveProductDataUpdate(
        productPage,
        productData?.id,
        cleanUpdateData
      );
  
      if (res?.result?.message === 'success') {
        if (res.result.data) {
          setProductData(res.result.data);
          setUpdateProductData({});
        } else {
          setProductUpdated(true);
        }
      } else if (res.error || res?.result?.errorMessage) {
        alert(res.error || res.result.errorMessage);
      }
    } catch (e) {
      console.error('handleSubmit error:', e);
    } finally {
      setFetchingData(false);
    }
  };
  

  const showBtn = btnType => {
    const btnStatus = productData?.btnStatus || {};
    if (btnType === 'show_start') return btnStatus.show_start;
    if (btnType === 'show_update') return btnStatus.show_update;
    if (btnType === 'show_cancel') return btnStatus.show_update;
    return false;
  };

  // const performAction = async action => {
  //   let newUpdateData = { ...updateProductData, action };
  //   if (selectedItem?.id) newUpdateData.selectedItem = selectedItem.id;
  //   setUpdateProductData(newUpdateData);
  //   await handleSubmit(productData?.id,);
  // };

  const performAction = async (action) => {
    // Build payload directly
    const payloadData = {
      ...updateProductData,
      action,
      ...(selectedItem?.id && { selectedItem: selectedItem.id }),
    };
  
    await handleSubmit(payloadData);
  };
  

  const getLineData = (field, row) => {
    const line = updateProductData?.lines?.[row?.id] || {};
    if (field === 'price')
      return (line?.price ?? row?.price ?? '').toString();
    if (field === 'is_published')
      return line?.is_published ?? row?.is_published ?? false;
    return '';
  };

  const handleLineChange = (value, key, row) => {
    const lines = { ...(updateProductData?.lines || {}) };
    const line = { ...(lines[row?.id] || {}), [key]: value };

    if (key === 'price' && value !== '') {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return;
    }

    lines[row?.id] = line;
    setUpdateProductData({ ...updateProductData, lines });
  };

  const handlePopupActions = (item = null) => {
    setPopupData({ open: false });
    setSelectedItem(item);
  };

  const openPopup = () => {
    const type = selectedProductOption?.value || '';
    setPopupData({ open: true, type });
  };

  return (
    <SafeAreaView style={style.container}>
      <Headercomp
        title={'Product Data Update'}
        onPress={() => navigation.goBack()}
        left={true}
      />

      {productData && !productUpdated && (
        <View style={style.container}>
          <View style={style.hr_tag} />

          {/* Buttons */}
          <View style={styles.header_btn_wrapper}>
            <ButtonCompo title='Submit' onPress={() => performAction('start')}/>
            {showBtn('show_start') && (
              <Pressable
                style={styles.header__btn}
                onPress={() => performAction('start')}>
                <Text style={styles.header__btn__text}>Start</Text>
              </Pressable>
            )}
            {showBtn('show_update') && (
              <Pressable
                style={styles.header__btn}
                onPress={() => performAction('update')}>
                <Text style={styles.header__btn__text}>Update</Text>
              </Pressable>
            )}
            {showBtn('show_cancel') && (
              <Pressable
                style={styles.header__btn}
                onPress={() => performAction('cancel')}>
                <Text style={styles.header__btn__text}>Cancel</Text>
              </Pressable>
            )}
          </View>

          <View style={style.thinhr_tag}></View>

          {/* Filter Dropdown */}
          <View style={style.show_data_in_row}>
            <Text
              style={[style.bold_font, { marginLeft: '2%', marginTop: '5%' }]}>
              Applied On
            </Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#999',
                width: '50%',
                marginLeft: 10,
                marginRight: 10,
              }}>
              <Dropdowncomp
                data={options}
                value={selectedProductOption}
                onChange={item => setSelectedProductOption(item)}
              />
            </View>
          </View>

          {/* Popup Button */}
       

          {showBtn('show_start') && productData?.filter && (
            <View style={{ marginTop: 50, width: '90%', alignSelf: 'center' }}>
              <ButtonCompo
                style={{ backgroundColor: COLORS.green }}
                title={selectedProductOption?.label || 'ALL'}
                onPress={openPopup}
              />
              {selectedItem && (
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}>
                  <Card>
                    <Chip
                      title={selectedItem?.name ?? ''}
                      icon={{
                        name: 'close',
                        type: 'font-awesome',
                        size: 16,
                        color: 'white',
                      }}
                      onPress={() => setSelectedItem(null)}
                    />
                  </Card>
                </View>
              )}
            </View>
          )}

          {/* Product Lines */}
          {productData?.total_line_ids > 0 && (
            <ScrollView style={{ marginBottom: '-7%' }}>
              {Object.values(productData?.product_update_line_ids || {}).map(
                row => (
                  <Card
                    key={row?.id}
                    containerStyle={{ paddingVertical: 5, borderRadius: 5 }}>
                    <View style={styles.cardDetailViewColumn}>
                      <View style={styles.cardDetailViewRow}>
                        <Text
                          style={{
                            width: '70%',
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}>
                          {row?.product_id?.name ?? ''}
                        </Text>
                      </View>
                      <View style={styles.cardDetailViewRow}>
                        <Text style={{ fontSize: 17 }}>Product Type:</Text>
                        <Text style={{ fontSize: 17 }}>{row?.type ?? ''}</Text>
                      </View>
                      <View style={styles.cardDetailViewRow}>
                        <Text style={{ fontSize: 17 }}>Product Category:</Text>
                        <Text style={{ fontSize: 17 }}>
                          {row?.categ_id?.name ?? ''}
                        </Text>
                      </View>
                      <View style={styles.cardDetailViewRow}>
                        <Text style={{ fontSize: 17, marginTop: '2%' }}>
                          Price:
                        </Text>
                        <TextInput
                          style={[styles.input, { width: 200 }]}
                          value={getLineData('price', row)}
                          keyboardType="numeric"
                          onChangeText={val =>
                            handleLineChange(val, 'price', row)
                          }
                        />
                      </View>
                      {row?.lot_id?.name && (
                        <View style={styles.cardDetailViewRow}>
                          <Text style={{ fontSize: 17 }}>
                            Lot/Serial: {row.lot_id.name}
                          </Text>
                        </View>
                      )}
                      <View style={{ marginLeft: '-10%' }}>
                        <CheckBox
                          title="Published"
                          iconRight
                          textStyle={{ fontSize: 17 }}
                          containerStyle={{
                            marginTop: -6,
                            backgroundColor: '#fff',
                            borderColor: '#fff',
                          }}
                          checked={getLineData('is_published', row)}
                          onPress={() =>
                            handleLineChange(
                              !getLineData('is_published', row),
                              'is_published',
                              row,
                            )
                          }
                        />
                      </View>
                    </View>
                  </Card>
                ),
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* Item Popup */}
      <ItemPopup
        origin="product-data-update"
        open={popupData?.open}
        type={popupData?.type}
        handlePopupActions={handlePopupActions}
        id={productData?.id}
      />

      <Loader visible={fetchingData} />
    </SafeAreaView>
  );
};

export default UpdateProduct;

const styles = StyleSheet.create({
  cardDetailViewColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardDetailViewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1%',
  },
  input: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#8080806e',
    padding: 2,
    borderRadius: 4,
    fontSize: 17,
  },
  header_btn_wrapper: {
    width: '95%',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
  },
  header__btn: {
    paddingVertical: 6,
    marginHorizontal: 8,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: style.blueColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  header__btn__text: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
});
