import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';
import navigationString from '../navigation/navigationString';

const MenuItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <View style={{ margin: 10 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationString.MENUSCREEN, {
            id: item.id,
            name: item.name,
            image: item.image,
            rating: item.rating,
            time: item.time,
            adress: item.adress,
            cost_for_two: item.cost_for_two,
            cuisines: item.cuisines,
            menu: item.menu,
          })
        }
        style={{ flexDirection: 'row', paddingLeft: 12 }}
      >
        <View style={{ position: 'relative' }}>
          <ImageBackground
            imageStyle={{ borderRadius: 8 }}
            style={{ aspectRatio: 4 / 4, height: 130 }}
            source={{ uri: item.image }}
            resizeMethod="contain"
          >
            <AntDesign
              style={{ position: 'absolute', right: 10, top: 10 }}
              name="hearto"
              size={24}
              color="white"
            />
          </ImageBackground>
        </View>

        <View style={{ marginLeft: 10 }}>
          {/* Name Of The Restaurant */}
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>

          {/* Rating & Time */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <MaterialIcons name="stars" size={22} color="green" />
            <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: '400' }}>
              {item.rating}
            </Text>
            <Text style={{ marginLeft: 3 }}>•</Text>
            <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: '400' }}>
              {item.time} mins
            </Text>
          </View>

          {/* Address */}
          <Text style={{ fontSize: 15, color: 'gray', marginTop: 6 }}>
            {item.adress}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <View
              style={{
                backgroundColor: '#090979',
                width: 22,
                height: 22,
                borderRadius: 11,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                ₹
              </Text>
            </View>

            <Text
              style={{
                marginTop: 5,
                marginLeft: 4,
                fontSize: 16,
                fontWeight: '500',
              }}
            >
              {item.cost_for_two} For Two
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <MaterialCommunityIcons name="bike-fast" size={24} color="black" />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>FREE DELIVERY</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MenuItem;

const styles = StyleSheet.create({});
