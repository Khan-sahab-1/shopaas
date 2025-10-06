import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../utils/apiurls';
import { moderateScale } from '../styles/responsiveSize';

const QuickFood = ({ item }) => {
  const section = item['4'];
  const sliderdata = section?.sliders || [];

  // console.log(section, 'Item Data====');

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity key={item.id} style={{ margin: 10 }}>
        <ImageBackground
          imageStyle={{ borderRadius: 6 }}
          style={{ aspectRatio: 5 / 6, height: 170 }}
          source={{ uri: BASE_URL + item.image }}
        >
          <Text
            style={{
              // position: 'absolute',
              // bottom: 10,
              // left: 10,
              fontSize: 20,
              fontWeight: 'bold',
              // color: 'white',
            }}
          >
            {item.display_name}
          </Text>
        </ImageBackground>

        {/* Optional - Static text or dummy metadata */}
        {/* <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</Text> */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
        >
          {/* <MaterialIcons name="stars" size={24} color="green" />
          <Text style={{ marginLeft: 6, fontSize: 15, fontWeight: '400' }}>
            4.5
          </Text> */}
          {/* <Text>・</Text> */}
          {/* <Text style={{ fontSize: 15, fontWeight: '400' }}>30 mins</Text> */}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ margin: 0 }}>
      <Text
        style={{
          fontSize: moderateScale(18),
          fontWeight: 'bold',
          paddingHorizontal: 16,
          marginTop: 10,
        }}
      >
        {section?.name}
      </Text>
      <FlatList
        data={sliderdata}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default QuickFood;

const styles = StyleSheet.create({});
