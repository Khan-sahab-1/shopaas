import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../styles/colors';
import { moderateScale } from '../styles/responsiveSize';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TextInputCompo = ({
  placeholder = 'Enter text',
  value = '',
  onChangeText = () => {},
  keyboardType = 'default',
  autoCapitalize = 'none',
  style = {},
  placeholderTextColor = COLORS.blackColor,
  editable = true,
  isPassword = false, 
  onFocus,
  onBlur
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword} // toggle logic
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, style]}
        placeholderTextColor={placeholderTextColor}
        editable={editable}
        onFocus={onFocus}
        onBlur={onBlur}
      />


      {isPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(prev => !prev)}
          style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ?   'eye':'eye-off'}
            size={25}
            color={COLORS.whiteColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextInputCompo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 1,
    borderColor: COLORS.gray2,
    
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    color: COLORS.black,
    paddingVertical: moderateScale(8),
    height:50
  },
  eyeIcon: {
    padding: moderateScale(6),
    position:'absolute',
    right:10,
    top:6
  },
});
