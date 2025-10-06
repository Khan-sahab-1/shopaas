// import {
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   FlatList,
//   Image,
//   ScrollView,
// } from 'react-native';
// import React, { useState } from 'react';
// import { COLORS } from '../../../../styles/colors';
// import Loader from '../../../../components/Loader';
// import { API_URLS, BASE_URL } from '../../../../utils/apiurls';
// import ButtonCompo from '../../../../components/ButtonCompo';
// import makeApiCall from '../../../../utils/apiHelper';
// import MessageShow from '../../../../constant/MessageShow';

// const ReturnOrderModal = ({ isVisible, onclose, item }) => {
//   const [isLoding, setIsloding] = useState(false);
//   const [quantities, setQuantities] = useState({});
//   console.log(quantities,'Itemss')

//   const handleIncrement=(item,product_uom_qty)=>{
//     console.log(product_uom_qty,'New')
//     setQuantities(product_uom_qty+1)
//   }
//   const handleDecrement=(item,product_uom_qty)=>{
//     setQuantities(product_uom_qty-1)

//   }

//   if (!item) return null;

//   const { originalOrderData, saleOrderData } = item || {};
//   const products = saleOrderData?.sale_order_lines
//     ? Object.values(saleOrderData.sale_order_lines)
//     : [];

//   const handlereturnConfirm = async () => {
//     try {
//       setIsloding(true);


//       let lineData = {};
//       products.forEach(p => {
//         lineData[p.id] = {
//           ...p,
//           maxLimit: p.product_uom_qty,
//           last_product_uom_qty: 0, 
//         };
//       });

//       const payload = {
//         jsonrpc: '2.0',
//         params: {
//           order_id: saleOrderData?.id,
//           partner_id: saleOrderData?.partner_id,
//           isConfirmed: true,
//           line: lineData,
//         },
//       };

//       console.log('Return confirm payload ===>', payload);

//       const response = await makeApiCall(
//         API_URLS.processReturnOrder,
//         'POST',
//         payload,
//       );

//       console.log('Return confirm response ===>', response);
//       if (response?.result?.redirectFlag) {
//         MessageShow.success(response?.result?.message);

//         onclose();
//       } else{
//         MessageShow.error('Error',response?.error?.message)
//       }

//       // you can add a success callback here
//     } catch (error) {
//       console.log('Return confirm error:', error);
//       MessageShow.error('error','Errpr')
//     } finally {
//       setIsloding(false);
//     }
//   };

//   return (
//     <Modal visible={isVisible} onRequestClose={onclose} transparent>
//       <View style={styles.container}>
//         <View style={styles.whiteBox}>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             {/* Header */}
//             <Text style={styles.header}>Return Order</Text>

//             {/* Original Order Info */}
//             <View style={styles.orderInfo}>
//               <Text style={styles.label}>
//                 Reference:
//                 <Text style={styles.value}>
//                   {' '}
//                   {originalOrderData?.reference}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Date:
//                 <Text style={styles.value}>
//                   {' '}
//                   {originalOrderData?.date_order}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Amount:
//                 <Text style={styles.value}>
//                   {' '}
//                   ₹{originalOrderData?.amount_total}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Company:
//                 <Text style={styles.value}>
//                   {' '}
//                   {originalOrderData?.company?.name}
//                 </Text>
//               </Text>
//             </View>

//             {/* Products */}
//             <Text style={styles.subHeader}>Products</Text>
//             <FlatList
//               data={products}
//               keyExtractor={item => item.id.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.card}>
//                   <Image
//                     source={{ uri: BASE_URL + item.product_image }}
//                     style={styles.image}
//                   />
//                   <View style={styles.cardContent}>
//                     <Text style={styles.productName}>{item.name}</Text>
//                     <Text style={styles.productPrice}>
//                       ₹{item.product_price}
//                     </Text>
//                     <Text style={styles.qty}>Qty: {item.product_uom_qty}</Text>
//                     <View style={styles.qtyControls}>
//                       <TouchableOpacity
//                         style={styles.qtyBtn}
//                         onPress={() => handleDecrement(item.id, item.product_uom_qty)}
//                         >
//                         <Text style={styles.qtyBtnText}>-</Text>
//                       </TouchableOpacity>

