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
import Invoice from '../Order/Invoice';

const EditConsoleUser = ({ navigation, route }) => {
  // console.log(route?.params,"parems")
  const { item } = route?.params;
  // console.log(item?.id)
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
  const transformed = selected?.value != null && selected?.label
  ? {
      [selected.value]: {
        name: selected.label,
        value: selected.value
      }
    }
  : {};

console.log(transformed);



  // Fetch user data and initialize technical settings state
  const fetchCreateUser = async id => {
    // console.log(id,'It')
    try {
      setIsLoading(true);
      const response = await makeApiCall(API_URLS.getUserData, 'POST', {
        jsonrpc: '2.0',
        params: {
          id: id,
          method: 'GET',
        },
      });
      console.log(response, 'Responce');
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
    if (item?.id) {
      fetchCreateUser(item?.id);
    }
  }, [item?.id]);

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
  // const formmated

  const formattedPurchase = fetchuser?.form_options?.sel_groups_54_55 || [];
  const purchaseDropdown = (formattedPurchase || []).map(item => ({
    label: item?.name || '',
    value: item?.value ?? '',
  }));
  

  const formattedInventory = fetchuser?.form_options?.sel_groups_20_21_22 || [];
  const inventoryDropdown = formattedInventory.map(item => ({
    label: item.name,
    value: item.value,
  }));
  const formattedInventory1 = fetchuser?.form_options?.sel_groups_25_26 || [];
  const inventoryDropdown1 = formattedInventory1.map(item => ({
    label: item.name,
    value: item.value,
  }));


  const formattedAutoBackupAccess =
    fetchuser?.form_options?.sel_groups_11 || [];
    const autoBackupAccessDropdown = (formattedAutoBackupAccess || []).map(item => ({
      label: item?.name || '',   // fallback empty string
      value: item?.value ?? '',  // fallback empty string
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
  const handleSubmit = async (id, company_id, selected) => {
    console.log(id, company_id, selected, 'calling');
  
  
  
    // ✅ Extract Technical Settings
    const technicalSettingsPayload = {};
    Object.entries(technicalSettings || {}).forEach(([key, item]) => {
      technicalSettingsPayload[key] = item?.value ?? '';
    });
  
    // ✅ Extract Extra Rights
    const extraRightPayload = {};
    Object.entries(extraRight || {}).forEach(([key, item]) => {
      extraRightPayload[key] = item?.value ?? '';
    });
  
    // ✅ Build final payload
    const payload = {
      company_id:String(company_id),
      id,
      method: 'POST',
      save_user: 'save_user',
      updatedData: {
        name: name || '',
        company_id:String(company_id),
        company_ids: transformed,
        login: email || '',
        sel_groups_36_40: selectedinvoicing?.value || '',
        sel_groups_20_21_22: selectedInventory?.value || '',
        sel_groups_34_35: selectedwebsite?.value || '',
        password: password || '',
        sel_groups_11: selectedautobackup?.value || '',
        sel_groups_20_21_22: selectedsales?.value || '',
        sel_groups_2_3: selectedasdminstration?.value || '',
        sel_groups_25_26: selectedpurchase?.value || '',
        ...technicalSettingsPayload,
        ...extraRightPayload,
      },
    };
  
    console.log(JSON.stringify(payload, null, 2), 'PayLoad');
  
    try {
      setIsLoading(true);
      const responce = await makeApiCall(API_URLS.saveUserData, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      console.log(responce, 'responce');
      Alert.alert(responce?.result)
      if (responce?.result?.message === 'success') {
        Alert.alert('Success');
      } else {
        // Alert.alert(responce?.result?.errorMessage || 'Something went wrong');
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
  useEffect(() => {
    if (fetchuser?.userData?.company_id && formattedDefaultCompany.length) {
      const matched = formattedDefaultCompany.find(
        item => item.value === fetchuser.userData.company_id,
      );
      setSelectedDefaultCompany(matched);
    }

    if (fetchuser?.userData?.company_ids && formattedAllowCompanies.length) {
      const matchedCompanies = formattedAllowCompanies.filter(item =>
        fetchuser.userData.company_ids.includes(item.value),
      );
      setSelected(matchedCompanies);
    }

    const websiteGroupValue =
      fetchuser?.userData?.modules?.Website?.sel_groups_34_35.value || {};

    const match = formattedWebsite.find(
      item => Number(item.value) === Number(websiteGroupValue),
    );
    // console.log('Matched website:', match);
    setselectedwebsite(match);
    const invoicing = fetchuser?.userData?.modules?.Accounting?.sel_groups_36_40.value || {};
    console.log(invoicing, 'Invoicing');
    console.log(formattedInvoicing);
    
    const matchInvoicing = formattedInvoicing.find(item => {
      return Number(item.value) === Number(invoicing);
    });

    setselectedinvoicing(matchInvoicing)

    const inventory=fetchuser?.userData?.modules?.Operations?.sel_groups_25_26.value || {};

    const matched=formattedInventory1.find(item=>{
      return Number(item.value)===Number(inventory)
    })
     setselectedInventory(matched)
     const purchase = fetchuser?.userData?.modules?.Operations?.sel_groups_54_55?.value || {};

   const matchedpurchase=formattedPurchase.find(item=>{
    return Number(item.value)===Number(purchase)
  })
    // console.log(matchedpurchase,'IIIIIII')
    // setselectedInventory(matchedpurchase)
    setselectedpurchase(matchedpurchase)

    const autobackup=fetchuser?.userData?.modules?.Other?.sel_groups_11.value || {};
    const matchautobackup=formattedAutoBackupAccess.find(item=>{
      return Number(item.value)===Number(autobackup)
    })
    // console.log(matchautobackup,'000000')
    setselectedautobackup(matchautobackup)

    const sales=fetchuser?.userData?.modules?.Sales?.sel_groups_20_21_22.value || {};
    const matchausales=inventoryDropdown.find(item=>{
      return Number(item.value)===Number(sales)
    })
    // console.log(matchausales)
    setselectedsales(matchausales)
    const administration=fetchuser?.userData?.modules?.Administration?.sel_groups_2_3.value || {};
    const matchaAdministaration=formattedAdministration.find(item=>{
      return Number(item.value)===Number(administration)
    })
    setselectdadministartion(matchaAdministaration)
    const user=fetchuser?.userData?.name||''
    setname(user)
    const email=fetchuser?.userData?.login
    setEmail(email)


  }, [fetchuser, formattedDefaultCompany, formattedAllowCompanies]);

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
            onChange={item => setselectedinvoicing(item)}
            value={selectedinvoicing}
          />

          {/* Operations */}
          <Text style={{ ...styles.label, fontSize: 18 }}>Operations:</Text>
          <Text style={styles.label}>Inventory</Text>
          <Dropdowncomp
            placeholder={'Inventory'}
            onChange={item => setselectedInventory(item)}
            value={selectedInventory}
            data={inventoryDropdown1}
          />
          <Text style={styles.label}>Purchase</Text>
          <Dropdowncomp
            placeholder={'Purchase'}
            data={purchaseDropdown}
            onChange={item => setselectedpurchase(item)}
            value={selectedpurchase}
          />

          {/* Other */}
          <Text style={{ ...styles.label, fontSize: 18 }}>Other:</Text>
          <Text style={styles.label}>Auto backup access</Text>
          <Dropdowncomp
            placeholder={'Auto backup access'}
            data={autoBackupAccessDropdown}
            onChange={item => setselectedautobackup(item)}
            value={selectedautobackup}
          />

          {/* Sales */}
          <Text style={{ ...styles.label, fontSize: 18 }}>Sales:</Text>
          <Dropdowncomp
            placeholder={'Sales'}
            data={inventoryDropdown}
            onChange={item => setselectedsales(item)}
            value={selectedsales}
          />

          {/* Administration */}
          <Text style={{ ...styles.label }}>Administration:</Text>
          <Dropdowncomp
            placeholder={'Administration'}
            data={administrationDropdown}
            onChange={item => setselectdadministartion(item)}
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

export default EditConsoleUser;
