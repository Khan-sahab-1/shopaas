import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from '../../styles/colors';
import Dropdowncomp from '../Dropdowncomp';
import ButtonCompo from '../ButtonCompo';
import { useNavigation } from '@react-navigation/native';
import navigationString from '../../navigation/navigationString';

const Inventory = ({ setInventoryData, inventoryData,data,onFieldChange , item}) => {
  const navigation=useNavigation()
  console.log(item,'DATA')
  useEffect(() => {
    if (data?.product?.tracking) {
      setInventoryData(prev => ({
        ...prev,
        tracking: data.product.tracking, 
      }));
    }
  }, [data]);
  const handleChange = (field, value) => {
    setInventoryData(prev => ({ ...prev, [field]: value }));
    onFieldChange && onFieldChange(field, value); 
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
        <Dropdowncomp
          data={[
            { label: 'By Unique Serial Number', value: 'serial' },
            { label: 'By Lot', value: 'lot' },
            { label: 'No Tracking', value: 'none' },
          ]}
          value={inventoryData?.tracking}
          onChange={item => handleChange('tracking', item.value)}
        />
         {(inventoryData?.tracking === 'serial' || inventoryData?.tracking === 'lot') && (
          <ButtonCompo title='Lot/Serials Number'
          onPress={()=>navigation.navigate(navigationString.SERIALS,{item})}/>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Inventory;

const styles = StyleSheet.create({});
