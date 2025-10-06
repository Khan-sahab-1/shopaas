import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { Card } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  companyDataTransfer,
  saveCompanyDataTransfer,
  getToCompanyData,
} from './Servicess';
import ItemPopup from './ItemPopup';
import style from './style';
import ProfileCard from './ProfileCard';
import DropDownPicker from 'react-native-dropdown-picker';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import ButtonCompo from '../../../../../components/ButtonCompo';
import SelectedModal from './SelectdeModal';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Loader from '../../../../../components/Loader';
import { COLORS } from '../../../../../styles/colors';
import { calendarFormat } from 'moment';
import MessageShow from '../../../../../constant/MessageShow';

const DataTransferModule = () => {
  const [transferData, setTransferData] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [transfer_form_options, setTransferFormOptions] = useState({});
  const [fetchingData, setFetchingData] = useState(false);

  const [productPage, setProductPage] = useState(0);

  const [DataTransfered, setDataTransfered] = useState(false);
  const [updatedtransferData, setUpdatedTransferData] = useState({});
  const [isOpneModal, setIsOpenModal] = useState(false);
  const [selectedOptions, setselectedOptions] = useState(null);

  // State for dropdown values
  const [fromCompany, setFromCompany] = useState('');
  const [toCompany, setToCompany] = useState('');
  const [appliedOn, setAppliedOn] = useState('');
  const [selectedfromCompany, setSelectedfromCompany] = useState(null);
  const [selectedItem, setSelectedItems] = useState([]);
  const [isLoding,setIsLoding]=useState(false)
  console.log(selectedItem,'ITEMS')

  useEffect(() => {
    getCompanyDataTransfer();
  }, []);
  console.log(transferData, 'TransferData');
  // Initialize dropdown values when data is available
  console.log(transfer_form_options, 'FROM COMPA');
  useEffect(() => {
    if (transferData) {
      setFromCompany(transferData.from_company_id?.toString() || '');
      setToCompany(transferData.to_company_id?.toString() || '');
      setAppliedOn(transferData.transfer_applied_on || '');
    }
  }, [transferData]);

  const FromCompanyOptions = Object.entries(
    transfer_form_options?.from_company_id || {},
  ).map(([key, obj]) => ({
    label: obj.name,
    value: obj.id.toString(),
  }));

  const toCompanyOptions = Object.entries(
    transfer_form_options?.to_company_id || {},
  ).map(([key, obj]) => ({
    label: obj.name,
    value: obj.id.toString(),
  }));

  const AppliedOnOptions = Object.entries(
    transfer_form_options?.transfer_applied_on || {},
  ).map(([key, name]) => ({
    label: name,
    value: key,
  }));

  const getCompanyDataTransfer = async () => {
    setFetchingData(true);
    try {
      const res = await companyDataTransfer(productPage);
      console.log('Response from companyDataTransfer', res);
      if (res.error || res.result.errorMessage) {
        alert(res.error || res.result.errorMessage);
      } else {
        setTransferData(res.result.data);
        setTransferFormOptions(res.result.transfer_form_options || {});

        // Update the form data in state
        setUpdatedTransferData(prev => ({
          ...prev,
          ...res.result.data,
        }));
      }
    } catch (e) {
      console.error(e);
    }
    setFetchingData(false);
  };

  const hadlegettofields = async from_company_id => {
    console.log(from_company_id, 'Fromcompanyid');
    try {
      setFetchingData(true);
      const res = await makeApiCall(API_URLS.getToCompanyData, 'POST', {
        jsonrpc: '2.0',
        params: {
          updatedTransferData: {
            from_company_id: from_company_id,
          },
        },
      });
      console.log(res, 'GettoCompanyData');
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setFetchingData(false);
    }
  };
  // Toggle active/inactive status locally
const handleActiveStatusChange = (id, newValue) => {
  setTransferData(prev => ({
    ...prev,
    product_transfer_line_ids: {
      ...prev.product_transfer_line_ids,
      [id]: {
        ...prev.product_transfer_line_ids[id],
        is_active: newValue, // update active status
      },
    },
  }));

  // Keep track of selected items separately if needed
  setSelectedItems(prev =>
    newValue
      ? [...prev, id] // add when active
      : prev.filter(itemId => itemId !== id) // remove when inactive
  );
};


  const handleDropdownChange = (field, value) => {
    // Update local state
    switch (field) {
      case 'from_company_id':
        setFromCompany(value);
        break;
      case 'to_company_id':
        setToCompany(value);
        break;
      case 'transfer_applied_on':
        setAppliedOn(value);
        break;
      default:
        break;
    }
    setUpdatedTransferData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // New function to handle active/inactive status change

  const handlesubmit = async updatedTransferData => {
    const payLoad = {
      page: 0,
      transferId: transferData?.id,
      updatedTransferData: updatedTransferData,
    };
    console.log(payLoad, 'Payload');
    try {
      setIsLoding(true)
      const responce = await makeApiCall(
        API_URLS.saveCompanyDataTransfer,
        'POST',
        {
          jsonrpc: '2.0',
          params: payLoad,
        },
      );
      console.log(responce, 'New');
      if(responce?.result?.message==="success"){
        MessageShow.success('success',responce?.result?.message)
       await getCompanyDataTransfer()
       setselectedOptions(null)
      //  setSelectedItems([])
      }
      if(responce?.result?.errorMessage){
        MessageShow.error('Error',responce?.result?.errorMessage)
      }

    } catch (error) {
      console.log(error);
    } finally{
      setIsLoding(false)
    }
  };

  const performAction = actionType => {
    // Placeholder for performAction function
    console.log('Performing action:', actionType);
    // Add your logic here based on actionType
  };

  const showBtn = btnType => {
    if (!transferData?.btnStatus) return false;
    if (btnType === 'edit') return transferData.btnStatus.show_start || true;
    if (btnType === 'show_start') return transferData.btnStatus.show_start;
    if (btnType === 'show_transfer')
      return transferData.btnStatus.show_transfer;
    if (btnType === 'show_cancel') return transferData.btnStatus.show_transfer;
    return false;
  };

  return (
    <SafeAreaView style={[style.container]}>
      <ScrollView>
        {transferData && !DataTransfered && (
          <View style={style.container}>
            {/* Header */}
            {/* <View style={styles.header__wrapper}>
              <Text style={styles.header__text}>Product Transfer</Text>
            </View> */}

            <View style={styles.header_btn_wrapper}>
              {showBtn('show_start') && (
                <Pressable
                  style={styles.header__btn}
                  onPress={() =>
                    handlesubmit({
                      action: 'start',
                      selectedItem: [selectedOptions],
                    })
                  }
                >
                  <Text style={styles.header__btn__text}>Start</Text>
                </Pressable>
              )}
              {/* {showBtn('show_transfer') && (
                <Pressable
                  style={styles.header__btn}
                  onPress={() => handlesubmit('transfer')}
                >
                  <Text style={styles.header__btn__text}>Transfer</Text>
                </Pressable>
              )} */}
              {showBtn('show_transfer') && (
                <Pressable
                  style={styles.header__btn}
                  onPress={() =>
                    handlesubmit({
                      action: 'transfer',
                      allSelected: false,
                      notSelected: [],
                      selected: selectedItem,
                      publishedData: {},
                    })
                  }
                >
                  <Text style={styles.header__btn__text}>Transfer</Text>
                </Pressable>
              )}
              {showBtn('show_cancel') && (
                <Pressable
                  style={styles.header__btn}
                  onPress={() => handlesubmit({action: "cancel"})}
                >
                  <Text style={styles.header__btn__text}>Cancel</Text>
                </Pressable>
              )}
            </View>

            {/* From Company */}


        
          </View>
        )}

        {/* Product Cards with Checkboxes */}
        {Object.keys(transferData?.product_transfer_line_ids || {}).length >
          0 ?(
          <ScrollView style={{ marginBottom: 20 }}>
            {Object.values(transferData?.product_transfer_line_ids || {}).map(
              row => (
                <Card key={row?.id} containerStyle={styles.cardContainer}>
                  <View style={styles.cardDetailViewColumn}>
                    {/* Header row with product name and checkbox */}
                    <View style={styles.cardDetailViewRowHeader}>
                      <Text style={styles.productNameText}>
                        {row?.product_id?.name ?? ''}
                      </Text>
                      <View style={styles.checkboxContainer}>
                        <CheckBox
                          value={row?.is_active ?? false}
                          onValueChange={newValue =>
                            handleActiveStatusChange(row?.id, newValue)
                          }
                          style={styles.checkbox}
                          tintColors={{
                            true: COLORS.primary || '#28a745',
                            false: '#d1d1d1',
                          }}
                          disabled={fetchingData} // Disable during API calls
                        />
                        <Text
                          style={[
                            styles.checkboxLabel,
                            {
                              color: row?.is_active
                                ? COLORS.success || '#28a745'
                                : COLORS.danger || '#6c757d',
                            },
                          ]}
                        >
                          {row?.is_active ? 'Selected' : 'Not Selected'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardDetailViewRow}>
                      <Text style={styles.labelText}>Product Type:</Text>
                      <Text style={styles.valueText}>{row?.type ?? ''}</Text>
                    </View>

                    <View style={styles.cardDetailViewRow}>
                      <Text style={styles.labelText}>Product Category:</Text>
                      <Text style={styles.valueText}>
                        {row?.categ_id?.name ?? ''}
                      </Text>
                    </View>

                    <View style={styles.cardDetailViewRow}>
                      <Text style={styles.labelText}>Price:</Text>
                      <Text style={[styles.valueText, styles.priceText]}>
                        ${row?.price ?? '0.00'}
                      </Text>
                    </View>
                  </View>
                </Card>
              ),
            )}
          </ScrollView>
        ): <View>

        <View style={style.show_data_in_row}>
          <Text style={[style.bold_font, { marginTop: '5%' }]}>
            From Company
          </Text>
          <View style={{ width: '60%' }}>
            <Dropdowncomp
              data={FromCompanyOptions}
              value={fromCompany}
              onChange={value => {
                handleDropdownChange('from_company_id', value),
                  hadlegettofields(value.value);
                setSelectedfromCompany(value);
              }}
              placeholder="Select From Company"
            />
          </View>
        </View>

        {/* To Company */}
        <View style={style.show_data_in_row}>
          <Text style={[style.bold_font, { marginTop: '5%' }]}>
            To Company
          </Text>
          <View style={{ width: '60%' }}>
            <Dropdowncomp
              data={toCompanyOptions}
              value={toCompany}
              onChange={value =>
                handleDropdownChange('to_company_id', value)
              }
              placeholder="Select To Company"
            />
          </View>
        </View>

        {/* Applied On */}
        <View style={style.show_data_in_row}>
          <Text style={[style.bold_font, { marginTop: '5%' }]}>
            Applied On
          </Text>
          <View style={{ width: '60%' }}>
            <Dropdowncomp
              data={AppliedOnOptions}
              value={appliedOn}
              onChange={async item => {
                handleDropdownChange('transfer_applied_on', item.value);
                setSelectedValue(item);
                await handlesubmit({ transfer_applied_on: item.value });
              }}
              placeholder="Select Applied On"
            />
          </View>
        </View>
        <ButtonCompo
          title={selectedValue?.label || 'Select Option'}
          onPress={() => setIsOpenModal(true)}
        />
           </View>}

        {selectedOptions && (
          <View style={styles.selectedOptionsBox}>
            <Text style={styles.selectedOptionsText}>
              {selectedOptions.name}
            </Text>
          </View>
        )}

        <SelectedModal
          isVisible={isOpneModal}
          onClose={() => setIsOpenModal(false)}
          item={selectedValue}
          id={transferData?.id}
          setselectedOptions={setselectedOptions}
        />
        <Loader visible={fetchingData} />
        <Loader visible={isLoding} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataTransferModule;

const styles = StyleSheet.create({
  header__wrapper: {
    width: '90%',
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  header__text: {
    fontSize: style.FontSize || 20,
    color: style.blueColor || '#007AFF',
    fontWeight: '600',
  },
  header_btn_wrapper: {
    width: '95%',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
  },
  header__btn: {
    paddingVertical: 4,
    marginHorizontal: 6,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    borderRadius: 25,
    backgroundColor: style.blueColor || '#007AFF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  header__btn__text: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  cardViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  labelInput: {
    fontWeight: '700',
    fontSize: 17,
  },
  cardDetailView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  selectedOptionsBox: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  selectedOptionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565c0',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Enhanced card styles
  cardContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDetailViewColumn: {
    flexDirection: 'column',
  },
  cardDetailViewRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDetailViewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productNameText: {
    width: '55%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  // Checkbox styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'flex-end',
  },
  checkbox: {
    marginRight: 8,
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Text styles
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    width: '45%',
  },
  valueText: {
    fontSize: 16,
    color: '#333',
    width: '50%',
    textAlign: 'right',
  },
  priceText: {
    fontWeight: '700',
    color: '#27ae60',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#8080806e',
    padding: 2,
    borderRadius: 4,
    fontSize: 17,
    height: 40,
    width: 200,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.whiteColor || '#FFFFFF',
  },
});
