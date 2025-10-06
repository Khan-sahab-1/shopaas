import {
 
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import { COLORS } from '../../../../../styles/colors';
import Headercomp from '../../../../../components/Headercomp';
import DateTimePickerComp from '../../../../../components/DateTimePickerComp';
import moment from 'moment';
import TextInputCompo from '../../../../../components/TextInputCompo';
import EditableTable from '../../../../../components/EditableTable';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateOrder = ({ navigation, }) => {

  const [isLoding, setIsloading] = useState(false);
  const [deleveryMethod, setdeleveryMethod] = useState([]);
  const [selecetedDeveryMethod, setselecteddeliveryMethod] = useState(null);
  const [deleveryorderType, setDeleveryOrderType] = useState([]);
  const [selecetdOrderType, setseleceOrderType] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setselectedCustomer] = useState(null);
  const [paymentterm, setPaymentterm] = useState([]);
  const [selectedpaymentterm, setselectedpaymentterm] = useState(null);
  const [paymentstatus, setpaymentstatus] = useState([]);
  const [selectedpaymentstatus, setselectedpaymentStatus] = useState(null);
  const [paymentMode, setpaymentmode] = useState([]);
  const [selecetdpaymentMode, setselecetedpaymentMode] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [resturnammount, setreturnamount] = useState('');
  const [pressOrderLine, setpressOrderLine] = useState(false);
  const [selectedTab, setSelectedTab] = useState('LINE');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handlePressOrderLine = () => {
    setpressOrderLine(!pressOrderLine);
  };
  const fetchcreateorder = async () => {
    try {
      setIsloading(true);
      const responce = await makeApiCall(API_URLS.fetchcreate_order, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      console.log(responce, 'OrderFetch');
      const formatatted = Object.entries(responce?.result?.carrier_ids).map(
        ([key, value]) => ({
          label: value,
          value: key,
        }),
      );
      setdeleveryMethod(formatatted);
      const formattedOrderType = Object.entries(
        responce?.result?.sale_order_type,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setDeleveryOrderType(formattedOrderType);

      const formatecustomer = Object.entries(responce?.result?.partner_ids).map(
        ([key, value]) => ({
          label: value,
          value: key,
        }),
      );
      setCustomers(formatecustomer);
      const formatePaymentTerm = Object.entries(
        responce?.result?.payment_term_ids,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setPaymentterm(formatePaymentTerm);
      const formatePaymentStatus = Object.entries(
        responce?.result?.payment_status,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setpaymentstatus(formatePaymentStatus);
      const formattedPaymentMode = Object.entries(
        responce?.result?.payment_mode,
      ).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      setpaymentmode(formattedPaymentMode);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    fetchcreateorder();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Create Order'}
        left={true}
        n
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
        <View style={{ ...styles.container }}>
          <Text style={{ ...styles.normalText }}>Order Type</Text>
          <Dropdowncomp
            data={deleveryorderType}
            onChange={item => {
              setseleceOrderType(item.value);
            }}
          />
          <Text style={{ ...styles.normalText }}>Customer</Text>
          <Dropdowncomp
            data={customers}
            search={true}
            value={selectedCustomer}
            onChange={item => {
              setselectedCustomer(item.value);
            }}
          />
          <Text style={{ ...styles.normalText }}>Invoice Address</Text>
          <Dropdowncomp
            data={customers}
            value={selectedCustomer}
            search={true}
            onChange={item => {
              setselectedCustomer(item.value);
            }}
          />
          <Text style={{ ...styles.normalText }}>Delivery Address</Text>
          <Dropdowncomp
            data={customers}
            search={true}
            value={selectedCustomer}
            onChange={item => {
              setselectedCustomer(item.value);
            }}
          />
          <Text style={{ ...styles.normalText }}>Expiration</Text>
          <TouchableOpacity
            style={{ ...styles.inputBox }}
            onPress={() => setPickerVisible(true)}
          >
            <Text style={{ ...styles.placeholder }}>
              {' '}
              {selectedDate
                ? moment(selectedDate).format('DD-MM-YYYY')
                : 'Select date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerComp
            isVisible={isPickerVisible}
            mode="date"
            onCancel={() => setPickerVisible(false)}
            onConfirm={date => {
              setSelectedDate(date);
              setPickerVisible(false);
            }}
            minimumDate={new Date()} // Optional
          />
          <Text style={{ ...styles.normalText }}>Payment Terms</Text>
          <Dropdowncomp
            data={paymentterm}
            onChange={item => {
              setselectedpaymentterm(item.value);
            }}
          />
          <Text style={{ ...styles.normalText }}>Return Amount</Text>
          <TextInputCompo
            placeholder="Return Amount"
            value={resturnammount}
            onChangeText={item => setreturnamount(item)}
            style={styles.inputBox}
          />
          <Text style={{ ...styles.normalText }}>Payment Status</Text>
          <Dropdowncomp
            data={paymentstatus}
            onChange={item => {
              setselectedpaymentStatus(item.value);
            }}
          />
          <Text style={{ ...styles.normalText }}>Payment Mode</Text>
          <Dropdowncomp
            data={paymentMode}
            onChange={item => {
              setselecetedpaymentMode(item.value);
            }}
          />
          <Text style={{ ...styles.normalText }}>Delivery Method</Text>

          <Dropdowncomp
            data={deleveryMethod}
            onChange={item => {
              setselecteddeliveryMethod(item.value);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedTab('LINE')}
            >
              <Text style={styles.buttonText}>ORDER LINE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedTab('INFO')}
            >
              <Text style={styles.buttonText}>OTHER INFO</Text>
            </TouchableOpacity>
          </View>
        </View>
        {selectedTab === 'LINE' && <EditableTable />}
        {selectedTab === 'INFO' && (
          <View style={{ padding: 10 }}>
            <Text style={{ ...styles.normalText }}>Sales</Text>
            <TextInputCompo
              placeholder="Salespersion"
              style={{ ...styles.inputBox }}
              editable={false}
            />
             <Text style={{ ...styles.normalText }}>Sales team</Text>
            <TextInputCompo
              placeholder="Sales Team"
              style={{ ...styles.inputBox }}
              editable={false}
            />
             <Text style={{ ...styles.normalText }}>Companey</Text>
            <TextInputCompo
              placeholder="Companey"
              style={{ ...styles.inputBox }}
              editable={false}
            />
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
                editable={false}
              />
              <Text>Online Signature</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
              <Text>Online Payment</Text>
            </View>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TextInputCompo
              placeholder="Patment Ref"
              style={{ ...styles.inputBox,width:150}}
              editable={false}
            />
            <TextInputCompo
              placeholder="Customer Ref"
              style={{ ...styles.inputBox,width:150 }}
              editable={false}
            />
            </View>
            <Text style={{ ...styles.normalText }}>Invoicing</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TextInputCompo
              placeholder="Fiscal Position"
              style={{ ...styles.inputBox,width:150}}
              editable={false}
            />
            <TextInputCompo
              placeholder="Jurnal"
              style={{ ...styles.inputBox,width:150 }}
              editable={false}
            />
            </View>
            <Text style={{ ...styles.normalText }}>Delivery</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TextInputCompo
              placeholder="Fiscal Position"
              style={{ ...styles.inputBox,width:150}}
              editable={false}
            />
            <TextInputCompo
              placeholder="Jurnal"
              style={{ ...styles.inputBox,width:150 }}
              editable={false}
            />
            </View>
            <TextInputCompo
              placeholder="Jurnal"
              style={{ ...styles.inputBox,width:150 ,marginTop:10}}
              editable={false}
            />
             <Text style={{ ...styles.normalText }}>Delivery</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TextInputCompo
              placeholder="Fiscal Position"
              style={{ ...styles.inputBox,width:150}}
              editable={false}
            />
            <TextInputCompo
              placeholder="Jurnal"
              style={{ ...styles.inputBox,width:150 }}
              editable={false}
            />
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
            <TextInputCompo
              placeholder="Fiscal Position"
              style={{ ...styles.inputBox,width:150}}
              editable={false}
            />
            <TextInputCompo
              placeholder="Jurnal"
              style={{ ...styles.inputBox,width:150 }}
              editable={false}
            />
            </View>
          </View>
        )}
      
        <ButtonCompo title='Save' style={{...styles.buttom}}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateOrder;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  normalText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
    paddingTop: 8,
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
    // marginVertical: 10,
  },
  placeholder: {
    fontSize: 16,
    color: COLORS.blackOpacity90,
  },
  button: {
    padding: 15,
    backgroundColor: COLORS.blueColor,
    borderRadius: 15,
  },
  buttonText: {
    color: COLORS.whiteColor,
    fontWeight: '800',
    fontSize: 16,
  },
  buttom:{
    marginBottom:20,
    width:'90%',
    alignSelf:'center'
  }
});
