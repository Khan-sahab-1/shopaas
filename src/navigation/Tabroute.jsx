// import {  StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import {
//   CartScreen,
//   HomeScreen,
//   Serchingscreens,
//   UserProfile,
// } from '../screens/Index';
// import navigationString from './navigationString';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSelector } from 'react-redux';
// import { SafeAreaView } from 'react-native-safe-area-context';
// const Tab = createBottomTabNavigator();
// const Tabroute = () => {
//  const totalItems = useSelector(state => state.cart.totalItems);
//   // console.log(cartItemData, '00000');
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           height: 60,
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//         },
//       }}
//     >
//       <Tab.Screen
//         name={navigationString.HOMESCREEN}
//         component={HomeScreen}
//         options={{
//           tabBarLabel: 'Shop',
//           tabBarLabelStyle: { fontSize: 14 },
//           tabBarIcon: ({ focused, color, size }) => {
//             return (
//               <Ionicons
//                 name={focused ? 'storefront' : 'storefront-outline'}
//                 size={30}
//                 color={color}
//               />
//             );
//           },
//         }}
//       />
//       {/* <Tab.Screen
//         name={navigationString.SEACRHINGSCREEN}
//         component={Serchingscreens}
//         options={{
//           tabBarLabel: 'Search',
//           tabBarLabelStyle: { fontSize: 14 },
//           tabBarIcon: ({ focused, color, size }) => {
//             return (
//               <Ionicons
//                 name={focused ? 'search' : 'search-outline'}
//                 size={30}
//               />
//             );
//           },
//         }}
//       /> */}

//       <Tab.Screen
//         name={navigationString.CARTSCREEN}
//         component={CartScreen}
//         options={{
//           tabBarLabel: 'Cart',
//           tabBarLabelStyle: { fontSize: 14 },
//           tabBarIcon: ({ focused, color, size }) => {
//             return (
//               <Ionicons name={focused ? 'cart' : 'cart-outline'} size={30} />
//             );
//           },
//           tabBarBadge: totalItems > 0 ? totalItems : null,
//           unmountOnBlur: true,
//         }}
//       />
//        <Tab.Screen
//         name={navigationString.USERPROFILES}
//         component={UserProfile}
//         options={{
//           tabBarLabel: 'User',
//           tabBarLabelStyle: { fontSize: 14 },
//           tabBarIcon: ({ focused, color, size }) => {
//             return (
//               <Ionicons
//                 name={focused ? 'person' : 'person-outline'}
//                 size={30}
//               />
//             );
//           },
//           unmountOnBlur: true,
//         }}
//       />
//     </Tab.Navigator>
//     </SafeAreaView>
//   );
// };

// export default Tabroute;

// const styles = StyleSheet.create({});

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CartScreen,
  HomeScreen,
  Serchingscreens,
  UserProfile,
} from '../screens/Index';
import navigationString from './navigationString';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {moderateScale} from '../styles/responsiveSize';
import ItemCart from '../screens/cart/ItemCart';

const Tab = createBottomTabNavigator();

const Tabroute = () => {
  const totalItems = useSelector(state => state.cart.totalItems);
  const cartData = useSelector(state => state.cartinfo.cartData);
  console.log(cartData, '------');
  const totalQuantity = cartData?.reduce(
    (acc, item) => acc + Number(item?.quantity || 0),
    0,
  );
  // console.log('Total Quantity:', totalQuantity);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: moderateScale(84),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#fff',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}>
      <Tab.Screen
        name={navigationString.HOMESCREEN}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Ionicons
                name={focused ? 'storefront' : 'storefront-outline'}
                size={24}
                color={color}
              />
            );
          },
        }}
      />

      {/* Uncomment if you want to use Search screen */}
      {/* <Tab.Screen
        name={navigationString.SEACRHINGSCREEN}
        component={Serchingscreens}
        options={{
          tabBarLabel: 'Search',
          tabBarLabelStyle: { 
            fontSize: 12,
            fontWeight: '600' 
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={24}
                color={color}
              />
            );
          },
        }}
      /> */}

      {/* <Tab.Screen
        name={navigationString.CARTSCREEN}
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarLabelStyle: { 
            fontSize: 12,
            fontWeight: '600' 
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons 
                name={focused ? 'cart' : 'cart-outline'} 
                size={24} 
                color={color}
              />
            );
          },
          tabBarBadge: totalItems > 0 ? totalItems : null,
          tabBarBadgeStyle: {
            backgroundColor: '#FF3B30',
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
          },
          unmountOnBlur: true,
        }}
      /> */}
      <Tab.Screen
        name={navigationString.CARTSCREEN}
        component={ItemCart}
        options={{
          tabBarLabel: 'Cart',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'}
                size={24}
                color={color}
              />
            );
          },
          tabBarBadge: totalQuantity > 0 ? totalQuantity : null,
          tabBarBadgeStyle: {
            backgroundColor: '#FF3B30',
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
          },
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name={navigationString.USERPROFILES}
        component={UserProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={color}
              />
            );
          },
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabroute;

const styles = StyleSheet.create({
  // You can add additional styles here if needed
});
