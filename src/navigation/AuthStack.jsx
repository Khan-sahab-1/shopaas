import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import navigationString from './navigationString';
import {
  LoginScreen,
  SignupScreen,
  RegisterYourCompaney,
  Menuscreen,
  YourLocation,
} from '../screens/Index';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={navigationString.LOGIN} component={LoginScreen} />
      <Stack.Screen name={navigationString.SIGNUP} component={SignupScreen} />
      <Stack.Screen
        name={navigationString.REGISTERYOURCOMPANEY}
        component={RegisterYourCompaney}
      />
      {/* Uncomment if needed */}
      {/* <Stack.Screen name={navigationString.MENUSCREEN} component={Menuscreen} /> */}
      {/* <Stack.Screen name={navigationString.LOCATION} component={YourLocation} /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
