import { SafeAreaView, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Dropdowncomp from '../../../../../../components/Dropdowncomp';
import TextInputCompo from '../../../../../../components/TextInputCompo';
import { COLORS } from '../../../../../../styles/colors';

const AdditionInfo = ({ FormatedData = [] }) => {
  console.log('Form Data:', FormatedData);

  // State for loading and data
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [formOptions, setFormOptions] = useState({});

  // Extract actual values and options safely
  useEffect(() => {
    if (FormatedData && FormatedData.length >= 2) {
      const values = FormatedData[0] || {};
      const options = FormatedData[1] || {};
      
      setFormValues(values);
      setFormOptions(options);
      setIsLoading(false);
    } else {
      console.warn('FormatedData is not in expected format');
      setIsLoading(false);
    }
  }, [FormatedData]);

  // Convert options object {id: label} → array [{label, value}]
  const mapOptions = (obj = {}) => {
    if (!obj || typeof obj !== 'object') return [];
    
    return Object.entries(obj).map(([key, label]) => ({
      label: label?.toString() || '',
      value: key,
    }));
  };

  // States for controlled inputs with proper initialization
  const [carrier, setCarrier] = useState('');
  const [trackingRef, setTrackingRef] = useState('');
  const [shippingWeight, setShippingWeight] = useState('');
  const [priority, setPriority] = useState('');
  const [user, setUser] = useState('');
  const [moveType, setMoveType] = useState('');
  const [group, setGroup] = useState('');

  // Initialize form values when data is loaded
  useEffect(() => {
    if (!isLoading) {
      setCarrier(formValues.carrier_id || '');
      setTrackingRef(formValues.carrier_tracking_ref || '');
      setShippingWeight(formValues.shipping_weight?.toString() || '');
      setPriority(formValues.priority || '');
      setUser(formValues.user_id || '');
      setMoveType(formValues.move_type || '');
      setGroup(formValues.group_id || '');
    }
  }, [isLoading, formValues]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryColor} />
          <Text style={styles.loadingText}>Loading form data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Carrier Dropdown */}
        <Text style={styles.label}>Carrier</Text>
        <Dropdowncomp
          data={mapOptions(formOptions.carrier_id_options)}
          value={carrier}
          onChange={setCarrier}
          placeholder="Select Carrier"
          style={styles.dropdown}
        />

        {/* Tracking Number */}
        <Text style={styles.label}>Tracking Number</Text>
        <TextInputCompo
          style={styles.input}
          value={trackingRef}
          onChangeText={setTrackingRef}
          placeholder="Enter Tracking Number"
        />

        {/* Shipping Weight */}
        <Text style={styles.label}>Shipping Weight ({formValues.weight_uom_name || 'kg'})</Text>
        <TextInputCompo
          style={styles.input}
          value={shippingWeight}
          onChangeText={setShippingWeight}
          placeholder="Enter Shipping Weight"
          keyboardType="numeric"
        />

        {/* Move Type Dropdown */}
        <Text style={styles.label}>Move Type</Text>
        <Dropdowncomp
          data={mapOptions(formOptions.move_type_options)}
          value={moveType}
          onChange={setMoveType}
          placeholder="Select Move Type"
          style={styles.dropdown}
        />

        {/* Priority Dropdown */}
        <Text style={styles.label}>Priority</Text>
        <Dropdowncomp
          data={mapOptions(formOptions.priority_options)}
          value={priority}
          onChange={setPriority}
          placeholder="Select Priority"
          style={styles.dropdown}
        />

        {/* User Dropdown */}
        <Text style={styles.label}>User</Text>
        <Dropdowncomp
          data={mapOptions(formOptions.user_id_options)}
          value={user}
          onChange={setUser}
          placeholder="Select User"
          style={styles.dropdown}
        />

        {/* Group Dropdown */}
        <Text style={styles.label}>Group</Text>
        <Dropdowncomp
          data={mapOptions(formOptions.group_id_options)}
          value={group}
          onChange={setGroup}
          placeholder="Select Group"
          style={styles.dropdown}
        />

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInputCompo
          style={[styles.input, styles.textArea]}
          placeholder="Additional Notes"
          multiline={true}
          numberOfLines={4}
          value={formValues.notes || ''}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdditionInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    paddingVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
    minHeight: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.whiteColor,
    minHeight: 50,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.grayDark,
  },
});