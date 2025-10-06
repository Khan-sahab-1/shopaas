import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '../styles/colors';
import { moderateScale } from '../styles/responsiveSize';

const ButtonCompo = ({ title = 'Submit', onPress = () => {}, style = {} }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonCompo;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary || '#3498db',
    paddingVertical: moderateScale(12),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  text: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});
