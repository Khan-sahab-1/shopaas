import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../styles/colors';
import StateChangeModal from '../constant/StateChangeModal';
import { useNavigation } from '@react-navigation/native';
import navigationString from '../navigation/navigationString';

const Ordercart = ({ data }) => {
  const navigation=useNavigation()
  const ArrayData = Object.values(data.orders || []);
  const [isStateModalVisible, setisStateModalVisible] = useState(false);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.itemContainer}
      onPress={()=>navigation.navigate(navigationString.EDITORDER,{ orderData: item })}>
        <View style={styles.row}>
          <Text style={styles.label}>Quotation Number:</Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.value}>{item.date_order}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Date:</Text>
          <Text style={styles.value}>{item.commitment_date || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Expected Date:</Text>
          <Text style={styles.value}>{item.expected_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Customer:</Text>
          <Text style={styles.value}>{item.partner?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total in ₹:</Text>
          <Text style={[styles.value, styles.amount]}>{item.amount_total}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, styles.status]}>{item.state_sale}</Text>
        </View>
        {/* <TouchableOpacity
          style={{
            padding: 6,
            backgroundColor: COLORS.blueColor,
            width: '40%',
            marginTop: 5,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={() => setisStateModalVisible(true)}
        >
          <Text style={{ ...styles.value, color: COLORS.whiteColor }}>
            Change Sate
          </Text>
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        // data={ArrayData}
        data={[...ArrayData].reverse()} 
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <StateChangeModal
        isvisible={isStateModalVisible}
        onclose={() => setisStateModalVisible(false)}
        item={data}
      />
    </View>
  );
};

export default Ordercart;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom:100
  },
  itemContainer: {
    padding: 15,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: '600',
    color: COLORS.darkGrey,
    width: 130,
  },
  value: {
    flex: 1,
    fontWeight: '500',
    color: COLORS.blackColor,
  },
  amount: {
    color: COLORS.primaryColor,
  },
  status: {
    fontWeight: '700',
    color: COLORS.secondaryColor,
  },
});
