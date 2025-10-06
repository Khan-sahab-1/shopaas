import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import {API_URLS} from '../../../utils/apiurls';
import TextInputCompo from '../../../components/TextInputCompo';
import ButtonCompo from '../../../components/ButtonCompo';
import Loader from '../../../components/Loader';
import MessageShow from '../../../constant/MessageShow';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContectUs = ({navigation}) => {
  // 🔹 States for inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoding,setIsloding]=useState(false)

  const handlecontectUs = async () => {
    try {
      const res = await makeApiCall(API_URLS.getContactUsData, 'POST', {
        jsonrpc: '2.0',
        params: {type: null, method: 'GET'},
      });
      console.log(res, 'Contect Us');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlecontectUs();
  }, []);

  // 🔹 Handle submit button
  const handleSend = async () => {
    if (!name || !phone || !email || !subject || !question) {
    //   console.log('Please fill all required fields');
      MessageShow.error('Please fill all required fields')
      return;
    }
    try {
      const payload = {
        name,
        phone,
        email,
        yourCompanyName: company,
        subject,
        QA:question,
      };
      console.log('Contact Us Payload:', payload);
      setIsloding(true)
      const res = await makeApiCall(API_URLS.SavecontactUS, 'POST', {
        jsonrpc:'2.0',
        params:payload,
      });
      console.log(res)
      if(res?.result?.message==='success'){
        MessageShow.success('success',res?.result?.message)
        Alert.alert('Thanks','We will get back to you shortly')
        setName('')
        setPhone('')
        setCompany('')
        setEmail('')
        setSubject('')
        setQuestion('')
      }
    } catch (error) {
      console.log(error);
    } finally{
        setIsloding(false)
    }
    // 👉 You can call API here with payload
  };



  const ContactDetails = () => {
    return (
      <View style={{paddingHorizontal:10,borderBottomWidth:1,marginVertical:10}}>
        <Text style={styles.heading}>Details</Text>
  
        {/* Company Name */}
        <View style={styles.row}>
          <Icon name="business" size={20} color={COLORS.blackColor} />
          <Text style={styles.text}>Chadha Industries Pvt Ltd</Text>
        </View>
  
        {/* Email */}
        <View style={styles.row}>
          <Icon name="email" size={20} color={COLORS.blackColor} />
          <Text style={styles.text}>info@arkefilters.com</Text>
        </View>
        <View style={styles.row}>
  <Icon name="phone" size={20} color={COLORS.blackColor} />
  <Text style={styles.text}>+91-11-4848 3700</Text>
</View>
  
        {/* Address */}
        <View style={styles.row}>
          <Icon name="location-on" size={20} color={COLORS.blackColor} />
          <Text style={styles.text}>
            38, DLF Industrial Area Kirti Nagar, Najafgarh Road New Delhi - 110015
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title={'Contact us'}
        left={true}
        onPress={() => navigation.goBack()}
      />
       
       <ContactDetails/>
      
      {/* Row 1 */}
      <Text style={{...styles.heading,paddingHorizontal:10}}>Contact Us</Text>
      <Text style={{...styles.heading,paddingHorizontal:10,fontSize:12}}>Contact us about anything related to our company or services. We'll do our best to get back to you as soon as possible.</Text>
      <View style={{flexDirection: 'row', gap: 10, paddingHorizontal: 10}}>
        
        <View style={{flex: 1}}>
          <Text style={styles.lable}>Your Name:</Text>
          <TextInputCompo
            style={styles.inputBox}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.lable}>Phone No:</Text>
          <TextInputCompo
            style={styles.inputBox}
            placeholder="Phone No"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
      </View>

      {/* Row 2 */}
      <View style={{flexDirection: 'row', gap: 10, paddingHorizontal: 10}}>
        <View style={{flex: 1}}>
          <Text style={styles.lable}>Your Email:</Text>
          <TextInputCompo
            style={styles.inputBox}
            placeholder="Your Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.lable}>Your Company:</Text>
          <TextInputCompo
            style={styles.inputBox}
            placeholder="Your Company"
            value={company}
            onChangeText={setCompany}
          />
        </View>
      </View>

      {/* Row 3 */}
      <View style={{flexDirection: 'row', gap: 10, paddingHorizontal: 10}}>
        <View style={{flex: 1}}>
          <Text style={styles.lable}>Subject:</Text>
          <TextInputCompo
            style={styles.inputBox}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
        </View>
      </View>

      {/* Row 4 - Question */}
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <Text style={styles.lable}>Your Question:</Text>
        <TextInputCompo
          style={{...styles.inputBox, height: 100}}
          placeholder="Your Question"
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <ButtonCompo title="Send" onPress={handleSend} />
        
      </View>
      <Loader visible={isLoding}/>
    </SafeAreaView>
  );
};

export default ContectUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  lable: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.blackColor,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.blackColor,
    flex: 1,
    flexWrap: 'wrap', // allows multi-line for long address
  },
});
