// import { Modal, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
// import React, { useState } from 'react';
// import CheckBox from '@react-native-community/checkbox';
// import makeApiCall from '../utils/apiHelper';
// import { API_URLS } from '../utils/apiurls';
// import { COLORS } from '../styles/colors';
// import Dropdowncomp from '../components/Dropdowncomp';
// import TextInputCompo from '../components/TextInputCompo';
// import ButtonCompo from '../components/ButtonCompo';

// const OptionModal = ({ isVisible, onClose, item = [] }) => {
//   const [selectedIds, setSelectedIds] = useState([]);
//   console.log(item,'Itemsss')

//   const toggleCheckbox = (productId) => {
//     if (selectedIds.includes(productId)) {
//       setSelectedIds(selectedIds.filter(id => id !== productId));
//     } else {
//       setSelectedIds([...selectedIds, productId]);
//     }
//   };
// const handleSubmit=async()=>{
//     try {
//         const responce=await makeApiCall(API_URLS.saveStoreOrderData,'POST',{
//             jsonrpc:'2.0',
//             params:{}
//         })
//     } catch (error) {
//        console.log(error) 
//     }
// }
//   const renderItem = ({ item }) => {
//     const isChecked = selectedIds.includes(item.id);
//     return (
//       <View style={styles.row}>
//         <CheckBox
//           value={isChecked}
//           onValueChange={() => toggleCheckbox(item.id)}
//         />
//         <Text style={styles.label}>{item.name}</Text>
//       </View>
//     );
//   };

//   return (
//     <Modal visible={isVisible} onRequestClose={onClose} transparent animationType="slide">
//       <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.container}>
//         <TouchableOpacity activeOpacity={1} style={styles.whitebox}>
//           <Text style={styles.title}>Select Products</Text>
//           {/* <FlatList
//             data={item}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//           />
//           <TouchableOpacity onPress={onClose} style={styles.button}>
//             <Text style={styles.buttonText}>Done</Text>
//           </TouchableOpacity> */}
//           <Text style={{...styles.buttonText,color:COLORS.blackColor}}>Product</Text>
//           <Dropdowncomp
//           data={[
//             { label: 'Option 1', value: '1' },
//             { label: 'Option 2', value: '2' },
//             { label: 'Option 3', value: '3' },
//           ]}/>
//           <Text style={{...styles.buttonText,color:COLORS.blackColor}}>Product</Text>
//           <TextInputCompo
//           placeholder='Quantity'
//           style={{...styles.input}}
//           />
//           <Text style={{...styles.buttonText,color:COLORS.blackColor}}>Delivered Quantity</Text>
//           <TextInputCompo
//           placeholder='Quantity'
//           style={{...styles.input}}
//           />
//           <Text style={{...styles.buttonText,color:COLORS.blackColor}}>Return Quantity</Text>
//           <TextInputCompo
//           placeholder='Quantity'
//           style={{...styles.input}}
//           />
//            <Text style={{...styles.buttonText,color:COLORS.blackColor}}>Unit Price</Text>
//           <TextInputCompo
//           placeholder='Quantity'
//           style={{...styles.input}}
//           />
//           <Text style={{...styles.buttonText,color:COLORS.blackColor}}>Product</Text>
//           <Dropdowncomp
//           data={[
//             { label: 'Option 1', value: '1' },
//             { label: 'Option 2', value: '2' },
//             { label: 'Option 3', value: '3' },
//           ]}/>
//            <Text style={{...styles.buttonText,color:COLORS.blackColor}}>Subtotal</Text>
//           <TextInputCompo
//           placeholder='Quantity'
//           style={{...styles.input}}
//           />
//           <ButtonCompo title='Save'/>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// export default OptionModal;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   whitebox: {
//     backgroundColor: 'white',
//     padding: 20,
//     maxHeight: '80%',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 6,
//   },
//   label: {
//     fontSize: 16,
//     marginLeft: 10,
//     flexShrink: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   button: {
//     marginTop: 16,
//     backgroundColor: '#007BFF',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   input:{
//     height:50,
//     borderWidth:1,
//     borderRadius:10
//   }
// });



import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import makeApiCall from '../utils/apiHelper';
import { API_URLS } from '../utils/apiurls';
import { COLORS } from '../styles/colors';
import Dropdowncomp from '../components/Dropdowncomp';
import TextInputCompo from '../components/TextInputCompo';
import ButtonCompo from '../components/ButtonCompo';

