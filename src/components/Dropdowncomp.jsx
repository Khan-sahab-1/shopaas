import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../styles/colors';

const Dropdowncomp = ({
  search,
  data,
  value,
  onChange,
  placeholder,
  style,
  placeholderStyle,
  selectedStyle,
  dropdownPosition,
  onFocus,
  onBlur,
}) => {
  return (
    <Dropdown
      style={{...styles.dropdown, ...style}}
      placeholderStyle={
        placeholderStyle ? placeholderStyle : styles.placeholderStyle
      }
      selectedTextStyle={{...styles.selectedTextStyle, ...selectedStyle}}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search={search}
      // keyboardAvoiding={true}
      disableAutoScroll={true}
      autoFocusSearch={true}
      autoClose={false}  
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder ? placeholder : 'Select item'}
      searchPlaceholder="Search..."
      // dropdownPosition='bottom'
      dropdownPosition={dropdownPosition}
      // dropdownPosition="auto" // or "bottom" / "top"
      keyboardAvoiding={false}
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      renderLeftIcon={() => (
        <AntDesign
          style={styles.icon}
          color={placeholderStyle ? 'white' : 'black'}
          name="Safety"
          size={20}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    // margin: 16,
    height: 50,
    padding: 10,
    // borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.whiteColor,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.blackOpacity90,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.blackOpacity90,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default Dropdowncomp;
