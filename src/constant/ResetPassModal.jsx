import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import TextInputCompo from '../components/TextInputCompo';
import ButtonCompo from '../components/ButtonCompo';
import { useSelector } from 'react-redux';
import makeApiCall from '../utils/apiHelper';
import { API_URLS } from '../utils/apiurls';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MessageShow from './MessageShow';

const ResetPassModal = ({ isVisible, onclose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newscreen, setNewScreen] = useState(false);
  const [isLoding,setIsloding]=useState(false)

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email.toLowerCase());
  };

  const handleGetOtp = () => {
    if (!email) {
      setError('Email is required');
    } else {
      //   setError('');
      // Call API or submit logic
      console.log('Send OTP to:', email);
      handleApiHandler();
    }
  };

  const handleApiHandler = async () => {
    try {
      setIsloding(true)
      const responce = await makeApiCall(API_URLS.getOtp, 'POST', {
        jsonrpc: '2.0',
        params: {
          email: email,
        },
      });
      console.log(responce, 'OTP sent successfully');
      if (!responce.result.errorMessage && !responce.error) {
        setNewScreen(true);
      } else {
        setError(responce.result.errorMessage || 'Failed to send OTP');
      }
    } catch (error) {
      console.log(error);
    } finally{
      setIsloding(false)
    }
  };
  const handleResetPassword = async () => {
    console.log(otp, newPassword, confirmPassword, 'Resetting password...');
    if (!otp || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      const params={
        email: email,
        otp: otp,
        passwd:newPassword,
        confirmPasswd:confirmPassword,
        id: null,
        token:""
      }
      console.log(params,'Params')
      const response = await makeApiCall(API_URLS.resetPassword, 'POST', {
        jsonrpc: '2.0',
        params: params,
      });
      console.log(response, 'Password reset successfully');
      if(response?.result?.message=== 'Password Updated Successfully'){
        MessageShow.success('success',response?.result?.message)
        setOtp('')
        setEmail('')
        setNewPassword('')
        setConfirmPassword('')
        setNewScreen(false)
        onclose()
        
      }
      if(response?.result?.errorMessage){
        MessageShow.error('error',response?.result?.errorMessage)
      }
      // onclose();
    } catch (error) {
      console.log(error);
      setError('Failed to reset password');
    }
  };

  return (
    <>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onclose}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          //   onPress={onclose}
          activeOpacity={1}
        >
          <View style={{ ...styles.whitebox }}>
            {!newscreen ? (
              <View>
                <View style={styles.headerRow}>
                  <Text style={styles.title}>Reset Password</Text>
                  <TouchableOpacity onPress={onclose} style={styles.iconButton}>
                    <Ionicons name="close" size={35} color="black" />
                  </TouchableOpacity>
                </View>
                <Text style={{ marginVertical: 10 }}>
                  Enter you email and we'll send a link on your email to reset
                  you password
                </Text>
                <TextInputCompo
                  placeholder="Enter your email"
                  onChangeText={text => {
                    setEmail(text);
                    setError('');
                  }}
                  value={email}
                  style={styles.input}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <ButtonCompo title="Get OTP" onPress={handleGetOtp} />

                <Text>
                  Unable to reset your password?{' '}
                  <Text style={{ fontWeight: 'bold', paddingVertical: 10 }}>
                    Contact Support
                  </Text>
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  Reset Password
                </Text>
                <TextInputCompo
                  placeholder="Enter OTP"
                  onChangeText={text => {
                    setOtp(text);
                    //   setError('');
                  }}
                  value={otp}
                  style={styles.input}
                />
                <TextInputCompo
                  placeholder="Enter your new Passwoerd"
                  onChangeText={text => {
                    setNewPassword(text);
                  }}
                  value={newPassword}
                  style={styles.input}
                />
                <TextInputCompo
                  placeholder="Enter your confirm Passwoerd"
                  onChangeText={text => {
                    setConfirmPassword(text);
                  }}
                  value={confirmPassword}
                  style={styles.input}
                />
                <View>
                  <ButtonCompo
                    title="Reset Password"
                    onPress={() => {
                      // Handle reset password logic
                      console.log('Resetting password...');
                      handleResetPassword();
                      //   onclose();
                    }}
                  />
                  <ButtonCompo
                    title="Cancel"
                    onPress={() => setNewScreen(false)}
                    style={{ backgroundColor: 'red', marginTop: 10 }}
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ResetPassModal;

const styles = StyleSheet.create({
  whitebox: {
    width: '100%',
    backgroundColor: 'white',
    // borderRadius: 10,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  iconButton: {
    marginRight: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
