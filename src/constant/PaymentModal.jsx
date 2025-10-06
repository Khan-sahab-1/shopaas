import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

const PaymentModal = ({ isVisible, onClose, item,totalPayment ,deliveryCharge}) => {
  console.log(totalPayment,deliveryCharge)
  const PayblePayment=totalPayment+deliveryCharge
  if (!item) return null;

  const { subtotal, tax, discount, delivery, total, delivery_text } = item;

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.container}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity style={styles.whitebox} activeOpacity={1}>
          <Text style={styles.title}>Detailed Bill</Text>
          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹ {totalPayment?.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax</Text>
            <Text style={styles.value}>₹ {tax?.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>₹ {discount?.toFixed(2)}</Text>
          </View>
          {delivery_text ? (
            <View style={styles.row}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>
                ₹ {deliveryCharge?.toFixed(2) || '0.00'}
              </Text>
            </View>
          ) : null}
          <View style={styles.line} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹ {PayblePayment?.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PaymentModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  whitebox: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  value: {
    fontSize: 15,
    color: '#000',
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  line: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
