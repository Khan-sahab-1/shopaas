import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headercomp from '../../components/Headercomp';
import TextInputCompo from '../../components/TextInputCompo';
import ButtonCompo from '../../components/ButtonCompo';
import { API_URLS } from '../../utils/apiurls';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmedLocation } from '../../redux/reducers/locationSlice';
import { getCurrentLocation } from '../../utils/getCurrentLocation';
import Loader from '../../components/Loader';
import { COLORS } from '../../styles/colors';

const YourLocation = ({ navigation }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const dispatch = useDispatch();
  const confirmedLocation = useSelector(state => state.location);

  const searchLocationHandler = async (loc, searchByText = false) => {
    try {
      let location = searchByText ? loc : '';
      let position = searchByText ? null : loc;

      setSearchLocation(location);
      location = location || '';

      if (location.length === 0) {
        setLocations([]);
        return;
      }

      if ((location.length > 2 && !fetchingData) || position) {
        let params = { text: location };
        if (position) {
          params.position = {
            lat: position.latitude,
            long: position.longitude,
          };
        }

        setFetchingData(true);

        const response = await fetch(API_URLS.getLocation, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            params: params,
          }),
        });

        const res = await response.json();
        console.log(res, 'Responce-----');
        setFetchingData(false);

        if (!res.result?.errorMessage && !res.error) {
          setLocations(res.result.data.location);
        } else {
          Alert.alert('Error', res.result.errorMessage || res.error);
        }
      }
    } catch (err) {
      setFetchingData(false);
      Alert.alert('Error', err.message);
    }
  };

  const handleSuggestionSelect = item => {
    setSearchLocation(item.address);
    setSelectedAddress({ id: item.id, name: item.address });
    setLocations([]);
  };

  const confirmLocation = async () => {
    try {
      if (!selectedAddress) {
        Alert.alert('Please select an address before confirming.');
        return;
      }

      setFetchingData(true);

      const response = await fetch(API_URLS.confirmLocation, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            addressId: selectedAddress.id,
            address: selectedAddress.name,
          },
        }),
      });

      const res = await response.json();
      setFetchingData(false);
      console.log(res, 'Confirm Location Response');

      if (!res.result?.errorMessage && !res.error) {
        Alert.alert('Success', 'Location confirmed!');
        dispatch(setConfirmedLocation(selectedAddress.name));

        navigation.goBack();
      } else {
        Alert.alert('Error', res.result.errorMessage || res.error);
      }
    } catch (err) {
      setFetchingData(false);
      Alert.alert('Error', err.message);
    }
  };
  const handleCurrentLocation = async () => {
    try {
      setFetchingData(true);
      const coords = await getCurrentLocation();

      const response = await fetch(API_URLS.getLocation, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            position: {
              lat: coords.latitude,
              long: coords.longitude,
            },
          },
        }),
      });

      const res = await response.json();
      console.log(res, 'Current location address res');

      setFetchingData(false);

      if (!res.result?.errorMessage && !res.error) {
        const locationData = Object.values(res.result.data.location)?.[0];
        if (locationData) {
          dispatch(setConfirmedLocation(locationData.address));
          Alert.alert('Success', 'Current location set!');
          navigation.goBack();
        } else {
          Alert.alert('No address found for current location.');
        }
      } else {
        Alert.alert('Error', res.result.errorMessage || res.error);
      }
    } catch (err) {
      setFetchingData(false);
      console.log('Current location fetch error:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:COLORS.whiteColor }}>
      <Headercomp 
      title="Location" 
      // onpress={() => navigation.goBack()}
      onPress={() => navigation.goBack()}
       left={true} />
      <View style={styles.container}>
        <TextInputCompo
          placeholder="Search a new address"
          style={styles.input}
          value={searchLocation}
          onChangeText={text => searchLocationHandler(text, true)}
        />

        {/* {fetchingData && <ActivityIndicator style={{ marginVertical: 10 }} />} */}

        {locations && Object.keys(locations).length > 0 && (
          <View style={styles.suggestionBox}>
            <FlatList
              data={Object.values(locations)}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}
                >
                  <Text>{item.address}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <ButtonCompo title="Confirm Location" onPress={confirmLocation} />

        <TouchableOpacity
          style={styles.locationRow}
          onPress={handleCurrentLocation}
        >
          <Icon name="locate" size={20} color="#000" />
          <Text style={styles.locationText}>Use Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationRow}>
          <Icon name="home" size={20} color="#000" />
          <View>
            <Text style={styles.locationText}>My Address</Text>
            <Text style={{ ...styles.locationText, fontSize: 20 }}>
              {confirmedLocation.confirmedLocation}
            </Text>
          </View>
        </TouchableOpacity>
        <Loader visible={fetchingData} />
      </View>
    </SafeAreaView>
  );
};

export default YourLocation;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
  },
  suggestionBox: {
    maxHeight: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 5,
    elevation: 2,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
});
