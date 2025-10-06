import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';

const Inventory = ({setInventoryData,inventoryData}) => {
  const selectedType = useSelector(state => state.productType.selectedType);
  console.log(selectedType,'Selected Type====')
  const handleChange = (field, value) => {
    setInventoryData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <View style={{...styles.container}}>
   {selectedType?.value === 'product' && <View>
    <Text style={{...styles.label}}>Traceability</Text>
    <Dropdowncomp
  data={[
    { label: 'By Unique Serial Number', value: 'serial' },
    { label: 'By Lot', value: 'lot' },
    { label: 'No Tracking', value: 'none' },
  ]}
  labelField="label"
  valueField="value"
  value={inventoryData?.tracking}
  onChange={item => handleChange('tracking', item.value)}
  placeholder="Select Type"
/>

    </View>}

      
    </View>
  )
}

export default Inventory

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:COLORS.whiteColor,
    padding:15
  },
  label:{
    fontSize:16,
    fontWeight:'800'
  }
})