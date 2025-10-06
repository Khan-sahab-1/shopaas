import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONSOLEDATA } from '../../../data/Consoledata';
import { COLORS } from '../../../styles/colors';
import LogoutModal from '../../../constant/LogoutModal';
import Headercomp from '../../../components/Headercomp';
import navigationString from '../../../navigation/navigationString';

const Console = ({ navigation }) => {
  const handlenavigatescreen = item => {
    console.log(item, 'Items----');
    switch (item.id) {
      case 1:
        navigation.navigate(navigationString.ORDER);
        break;
      case 2:
        navigation.navigate(navigationString.COMPANEYBRAND);
        break;
      case 3:
        navigation.navigate(navigationString.PRODUCTS);
        break;
      case 4:
        navigation.navigate(navigationString.PACKORDER);
        break;
      case 5:
        navigation.navigate(navigationString.PICKORDER);
        break;
      case 6:
        navigation.navigate(navigationString.DISPATCH);
        break;
      case 7:
        navigation.navigate(navigationString.PRODUCTCATEGORIES);
        break;
      case 8:
        navigation.navigate(navigationString.PRODUCTVARIENT);
        break;
      case 9:
        navigation.navigate(navigationString.ECOMMERCECATEGORIES);
        break;
      case 10:
        navigation.navigate(navigationString.USERS);
        break;
      case 11:
        navigation.navigate(navigationString.PRICELISTS);
        break;
      case 12:
        navigation.navigate(navigationString.PRODUCTTRANSFER);
        break;
        case 13:
        navigation.navigate(navigationString.PRODUCTDATAUPDATE);
        break;
        case 14:
        navigation.navigate(navigationString.STOCKINVENTORY);
        break;
        case 15:
          navigation.navigate(navigationString.PROMOTION);
          break;
      case 16:
        navigation.navigate(navigationString.DASHBOARD);
        break;
      case 17:
        navigation.navigate(navigationString.LOYALITY);
        break;
        case 18:
        navigation.navigate(navigationString.UOM);
        break;
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => handlenavigatescreen(item)}
      >
        <View style={styles.itemContent}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.blackColor} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'Console'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          data={CONSOLEDATA}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: COLORS.blackColor,
                marginVertical: 8,
              }}
            />
          )}
          ListEmptyComponent={() => (
            <Text style={{ color: 'white' }}>No Data Found</Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Console;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
    // padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 25,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.blackColor,
  },
});
