import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { COLORS } from '../styles/colors';

const SingledropdownPicker = ({
  placeholder,
  items: initialItems = [],
  onSelect,
  style,
  dropDownDirection,
  palceholderTextcolor,
  color,
  search,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(initialItems);
  console.log(items, 'itemss');

  
  useEffect(() => {
    if (value && items?.length > 0) {
      const selectedItem = items.find(item => item.value === value);
      if (selectedItem && onSelect) {
        onSelect(selectedItem);
      }
    }
  }, [value, items]);
  

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      // searchable={search || true}
      searchable={search ?? true}
      style={[styles.dropdown, style]}
      dropDownContainerStyle={styles.dropdownContainer}
      dropDownDirection={dropDownDirection}
        // placeholderStyle={styles.placeholderStyle}
      textStyle={{ color: COLORS.blackColor }}
      placeholderStyle={{ color: color || COLORS.whiteColor }}
      searchPlaceholderTextColor={COLORS.blackColor}
      searchTextInputStyle={{ color: color || COLORS.whiteColor }}
    />
  );
};

export default SingledropdownPicker;

const styles = StyleSheet.create({
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: COLORS.whiteColor, 
  },

  placeholderStyle: {
    color: '#fff',
  },
});