//                       <Text style={styles.qtyValue}>
//                         {/* {quantities[item.id] || 0} */}
//                       </Text>

//                       <TouchableOpacity
//                         style={styles.qtyBtn}
//                         onPress={() =>
//                           handleIncrement(item.id, item.product_uom_qty)
//                         }
//                         >
//                         <Text style={styles.qtyBtnText}>+</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               )}
//             />
//           </ScrollView>

//           <View
//             style={{ flexDirection: 'row', justifyContent: 'space-between' }}
//           >
//             <ButtonCompo
//               title="Close"
//               style={{ width: '45%' }}
//               onPress={onclose}
//             />
//             <ButtonCompo
//               title="Confirm"
//               style={{ width: '45%' }}
//               onPress={handlereturnConfirm}
//             />
//           </View>
//         </View>
//       </View>
//       <Loader visible={isLoding} />
//     </Modal>
//   );
// };

// export default ReturnOrderModal;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   whiteBox: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: COLORS.whiteColor,
//     borderRadius: 12,
//     padding: 16,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 12,
//     color: COLORS.primary,
//   },
//   orderInfo: {
//     marginBottom: 16,
//     backgroundColor: COLORS.lightGray,
//     padding: 10,
//     borderRadius: 8,
//   },
//   label: {
//     fontSize: 14,
//     color: COLORS.gray,
//   },
//   value: {
//     fontWeight: '600',
//     color: COLORS.black,
//   },
//   subHeader: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginVertical: 8,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.whiteColor,
//     borderRadius: 8,
//     marginBottom: 10,
//     padding: 10,
//     elevation: 2,
//   },
//   image: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   productPrice: {
//     fontSize: 14,
//     color: COLORS.primary,
//     marginTop: 4,
//   },
//   qty: {
//     fontSize: 12,
//     color: COLORS.gray,
//   },
//   closeBtn: {
//     marginTop: 16,
//     alignSelf: 'center',
//     backgroundColor: COLORS.gray2,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   closeText: {
//     color: COLORS.whiteColor,
//     fontWeight: '600',
//   },
//   qtyControls: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
//   qtyBtn: { width: 32, height: 32, borderRadius: 6, backgroundColor: COLORS.blueColor, justifyContent: 'center', alignItems: 'center' },
//   qtyBtnText: { color: COLORS.whiteColor, fontSize: 18, fontWeight: '700' },
//   qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },
// });


import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../../styles/colors';
import Loader from '../../../../components/Loader';
import { API_URLS, BASE_URL } from '../../../../utils/apiurls';
import ButtonCompo from '../../../../components/ButtonCompo';
import makeApiCall from '../../../../utils/apiHelper';
import MessageShow from '../../../../constant/MessageShow';

