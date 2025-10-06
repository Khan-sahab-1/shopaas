import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputCompo from '../../../components/TextInputCompo';
import Headercomp from '../../../components/Headercomp';
import ButtonCompo from '../../../components/ButtonCompo';
import ResetPassModal from '../../../constant/ResetPassModal';
import { useSelector } from 'react-redux';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';

const Profile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [isModalVisible, setisModalVisible] = useState(false);
  const [isLoading, setisLoadin] = useState(false);
  const userinfo = useSelector(state => state.auth);
  const [user, setuser] = useState([]);
  console.log('User Info:', user);
  const fetchuserinfo = async () => {
    try {
      setisLoadin(true);
      const responce = await makeApiCall(API_URLS.getContactUsData, 'POST', {
        jsonrpc: '2.0',
        params: {
          type: 'address',
          method: 'GET',
        },
      });
      console.log(responce, 'USER');
      setuser(responce?.result?.form_options);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoadin(false);
    }
  };
  useEffect(() => {
    fetchuserinfo();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <SafeAreaView style={styles.container}>
        <Headercomp
          left={true}
          onPress={() => navigation.goBack()}
          title={'My Profile'}
          // centerIcon={true}
          // centerIconName="home"
          // onCenterIconPress={() => console.log('Home')}
          // variant="elevated"
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitials}>
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()
                    : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.editImageButton}>
                <Text style={styles.editImageText}>✎</Text>
              </TouchableOpacity>
            </View>
            {/* <Text style={styles.welcomeText}>Welcome Back!</Text> */}
            <Text style={styles.subtitle}>Manage your profile information</Text>
          </View>

          {/* Profile Form */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInputCompo
                  style={styles.textInput}
                  value={user?.name || null}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#a0a0a0"
                  editable={false}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address/User Id</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInputCompo
                  style={styles.textInput}
                  value={user?.email || null}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={false}
                />
              </View>
            </View>

            {/* Contact Number Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInputCompo
                  style={styles.textInput}
                  value={user?.phone}
                  onChangeText={setContact}
                  placeholder="Enter your contact number"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="phone-pad"
                  editable={false}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {/* <ButtonCompo
                title="💾 Save Changes"
                style={styles.saveButton}
                // onPress={() => setisModalVisible(true)}
              /> */}

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => setisModalVisible(true)}
              >
                <Text style={styles.resetButtonText}>🔐 Reset Password</Text>
              </TouchableOpacity>
            </View>

            {/* Additional Options */}
            {/* <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.optionItem}>
                <Text style={styles.optionIcon}>⚙️</Text>
                <Text style={styles.optionText}>Account Settings</Text>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem}>
                <Text style={styles.optionIcon}>🔔</Text>
                <Text style={styles.optionText}>Notifications</Text>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem}>
                <Text style={styles.optionIcon}>🛡️</Text>
                <Text style={styles.optionText}>Privacy & Security</Text>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
            </View> */}
            <ResetPassModal
              isVisible={isModalVisible}
              onclose={() => setisModalVisible(false)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  profileInitials: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editImageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    opacity: 0.7,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 30,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  optionArrow: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
});
