import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import makeApiCall from '../../../../../utils/apiHelper';
import {API_URLS} from '../../../../../utils/apiurls';
import ButtonCompo from '../../../../../components/ButtonCompo';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import Loader from '../../../../../components/Loader';
import InvoicePaymentModal from './InvoicePaymentModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const Invoice = ({navigation, route}) => {
  const {orderData} = route.params;
  const [invoicedata, setInvoicedata] = useState({});
  const [selectedTab, setSelectedTab] = useState('LINE');
  const [isLoding, setIsloding] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState([]);

  const fetchinvoicedata = async (orderId, invoiceId, formData) => {
    try {
      const res = await makeApiCall(API_URLS.getOrderInvoiceData, 'POST', {
        jsonrpc: '2.0',
        params: {orderId, invoiceId, formData},
      });
      console.log(res, 'RESPONSE');
      if (res?.result?.message === 'success') {
        setInvoicedata(res?.result?.data?.invoice);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (orderData) {
      fetchinvoicedata(orderData?.id, null, true);
    }
  }, []);

  const handleInvoicePost = async invoiceId => {
    try {
      setIsloding(true);
      const responce = await makeApiCall(
        API_URLS.saveOrderInvoiceData,
        'POST',
        {
          jsonrpc: '2.0',
          params: {invoiceId: invoiceId, updatedInvoiceData: {action: 'post'}},
        },
      );
      console.log(responce);
      if (responce?.result?.message === 'success') {
        fetchinvoicedata(orderData?.id, null, true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloding(false);
    }
  };
  const fetchsaveinvoicedata = async (invoiceId, action) => {
    try {
      setIsloding(true);
      const responce = await makeApiCall(
        API_URLS.saveOrderInvoiceData,
        'POST',
        {
          jsonrpc: '2.0',
          params: {invoiceId: invoiceId, updatedInvoiceData: {action: action}},
        },
      );
      // console.log(responce,'Dara')
      setPaymentData(responce?.result?.data?.paymentData || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloding(false);
    }
  };
  const hadlepaymentpress = () => {
    if (invoicedata?.id) {
      setOpenPaymentModal(true);
    }
    fetchsaveinvoicedata(invoicedata?.id, 'register_payment');
  };
  const handleonclose = () => {
    setOpenPaymentModal(false);
    fetchinvoicedata(orderData?.id, null, true);
    // setPaymentData([]);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.whiteColor}}>
      <Headercomp
        title={'Invoice'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            {invoicedata?.name || 'Loading...'}
          </Text>
          {invoicedata?.btnStatus?.show_post && (
            <ButtonCompo
              title="Post"
              style={{width: '50%'}}
              onPress={() => {
                handleInvoicePost(invoicedata.id);
              }}
            />
          )}
          {invoicedata?.btnStatus?.show_register_payment && (
            <ButtonCompo
              title="Register Payment"
              style={{width: '50%'}}
              onPress={hadlepaymentpress}
            />
          )}

          {/* Upper Card */}
          {invoicedata?.id ? (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Customer</Text>
                <Text style={styles.value}>
                  {invoicedata?.invoice_partner_display_name}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Delivery Address</Text>
                <Text style={styles.value}>
                  {invoicedata?.partner_shipping_id?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Invoice Date</Text>
                <Text style={styles.value}>
                  {invoicedata?.invoice_date || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Reference</Text>
                <Text style={styles.value}>{invoicedata?.ref || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Terms</Text>
                <Text style={styles.value}>
                  {invoicedata?.invoice_payment_term_id?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Company</Text>
                <Text style={styles.value}>
                  {invoicedata?.company_id?.name || 'N/A'}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{marginTop: 20}}>Loading invoice details...</Text>
          )}

          {/* Tab Buttons */}
          <View style={{flexDirection: 'row', marginTop: 20, gap: 10}}>
            <ButtonCompo
              title="Invoice Lines"
              onPress={() => setSelectedTab('LINE')}
              style={{width: '40%'}}
            />
            <ButtonCompo
              title="Other Info"
              onPress={() => setSelectedTab('INFO')}
              style={{width: '40%'}}
            />
          </View>

          <View style={{marginTop: 20}}>
            {selectedTab === 'LINE' && (
              <>
                <View style={{width: '100%'}}>
                  {Object.values(invoicedata?.invoice_line_ids || {}).map(
                    (item, index) => (
                      <View key={item.id || index} style={styles.card}>
                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>Product:</Text>
                          <Text style={styles.cardValue}>
                            {item?.product_id?.name}
                          </Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>Label:</Text>
                          <Text style={styles.cardValue}>{item?.name}</Text>
                        </View>
                        {/* <View style={[styles.row, { flexWrap: 'wrap' }]}>
                      <Text style={styles.cardTitle}>Label:</Text>
                      <Text style={[styles.cardValue, { flex: 1 }]}>
                        {item?.name}
                      </Text>
                    </View> */}

                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>Quantity:</Text>
                          <Text style={styles.cardValue}>{item?.quantity}</Text>
                        </View>
                        {/* <View style={styles.row}>
                      <Text style={styles.cardTitle}>Delivered Qty:</Text>
                      <Text style={styles.cardValue}>
                        {item?.qty_delivered}
                      </Text>
                    </View> */}
                        {/* <View style={styles.row}>
                          <Text style={styles.cardTitle}>Return Qty:</Text>
                          <Text style={styles.cardValue}>
                            {item?.return_quantity}
                          </Text>
                        </View> */}
                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>Unit Price:</Text>
                          <Text style={styles.cardValue}>
                            ₹{item?.price_unit}
                          </Text>
                        </View>

                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>Discount Price:</Text>
                          <Text style={styles.cardValue}>
                            {' '}
                            ₹{item?.price_reduce}
                          </Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>Taxes:</Text>
                          <Text style={styles.cardValue}>
                            {item?.tax_ids?.name || 0}%
                          </Text>
                        </View>
                        <View
                          style={{
                            ...styles.row,
                            borderTopWidth: 1,
                            borderColor: COLORS.blackColor,
                            paddingVertical: 5,
                          }}>
                          <Text style={styles.cardTitle}>Subtotal:</Text>
                          <Text style={styles.cardValue}>
                            ₹{item?.price_subtotal}
                          </Text>
                        </View>
                      </View>
                    ),
                  )}
                </View>
                <View
                  style={{
                    ...styles.card,
                    width: '60%',
                    alignSelf: 'flex-end',
                    gap: 10,
                  }}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Amount Untaxed</Text>
                    <Text
                      style={styles.value}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {Number(invoicedata.amount_untaxed_signed).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Amount Tax</Text>
                    <Text
                      style={styles.value}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {Number(invoicedata.amount_by_group).toFixed(2)}
                    </Text>
                  </View>

                  {/* Example: Optional discount */}
                  {/* <View style={styles.row}>
    <Text style={styles.label}>Discount</Text>
    <Text style={styles.value}>{invoicedata.amount_discount}</Text>
  </View> */}

                  <View
                    style={{
                      ...styles.row,
                      borderTopWidth: 1,
                      borderColor: COLORS.blackColor,
                      paddingTop: 6,
                    }}>
                    <Text style={styles.label}>Total Amount</Text>
                    <Text
                      style={styles.value}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {Number(invoicedata.amount_total_signed).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {selectedTab === 'INFO' && (
              <>
                <View style={{...styles.card}}>
                  <Text
                    style={{...styles.label, fontWeight: '800', fontSize: 18}}>
                    Invoice
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Salesperson</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_untaxed_signed}</Text> */}
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Sales team</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                  {/* <View style={styles.row}>
              <Text style={styles.label}>Discount</Text>
              <Text style={styles.value}>{invoicedata.amount_untaxed_signed}</Text>
            </View> */}
                  {/* <View style={styles.row}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>{invoicedata.amount_untaxed_signed}</Text>
            </View> */}
                  <View style={styles.row}>
                    <Text style={styles.label}>Sourece Document</Text>
                    <Text style={styles.value}>
                      {invoicedata.invoice_origin}
                    </Text>
                  </View>
                </View>
                <View style={{...styles.card}}>
                  <Text
                    style={{...styles.label, fontWeight: '800', fontSize: 18}}>
                    Accounting
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>IncoTeam</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_untaxed_signed}</Text> */}
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Fiscal position</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                  {/* <View style={styles.row}>
              <Text style={styles.label}>Discount</Text>
              <Text style={styles.value}>{invoicedata.amount_untaxed_signed}</Text>
            </View> */}
                  {/* <View style={styles.row}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>{invoicedata.amount_untaxed_signed}</Text>
            </View> */}
                  {/* <View style={styles.row}>
              <Text style={styles.label}>Sourece Document</Text>
              <Text style={styles.value}>{invoicedata.invoice_origin}</Text>
            </View> */}
                </View>
                <View style={{...styles.card}}>
                  <Text
                    style={{...styles.label, fontWeight: '800', fontSize: 18}}>
                    Payments
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Payment ref</Text>
                    <Text style={styles.value}>{invoicedata.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Bank Account</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                </View>
                <View style={{...styles.card}}>
                  <Text
                    style={{...styles.label, fontWeight: '800', fontSize: 18}}>
                    Import/Export
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Export Type</Text>
                    <Text style={styles.value}>
                      {invoicedata.l10n_in_export_type}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Shipping Port Code</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Shipping bill Number</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Shipping bill date</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                </View>
                <View style={{...styles.card}}>
                  <Text
                    style={{...styles.label, fontWeight: '800', fontSize: 18}}>
                    Marketing
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.label}> Campaign</Text>
                    {/* <Text style={styles.value}>{invoicedata.name}</Text> */}
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Medium</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>source</Text>
                    {/* <Text style={styles.value}>{invoicedata.amount_by_group}</Text> */}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <InvoicePaymentModal
        isVisible={openPaymentModal}
        onclose={handleonclose}
        data={paymentData}
        invoiceId={invoicedata?.id}
      />
      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default Invoice;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginTop: 10,
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
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
    padding: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    padding: 8,
    maxWidth: '50%',
    textAlign: 'right',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
  cardValue: {
    fontSize: 14,
    color: COLORS.blackColor,
    fontWeight: '400',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // prevents overflow
  },
  label: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1, // allows label to shrink
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    flexShrink: 1, // prevents overflow
    maxWidth: '50%', // keeps numbers inside box
  },
});
