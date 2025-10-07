import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../styles/colors';

const HomeHeader = ({user}) => {
  return (
    <>
      <View style={{...styles.container}}>
        <Text style={{...styles.label}}>
          {' '}
          Hello, {user?.user?.name || 'User'}
        </Text>
      </View>
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.whiteColor,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blackColor,
  },
});
