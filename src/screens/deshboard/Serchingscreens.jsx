import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import Headercomp from '../../components/Headercomp';
import makeApiCall from '../../utils/apiHelper';
import { API_URLS } from '../../utils/apiurls';
import { COLORS } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInputCompo from '../../components/TextInputCompo';

const Serchingscreens = ({ navigation }) => {
  const [companeyType, setcompaneytype] = useState([]);
  const [selectedValue, setSelectedValue] = useState(-1);
  const [searchitem, setserchitem] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchcompaneyType = async () => {
      try {
        const responce = await makeApiCall(API_URLS.getcatagory, 'POST', {
          jsonrpc: '2.0',
          params: {},
        });

        if (!responce.result.errorMesage && !responce.error) {
          const rawItems = responce?.result?.companyTypes;
          const mappedItems = [
            { label: 'Shopass Id', value: -1 }, // Add this line
            ...rawItems.map(item => ({
              label: item.name,
              value: item.id,
            })),
          ];
          setcompaneytype(mappedItems);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchcompaneyType();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Headercomp title={'Store List'} onpress={() => navigation.goBack()} />
      <View style={styles.container}>
        <DropDownPicker
          open={open}
          value={selectedValue}
          items={companeyType}
          setOpen={setOpen}
          setValue={setSelectedValue}
          setItems={setcompaneytype}
          placeholder="Select Company Type"
          searchable
          style={styles.dropdown}
          dropDownContainerStyle={[
            styles.dropdownContainer,
            { maxHeight: 400 },
          ]}
          textStyle={{ color: '#fff' }}
          placeholderStyle={{ color: '#ccc' }}
          searchPlaceholderTextColor={COLORS.whiteColor}
          searchTextInputStyle={{ color: COLORS.whiteColor }}
          ArrowDownIconComponent={() => (
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          )}
          ArrowUpIconComponent={() => (
            <Icon name="keyboard-arrow-up" size={24} color="#fff" />
          )}
        />
        <TextInputCompo
          placeholder="Search ....."
          style={{ ...styles.input }}
          value={searchitem}
          onChangeText={text => setserchitem(text)}
          placeholderTextColor={COLORS.whiteColor}
        />

        {/* {selectedValue && (
          <Text style={styles.selectedText}>
            Selected Company ID: {selectedValue}
          </Text>
        )} */}
      </View>
    </SafeAreaView>
  );
};

export default Serchingscreens;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    // paddingVertical: 10,
    flex: 1,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#2c2c2c',
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#2c2c2c',
  },
  selectedText: {
    fontSize: 16,
    marginTop: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555',
  },
});
