import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../styles/colors';
import TextInputCompo from './TextInputCompo';

const Commoncard = ({ item ,editShow,setdeliveredData}) => {
  console.log(editShow)
  console.log(item, 'Item');
  const [lines, setLines] = useState([]);
  console.log(lines,'LINESSSSS')

  // Initialize lines state when item changes
  useEffect(() => {
    if (item?.move_line_ids_without_package) {
      setLines(Object.values(item.move_line_ids_without_package));
    }
  }, [item]);

  const updateLineQty = (lineId, qty) => {
    const updatedLines = lines.map((line) =>
      line.id === lineId ? { ...line, qty_done: qty } : line
    );
    setLines(updatedLines);
    setdeliveredData()
  };

  return (
    <>
      <View style={{ width: '100%' }}>
        {lines.map((line, index) => (
          <View key={line.id || index} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Product:</Text>
              <Text style={styles.cardValue}>
                {line?.product_id?.name || 'N/A'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.cardTitle}>From:</Text>
              <Text style={styles.cardValue}>
                {line?.location_id?.name || '0'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.cardTitle}>Reserved:</Text>
              <Text style={styles.cardValue}>
                {line?.product_uom_qty || 'NA'}
              </Text>
            </View>

            {/* <View style={styles.row}>
              <Text style={styles.cardTitle}>Done:</Text>
              <Text style={styles.cardValue}>{line?.qty_done || '0'}</Text>
            </View> */}
            
            {editShow?<View style={styles.inputContainer}>
              <Text style={styles.cardTitle}>Done:</Text>
              <View style={styles.inputBox}>
                <TextInputCompo
                  value={line.qty_done !== undefined ? String(line.qty_done) : ''}
                  placeholder="Enter Qty"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    // Allow empty input
                    if (text === '') {
                      updateLineQty(line.id, 0);
                      return;
                    }

                    // Allow only digits
                    let numericValue = text.replace(/[^0-9]/g, '');
                    
                    // Convert to number, default to 0 if empty
                    let inputQty = numericValue === '' ? 0 : parseInt(numericValue, 10);
                    
                    // Restrict max to product_uom_qty (allow equal values)
                    if (inputQty > line?.product_uom_qty) {
                      inputQty = line?.product_uom_qty;
                    }

                    // Update qty_done in state
                    updateLineQty(line.id, inputQty);
                  }}
                />
              </View>
            </View>:<View style={styles.row}>
              <Text style={styles.cardTitle}>Done:</Text>
              <Text style={styles.cardValue}>{line?.qty_done || '0'}</Text>
            </View>}
          </View>
        ))}
      </View>
    </>
  );
};

export default Commoncard;

const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 15
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.blackColor,
  },
  inputBox: {
    borderRadius: 10,
    borderWidth: 1,
    width: 120,
    paddingHorizontal: 10,
  },
});