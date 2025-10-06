


import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import Icon from 'react-native-vector-icons/Ionicons';

const AdditionInfo = ({ data, trackChanges, setTrackChanges }) => {
  const apiData = data?.additional_info_data?.[0]; 
  const options = data?.additional_info_data?.[1]; 
    
// console.log(data?.origin,'ADDITION INFO DATA')
  const [carrierId, setCarrierId] = useState(null);
  const [trackingRef, setTrackingRef] = useState('');
  const [weight, setWeight] = useState('');
  const [shippingWeight, setShippingWeight] = useState('');
  const [shippingPolicy, setShippingPolicy] = useState(null);
  const [responsible, setResponsible] = useState(null);
  const [procurementGroup, setProcurementGroup] = useState(null);
  const [priority, setPriority] = useState(0);

  // 🔽 Map options into dropdown-compatible array
  const mapOptions = obj =>
    Object.entries(obj || {}).map(([value, label]) => ({
      label,
      value: value?.toString(), // ✅ cast to string to match dropdown
    }));

    useEffect(() => {
        if (!apiData) return;
      
        // Only set local UI state, do NOT touch trackChanges
        setCarrierId(apiData.carrier_id?.toString() || null);
        setTrackingRef(apiData.carrier_tracking_ref || '');
        setWeight(apiData.weight?.toString() || '');
        setShippingWeight(apiData.shipping_weight?.toString() || '');
        setShippingPolicy(apiData.move_type?.toString() || null);
        setResponsible(apiData.user_id?.toString() || null);
        setProcurementGroup(apiData.group_id?.toString() || null);
        setPriority(String(apiData.priority) || 0);
      }, [apiData]);
      
      
      

      const handleChange = (field, value) => {
        // Update local state for UI
        if (field === 'priority') value = value.toString();
        switch (field) {
          case 'carrier_id': setCarrierId(value); break;
          case 'carrier_tracking_ref': setTrackingRef(value); break;
          case 'weight': setWeight(value); break;
          case 'shipping_weight': setShippingWeight(value); break;
          case 'move_type': setShippingPolicy(value); break;
          case 'user_id': setResponsible(value); break;
          case 'group_id': setProcurementGroup(value); break;
          case 'priority': setPriority(value); break;
        }
      
        // 🔹 Update trackChanges only when user changes something
        setTrackChanges(prev => ({
          ...prev,
          additionInfo: {
            ...prev.additionInfo,
            [field]: value,
          },
        }));
      };
      

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {/* Carrier + Tracking Ref */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>Carrier</Text>
            <Dropdowncomp
              data={mapOptions(options?.carrier_id_options)}
              placeholder="Select Carrier"
              value={carrierId}
              onChange={val => handleChange('carrier_id', val)}
            />
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Tracking Reference</Text>
            <TextInputCompo
              style={styles.input}
              placeholder="Enter Tracking Reference"
              value={trackingRef}
              onChangeText={text => handleChange('carrier_tracking_ref', text)}
            />
          </View>
        </View>

        {/* Weight + Shipping Weight */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>Weight ({apiData?.weight_uom_name})</Text>
            <TextInputCompo
              style={styles.input}
              placeholder="Weight"
              value={weight}
              keyboardType="numeric"
              onChangeText={text => handleChange('weight', text)}
              editable={false}
            />
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Weight For Shipping</Text>
            <TextInputCompo
              style={styles.input}
              placeholder="Weight For Shipping"
              value={shippingWeight}
              keyboardType="numeric"
              onChangeText={text => handleChange('shipping_weight', text)}
              editable={false}
            />
          </View>
        </View>

        {/* Shipping Policy + Responsible */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>Shipping Policy</Text>
            <Dropdowncomp
              data={mapOptions(options?.move_type_options)}
              placeholder="Shipping Policy"
              value={shippingPolicy}
              onChange={val => handleChange('move_type', val)}
              style={{ height: 60 }}
            />
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Responsible</Text>
            <Dropdowncomp
              data={mapOptions(options?.user_id_options)}
              placeholder="Responsible"
              value={responsible}
              onChange={val => handleChange('user_id', val)}
              style={{ height: 60 }}
            />
          </View>
        </View>

        {/* Procurement Group */}
        <View style={{ ...styles.box, flexDirection: 'row', justifyContent: 'space-between' }}>
  {/* Procurement Group */}
  <View style={{ flex: 1, marginRight: 10 }}>
    <Text style={styles.label}>Procurement Group</Text>
    <TextInputCompo
      value={data?.origin}
      style={styles.input}
      editable={false}
      placeholder="Procurement Group"
    />
  </View>

  {/* Priority */}
  <View style={{ flex: 1, alignItems: 'flex-start' }}>
    <Text style={styles.label}>Priority</Text>
    <View style={styles.starRow}>
      {[1, 2, 3].map(star => (
        <TouchableOpacity key={star} onPress={() => handleChange('priority', star)}>
          <Icon
            name={star <= priority ? 'star' : 'star-outline'}
            size={28}
            color={star <= priority ? COLORS.yellow : COLORS.grayText}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
    <Text style={{ marginTop: 6, color: COLORS.grayText }}>
      {options?.priority_options?.[priority] || ''}
    </Text>
  </View>
</View>


        {/* Priority Rating */}
        {/* <View style={styles.ratingBox}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.starRow}>
            {[1, 2, 3].map(star => (
              <TouchableOpacity key={star} onPress={() => handleChange('priority', star)}>
                <Icon
                  name={star <= priority ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= priority ? COLORS.yellow : COLORS.grayText}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ marginTop: 6, color: COLORS.grayText }}>
            {options?.priority_options?.[priority] || ''}
          </Text>
        </View> */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default AdditionInfo;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.whiteColor },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  box: { flex: 1, marginHorizontal: 5, marginVertical: 5 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: COLORS.blackColor },
  input: { borderWidth: 1, borderColor: COLORS.grayText, borderRadius: 8, padding: 12, fontSize: 14, color: COLORS.blackColor, backgroundColor: COLORS.whiteColor },
  ratingBox: { marginTop: 12, marginHorizontal: 5, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.grayText, borderRadius: 8, paddingHorizontal: 10, backgroundColor: COLORS.whiteColor ,marginBotttom:100},
  starRow: { flexDirection: 'row', marginTop: 8 },
  star: { marginRight: 8 },
});