const OptionModal = ({ isVisible, onClose, item = [] ,id}) => {
  console.log(id,'Ittttttt')
  // Form States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [deliveredQty, setDeliveredQty] = useState('');
  const [returnQty, setReturnQty] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [subtotal, setSubtotal] = useState('');

  // Format dropdown data
  const dropdownData = item.map((p) => ({
    label: p.name,
    value: p.id,
    ...p, // keep all original fields for later use
  }));

  // Auto-update subtotal
  useEffect(() => {
    if (quantity && unitPrice) {
      setSubtotal((parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2));
    } else {
      setSubtotal('');
    }
  }, [quantity, unitPrice]);





  const handleSubmit = async () => {
    if (!selectedProduct) {
      console.warn("Please select a product");
      return;
    }
  
    try {
      const payload = {
        orderId: id , // you can pass this as a prop if dynamic
        updatedOrderData: {
          order_lines: {
            New0: {
              product_id: {
                id: selectedProduct.id,
                name: selectedProduct.name
              },
              product_template_id: selectedProduct.product_template_id,
              name: "",
              product_uom_qty: parseFloat(quantity) || 0,
              qty_delivered: parseFloat(deliveredQty) || 0,
              return_quantity: parseFloat(returnQty) || 0,
              price_unit: parseFloat(unitPrice) || 0,
              tax_id: {},
              price_subtotal: parseFloat(subtotal) || 0,
              sale_order_line_type: "so_snap",
              id: "New0"
            }
          },
          TotalTaxAmount: 0
        }
      };
  // console.log(payload,'PaYload')
      const response = await makeApiCall(API_URLS.saveStoreOrderData, 'POST', {
        jsonrpc:'2.0',
        params:payload
      });
      // console.log('Saved successfully:', response);
      if(response?.result?.message==='success'){
        // fechorderdata()
        onClose()
      }
      // onClose();
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <Modal visible={isVisible} onRequestClose={onClose} transparent animationType="slide">
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.container}>
        <TouchableOpacity activeOpacity={1} style={styles.whitebox}>
          <Text style={styles.title}>Select Products</Text>

          {/* Product Dropdown */}
          <Text style={{ ...styles.buttonText, color: COLORS.blackColor }}>Product</Text>
          <Dropdowncomp
            data={dropdownData}
            labelField="label"
            valueField="value"
            placeholder="Select Product"
            value={selectedProduct?.id}
            search={true}
            onChange={(prod) => {
              setSelectedProduct(prod);
              setUnitPrice(prod.list_price?.toString() || '');
              setQuantity(prod.price_unit?.toString() || '');
            }}
          />

          {/* Quantity */}
          <Text style={{ ...styles.buttonText, color: COLORS.blackColor }}>Quantity</Text>
          <TextInputCompo
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            style={{ ...styles.input }}
            keyboardType="numeric"
          />

          {/* Delivered Quantity */}
          <Text style={{ ...styles.buttonText, color: COLORS.blackColor }}>Delivered Quantity</Text>
          <TextInputCompo
            placeholder="Delivered Quantity"
            value={deliveredQty}
            onChangeText={setDeliveredQty}
            style={{ ...styles.input }}
            keyboardType="numeric"
          />

          {/* Return Quantity */}
          <Text style={{ ...styles.buttonText, color: COLORS.blackColor }}>Return Quantity</Text>
          <TextInputCompo
            placeholder="Return Quantity"
            value={returnQty}
            onChangeText={setReturnQty}
            style={{ ...styles.input }}
            keyboardType="numeric"
          />

          {/* Unit Price */}
          <Text style={{ ...styles.buttonText, color: COLORS.blackColor }}>Unit Price</Text>
          <TextInputCompo
            placeholder="Unit Price"
            value={unitPrice}
            onChangeText={setUnitPrice}
            style={{ ...styles.input }}
            keyboardType="numeric"
          />

          {/* Subtotal */}
          <Text style={{ ...styles.buttonText, color: COLORS.blackColor }}>Subtotal</Text>
          <TextInputCompo
            placeholder="Subtotal"
            value={subtotal}
            editable={false}
            style={{ ...styles.input, backgroundColor: '#f5f5f5' }}
          />

          {/* Save Button */}
          <ButtonCompo title="Save" onPress={handleSubmit} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default OptionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  whitebox: {
    backgroundColor: 'white',
    padding: 20,
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
