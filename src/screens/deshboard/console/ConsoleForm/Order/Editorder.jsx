import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import makeApiCall from '../../../../../utils/apiHelper';
import {API_URLS} from '../../../../../utils/apiurls';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import {COLORS} from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import DateTimePickerComp from '../../../../../components/DateTimePickerComp';
import moment from 'moment';
import TextInputCompo from '../../../../../components/TextInputCompo';
import EditableTable from '../../../../../components/EditableTable';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import navigationString from '../../../../../navigation/navigationString';
import Editable from '../../../../../constant/Editable';
import Loader from '../../../../../components/Loader';
import MessageShow from '../../../../../constant/MessageShow';
import {SafeAreaView} from 'react-native-safe-area-context';

const Editorder = ({navigation, route}) => {
  const {orderData} = route.params;
  // console.log(orderData, 'OrderdataParems');
  const [isLoding, setIsloading] = useState(false);
  const [deleveryMethod, setdeleveryMethod] = useState([]);
  const [selecetedDeveryMethod, setselecteddeliveryMethod] = useState(null);
  const [deleveryorderType, setDeleveryOrderType] = useState([]);
  const [selecetdOrderType, setseleceOrderType] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setselectedCustomer] = useState(
    orderData.partner.id,
  );

  const [paymentterm, setPaymentterm] = useState([]);
  const [selectedpaymentterm, setselectedpaymentterm] = useState(null);
  const [paymentstatus, setpaymentstatus] = useState([]);
  const [selectedpaymentstatus, setselectedpaymentStatus] = useState(null);
  const [paymentMode, setpaymentmode] = useState([]);
  const [selecetdpaymentMode, setselecetedpaymentMode] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [resturnammount, setreturnamount] = useState('');
  const [selectedTab, setSelectedTab] = useState('LINE');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [updateddata, setUpdateddata] = useState([]);
  const [texdetails, settexdetails] = useState([]);
  const [selectedtex, setselecetdTex] = useState(null);
  // const [orderLines, setOrderLines] = useState(updateddata.order_lines || {});
  const [delivered, setDelivered] = useState('');

  const [isedit, setisedit] = useState(false);
  // const [salespersion,setsalespersion]=useState('')

  // console.log(updateddata?.delivery_count, 'Updared Data');
  // console.log(texdetails, 'texdetails');
  // console.log(deleveryorderType,'Customer')

  const fetchcreateorder = async () => {
    try {
      setIsloading(true);
      const responce = await makeApiCall(API_URLS.fetchcreate_order, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(responce, 'OrderFetch');
      const formatatted = Object.entries(responce?.result?.carrier_ids).map(
        ([key, value]) => ({
          label: value,
          value: key,
        }),
      );
      setdeleveryMethod(formatatted);

      const formattedOrderType = Object.entries(
        responce?.result?.sale_order_type,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setDeleveryOrderType(formattedOrderType);

      const formatecustomer = Object.entries(responce?.result?.partner_ids).map(
        ([key, value]) => ({
          label: value,
          value: key,
        }),
      );
      setCustomers(formatecustomer);
      const formatePaymentTerm = Object.entries(
        responce?.result?.payment_term_ids,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setPaymentterm(formatePaymentTerm);
      const formatePaymentStatus = Object.entries(
        responce?.result?.payment_status,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setpaymentstatus(formatePaymentStatus);
      const formattedPaymentMode = Object.entries(
        responce?.result?.payment_mode,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setpaymentmode(formattedPaymentMode);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    fetchcreateorder();
    fetchtaxesdetails();
  }, []);
  // console.log(deleveryorderType,"methid")
  const fetchtaxesdetails = async () => {
    try {
      const responce = await makeApiCall(API_URLS.fetchTaxesDetails, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      // console.log(responce?.result,'Tax')
      const formattedData = Object.entries(
        responce?.result?.taxes_id || {},
      ).map(([key, value]) => ({
        label: value.name,
        value: key,
      }));

      settexdetails(formattedData);
    } catch (error) {
      console.log(error);
    }
  };
  const handlehanes = async data => {
    try {
      setIsloading(true);
      const payload = {
        jsonrpc: '2.0',
        data: data,
      };
      console.log(payload, 'Payload');
      const responce = await makeApiCall(API_URLS.SavefetchDetails, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      console.log(responce, 'Responce=====');
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchintialRender = async ordetId => {
    try {
      setIsloading(true);
      const res = await makeApiCall(API_URLS.getStoreOrderData, 'POST', {
        jsonrpc: '2.0',
        params: {
          orderId: ordetId,
        },
      });
      console.log(res, 'Hetch OrderData');
      if (res?.result?.message === 'success') {
        setUpdateddata(res.result?.data?.order);
        MessageShow.success('success', res?.result?.message);
      } else {
        // Alert.alert(res?.result?.errorMessage)
        MessageShow.error(res?.result?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    if (orderData?.id) {
      fetchintialRender(orderData?.id);
    }
  }, [orderData?.id]);

  useEffect(() => {
    if (updateddata && customers.length > 0) {
      // Set Customer dropdown
      if (updateddata?.partner?.id) {
        const matched = customers.find(
          c => Number(c.value) === Number(updateddata.partner.id),
        );

        if (matched) {
          setselectedCustomer(matched.value);
        }
      }

      // Set Order Type dropdown
      if (updateddata?.sale_order_type && deleveryorderType.length > 0) {
        const matched = deleveryorderType.find(
          c =>
            String(c.value).toLowerCase() ===
            String(updateddata.sale_order_type).toLowerCase(),
        );

        // console.log('Available dropdown values:', deleveryorderType);
        // console.log('sale_order_type from API:', updateddata.sale_order_type);
        // console.log('Matched',matched)
        if (matched) {
          setseleceOrderType(matched.value);
        }
      }
      if (updateddata?.payment_term_id && paymentterm.length > 0) {
        const matched = paymentterm.find(
          c => String(c.value) === String(updateddata?.payment_term_id),
        );
        //  console.log(matched,'Matched')
        //    console.log('Available dropdown values:', paymentterm);
        // console.log('sale_order_type from API:', updateddata?.payment_term_id);
        // console.log('Matched',matched)
        if (matched) {
          // selectedpaymentterm
          setselectedpaymentterm(String(matched.value));
        }
      }
      if (updateddata.payment_mode && paymentMode.length > 0) {
        const matched = paymentMode.find(
          c => String(c.value) === String(updateddata.payment_mode),
        );
        // console.log('Matched:', matched);
        // console.log('Available dropdown values:', paymentMode);
        // console.log('payment_mode from API:', updateddata.payment_mode);

        if (matched) {
          setselecetedpaymentMode(matched);
        }
      }
      if (updateddata?.payment_status && paymentstatus.length > 0) {
        const matched = paymentstatus.find(
          c => String(c.value) === String(updateddata?.payment_status),
        );

        if (matched) {
          setselectedpaymentStatus(matched);
        }
      }
      if (updateddata?.carrier_id && deleveryMethod.length > 0) {
        const matched = deleveryMethod.find(
          c => Number(c.value) === Number(updateddata.carrier_id),
        );
        // console.log('Matched:', matched);
        // console.log('Available dropdown values:', deleveryMethod);
        // console.log('carrier_id from API:', updateddata.carrier_id);

        if (matched) {
          setselecteddeliveryMethod(matched);
        }
      }
      if (updateddata?.require_signature !== undefined) {
        setToggleCheckBox(updateddata.require_signature);
      }
      if (updateddata?.require_payment !== undefined) {
        setToggleCheckBox1(updateddata.require_payment);
      }
    }
  }, [
    updateddata,
    customers,
    deleveryorderType,
    paymentterm,
    paymentMode,
    paymentstatus,
  ]);

  const handlecreateInvoice = async (orderId, action) => {
    try {
      const responce = await makeApiCall(API_URLS.saveStoreOrderData, 'POST', {
        jsonrpc: '2.0',
        params: {orderId, updatedOrderData: {action: action}},
      });
      console.log(responce, 'InvoiceRes');

      if (responce?.result?.message === 'success') {
        fetchintialRender(orderId);
        setisedit(false);
      }
      if (responce.result.errorMessage) {
        Alert.alert(responce.result.errorMessage);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <Headercomp
        title={'Edit Order'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
        <View style={{...styles.container}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: '800',
                color: COLORS.blackColor,
              }}>
              {updateddata?.name}
            </Text>

            <View style={{flexDirection: 'row', gap: 8}}>
              {/* <ButtonCompo title="Edit" style={{ width: 80 }} />
    <ButtonCompo title="Confirm" style={{ width: 80 }} />
    <ButtonCompo title="Cancel" style={{ width: 80 }} /> */}
              {/* {['Delivered', 'Confirmed'].includes(updateddata.state_sale) && (
  <ButtonCompo
    title="Invoice"
    style={{ width: 80 }}
    onPress={() =>
      navigation.navigate(navigationString.INVOICE, {
        orderData: orderData,
      })
    }
  />
)} */}
              {!(
                updateddata?.btnStatus?.show_edit ||
                updateddata?.btnStatus?.show_confirm ||
                updateddata?.btnStatus?.show_cancel
              ) && (
                <ButtonCompo
                  title="Delivery"
                  style={{width: 80}}
                  onPress={() =>
                    navigation.navigate(navigationString.DELIVERY, {
                      orderData: orderData,
                      delivery_count: updateddata?.order_lines,
                    })
                  }
                />
              )}

              {/* {updateddata?.btnStatus?.show_create_invoice && ()} */}
              {/* {updateddata?.state_sale==="Cancelled" && (
  <ButtonCompo
    title="Set to Quatation"
    style={{ width: '50%' }}
    onPress={() => {
      handlecreateInvoice(invoicedata.id,'set_to_quotation');
    }}
  />
)} */}
              {updateddata?.btnStatus?.show_edit && (
                <ButtonCompo
                  title="Edit"
                  style={{width: '30%'}}
                  onPress={() => {
                    setisedit(!isedit);
                  }}
                />
              )}
              {updateddata?.btnStatus?.show_confirm && (
                <ButtonCompo
                  title="Confirm"
                  style={{width: '30%'}}
                  onPress={() => {
                    handlecreateInvoice(updateddata?.id, 'confirm');
                  }}
                />
              )}
              {updateddata?.btnStatus?.show_cancel && (
                <ButtonCompo
                  title="Cencel"
                  style={{width: '30%'}}
                  onPress={() => {
                    handlecreateInvoice(updateddata?.id, 'cancel');
                  }}
                />
              )}
              {updateddata?.btnStatus?.show_set_to_quotation && (
                <ButtonCompo
                  title="set to quotation"
                  style={{width: '30%'}}
                  onPress={() => {
                    handlecreateInvoice(updateddata?.id, 'set_to_quotation');
                  }}
                />
              )}
              {updateddata?.btnStatus?.show_short_close && (
                <ButtonCompo
                  title="set to quotation"
                  style={{width: '30%'}}
                  onPress={() => {
                    handlecreateInvoice(updateddata?.id, 'set_to_quotation');
                  }}
                />
              )}

              {updateddata?.btnStatus?.show_create_invoice ? (
                <>
                  <ButtonCompo
                    title="Create Invoice"
                    style={{width: 150}}
                    onPress={() =>
                      handlecreateInvoice(updateddata?.id, 'create_invoice')
                    }
                  />
                  {/* You can optionally include the Delivery button here too */}
                </>
              ) : (
                !(
                  updateddata?.btnStatus?.show_edit ||
                  updateddata?.btnStatus?.show_confirm ||
                  updateddata?.btnStatus?.show_cancel
                ) && (
                  <ButtonCompo
                    title="Invoice"
                    style={{width: 80}}
                    onPress={() =>
                      navigation.navigate(navigationString.INVOICE, {
                        orderData: orderData,
                      })
                    }
                  />
                )
              )}

              {/* {updateddata.show_create_invoice === true && (
                <ButtonCompo
                  title="Delivery"
                  style={{ width: 80 }}
                  onPress={() => navigation.navigate(navigationString.DELIVERY,{orderData: orderData,})}
                />
              )} */}
            </View>
          </View>
          {/* Order Type + Customer */}
          <View style={styles.inputBoxContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Order Type</Text>
              <Dropdowncomp
                data={deleveryorderType}
                value={selecetdOrderType}
                onChange={item => setseleceOrderType(item.value)}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Customer</Text>
              <Dropdowncomp
                data={customers}
                search={true}
                value={selectedCustomer}
                onChange={item => setselectedCustomer(item.value)}
              />
            </View>
          </View>

          {/* Invoice Address + Delivery Address */}
          <View style={styles.inputBoxContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Invoice Address</Text>
              <Dropdowncomp
                data={customers}
                value={selectedCustomer}
                search={true}
                onChange={item => setselectedCustomer(item.value)}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Delivery Address</Text>
              <Dropdowncomp
                data={customers}
                search={true}
                value={selectedCustomer}
                onChange={item => setselectedCustomer(item.value)}
              />
            </View>
          </View>

          {/* Expiration + Payment Terms */}
          <View style={styles.inputBoxContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Expiration</Text>
              <TouchableOpacity
                style={{...styles.inputBox, height: 60}}
                onPress={() => setPickerVisible(true)}>
                <Text style={{...styles.placeholder}}>
                  {selectedDate
                    ? moment(selectedDate).format('DD-MM-YYYY')
                    : 'Select date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerComp
                isVisible={isPickerVisible}
                mode="date"
                onCancel={() => setPickerVisible(false)}
                onConfirm={date => {
                  setSelectedDate(date);
                  setPickerVisible(false);
                }}
                minimumDate={new Date()}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Payment Terms</Text>
              <Dropdowncomp
                data={paymentterm}
                value={selectedpaymentterm}
                onChange={item => {
                  setselectedpaymentterm(item.value);
                }}
                style={{height: 60}}
              />
            </View>
          </View>

          {/* Return Amount + Payment Status */}
          <View style={styles.inputBoxContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Return Amount</Text>
              <TextInputCompo
                placeholder="Return Amount"
                value={resturnammount}
                onChangeText={item => setreturnamount(item)}
                style={styles.inputBox}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Payment Status</Text>
              <Dropdowncomp
                data={paymentstatus}
                value={selectedpaymentstatus}
                onChange={item => {
                  setselectedpaymentStatus(item.value);
                }}
              />
            </View>
          </View>

          {/* Payment Mode + Delivery Method */}
          <View style={styles.inputBoxContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Payment Mode</Text>
              <Dropdowncomp
                value={selecetdpaymentMode}
                data={paymentMode}
                onChange={item => {
                  setselecetedpaymentMode(item.value);
                }}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.normalText}>Delivery Method</Text>
              <Dropdowncomp
                data={deleveryMethod}
                value={selecetedDeveryMethod}
                onChange={item => {
                  setselecteddeliveryMethod(item);
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedTab('LINE')}>
              <Text style={styles.buttonText}>ORDER LINE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedTab('INFO')}>
              <Text style={styles.buttonText}>OTHER INFO</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedTab === 'LINE' && (
          <View style={{flex: 1}}>
            {isedit ? (
              <Editable Item={updateddata} />
            ) : (
              <>
                {/* Table Header */}
                {/* Table Header */}
                {/* Table Header */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View>
                    {/* Header */}
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#f2f2f2',
                        borderWidth: 1,
                        borderColor: '#ccc',
                      }}>
                      <Text style={[styles.tableHeader, {width: 120}]}>
                        Product
                      </Text>
                      <Text style={[styles.tableHeader, {width: 150}]}>
                        Description
                      </Text>
                      <Text style={[styles.tableHeader, {width: 80}]}>Qty</Text>
                      <Text style={[styles.tableHeader, {width: 100}]}>
                        Delivered
                      </Text>
                      <Text style={[styles.tableHeader, {width: 80}]}>
                        Return
                      </Text>
                      <Text style={[styles.tableHeader, {width: 100}]}>
                        Unit Price
                      </Text>
                      <Text style={[styles.tableHeader, {width: 100}]}>
                        Discount
                      </Text>
                      <Text style={[styles.tableHeader, {width: 120}]}>
                        Taxes
                      </Text>
                      <Text style={[styles.tableHeader, {width: 120}]}>
                        Subtotal
                      </Text>
                    </View>

                    {/* Rows */}
                    {Object.values(updateddata?.order_lines || {}).map(
                      (item, index) => (
                        <View
                          key={item.id || index}
                          style={{
                            flexDirection: 'row',
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: '#ccc',
                            // paddingVertical:10
                          }}>
                          <Text style={[styles.tableCell, {width: 120}]}>
                            {item?.product_id?.name}
                          </Text>
                          <Text style={[styles.tableCell, {width: 150}]}>
                            {item?.name}
                          </Text>
                          <Text style={[styles.tableCell, {width: 80}]}>
                            {item?.product_uom_qty}
                          </Text>
                          <Text style={[styles.tableCell, {width: 100}]}>
                            {item?.qty_delivered}
                          </Text>
                          <Text style={[styles.tableCell, {width: 80}]}>
                            {item?.return_quantity}
                          </Text>
                          <Text style={[styles.tableCell, {width: 100}]}>
                            ₹{item?.price_unit}
                          </Text>
                          <Text style={[styles.tableCell, {width: 100}]}>
                            {item?.discount}
                          </Text>
                          <View style={{width: 120, justifyContent: 'center'}}>
                            <Dropdowncomp
                              data={texdetails}
                              style={{borderWidth: 0, height: 60}}
                              placeholder={'select'}
                              onChange={item => {
                                setselecetdTex(item);
                                handlehanes({
                                  order_lines: updateddata?.order_lines,
                                });
                                handlehanes(
                                  Object.values(updateddata?.order_lines || {}),
                                );
                              }}
                              value={selectedtex}
                            />
                          </View>
                          <Text style={[styles.tableCell, {width: 120}]}>
                            ₹{item?.price_subtotal || 'NA'}
                          </Text>
                        </View>
                      ),
                    )}
                  </View>
                </ScrollView>

                {/* Totals */}
                <View
                  style={{
                    marginTop: 10,
                    alignSelf: 'flex-end',
                    width: '60%',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <View style={styles.row1}>
                    <Text style={styles.label}>Amount Untaxed</Text>
                    <Text style={styles.value}>
                      {Number(updateddata?.amount_untaxed).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.row1}>
                    <Text style={styles.label}>Amount Tax</Text>
                    <Text style={styles.value}>
                      {Number(updateddata?.amount_tax).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.row1}>
                    <Text style={styles.label}>Discount</Text>
                    <Text style={styles.value}>
                      {Number(updateddata?.discount).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.row1}>
                    <Text style={styles.label}>Delivery</Text>
                    <Text style={styles.value}>
                      {Number(updateddata?.delivery).toFixed(2)}
                    </Text>
                  </View>
                  <View style={{...styles.row1, borderTopWidth: 1}}>
                    <Text style={[styles.label, {fontWeight: 'bold'}]}>
                      Total Amount
                    </Text>
                    <Text style={[styles.value, {fontWeight: 'bold'}]}>
                      {Number(updateddata?.amount_total).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {selectedTab === 'INFO' && (
          <View style={{padding: 10}}>
            <Text style={{...styles.normalText}}>Sales</Text>
            <TextInputCompo
              placeholder="Salespersion"
              style={{...styles.inputBox}}
            />
            <Text style={{...styles.normalText}}>Sales team</Text>
            <TextInputCompo
              placeholder="Sales Team"
              style={{...styles.inputBox}}
              value={updateddata.team_id.name}
            />
            <Text style={{...styles.normalText}}>Companey</Text>
            <TextInputCompo
              placeholder="Companey"
              style={{...styles.inputBox}}
              value={updateddata.company_id.name}
              editable={false}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
                <Text style={{...styles.normalText}}>Online Signature</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox1}
                  onValueChange={newValue => setToggleCheckBox1(newValue)}
                />
                <Text>Online Payment</Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {' '}
              <View style={{width: '45%'}}>
                <Text style={{...styles.normalText}}>Patment Ref</Text>
                <TextInputCompo
                  placeholder="Patment Ref"
                  style={{...styles.inputBox, width: 150}}
                  value={updateddata.name}
                  editable={false}
                />
              </View>
              <View style={{width: '45%'}}>
                <Text style={{...styles.normalText}}>Customer Ref</Text>

                <TextInputCompo
                  placeholder="Customer Ref"
                  style={{...styles.inputBox, width: 150}}
                />
              </View>
            </View>
            <Text style={{...styles.normalText}}>Invoicing</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '45%'}}>
                <TextInputCompo
                  placeholder="Fiscal Position"
                  style={{...styles.inputBox}}
                />
              </View>
              <View style={{width: '45%'}}>
                <TextInputCompo
                  placeholder="Jurnal"
                  style={{...styles.inputBox}}
                />
              </View>
            </View>
            <Text style={{...styles.normalText}}>Delivery</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {' '}
              <View style={{width: '45%'}}>
                <Text style={{...styles.normalText}}>Warehouse</Text>
                <TextInputCompo
                  placeholder="Fiscal Position"
                  style={{...styles.inputBox, width: 150}}
                  value={updateddata.warehouse_id.name}
                  editable={false}
                />
              </View>
              <View style={{width: '45%'}}>
                <Text style={{...styles.normalText}}>Shipping Policy</Text>
                <View style={{width: '100%'}}>
                  <TextInputCompo
                    placeholder="Jurnal"
                    style={{...styles.inputBox}}
                    value={updateddata.picking_policy}
                    editable={false}
                  />
                </View>
              </View>
            </View>
            <View>
              <Text style={{...styles.normalText}}>Delivery Date</Text>
            </View>
            <View style={{width: '45%'}}>
              <TextInputCompo
                placeholder="Delivery Date"
                style={{...styles.inputBox, width: 150, marginTop: 10}}
                value={updateddata.commitment_date}
                editable={false}
              />
            </View>
            <Text style={{...styles.normalText}}>Reporting</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '45%'}}>
                <TextInputCompo
                  placeholder="Source Documents"
                  style={{...styles.inputBox, width: 150}}
                />
              </View>
              <View style={{width: '45%'}}>
                <TextInputCompo
                  placeholder="Opportunity"
                  style={{...styles.inputBox, width: 150}}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View style={{width: '45%'}}>
                <TextInputCompo
                  placeholder="Campaign"
                  style={{...styles.inputBox, width: 150}}
                />
              </View>
              <View style={{width: '45%'}}>
                <TextInputCompo
                  placeholder="source"
                  style={{...styles.inputBox, width: 150}}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    // marginBottom: 20,
  },
  normalText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
    paddingTop: 8,
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,

    // marginVertical: 10,
  },
  placeholder: {
    fontSize: 16,
    color: COLORS.blackOpacity90,
  },
  button: {
    padding: 15,
    backgroundColor: COLORS.blueColor,
    borderRadius: 15,
  },
  buttonText: {
    color: COLORS.whiteColor,
    fontWeight: '800',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  amountLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },

  amountValue: {
    color: '#1A73E8',
    fontWeight: '700',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  editContainer: {
    paddingHorizontal: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    // alignSelf:'center'
  },
  inputBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  tableHeader: {
    fontWeight: 'bold',
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
});

export default Editorder;
