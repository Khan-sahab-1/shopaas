import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../styles/colors';
import TextInputCompo from '../components/TextInputCompo';
import makeApiCall from '../utils/apiHelper';
import { API_URLS } from '../utils/apiurls';
import Loader from '../components/Loader';
import ButtonCompo from '../components/ButtonCompo';
import OptionModal from './OptionModal';

const Editable = ({ Item,navigation,editable }) => {
  const [lines, setLines] = useState([]);
  const [discount, setDiscount] = useState(Item?.discount || 0);
  const [isLoding, setIsLoding] = useState(false);
  const [isVisible, setisVisible] = useState(false);
  const [optiondata,setoptiondata]=useState([])
    console.log(Item?.id,'ID MIL RAHI H')

  const fetchOption = async (orderId, origin, type, query) => {
    try {
      setIsLoding(true);
      const responce = await makeApiCall(API_URLS.getProductOptions, 'POST', {
        jsonrpc: '2.0',
        params: {
          id: orderId,
          origin: origin,
          type: type,
          query: query,
        },
      });
      console.log(responce, 'Option Data');
      setoptiondata(responce?.result?.data?.items)
      if (Array.isArray(responce?.result?.data?.items) && responce.result.data.items.length > 0) {
        setisVisible(true);
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };
  const handleOption = () => {
    if (!Item?.id) return;
    // setisVisible(true);
    fetchOption(Item.id, 'store_order_form', 'product', null);
  };
  

  useEffect(() => {
    if (Item?.order_lines) {
      const initialLines = Object.values(Item.order_lines).map(line => {
        const qty = line.product_uom_qty || 0;
        const ret = line.return_quantity || 0;
        const price = line.price_unit || 0;
        const discount = line.discount || 0;
        const subtotal = (qty - ret) * price - discount;

        return {
          ...line,
          product_uom_qty: qty,
          qty_delivered: line.qty_delivered || 0,
          return_quantity: ret,
          price_unit: price,
          discount: discount,
          price_subtotal: subtotal,
        };
      });

      setLines(initialLines);
    }
  }, [Item]);

  const handleChange = (index, field, value) => {
    const updatedLines = [...lines];
    const numericValue = parseFloat(value) || 0;
    updatedLines[index][field] = numericValue;

    const qty = updatedLines[index].product_uom_qty || 0;
    const ret = updatedLines[index].return_quantity || 0;
    const price = updatedLines[index].price_unit || 0;
    const discount = updatedLines[index].discount || 0;

    updatedLines[index].price_subtotal = (qty - ret) * price - discount;

    setLines(updatedLines);
  };

  const handleSave = async () => {
    try {
      setIsLoding(true);
      const order_lines = {};

      lines.forEach(line => {
        order_lines[line.id] = {
          price_unit: line.product_uom_qty,
          price_subtotal: line.price_subtotal.toFixed(2),
          product_uom_qty: line.price_unit,
          // price_subtotal: "0.00"
        };
      });
      const payload = {
        orderId: Item?.id,
        updatedOrderData: {
          discount: discount,
          order_lines,
          TotalTaxAmount: 0,
        },
      };
      console.log(payload, 'PAYLOAD');
      const response = await makeApiCall(API_URLS.saveStoreOrderData, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });

      console.log('Order saved:', response);
      if(response?.result?.message==='success'){
        // navigation.goBack()
        Alert.alert('Success','Success')
      
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoding(false);
    }
  };

  const renderOrderLines = () => {
    return lines.map((line, index) => (
      <View key={line.id || index} style={styles.card}>
        <Text style={styles.label}>Product:</Text>
        <Text style={styles.value}>{line?.product_id?.name}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{line?.name}</Text>

        <Text style={styles.label}>Quantity:</Text>
        <TextInputCompo
          placeholder="Enter quantity"
          value={String(line.product_uom_qty)}
          onChangeText={value => handleChange(index, 'product_uom_qty', value)}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Delivered Quantity:</Text>
        <TextInputCompo
          placeholder="Enter delivered qty"
          value={String(line.qty_delivered)}
          onChangeText={value => handleChange(index, 'qty_delivered', value)}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Return Quantity:</Text>
        <TextInputCompo
          placeholder="Enter return qty"
          value={String(line.return_quantity)}
          onChangeText={value => handleChange(index, 'return_quantity', value)}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Unit Price:</Text>
        <TextInputCompo
          placeholder="Enter price"
          value={String(line.price_unit)}
          onChangeText={value => handleChange(index, 'price_unit', value)}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Discount (₹):</Text>
        <TextInputCompo
          placeholder="Enter discount"
          value={String(line.discount)}
          onChangeText={value => handleChange(index, 'discount', value)}
          style={styles.input}
          keyboardType="numeric"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...styles.label, fontSize: 18, fontWeight: '800' }}>
            Subtotal:
          </Text>
          <Text style={{ ...styles.value, fontSize: 18, fontWeight: '800' }}>
            {line.price_subtotal.toFixed(2)}
          </Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {renderOrderLines()}
      {/* <ButtonCompo title='Add New Line' onPress={()=>fetchOption(Item?.id,'store_order_form','product',null)}/> */}
      <ButtonCompo title="Add New Line" onPress={handleOption} />
      <ButtonCompo title="Save Order" onPress={handleSave} />
      {/* <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveText}>Save Order</Text>
      </TouchableOpacity> */}
      <Loader visible={isLoding} />
      <OptionModal isVisible={isVisible} onClose={() => setisVisible(false)}
      item={optiondata} 
      id={Item?.id}/>
    </View>
  );
};

export default Editable;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.blackColor,
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blackColor,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: COLORS.primary || '#007bff',
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
