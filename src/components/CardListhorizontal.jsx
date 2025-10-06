import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../styles/colors';
import { BASE_URL } from '../utils/apiurls';
import Icon from 'react-native-vector-icons/FontAwesome';

const CardListhorizontal = ({ data, onPressItem }) => {
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: `${BASE_URL}${item.image}` }}
        style={styles.cardImage}
      />
      <TouchableOpacity
        style={{ position: 'absolute', padding: 10, right: 0 }}
        onPress={() => onPressItem?.(item)}
      >
        <Icon name="plus" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          ₹ {item.originalPrice.toFixed(2)}
        </Text>
        <Text style={styles.cardSubtitle}>{item.brand_name}</Text>
        <Text style={styles.cardSubtitle}>{item.uom_name}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

export default CardListhorizontal;

const styles = StyleSheet.create({
  flatListContent: {
    // paddingHorizontal: 10,
    // backgroundColor: 'red',
    paddingVertical: 5,
  },
  cardContainer: {
    // flexDirection: 'row',
    backgroundColor: COLORS.whiteColor,
    padding: 10,
    marginRight: 12,
    borderRadius: 10,
    elevation: 4,
    alignItems: 'center',
    width: 150,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  productInfo: {
    flex: 1, // Take remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
});
