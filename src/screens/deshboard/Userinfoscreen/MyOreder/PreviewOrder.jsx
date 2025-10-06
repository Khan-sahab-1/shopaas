import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../styles/colors';
import Headercomp from '../../../../components/Headercomp';
import makeApiCall from '../../../../utils/apiHelper';
import { API_URLS } from '../../../../utils/apiurls';
import ButtonCompo from '../../../../components/ButtonCompo';
import navigationString from '../../../../navigation/navigationString';
import Loader from '../../../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

const PreviewOrder = ({ navigation, route }) => {
  const { item } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const fetchPreview = async (orderId) => {
    try {
      setIsLoading(true);
      const res = await makeApiCall(API_URLS.customerOrderDetails, 'POST', {
        jsonrpc: '2.0',
        params: { orderId },
      });
      setOrderData(res?.result?.orderData);
      console.log(res, 'Details Response');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (item?.id) {
      fetchPreview(item?.id);
    }
  }, [item?.id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Headercomp title="Preview Order" left={true} onPress={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={COLORS.blueColor} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp title="Preview Order" left={true} onPress={() => navigation.goBack()} />
        <View style={{alignItems:'flex-end',paddingHorizontal:15}}>
          <ButtonCompo style={{width:'40%'}} title='Invoice' onPress={()=>navigation.navigate(navigationString.PDFPREVIEWDOWNLOAD,{item:orderData})}/>
        </View>
      {orderData ? (
        <ScrollView style={styles.scroll}>
          {/* Current Status */}
          <Text style={styles.status}>Current Status : {orderData.current_state}</Text>
          <Text style={styles.orderInfo}>
            Order#: {orderData.name} | Ordered On {orderData.date}
          </Text>

          {/* Seller & Customer */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.col}>
                <Text style={styles.cardTitle}>Seller</Text>
                <Text>{orderData?.seller?.name}</Text>
                <Text>{orderData?.seller?.address}</Text>
                <Text>{orderData?.seller?.phone}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.cardTitle}>Customer</Text>
                <Text>{orderData?.billing?.name}</Text>
                <Text>{orderData?.billing?.address}</Text>
                <Text>{orderData?.billing?.phone}</Text>
              </View>
            </View>
          </View>

          {/* Products */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cellHeader}>Product</Text>
              <Text style={styles.cellHeader}>Qty</Text>
              <Text style={styles.cellHeader}>Discount</Text>
              <Text style={styles.cellHeader}>Price</Text>
            </View>

            {Object.values(orderData?.orderline || {}).map((lines) =>
              lines.map((p) => (
                <View style={styles.tableRow} key={p.id}>
                  <Text style={styles.cell}>{p.product_name}</Text>
                  <Text style={styles.cell}>{p.Quantity}</Text>
                  <Text style={styles.cell}>{p.discount_price}</Text>
                  <Text style={styles.cell}>{p.price_unit}</Text>
                </View>
              ))
            )}
          </View>

          {/* Totals */}
          <View style={styles.totalBox}>
            <Row label="Sub Total" value={orderData.amount_untaxed} />
            <Row label="Taxes" value={orderData.amount_tax} />
            <Row label="Discount" value={orderData.discount} />
            <Row label="Delivery" value={orderData.delivery} />
            <Row label="Total" value={orderData.amount_total} bold />
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.noData}>No Order Data Found</Text>
      )}
      <Loader visible={isLoading}/>
    </SafeAreaView>
  );
};

// Small helper row component
const Row = ({ label, value, bold }) => (
  <View style={styles.rowBetween}>
    <Text style={[styles.totalText, bold && { fontWeight: '700' }]}>{label}</Text>
    <Text style={[styles.totalText, bold && { fontWeight: '700' }]}>₹{value}</Text>
  </View>
);

export default PreviewOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  scroll: { padding: 15 },
  status: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  orderInfo: { fontSize: 14, color: '#555', marginBottom: 15 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 5 },
  table: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#eee', padding: 8 },
  tableRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#ddd' },
  cellHeader: { flex: 1, fontWeight: '700', textAlign: 'center' },
  cell: { flex: 1, textAlign: 'center' },
  totalBox: { padding: 10, backgroundColor: '#fafafa', borderRadius: 8 },
  totalText: { fontSize: 15, marginVertical: 3 },
  noData: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
});
