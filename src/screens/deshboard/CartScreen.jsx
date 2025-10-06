import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCartData} from '../../redux/reducers/fetchCartData';
import {COLORS} from '../../styles/colors';
import Headercomp from '../../components/Headercomp';
import CouponModal from '../../constant/CoupenModal';
import {API_URLS, BASE_URL} from '../../utils/apiurls';
import makeApiCall from '../../utils/apiHelper';
import Loader from '../../components/Loader';
import navigationString from '../../navigation/navigationString';
import ButtonCompo from '../../components/ButtonCompo';
import ScreenshotModal from './screenshot/Screenshot';
import CheckBox from '@react-native-community/checkbox';
import DeliveryOptions from './Userinfoscreen/DeliveryOptions';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import MessageShow from '../../constant/MessageShow';
import TextInputCompo from '../../components/TextInputCompo';
import axios from 'axios';

const CartScreen = ({navigation, route}) => {
  console.log(route, 'Route');
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.cartData);
  const totalItems = useSelector(state => state.cart.totalItems);
  const [openCoupenModal, setOpencoupenModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setisloading] = useState(false);
  const [openModal, setOpneModal] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [imageslist, setImageslist] = useState([]);
  const [description, setDescription] = useState('');
  console.log(imageslist, 'LIST');
  console.log(cart, 'Cart Data');
  const handleImagepicker = () => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: true, 
      mediaType: 'photo',
      includeBase64: true, 
      compressImageQuality: 0.8, 
    })
      .then(images => {
        console.log(images); // Array of selected images
        setImageslist(images); // Save to state
      })
      .catch(error => {
        console.log('ImagePicker Error:', error);
      });
  };

  const hanldeCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.8,
    })
      .then(image => {
        console.log(image);
        setImageslist(prev => [...prev, image]);
      })
      .catch(error => {
        console.log('Camera Error:', error);
      });
  };

  const total =
    Number(cart?.subtotal) +
    Number(cart?.tax) +
    Number(cart?.discount) +
    Number(cart?.delivery);
  console.log(total, 'Total');

  const cartItem = Object.values(cart?.sale_order_lines);
  // console.log(cartItem,'Item')

  useEffect(() => {
    dispatch(fetchCartData());
  }, []);
  useEffect(() => {
    if (cart) {
      // If redeem.show is true, check the box, otherwise leave unchecked
      if (cart?.redeem?.show === false) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
    }
  }, [cart]);

  const handleCouponPress = () => {
    setOpencoupenModal(true);
  };

  // const updateQuantity = (itemId, action) => {

  // };
  const updateQuantity = async (item, newQty) => {
    console.log(item, 'Item');

    try {
      setisloading(true);
      const response = await makeApiCall(API_URLS.addToCart, 'POST', {
        jsonrpc: '2.0',
        params: {
          product_id: item.product_id,
          product_template_id: item.id,
          set_qty: 0,
          add_qty: 1,
        },
      });
      console.log('Qty updated:', response?.result?.message);
      if (response?.result?.message === 'success') {
        // setQuentity(response?.result)
        // fetchCarddata()
        dispatch(fetchCartData());
        // fetchCartData();
        setSelectedDeliveryOption(null);
      }
    } catch (error) {
      console.error('Error updating cart qty', error);
    } finally {
      setisloading(false);
    }
  };

  const removeItem = async (item, set_qty, add_qty = 0) => {
    console.log(item?.product_uom_qty, 'Item');
    let newSetQty = item?.product_uom_qty > 1 ? item?.product_uom_qty - 1 : -1;
    try {
      setisloading(true);
      const response = await makeApiCall(API_URLS.addToCart, 'POST', {
        jsonrpc: '2.0',
        params: {
          product_id: item.product_id,
          product_template_id: item.id,
          return_updated_data: true,
          set_qty: newSetQty,
          add_qty: add_qty,
        },
      });
      console.log('Qty updated:', response);
      if (response?.result?.message === 'success') {
        // setQuentity(response?.result)
        // fetchCarddata()
        dispatch(fetchCartData());
        setSelectedDeliveryOption(null);
      }
    } catch (error) {
      console.error('Error updating cart qty', error);
    } finally {
      setisloading(false);
    }
  };

  const renderCartItem = ({item}) => (
    <View style={styles.cartItem}>
      <Image
        source={{uri: `${BASE_URL}${item.product_image}`}}
        style={styles.itemImage}
      />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={3}>
          {item.name}
        </Text>
        <Text style={styles.itemVariant}>
          {' '}
          Price:₹ {item.product_price.toFixed(2)}
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => removeItem(item)}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.product_uom_qty}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item, 1)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeItem(item)}
        >
          <Text style={styles.removeButtonText}>🗑</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const handdleReedeem = () => {
    Alert.alert(
      'Redeem Rewards',
      cart?.redeem?.message ||
        'Are you sure you want to redeem your reward points?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setisloading(true);
              const response = await makeApiCall(
                API_URLS.redeemRewardPoints,
                'POST',
                {
                  jsonrpc: '2.0',
                  params: {},
                },
              );
              console.log(response, 'Delivery API ResponseReedeem');
              if (response?.result?.message?.toLowerCase() === 'success') {
                dispatch(fetchCartData());
              }
            } catch (error) {
              console.log('Delivery API Error:', error);
            } finally {
              setisloading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleUncheckRedeem = async (order_line, product_id) => {
    console.log(order_line, product_id, 'Orderlineid and productid');
    try {
      setisloading(true);

      const response = await makeApiCall(API_URLS.addToCart, 'POST', {
        jsonrpc: '2.0',
        params: {
          order_line: order_line,
          product_id: product_id,
          add_qty: 0,
          set_qty: -1,
          return_updated_data: true,
        },
      });
      console.log(response, 'Delivery API ResponseReedeem');
      if (response?.result?.message === 'success') {
        // setDeliveryCost(response.result.delivery_cost);
        dispatch(fetchCartData());
      }
    } catch (error) {
      // Update delivery cost if API returns it
      console.log('Delivery API Error:', error);
    } finally {
      setisloading(false);
    }
  };

  const EmptyCart = () => (
    <View style={styles.emptyCart}>
      <Text style={styles.emptyCartIcon}>🛒</Text>
      <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyCartSubtitle}>
        Add some items to get started
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate(navigationString.HOMESCREEN)}>
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDeliveryChange = async option => {
    setSelectedDeliveryOption(option);

    try {
      setisloading(true);

      const response = await makeApiCall(API_URLS.addDelivery, 'POST', {
        jsonrpc: '2.0',
        params: {delivery_type: option},
      });

      console.log('Delivery API Response:', response);

      // Update delivery cost if API returns it
      if (response?.result?.delivery_cost !== undefined) {
        // setDeliveryCost(response.result.delivery_cost);
      }

      // Optionally refresh cart
      dispatch(fetchCartData());
    } catch (error) {
      console.log('Delivery API Error:', error);
    } finally {
      setisloading(false);
    }
  };

  // const handleProcessCheckout = async () => {
  //   try {
  //     const formData = new FormData();

  //     // Add description and delivery type
  //     formData.append('description', description);
  //     formData.append('delivery_type', selectedDeliveryOption || 'pickup');

  //     // ✅ Attach all images dynamically
  //     // imageslist.forEach((img, index) => {
  //     //   formData.append(`image${index}`, {
  //     //     uri: img.path,
  //     //     type: img.mime || 'image/jpeg',
  //     //     name: `photo${index}.jpg`,
  //     //   });
  //     // });
  //     imageslist.forEach((value, index) => {
  //       formData.append(`image${index}`, {
  //         uri: value.path,
  //         type: value.mime || 'image/jpeg',
  //         name: value.filename || 'image.jpg',
  //       });
  //     });

  //     console.log(formData, 'FORM DATA');
  //     const response = await makeApiCall(
  //       API_URLS.processCheckout,
  //       'POST',
  //       formData,
  //       {
  //         // 'Content-Type': 'multipart/form-data',
  //         Accept: 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     );

  //     console.log('Checkout Response:', response);

  //     if (response?.message === 'success' && response?.redirectFlag) {
  //       MessageShow.success('Success', 'images saved successfully');
  //     } else {
  //       Alert.alert(
  //         'Failed',
  //         response?.result?.message || 'Something went wrong',
  //       );
  //     }
  //   } catch (error) {
  //     console.log('Checkout Error:', error);
  //     Alert.alert('Error', 'Unable to process checkout. Please try again.');
  //   }
  // };

  // 🔍 Debug helper for FormData in React Native
  const debugFormData = formData => {
    if (formData && formData._parts) {
      console.log('---- FormData Debug ----');
      formData._parts.forEach(([key, value]) => {
        console.log(key, value);
      });
      console.log('-------------------------');
    } else {
      console.log('FormData is empty or invalid');
    }
  };

  const handleProcessCheckout = async () => {
   
    try {
       setisloading(true)
      if (cart?.sale_order_lines) {
        const unpublished = Object.values(cart.sale_order_lines).some(
          line => line?.is_published === false,
        );
      
        if (unpublished) {
          Alert.alert(
            'Error',
            'Some products are not published, please remove them before checkout.',
          );
          return; // ❌ Stop checkout
        }
      }
      const formData = new FormData();

      formData.append('description', description || '');
      formData.append('delivery_type', selectedDeliveryOption || false);
      formData.append('removed_imgs','')

      imageslist.forEach((img, index) => {
        const file = {
          uri:
            Platform.OS === 'ios' ? img.path.replace('file://', '') : img.path,
          type: img.mime || 'image/jpeg',
          name: img.filename || `photo${index}.jpg`,
        };
        formData.append(`image${index}`, file);
      });

      // 🔍 Debug FormData
      debugFormData(formData);

      // ✅ Correct axios usage
      const response = await axios.post(API_URLS.processCheckout, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        timeout: 7000,
      });

      console.log('Checkout Response:', response.data);

      if (
        response?.data?.message === 'success' &&
        response?.data?.redirectFlag
      ) {
        MessageShow.success('Success', 'Images saved successfully');
        return true;
      } else {
        Alert.alert(
          'Failed',
          response?.data?.result?.message || 'Something went wrong',
        );
      }
    } catch (error) {
      console.log('Checkout Error:', error);
      Alert.alert('Error', 'Unable to process checkout. Please try again.');
    } finally{
      setisloading(false)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headercomp title={`Cart`} />

      {cartItem.length === 0 ? (
        <EmptyCart />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {/* Coupon Section */}
          <View style={styles.couponContainer}>
            <TouchableOpacity onPress={handleCouponPress} activeOpacity={0.7}>
              <View style={styles.couponContent}>
                <View style={styles.couponLeft}>
                  <Text style={styles.couponIcon}>🎫</Text>
                  <View>
                    <Text style={styles.couponText}>
                      {appliedCoupon
                        ? `Coupon Applied: ${appliedCoupon}`
                        : 'Available Coupons'}
                    </Text>
                    {/* <Text style={styles.couponSubtext}>
                      {appliedCoupon ? '10% discount applied' : 'Save up to 20% on your order'}
                    </Text> */}
                  </View>
                </View>
                <Text style={styles.couponAction}>
                  {appliedCoupon ? 'Change' : 'View'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <View style={styles.cartSection}>
            <Text style={styles.sectionTitle}>Items in Cart</Text>
            <FlatList
              data={cartItem}
              renderItem={renderCartItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ₹ {cart?.subtotal.toFixed(2)}
              </Text>
            </View>

            {appliedCoupon && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountText]}>
                  Discount
                </Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  -₹
                  {cart?.discount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charges</Text>
              <Text style={styles.summaryValue}>
                ₹{cart?.delivery.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>₹{cart?.tax.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Coupon Discount:</Text>
              <Text style={styles.summaryValue}>
                ₹{cart?.discount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹ {total.toFixed(2)}</Text>
            </View>
          </View>

          {cart?.redeem?.show &&!cart?.hideHomeDeveliery&& (
            <View style={{...styles.card}}>
              {cart?.redeem?.show &&
                Object.values(cart?.coupons || {}).length <= 0 && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CheckBox
                      disabled={false}
                      value={isChecked}
                      onValueChange={async newValue => {
                        setIsChecked(newValue);

                        if (newValue) {
                          await handdleReedeem();
                        } else {
                          await handleUncheckRedeem(
                            cart?.coupons?.id,
                            cart?.coupons?.product_id,
                          );
                        }
                      }}
                      tintColors={{
                        true: COLORS.primaryColor,
                        false: COLORS.lightGray,
                      }}
                    />
                    <Text style={{...styles.summaryValue}}>
                      <Text style={styles.redeemText}>
                        Redeem Rewards{' '}
                        {cart?.discount > 0 ? `(${cart.discount})` : ''}
                      </Text>
                    </Text>
                  </View>
                )}

              {cart?.coupons &&
                Object.values(cart.coupons).map(coupon => (
                  <View
                    key={coupon.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 25,
                      backgroundColor: COLORS.gray2,
                      marginTop: 10,
                      borderRadius: 5,
                    }}>
                    <Text style={{fontSize: 16, color: COLORS.whiteColor}}>
                      {coupon.name}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        handleUncheckRedeem(coupon.id, coupon?.product_id)
                      } // function to remove coupon
                    >
                      <Icon
                        name="close-circle"
                        size={25}
                        color={COLORS.redColor}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}

          {/* Shipping Info */}
          {/* {shipping === 0 && (
            <View style={styles.freeShippingBanner}>
              <Text style={styles.freeShippingText}>🚚 Free Shipping Applied!</Text>
            </View>
          )} */}

          {cart?.allowOrderBySnapshot && !cart?.hideHomeDeveliery && (
            <View
              style={{
                ...styles.cartSection,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <ButtonCompo
                title="From Galary"
                style={{width: '45%', height: 45}}
                onPress={handleImagepicker}
              />
              <ButtonCompo
                title="Open Camera"
                style={{width: '45%', height: 45}}
                onPress={hanldeCamera}
              />
            </View>
          )}
          <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 15}}>
            {imageslist.map((img, index) => (
              <View key={index} style={{margin: 5}}>
                {/* Image container with delete icon */}
                <View style={{position: 'relative'}}>
                  <Image
                    source={{uri: img.path}}
                    style={{width: 100, height: 100, borderRadius: 8}}
                  />
                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() => {
                      // remove selected image
                      const updatedList = imageslist.filter(
                        (_, i) => i !== index,
                      );
                      setImageslist(updatedList);
                    }}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: 12,
                      padding: 3,
                    }}>
                    <Icon name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {imageslist?.length > 0 && (
            <>
              {/* <ButtonCompo
                title="save images"
                onPress={handleProcessCheckout}
                style={{width: '45%', height: 45, alignSelf: 'center'}}
              /> */}
              <TextInputCompo
                style={{borderWidth: 1, margin: 10, borderRadius: 10}}
                placeholder="Description"
                value={description}
                onChangeText={text => setDescription(text)}
              />
            </>
          )}
        </ScrollView>
      )}

      {/* Checkout Button */}
      {cartItem.length > 0 && (
        <View style={styles.checkoutContainer}>
          {!cart?.hideHomeDeveliery && (
            <DeliveryOptions
              options={cart?.delivery_options}
              selectedOption={selectedDeliveryOption}
              onSelectOption={handleDeliveryChange}
            />
          )}

          {/* <TouchableOpacity
            style={styles.checkoutButton}
            activeOpacity={0.8}
            onPress={() => {
              if (selectedDeliveryOption) {
                // ✅ if NOT null → go ahead
                navigation.navigate(navigationString.BILLINGADDRESS, {
                  deliveryType: selectedDeliveryOption,
                });
              } else {
                // ❌ if null → show alert
                MessageShow.error('Alert', 'Please Select Delivery Options');
              }
            }}
            // onPress={() => navigation.navigate(navigationString.BILLINGADDRESS)}
          >
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout •₹ {total.toFixed(2)}
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={styles.checkoutButton}
            activeOpacity={0.8}
            onPress={() => {
              if (!cart?.hideHomeDeveliery) {
                // 🔹 Case 1: Delivery options visible → must select
                if (selectedDeliveryOption) {
                  navigation.navigate(navigationString.BILLINGADDRESS, {
                    deliveryType: selectedDeliveryOption,
                  });
                } else {
                  MessageShow.error('Alert', 'Please Select Delivery Options');
                }
              } else {
                // 🔹 Case 2: Home delivery hidden → skip check
                navigation.navigate(navigationString.BILLINGADDRESS, {
                  deliveryType: 'pickup', // or default type
                });
              }
            }}>
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout • ₹ {total.toFixed(2)}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
  style={styles.checkoutButton}
  activeOpacity={0.8}
  onPress={async () => {
    if (!cart?.hideHomeDeveliery) {
      // 🔹 Case 1: Delivery options visible → must select
      if (selectedDeliveryOption) {
        const success = await handleProcessCheckout(); // ✅ Call before navigation
        if (success) {
          navigation.navigate(navigationString.BILLINGADDRESS, {
            deliveryType: selectedDeliveryOption,
          });
        }
      } else {
        MessageShow.error('Alert', 'Please Select Delivery Options');
      }
    } else {
      // 🔹 Case 2: Home delivery hidden → skip check
      const success = await handleProcessCheckout(); 
      console.log("✅ Checkout Success:", success);// ✅ Call before navigation
      if (success) {
        navigation.navigate(navigationString.BILLINGADDRESS, {
          deliveryType: 'pickup', // or default type
        });
      }
    }
  }}>
  <Text style={styles.checkoutButtonText}>
    Proceed to Checkout • ₹ {total.toFixed(2)}
  </Text>
</TouchableOpacity>

        </View>
      )}

      <CouponModal
        isVisible={openCoupenModal}
        onClose={() => {
          setOpencoupenModal(false);
          dispatch(fetchCartData());
        }}
      />

      {route?.params?.item === 'Snapshot' && (
        <ButtonCompo
          style={{width: '40%', alignSelf: 'center'}}
          title="Order By Snapshot"
          onPress={() => setOpneModal(true)}
        />
      )}
      <ScreenshotModal
        isVisible={openModal}
        onclose={() => setOpneModal(false)}
      />
      <Loader visible={isLoading} />
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS?.whiteColor || '#FFFFFF',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  couponContainer: {
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  couponContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  couponIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  couponText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  couponSubtext: {
    fontSize: 12,
    color: '#666',
  },
  couponAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  cartSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    // justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  quantityControls: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 8,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 16,
  },
  summaryContainer: {
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  discountText: {
    color: '#22C55E',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  freeShippingBanner: {
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#D4EDDA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  freeShippingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#155724',
  },
  checkoutContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // borderColor:COLORS.lightGray,

    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent:'space-between',
    backgroundColor: COLORS.whiteColor,
    // borderRadius:10
  },
});
