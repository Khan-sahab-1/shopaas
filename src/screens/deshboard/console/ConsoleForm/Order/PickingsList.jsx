import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import navigationString from '../../../../../navigation/navigationString';

const PickingsList = ({ pickings=[],orderData=null }) => {
    console.log(orderData,'PICKING')

  



    const navigation=useNavigation()
  return (
    <ScrollView style={{ paddingHorizontal: 10 }}>
    {pickings.map((picking) => (
      <TouchableOpacity
        key={picking.id}
        style={styles.card}
        onPress={() =>
          navigation.navigate(navigationString.PREVIEWQTYUPDATE, {
            selectedPicking: picking,   
            orderData,                 
          })
        }
      >
        <Text style={styles.label}>Reference: {picking.name}</Text>
        <Text style={styles.label}>From: {picking.location_id?.name}</Text>
        <Text style={styles.label}>To: {picking.location_dest_id?.name}</Text>
        <Text style={styles.label}>
          Contact: {picking.shipping_id?.phone || picking.partner_id?.name}
        </Text>
        <Text style={styles.label}>Scheduled Date: {picking.scheduled_date}</Text>
        <Text style={styles.label}>Source Document: {picking.origin}</Text>
        <Text style={styles.label}>Status: {picking.state_picking}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
  
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginVertical: 2,
  },
});

export default PickingsList;
