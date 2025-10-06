import React from 'react';
import { Dimensions, StyleSheet, View, Image, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { API_URLS, BASE_URL } from '../utils/apiurls';

const { width } = Dimensions.get('window');

const Slider = ({ images = [] }) => {
  const defaultImages = [
    'https://source.unsplash.com/random/800x600',
    'https://source.unsplash.com/random/801x600',
    'https://source.unsplash.com/random/802x600',
    'https://source.unsplash.com/random/803x600',
  ];

  const imageList = images.length > 0 ? images : defaultImages;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        autoPlay
        data={imageList}
        width={width * 0.9}
        height={200}
        scrollAnimationDuration={1000}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{
                uri: typeof item === 'string' ? item : BASE_URL + item.image,
              }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.caption}>Image {index + 1}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  itemContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  caption: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 14,
  },
});
