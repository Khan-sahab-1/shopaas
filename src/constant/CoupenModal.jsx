// import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import makeApiCall from '../utils/apiHelper';
// import { API_URLS } from '../utils/apiurls';

// const CouponModal = ({ isVisible, onClose }) => {
//   const [isLoding,setIsLoding]=useState(false)
//   const fetchendcsustomerCoupen=async()=>{
//     try {
//       setIsLoding(true)
//       const res=await makeApiCall(API_URLS.getUserCoupons,'POST',{
//         params:{companySpecific: true}
//       })
//       console.log(res,'Coupens')
//     } catch (error) {
//       console.log(error,'Error in fetching coupen')
//     } finally{
//       setIsLoding(false)
//     }
//   }
//   useEffect(()=>{
//     fetchendcsustomerCoupen()
//   },[])
//   return (
//     <>
//       <Modal
//         visible={isVisible}
//         onRequestClose={onClose}
//         animationType="fade"
//         transparent
//       >
//         <TouchableOpacity style={styles.container} onPress={onClose}>
//           <View style={styles.whitebox}>
//             {/* Icon Container */}
//             <View style={styles.iconContainer}>
//               <View style={styles.errorIcon}>
//                 <Text style={styles.errorIconText}>✕</Text>
//               </View>
//             </View>

//             {/* Title */}
//             <Text style={styles.title}>Coupon Not Available</Text>

//             {/* Description */}
//             <Text style={styles.description}>
//               This coupon is currently unavailable or has expired. Please try another coupon or check back later.
//             </Text>

//             {/* Action Buttons */}
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity
//                 style={styles.primaryButton}
//                 onPress={onClose}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.primaryButtonText}>Try Another Coupon</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={onClose}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.secondaryButtonText}>Continue Without Coupon</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// export default CouponModal;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   whitebox: {
//     width: '85%',
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 25,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   iconContainer: {
//     marginBottom: 20,
//   },
//   errorIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#FFE6E6',
//     borderWidth: 2,
//     borderColor: '#FF4444',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorIconText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FF4444',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 25,
//     paddingHorizontal: 10,
//   },
//   buttonContainer: {
//     width: '100%',
//     gap: 12,
//   },
//   primaryButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     shadowColor: '#007AFF',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   primaryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#DDD',
//   },
//   secondaryButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import makeApiCall from '../utils/apiHelper';
import { API_URLS } from '../utils/apiurls';

const CouponModal = ({ isVisible, onClose, onSelectCoupon }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [promocode, setpromocode] = useState(null);
  console.log(promocode, 'Selected Coupen');

  const fetchCustomerCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await makeApiCall(API_URLS.getUserCoupons, 'POST', {
        params: { companySpecific: true },
      });

      if (res?.result?.data) {
        // Convert object to array for easier rendering
        const couponArray = Object.values(res?.result?.data);
        setCoupons(couponArray);
      }
      console.log(res, 'Coupons');
    } catch (error) {
      console.log(error, 'Error in fetching coupon');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchCustomerCoupons();
    }
  }, [isVisible]);

  const handleSelectCoupon = coupon => {
    setSelectedCoupon(coupon.id);
    setpromocode(coupon.promo_code);
    if (onSelectCoupon) {
      onSelectCoupon(coupon);
    }
  };

  const handleApplyCoupen = async promo => {
    try {
      setIsLoading(true);
      const res = await makeApiCall(API_URLS.applyPromo, 'POST', {
        params: { promo: promo },
      });
      console.log(res, 'Apply Coupen');
      if(res?.result?.message==='Success'){
        onClose();
      }
    } catch (error) {
      console.log(error, 'Error in applying coupen');
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = dateString => {
    const date = new Date(dateString.split('-').reverse().join('-'));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderCouponItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.couponCard,
        selectedCoupon === item.id && styles.selectedCouponCard,
      ]}
      onPress={() => handleSelectCoupon(item)}
      activeOpacity={0.7}
    >
      <View style={styles.couponHeader}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount_percent}</Text>
          <Text style={styles.offText}>OFF</Text>
        </View>
        <View style={styles.couponInfo}>
          <Text style={styles.couponName}>{item.name}</Text>
          <Text style={styles.promoCode}>Code: {item.promo_code}</Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}

      <View style={styles.couponDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Min. Amount:</Text>
          <Text style={styles.detailValue}>₹{item.rule_minimum_amount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Uses Left:</Text>
          <Text style={styles.detailValue}>{item.maximum_use_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Valid Until:</Text>
          <Text style={styles.detailValue}>
            {formatDate(item.rule_date_to)}
          </Text>
        </View>
      </View>

      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{item.company.name}</Text>
        <Text style={styles.companyType}>{item.company.company_type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Available Coupons</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading coupons...</Text>
              </View>
            ) : coupons.length > 0 ? (
              <FlatList
                data={coupons}
                renderItem={renderCouponItem}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.couponList}
              />
            ) : (
              <View style={styles.emptyCoupons}>
                <Text style={styles.emptyTitle}>No Coupons Available</Text>
                <Text style={styles.emptyDescription}>
                  There are no active coupons at the moment. Please check back
                  later.
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {!isLoading && coupons.length > 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  !selectedCoupon && styles.disabledButton,
                ]}
                onPress={() => handleApplyCoupen(promocode)}
                disabled={!selectedCoupon}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.applyButtonText,
                    !selectedCoupon && styles.disabledButtonText,
                  ]}
                >
                  Apply Coupon
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CouponModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  couponList: {
    paddingBottom: 10,
  },
  couponCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCouponCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F8FBFF',
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  discountBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  discountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  couponInfo: {
    flex: 1,
    marginLeft: 12,
  },
  couponName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  promoCode: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    backgroundColor: '#E6F3FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  couponDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  companyType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyCoupons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
