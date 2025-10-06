


import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import makeApiCall from '../../utils/apiHelper';
import { API_URLS } from '../../utils/apiurls';
import { data } from '../../data/UserinfoData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles/colors';
import Headercomp from '../../components/Headercomp';
import { useDispatch, useSelector } from 'react-redux';
import navigationString from '../../navigation/navigationString';
import LogoutModal from '../../constant/LogoutModal';
import { getSessionAsync, loginAsync, logoutAsync } from '../../redux/reducers/authreducers';
import { persistor } from '../../redux/store';
import Loader from '../../components/Loader';
import { fetchSessionInfo } from '../../redux/reducers/sessionSlice';

const UserProfile = ({ navigation }) => {
  const userInfo = useSelector(state => state.auth);
  const session = useSelector(state => state.session);
  console.log(session,'session')
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoding,setIsloding]=useState(false)
  const dispatch = useDispatch();
  let listData = [...data];
  // console.log(userInfo,'USERINFO')

  // Conditionally push items
  if (
    session?.data?.session_info?.user_companies &&
    session?.data?.session_info?.user_companies?.current_company
  ) {
    listData.push(
      {
        id: 7,
        title: 'Console',
        image:
          'https://img.icons8.com/external-wanicon-flat-wanicon/452/external-coupon-cyber-monday-wanicon-flat-wanicon.png',
      },
      {
        id: 8,
        title: 'Become Customer',
        image: 'https://cdn-icons-png.flaticon.com/512/3225/3225069.png',
      },
    );
  }
  if (
    session?.data?.session_info?.is_admin===false &&
    session?.data?.custom_session_info?.user_type==='internal'
  ) {
    listData.push({
      id: 0,
      title: 'Become Employe',
      image: 'https://cdn-icons-png.flaticon.com/512/2405/2405283.png',
    });
  }
  const getsessioninfo = async () => {
    try {
      const responce = await makeApiCall(API_URLS.getSessionInfo, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(responce, 'sessionresponce');
      return responce.result;
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error?.message || 'Something went wrong');
    }
  };
  

  useEffect(() => {
    getsessioninfo();
  }, []);

  const handleconvertUser = async (become) => {
    console.log(become,'become----')
    try {
      setIsloding(true);
      const response = await makeApiCall(API_URLS.toggleCompanyUser, 'POST', {
        jsonrpc: '2.0',
        params: { become },
      });
      console.log(response, 'toggle response');
  
      if (response?.result?.message === 'success') {
        // const sessionData = await getsessioninfo(); // 👈 call and wait
        // console.log(sessionData, 'sessionData after login');
        await dispatch(fetchSessionInfo());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloding(false);
    }
  };
  


  const handlenavigatescreen = item => {
    console.log(item, 'Item');
    switch (item.id) {
      case 5:
        navigation.navigate(navigationString.PROFILE);
        break;
      case 1:
        navigation.navigate(navigationString.MYORDER);
        break;
      case 4:
        navigation.navigate(navigationString.MYCOUPEN);
        break;
      case 2:
        navigation.navigate(navigationString.MYADDRESS);
        break;
      case 3:
        navigation.navigate(navigationString.HELPANDSUPPORT);
        break;
      case 6:
        setLogoutModalVisible(true);
        break;
      case 7:
        navigation.navigate(navigationString.CONSOLE);
        break;
      case 0:
        handleconvertUser('internal')
        // handleconvertUser('portal')
        break;
      case 8:
        handleconvertUser('portal')
        break;
        case 10:
        navigation.navigate(navigationString.CONTECTUS);
        break;
    }
  };

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await dispatch(logoutAsync()).unwrap();
      navigation.reset({
        index: 0,
        routes: [{ name: navigationString.LOGIN }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
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
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.blackColor} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listData}
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
      <LogoutModal
        isvisible={logoutModalVisible}
        onclose={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
      />
      <Loader visible={isLoding}/>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:COLORS.whiteColor
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