const ReturnOrderModal = ({ isVisible, onclose, item }) => {
  const [isLoding, setIsloding] = useState(false);
  const [quantities, setQuantities] = useState({});

  if (!item) return null;

  const { originalOrderData, saleOrderData } = item || {};
  const products = saleOrderData?.sale_order_lines
    ? Object.values(saleOrderData.sale_order_lines)
    : [];
  
  // This useEffect hook will initialize the quantities state when the modal opens
  // or when the item prop changes.
  React.useEffect(() => {
    if (products) {
      const initialQuantities = {};
      products.forEach(p => {
        initialQuantities[p.id] = p.product_uom_qty;
      });
      setQuantities(initialQuantities);
    }
  }, [item]);


  const handleIncrement = (item) => {
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[item.id] || 0;
      if (currentQuantity < item.product_uom_qty) {
        return {
          ...prevQuantities,
          [item.id]: currentQuantity + 1,
        };
      }
      return prevQuantities;
    });
  };

  const handleDecrement = (item) => {
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[item.id] || 0;
      if (currentQuantity > 1) {
        return {
          ...prevQuantities,
          [item.id]: currentQuantity - 1,
        };
      }
      return prevQuantities;
    });
  };

  const handlereturnConfirm = async () => {
    try {
      setIsloding(true);

      let lineData = {};
      products.forEach(p => {
        lineData[p.id] = {
          ...p,
          maxLimit: p.product_uom_qty,
          last_product_uom_qty: quantities[p.id] || 0, 
        };
      });

      const payload = {
        jsonrpc: '2.0',
        params: {
          order_id: saleOrderData?.id,
          partner_id: saleOrderData?.partner_id,
          isConfirmed: true,
          line: lineData,
        },
      };

      console.log('Return confirm payload ===>', payload);

      const response = await makeApiCall(
        API_URLS.processReturnOrder,
        'POST',
        payload,
      );

      console.log('Return confirm response ===>', response);
      if (response?.result?.redirectFlag) {
        MessageShow.success(response?.result?.message);

        onclose();
      } else{
        MessageShow.error('Error',response?.error?.message)
      }

    } catch (error) {
      console.log('Return confirm error:', error);
      MessageShow.error('error','Errpr')
    } finally {
      setIsloding(false);
    }
  };

  return (
    <Modal visible={isVisible} onRequestClose={onclose} transparent>
      <View style={styles.container}>
        <View style={styles.whiteBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={styles.header}>Return Order</Text>

            {/* Original Order Info */}
            <View style={styles.orderInfo}>
              <Text style={styles.label}>
                Reference:
                <Text style={styles.value}>
                  {' '}
                  {originalOrderData?.reference}
                </Text>
              </Text>
              <Text style={styles.label}>
                Date:
                <Text style={styles.value}>
                  {' '}
                  {originalOrderData?.date_order}
                </Text>
              </Text>
              <Text style={styles.label}>
                Amount:
                <Text style={styles.value}>
                  {' '}
                  ₹{originalOrderData?.amount_total}
                </Text>
              </Text>
              <Text style={styles.label}>
                Company:
                <Text style={styles.value}>
                  {' '}
                  {originalOrderData?.company?.name}
                </Text>
              </Text>
            </View>

            {/* Products */}
            <Text style={styles.subHeader}>Products</Text>
            <FlatList
              data={products}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image
                    source={{ uri: BASE_URL + item.product_image }}
                    style={styles.image}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>
                      ₹{item.product_price}
                    </Text>
                    <Text style={styles.qty}>Qty: {item.product_uom_qty}</Text>
                    <View style={styles.qtyControls}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => handleDecrement(item)}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyValue}>
                        {quantities[item.id] || 0}
                      </Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => handleIncrement(item)}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </ScrollView>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ButtonCompo
              title="Close"
              style={{ width: '45%' }}
              onPress={onclose}
            />
            <ButtonCompo
              title="Confirm"
              style={{ width: '45%' }}
              onPress={handlereturnConfirm}
            />
          </View>
        </View>
      </View>
      <Loader visible={isLoding} />
    </Modal>
  );
};

export default ReturnOrderModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  whiteBox: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.whiteColor,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: COLORS.primary,
  },
  orderInfo: {
    marginBottom: 16,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
  },
  value: {
    fontWeight: '600',
    color: COLORS.black,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.whiteColor,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  qty: {
    fontSize: 12,
    color: COLORS.gray,
  },
  closeBtn: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: COLORS.gray2,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  closeText: {
    color: COLORS.whiteColor,
    fontWeight: '600',
  },
  qtyControls: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyBtn: { width: 32, height: 32, borderRadius: 6, backgroundColor: COLORS.blueColor, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: COLORS.whiteColor, fontSize: 18, fontWeight: '700' },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },
});