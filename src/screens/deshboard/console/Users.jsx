import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../styles/colors';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import Loader from '../../../components/Loader';
import { useSelector } from 'react-redux';
import navigationString from '../../../navigation/navigationString';
import { SafeAreaView } from 'react-native-safe-area-context';

const Users = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
 

  const handleFetchUserData = async () => {
    try {
      setLoading(true);
      const res = await makeApiCall(
        API_URLS.getUsersTreeData,
        'POST',
        {
          jsonrpc: '2.0',
          params: {
            userId: null,
            method: 'GET',
          },
        }
      );
      console.log('✅ User:', res);
      
      if (res?.result?.form_options?.users_data) {
        setUsersData(res.result.form_options.users_data);
        setFilteredUsers(res.result.form_options.users_data);
      } else {
        Alert.alert('Error', 'Failed to fetch users data');
      }
    } catch (error) {
      console.log('❌ Error:', error.message || error);
      Alert.alert('Error', 'Something went wrong while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleFetchUserData();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredUsers(usersData);
    } else {
      const filtered = usersData.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()) ||
        user.login.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleUserPress = (user) => {
    Alert.alert(
      'User Details',
      `Name: ${user.name}\nEmail: ${user.login}\nLanguage: ${user.lang}\nLast Login: ${user.login_date || 'Never'}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never logged in';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (loginDate) => {
    if (!loginDate) return COLORS.grayColor || '#8E8E93';
    
    const lastLogin = new Date(loginDate);
    const now = new Date();
    const daysDiff = (now - lastLogin) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 1) return COLORS.successColor || '#34C759'; // Online recently
    if (daysDiff <= 7) return COLORS.warningColor || '#FF9500'; // Active this week
    return COLORS.grayColor || '#8E8E93'; // Inactive
  };

  const getStatusText = (loginDate) => {
    if (!loginDate) return 'Never Active';
    
    const lastLogin = new Date(loginDate);
    const now = new Date();
    const daysDiff = (now - lastLogin) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 1) return 'Recently Active';
    if (daysDiff <= 7) return 'Active This Week';
    return 'Inactive';
  };

  const renderUserItem = ({ item }) => {
    const statusColor = getStatusColor(item.login_date);
    const statusText = getStatusText(item.login_date);

    return (
      <TouchableOpacity 
        style={styles.userCard}
        onPress={() => {handleUserPress(item)
         navigation.navigate(navigationString.EDITUSERCONSOLE,{item})

        }} 
      >
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: statusColor }]}>
              <Text style={styles.avatarText}>
                {item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.login}</Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.userDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Language:</Text>
            <Text style={styles.detailValue}>
              {item.lang === 'en_US' ? 'English (US)' : item.lang}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Login:</Text>
            <Text style={styles.detailValue}>
              {formatDate(item.login_date)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>User ID:</Text>
            <Text style={styles.detailValue}>#{item.id}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>No Users Found</Text>
      <Text style={styles.emptyText}>
        {searchText 
          ? 'No users match your search criteria' 
          : 'No users available at the moment'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.totalUsersText}>
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
      </Text>
    </View>
  );

  useEffect(() => {
    handleFetchUserData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <Headercomp
        title={'Users'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor={COLORS.grayColor || '#8E8E93'}
          />
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryColor || '#007AFF'} />
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={filteredUsers.length > 0 ? renderHeader : null}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primaryColor || '#007AFF']}
              />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
          <TouchableOpacity style={{...styles.buttonCreate}}
            onPress={()=>navigation.navigate(navigationString.CREATEUSERCONSOLE)}>
              <Text style={{...styles.btntext}}>Create</Text>
            </TouchableOpacity>
      </View>
      
      <Loader visible={loading && !refreshing} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor || '#F8F9FA',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: COLORS.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalUsersText: {
    fontSize: 14,
    color: COLORS.grayColor || '#8E8E93',
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryColor || '#007AFF',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.whiteColor || '#FFFFFF',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: COLORS.whiteColor || '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textColor || '#1C1C1E',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.grayColor || '#8E8E93',
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.grayColor || '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textColor || '#1C1C1E',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.grayColor || '#8E8E93',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textColor || '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.grayColor || '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonCreate:{
    position:'absolute',
    backgroundColor:COLORS.blueColor,
    width:100,
    height:50,
    right:20,
    bottom:20,
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center'
  },
  btntext:{
    fontWeight:'600',
    fontSize:16,
    color:COLORS.whiteColor
  },
});
export default Users