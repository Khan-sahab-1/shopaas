import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Headercomp from '../../../components/Headercomp';
import { COLORS } from '../../../styles/colors';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import MyOrderfilterModal from '../../../constant/MyOrderfilterModal';
import Loader from '../../../components/Loader';
import { useDispatch } from 'react-redux';
import { fetchCartData } from '../../../redux/reducers/fetchCartData';
import TextInputCompo from '../../../components/TextInputCompo';
import ReturnOrderModal from './MyOreder/ReturnOrderModal';
import RatingModal from './MyOreder/Rating';
import navigationString from '../../../navigation/navigationString';
import MessageShow from '../../../constant/MessageShow';

const MyOrder = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opneMoreModal, setOpneMoreModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [openRetuenModal,srtOpenreturnModal]=useState(false)
  const [returnItemOrder,setReturnOrderItem]=useState([])
  const [openRatinModal,setopenRatingModal]=useState(false)
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch=useDispatch()

  const fetchUserOrder = async () => {
    console.log('first', selectedFilter);
    try {
      setLoading(true);
      const response = await makeApiCall(API_URLS.getUserOrders, 'POST', {
        jsonrpc: '2.0',
        params: { sortBy: selectedFilter ? selectedFilter : null },
      });

      console.log('OrderResponse', response);

      const result = response?.result;

      if (result?.message === 'success' && result?.statusCode === 200) {
        const orderList = Object.values(result?.data || {});
        setOrders(orderList);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlereorder = async (order_id, partner_id) => {
    console.log(order_id, partner_id,'IDESS')
    try {
      setLoading(true);
      const response = await makeApiCall(API_URLS.reOrder, 'POST', {
        jsonrpc: '2.0',
        params: { order_id: order_id, partner_id: partner_id }
      });
      
      console.log(response, 'Reorder Response');
      
      if (response?.result?.statusCode === 200) {
        Alert.alert('Success', 'Order has been reordered successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Refresh orders list or navigate to new order
              dispatch(fetchCartData())
              fetchUserOrder();
            }
          }
        ]);
      } else {
        Alert.alert('Error', response?.result?.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlecancel = async (order_id, partner_id) => {
    // console.log(order_id, partner_id,'IDSS')

    try {
      setLoading(true);
      const response = await makeApiCall(API_URLS.cancelOrder, 'POST', {
        jsonrpc: '2.0',
        params: { order_id: order_id, partner_id: partner_id }
      });
      
      // console.log(response, 'Cancel Response');
      
      if (response?.result?.message === 'success') {
        Alert.alert('Success', 'Order has been cancelled successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Refresh orders list
              fetchUserOrder();
            }
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to cancel order. Please try again.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = (item) => {
    // console.log(item,'Action Item')
    if (item.state === 'Draft') {
      // Show confirmation dialog for cancel
      Alert.alert(
        'Cancel Order',
        `Are you sure you want to cancel order ${item.reference}?`,
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => handlecancel(item.id, item.partner?.id),
          },
        ]
      );
    } else if (!item.reference?.startsWith('RE')) {
      // Show confirmation dialog for reorder
      Alert.alert(
        'Reorder',
        `Are you sure you want to reorder from ${item.company?.name}?`,
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => handlereorder(item.id, item.partner?.id),
          },
        ]
      );
    }
    
  };
  const fetchgetReturnItem = async (order_id, partner_id) => {
    console.log(order_id, partner_id);
    try {
      setLoading(true);
      const response = await makeApiCall(API_URLS.getReturnCart, 'POST', {
        jsonrpc: '2.0',
        params: {
          sale_order_id: [String(order_id)], // must be "sale_order_id" and inside array
          partner_id: [String(partner_id)],  // must also be array
        },
      });
      console.log(response, 'Return Response');
      if(response?.result?.message==='success'){
        setReturnOrderItem(response?.result)
        srtOpenreturnModal(true)

      }
      else{
        Alert.alert('Return Order',response?.result?.message)
        MessageShow.error('Return Order',response?.result?.message)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserOrder();
  }, [selectedFilter]);

  const renderOrderItem = ({ item }) => {
    const showActionButton = item.state === 'Draft' || !item.reference?.startsWith('RE');
    
    return (
      <TouchableOpacity style={styles.orderItem} 
      disabled={!item?.reportUrl} 
      onPress={()=>
        navigation.navigate(navigationString.PREVIEVORDER,{item})
        
      }>
        {/* Company Type */}
        <Text style={styles.companyType}>{item?.company?.company_type}</Text>

        {/* Company Name and Date */}
        <View style={styles.rowBetween}>
          <Text style={styles.companyName}>{item?.company?.name}</Text>
          <Text style={styles.date}>{item?.date_order}</Text>
        </View>

        {/* Reference and Amount */}
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

        <Text style={styles.label}>
          Order Ref: <Text style={styles.value}>{item?.reference}</Text>
        </Text>
        {item.state === 'Delivered' && item.star_rating_count > 0 && (
  <Text>{item.star_rating_count}⭐</Text>
)}
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

        <Text style={styles.label}>
          Amount: <Text style={styles.value}>₹{item?.amount_total}</Text>
        </Text>
       
       {item.state === 'Delivered'&& 
       <>
       {/* <Text>hi</Text> */}
       <TouchableOpacity
            style={[
              styles.actionBtn, 
              { backgroundColor: COLORS.blueColor, marginLeft: showActionButton ? 0 : 'auto' }
            ]}
          onPress={()=>{setopenRatingModal(true)
            setSelectedItem(item)
          }}>

            <Text style={[styles.actionText, { color: COLORS.whiteColor
             }]}>
              Rating
            </Text>
          </TouchableOpacity>
          </>
          }
        </View>

        {/* Actions */}
        <View style={styles.rowBetween}>
          {showActionButton && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                item.state === 'Draft' && { backgroundColor: '#DC3545' },
              ]}
              onPress={() => handleOrderAction(item)}
            >
              <Text
                style={{
                  ...styles.actionText,
                  ...(item.state === 'Draft' && { color: COLORS.whiteColor }),
                }}
              >
                {item.state === 'Draft' ? 'Cancel' : 'Reorder'}
              </Text>
            </TouchableOpacity>
          )}
          {item?.show_return_btn&&<TouchableOpacity
            style={[
              styles.actionBtn, 
              { backgroundColor: COLORS.green, marginLeft: showActionButton ? 0 : 'auto' }
            ]}
          onPress={()=>{
            // srtOpenreturnModal(true)
            fetchgetReturnItem(item.id, item.partner?.id)
            // handleOrderAction(item)
          }}>
            <Text style={[styles.actionText, { color: COLORS.whiteColor }]}>
              Return
            </Text>
          </TouchableOpacity>}

          <TouchableOpacity
            style={[
              styles.actionBtn, 
              { backgroundColor: '#F8D7DA', marginLeft: showActionButton ? 0 : 'auto' }
            ]}
          >
            <Text style={[styles.actionText, { color: '#721C24' }]}>
              {item?.state}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp
        title="My Orders"
        left={true}
        onPress={() => navigation.goBack()}
        right={true}
        onPressright={() => setOpneMoreModal(true)}
      />
     {/* <TextInputCompo placeholder='search....' style={{...styles.input}}/> */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primaryColor}
          style={{ marginTop: 50 }}
        />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="receipt-long" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No orders available</Text>
        </View>
      ) : (
        <FlatList
          data={orders.slice().reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}

      <MyOrderfilterModal
        isvisible={opneMoreModal}
        onclose={() => setOpneMoreModal(false)}
        onselect={item => {
          // console.log('Selected Filter:', item);
          setSelectedFilter(item.value);
        }}
      />
      <ReturnOrderModal
      isVisible={openRetuenModal}
      onclose={()=>srtOpenreturnModal(false)}
      item={returnItemOrder}/>
      <RatingModal
      visible={openRatinModal}
      onClose={()=>{setopenRatingModal(false)
        fetchUserOrder();
      }}
      item={selectedItem}/>
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteColor,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  companyType: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  actionBtn: {
    backgroundColor: '#E6F0FF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#0056B3',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
  },
  input:{
    borderRadius:10,
    borderWidth:1,
    width:'90%',
    alignSelf:'center',
    padding:10,
    height:50,
  }
});