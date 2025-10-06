




import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

const Routes = () => {
  const userinfo = useSelector(state => state.auth);
  const isLoggedIn = userinfo?.isLoggedIn;
  const userData = userinfo?.user;
  const isLoading = userinfo?.isLoading;

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Return the appropriate stack
  return isLoggedIn && userData ? <MainStack /> : <AuthStack />;
};

export default Routes;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

