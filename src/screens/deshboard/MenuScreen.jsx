import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import FoodItem from '../../components/FoodItem';

const MenuScreen = () => {
  const cart = useSelector(state => state.cart.cart);
  // console.log("cart", cart)
  const total = cart
    .map(item => item.price * item.quantity)
    .reduce((cur, prev) => cur + prev, 0);
  // console.log(total)
  const route = useRoute();
  const navigation = useNavigation();
  const [menu, setMenu] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // console.log(route.params)

  const fetchMenu = () => {
    setMenu(route.params.menu);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    fetchMenu();
  }, []);
  return (
    // <ScrollView style={{ marginTop: 50 }}>
    <>
      <ScrollView>
        {/* // Outer blue container */}
        <View
          style={{
            height: 300,
            backgroundColor: '#B0C4DE',
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: 10,
            }}
          >
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="black"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="search1" size={22} color="black" />
              <Text style={{ fontSize: 16, fontWeight: '600', marginLeft: 7 }}>
                Search
              </Text>
            </View>
          </View>
          {/* Inner white container starts */}
          <View
            style={{
              backgroundColor: 'white',
              height: 210,
              marginHorizontal: 20,
              marginVertical: 5,
              padding: 10,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
                {route.params.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign
                  style={{ marginHorizontal: 7 }}
                  name="sharealt"
                  size={24}
                  color="black"
                />
                <AntDesign name="hearto" size={24} color="black" />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 7,
              }}
            >
              <MaterialIcons name="stars" size={24} color="green" />
              <Text style={{ marginLeft: 6, fontSize: 17, fontWeight: '400' }}>
                {route.params.rating}
              </Text>
              <Text>・</Text>
              <Text style={{ fontSize: 17, fontWeight: '400' }}>
                {route.params.time} mins
              </Text>
            </View>

            <Text style={{ marginTop: 8, color: 'gray', fontSize: 17 }}>
              {route.params.cuisines}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Text>Outlet</Text>
              <Text
                style={{ marginLeft: 15, fontSize: 15, fontWeight: 'bold' }}
              >
                {route.params.adress}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Text>22 mins</Text>
              <Text
                style={{ marginLeft: 15, fontSize: 14, fontWeight: 'bold' }}
              >
                Home
              </Text>
            </View>

            <Text
              style={{
                borderColor: 'gray',
                borderWidth: 0.6,
                height: 1,
                marginTop: 12,
              }}
            ></Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <FontAwesome5 name="bicycle" size={24} color="orange" />
              <Text style={{ marginLeft: 7, color: 'gray', fontSize: 16 }}>
                0-3 Kms |{' '}
              </Text>
              <Text style={{ marginLeft: 7, color: 'gray', fontSize: 16 }}>
                35 Delivery fee will apply
              </Text>
            </View>
          </View>
          {/* Inner white container ends */}
        </View>
        {/* Menu Section Starts */}
        <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '500' }}>
          MENU
        </Text>
        <Text
          style={{
            borderColor: 'gray',
            borderWidth: 0.6,
            height: 1,
            marginTop: 12,
          }}
        ></Text>
        {route.params.menu.map((item, index) => (
          <FoodItem item={item} key={index} />
        ))}

        {/* Menu Section Ends */}
      </ScrollView>
      {/* Bottom menu design starts*/}
      <Pressable
        onPress={toggleModal}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          backgroundColor: 'black',
          marginLeft: 'auto',
          position: 'absolute',
          bottom: 35,
          right: 25,
          alignContent: 'center',
        }}
      >
        <MaterialIcons
          style={{ textAlign: 'center' }}
          name="menu-book"
          size={24}
          color="white"
        />
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500' }}>
          MENU
        </Text>
      </Pressable>
      <Modal isVisible={modalVisible} onBackdropPress={toggleModal}>
        <View
          style={{
            height: 190,
            width: 250,
            backgroundColor: 'black',
            position: 'absolute',
            bottom: 35,
            right: 10,
            borderRadius: 7,
          }}
        >
          {menu.map((item, ind) => (
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              key={ind}
            >
              <Text
                style={{ color: '#D0D0D0', fontWeight: '600', fontSize: 19 }}
              >
                {item.name}
              </Text>
              <Text
                style={{ color: '#D0D0D0', fontWeight: '600', fontSize: 19 }}
              >
                {item.items.length}
              </Text>
            </View>
          ))}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{ width: 120, height: 70, resizeMode: 'contain' }}
              source={{
                uri: 'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_284/Logo_f5xzza',
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Bottom menu design ends*/}
      {/* Bottom Cart starts */}
      {total === 0 ? null : (
        <Pressable
          style={{
            backgroundColor: '#00A877',
            width: '90%',
            padding: 13,
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'absolute',
            borderRadius: 8,
            left: 20,
            bottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {cart.length} items | {total}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  marginTop: 3,
                  color: 'white',
                }}
              >
                Extra Charges may apply!
              </Text>
            </View>

            <Pressable
              onPress={() =>
                navigation.navigate('Cart', {
                  name: route.params.name,
                })
              }
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginTop: 3,
                  color: 'white',
                }}
              >
                View Cart
              </Text>
            </Pressable>
          </View>
        </Pressable>
      )}
    </>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({});
