import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import CheckBox from '@react-native-community/checkbox';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import ButtonCompo from '../../../../../components/ButtonCompo';
import MessageShow from '../../../../../constant/MessageShow';

const CreateUserConsole = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchuser, setFetchuser] = useState(null);
  const [selectedDefaultCompany, setSelectedDefaultCompany] = useState(null);

  const [selected, setSelected] = useState({});
  const [selectedinvoicing, setselectedinvoicing] = useState(null);
  const [selectedInventory, setselectedInventory] = useState(null);
  const [selectedwebsite, setselectedwebsite] = useState(null);
  const [selectedpurchase, setselectedpurchase] = useState(null);
  const [selectedautobackup, setselectedautobackup] = useState(null);
  const [selectedsales, setselectedsales] = useState(null);
  const [selectedasdminstration, setselectdadministartion] = useState(null);
  const [technicalSettings, setTechnicalSettings] = useState({});
  const [extraRight, setExtraRight] = useState({});
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  // console.log(selectedpurchase,selectedasdminstration,'Default')
  const transformed = selected.company_ids
  ? {
      [selected.company_ids.value]: {
        name: selected.company_ids.name,
        value: selected.company_ids.value,
      },
    }
  : {};

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  
  console.log(transformed)
  
  // Fetch user data and initialize technical settings state
  const fetchCreateUser = async () => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getUserData, 'POST', {
        jsonrpc: '2.0',
        params: {
          id: 'New',
          method: 'GET',
        },
      });
      if (response?.result?.message === 'success') {
        setFetchuser(response.result);
        if (response.result?.userData?.modules?.['Technical Settings']) {
          setTechnicalSettings(
            response.result.userData.modules['Technical Settings'],
          );
        }
        if (response.result?.userData?.modules?.['Extra Rights']) {
          setExtraRight(response.result.userData.modules['Extra Rights']);
        }
      }
    } catch (error) {
      console.log('Fetch user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreateUser();
  }, []);

  // Format dropdown data safely (check for arrays)
  const formattedAllowCompanies = fetchuser?.form_options?.company_ids || [];
  const allowCompaniesDropdown = formattedAllowCompanies.map(item => ({
    label: item.name,
    value: item.value,
  }));

  const formattedDefaultCompany = fetchuser?.form_options?.company_id || [];
  const defaultCompanyDropdown = formattedDefaultCompany.map(item => ({
    label: item.name,
    value: item.value,
  }));

  const formattedWebsite = fetchuser?.form_options?.sel_groups_34_35 || [];
  const websiteDropdown = formattedWebsite.map(item => ({
    label: item.name,
    value: item.value,
  }));

  const formattedInvoicing = fetchuser?.form_options?.sel_groups_36_40 || [];
  const invoicingDropdown = formattedInvoicing.map(item => ({
    label: item.name,
    value: item.value,
  }));

  const formattedPurchase = fetchuser?.form_options?.sel_groups_54_55 || [];
  const purchaseDropdown = formattedPurchase.map(item => ({
    label: item.name,
    value: item.value,
  }));

  const formattedInventory = fetchuser?.form_options?.sel_groups_20_21_22 || [];
  const inventoryDropdown = formattedInventory.map(item => ({
    label: item.name,
    value: item.value,
  }));

  const formattedAutoBackupAccess =
    fetchuser?.form_options?.sel_groups_11 || [];
  const autoBackupAccessDropdown = formattedAutoBackupAccess.map(item => ({
    label: item.name,
    value: item.value,
  }));

  const formattedAdministration = fetchuser?.form_options?.sel_groups_2_3 || [];
  const administrationDropdown = formattedAdministration.map(item => ({
    label: item.name,
    value: item.value,
  }));

  // Handle checkbox toggle for Technical Settings
  const toggleTechnicalSetting = key => {
    setTechnicalSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: !prev[key].value,
      },
    }));
  };
  const toggleExtraRight = key => {
    setExtraRight(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: !prev[key].value,
      },
    }));
  };

  // Prepare data for backend submission (example function)
  const handleSubmit = async (id, company_id) => {
    // Extract key-value pairs for Technical Settings
    const technicalSettingsPayload = {};
    Object.entries(technicalSettings).forEach(([key, item]) => {
      technicalSettingsPayload[key] = item.value;
    });

    // Extract key-value pairs for Extra Rights
    const extraRightPayload = {};
    Object.entries(extraRight).forEach(([key, item]) => {
      extraRightPayload[key] = item.value;
    });

    // Now you can send technicalSettingsPayload and extraRightPayload to backend or combine them
    // console.log('Technical Settings Payload:', technicalSettingsPayload);
    // console.log('Extra Rights Payload:', extraRightPayload);

    // Example: combined payload
    const payload = {
      company_id: company_id,
      id: id,
      method: 'POST',
      save_user: 'save_user',
      updatedData: {
        name: name,
        company_id: company_id,
        company_ids: transformed,
        // company_ids: '',
        login: email,
        // name: name,
        sel_groups_36_40: selectedinvoicing,
        sel_groups_20_21_22: selectedInventory,
        sel_groups_34_35: selectedwebsite,
        password: password,
        sel_groups_11: selectedautobackup,
        sel_groups_20_21_22: selectedsales,
        sel_groups_2_3: selectedasdminstration,
        sel_groups_25_26: selectedpurchase,

        ...technicalSettingsPayload,
        ...extraRightPayload,
      },
      // technicalSettings: technicalSettingsPayload,
      // extraRights: extraRightPayload,
    };
    console.log(payload, 'PayLoad');
    if (!name.trim()) {
      MessageShow.error('Validation Error', 'Please enter a name');
      return;
    }
  
    if (!email.trim()) {
      MessageShow.error('Validation Error', 'Please enter an email');
      return;
    }
  
    if (!isValidEmail(email)) {
      MessageShow.error('Validation Error', 'Please enter a valid email');
      return;
    }
    // Send `payload` to your backend API here
    try {
      setIsLoading(true);
      const responce = await makeApiCall(API_URLS.saveUserData, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      console.log(responce,'responce')
      if(responce?.result.message==='success'){
        Alert.alert('Success')
      }
      else{
        Alert.alert(responce?.result?.errorMessage)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(fetchuser?.userData?.id, 'User');
  const handlconfirm = () => {
    if ((fetchuser?.userData?.id, fetchuser?.userData?.company_id)) {
      handleSubmit(fetchuser?.userData?.id, fetchuser?.userData?.company_id);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Create User'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={{ paddingHorizontal: 15 }}>
          <Text style={styles.label}>User Name</Text>
          <TextInputCompo
            placeholder="Name"
            style={styles.inputbox}
            onChangeText={text => setname(text)}
            value={name}
          />

          <Text style={styles.label}>User Email/UserId</Text>
          <TextInputCompo
            placeholder="User Email/UserId"
            style={styles.inputbox}
            onChangeText={text => setEmail(text)}
            value={email}
          />

          <Text style={styles.label}>Password</Text>
          <TextInputCompo
            placeholder="Password"
            style={styles.inputbox}
            onChangeText={text => setpassword(text)}
            value={password}
          />

          <Text style={styles.label}>Default Company</Text>
          <Dropdowncomp
            data={defaultCompanyDropdown}
            placeholder={'Default Company'}
            onChange={item => setSelectedDefaultCompany(item.value)}
            value={selectedDefaultCompany}
          />

          <Text style={styles.label}>Allowed Companies</Text>
          <Dropdowncomp
            data={allowCompaniesDropdown}
            placeholder={'Allowed Companies'}
            onChange={item => setSelected(item)}
            value={selected}
          />

          {/* Extra Rights: you can implement similarly if needed */}
          {Object.entries(extraRight).map(([key, item]) => (
            <View key={key} style={styles.checkboxContainer}>
              <CheckBox
                value={item.value}
                onValueChange={() => toggleExtraRight(key)}
              />
              <Text style={styles.label}>{item.name}</Text>
            </View>
          ))}

          {/* Website */}
          <Text style={{ ...styles.label, fontSize: 18, marginTop: 20 }}>
            Website:
          </Text>
          <Dropdowncomp
            placeholder={'Website'}
            data={websiteDropdown}
            onChange={item => setselectedwebsite(item.value)}
            value={selectedwebsite}
          />

          {/* Accounting */}
          <Text style={{ ...styles.label, fontSize: 18 }}>Accounting:</Text>
          <Text style={styles.label}>Invoicing</Text>
          <Dropdowncomp
            placeholder={'Invoicing'}
            data={invoicingDropdown}
            onChange={item => setselectedinvoicing(item.value)}
            value={selectedinvoicing}
          />

          {/* Operations */}
          <Text style={{ ...styles.label, fontSize: 18 }}>Operations:</Text>
          <Text style={styles.label}>Inventory</Text>
          <Dropdowncomp
            placeholder={'Inventory'}
            onChange={item => setselectedInventory(item.value)}
            value={selectedInventory}
            data={inventoryDropdown}
          />
          <Text style={styles.label}>Purchase</Text>
          <Dropdowncomp
            placeholder={'Purchase'}
            data={purchaseDropdown}
            onChange={item => setselectedpurchase(item.value)}
            value={selectedpurchase}
          />

          {/* Other */}
          <Text style={{ ...styles.label, fontSize: 18 }}>Other:</Text>
          <Text style={styles.label}>Auto backup access</Text>
          <Dropdowncomp
            placeholder={'Auto backup access'}
            data={autoBackupAccessDropdown}
            onChange={item => setselectedautobackup(item.value)}
            value={selectedautobackup}
          />

          {/* Sales */}
          <Text style={{ ...styles.label, fontSize: 18 }}>Sales:</Text>
          <Dropdowncomp
            placeholder={'Sales'}
            data={inventoryDropdown}
            onChange={item => setselectedsales(item.value)}
            value={selectedsales}
          />

          {/* Administration */}
          <Text style={{ ...styles.label }}>Administration:</Text>
          <Dropdowncomp
            placeholder={'Administration'}
            data={administrationDropdown}
            onChange={item => setselectdadministartion(item.value)}
            value={selectedasdminstration}
          />

          {/* Technical Settings Checkboxes */}
          <Text style={{ ...styles.label, fontSize: 18, marginTop: 20 }}>
            Technical Settings:
          </Text>
          <View>
            {Object.entries(technicalSettings).map(([key, item]) => (
              <View key={key} style={styles.checkboxContainer}>
                <CheckBox
                  value={item.value}
                  onValueChange={() => toggleTechnicalSetting(key)}
                />
                <Text style={styles.label}>{item.name}</Text>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <View style={{ marginVertical: 20 }}>
            <ButtonCompo title="Submit" onPress={handlconfirm} />
          </View>
        </View>
        <Loader visible={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateUserConsole;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blackColor,
    marginLeft: 8,
    flex: 1,
  },
  inputbox: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});
