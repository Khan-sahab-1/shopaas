import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import { COLORS } from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import Loader from '../../../components/Loader';
import axios from 'axios';
import CreatingLoyalityModal from './ConsoleForm/Loyalitty/CreatingLoyalityModal';
import EditLoyalModal from './ConsoleForm/Loyalitty/EditLoyalModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const Loyality = ({ navigation }) => {
  const [isLoding, setisLoding] = useState(false);
  const [isOpenCreating, setisOpencreating] = useState(false);
  const [loyalityData, setLoyalityData] = useState([]);
  const [editisOpen, seteditOpen] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  if (loyalityData && loyalityData.length > 0) {
    console.log('Data found:', loyalityData);
  } else {
    console.log('No data or null:', loyalityData);
  }

  const fetchLoyality = async (type = null) => {
    try {
      setisLoding(true);
      const res = await makeApiCall(API_URLS.getLoyaltyData, 'POST', {
        jsonrpc: '2.0',
        params: { type: null, method: 'GET' },
      });
      // const payload = {
      //   jsonrpc: '2.0',
      //   params: { type: null, method: 'GET' }
      // };

      // const res = await axios.post(API_URLS.getLoyaltyData, payload, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //     // plus any auth token if needed:
      //     // 'Authorization': `Bearer ${token}`
      //   },
      //   withCredentials: true // if backend uses cookies
      // });

      console.log('FeTch Loyality', res?.result);
      setLoyalityData(res?.result?.form_options?.loyalty_grp);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoding(false);
    }
  };

  
  useEffect(() => {
    fetchLoyality();
  }, []);
  
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ ...styles.card }}
        onPress={() => {
          seteditOpen(true);
          setselectedItem(item);
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...styles.normartext }}>Name</Text>
          <Text style={{ ...styles.normartext }}>{item.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...styles.normartext }}>Minimum Purchace</Text>
          <Text style={{ ...styles.normartext }}>{item.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...styles.normartext }}>Companey</Text>
          <Text style={{ ...styles.normartext }}>{item.company}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...styles.normartext }}>One Time Policy</Text>
          <Text style={{ ...styles.normartext }}>{item.loyalty_policy}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const ListEmptyComponent = () => {
    return (
      <View>
        <Text>Empty List </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Loyalty'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <View style={{ ...styles.container }}>
        <FlatList
          data={loyalityData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          // ListEmptyComponent={ListEmptyComponent}
        />
      </View>
      {(!loyalityData || loyalityData.length === 0) && (
        <TouchableOpacity
          style={{ ...styles.buttonCreate }}
          onPress={() => setisOpencreating(true)}
        >
          <Text style={{ ...styles.btntext }}>Create</Text>
        </TouchableOpacity>
      )}

      <CreatingLoyalityModal
        isVisible={isOpenCreating}
        onclose={() => setisOpencreating(false)}
      />
      <EditLoyalModal
        isVisible={editisOpen}
        onclose={() => {
          seteditOpen(false);
          fetchLoyality();
        }}
        item={selectedItem}
      />
      <Loader visible={isLoding} />
    </SafeAreaView>
  );
};

export default Loyality;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  normartext: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blackColor,
  },
  buttonCreate: {
    position: 'absolute',
    backgroundColor: COLORS.blueColor,
    width: 100,
    height: 50,
    right: 20,
    bottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntext: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.whiteColor,
  },
});
