import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/colors';

const Headercomp = ({ left, onPress, title,right,onPressright,name }) => {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {left ? (
          <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Ionicons
             name="chevron-back-outline"
              size={20}
              color={COLORS.whiteColor}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>
 {right&&<TouchableOpacity style={styles.backButton} onPress={onPressright}>
 <Ionicons
  name={name?name:'ellipsis-vertical'}
 
  size={20}
  color={COLORS.whiteColor}
/>
          </TouchableOpacity>}
    </View>
  );
};

export default Headercomp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.whiteColor,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 40,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  backButton: {
    padding: 10,
    backgroundColor: COLORS.gray2,
    borderRadius: 50,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});
