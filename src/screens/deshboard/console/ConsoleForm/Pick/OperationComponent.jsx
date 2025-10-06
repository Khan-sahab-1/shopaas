import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';

const OperationComponent = ({ data ,trackChanges, setTrackChanges,isEditable}) => {
  // Convert object to array and map to proper table format
//   console.log(data,'DATA')
  const formatData = () => {
    if (!data || !data.move_ids_without_package) return [];

    return Object.values(data.move_ids_without_package).map(item => ({
      id: item.id,
      product: item.product_id?.name || 'N/A',
      reserve: item.product_uom_qty || 0,
      done: item.quantity_done || 0,
    }));
  };

  const [tableData, setTableData] = useState(formatData());

  useEffect(() => {
    setTableData(formatData());
  }, [data]);

//   const handleDoneChange = (index, value) => {
//     let numericValue = parseInt(value) || 0;
//     if (numericValue > tableData[index].reserve) numericValue = tableData[index].reserve;

//     const updatedData = [...tableData];
//     updatedData[index].done = numericValue;
//     setTableData(updatedData);
//   };
const handleDoneChange = (index, value) => {
    let numericValue = parseInt(value) || 0;
    if (numericValue > tableData[index].reserve) numericValue = tableData[index].reserve;
  
    const updatedData = [...tableData];
    updatedData[index].done = numericValue;
    setTableData(updatedData);
  
    // Update trackChanges state
    setTrackChanges(prev => ({
      ...prev,
      move_ids_without_package: {
        ...prev.move_ids_without_package,
        [updatedData[index].id]: { quantity_done: numericValue },
      },
    }));
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, styles.productColumn]}>Product</Text>
      <Text style={[styles.headerText, styles.fromColumn]}>Demand</Text>
      
      <Text style={[styles.headerText, styles.doneColumn]}>Done</Text>
    </View>
  );
// console.log(tableData)
  const renderTableRow = (item, index) => (
    <View key={item.id} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      <Text style={[styles.cellText, styles.productColumn]}>{item.product}</Text>
      <Text style={[styles.cellText, styles.fromColumn]}>{item.reserve}</Text>
      {/* <Text style={[styles.cellText, styles.lotColumn]}>{item.lotNo}</Text>
      <Text style={[styles.cellText, styles.reserveColumn]}>{item.reserve}</Text> */}
      <TextInput
        style={[styles.cellText, styles.doneColumn, styles.input]}
        keyboardType="numeric"
        value={String(item.done)}
        onChangeText={text => handleDoneChange(index, text)}
        editable={isEditable}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {renderTableHeader()}
          {tableData.map((item, index) => renderTableRow(item, index))}
        </View>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  table: { backgroundColor: '#fff', borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#4a90e2', paddingVertical: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  evenRow: { backgroundColor: '#f9f9f9' },
  oddRow: { backgroundColor: '#fff' },
  headerText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center', paddingHorizontal: 8 },
  cellText: { fontSize: 14, color: '#333', textAlign: 'center', paddingHorizontal: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 4, textAlign: 'center' },
  productColumn: { width: 200 },
  fromColumn: { width: 150 },
  lotColumn: { width: 100 },
  reserveColumn: { width: 80 },
  doneColumn: { width: 100 },
});

export default OperationComponent

