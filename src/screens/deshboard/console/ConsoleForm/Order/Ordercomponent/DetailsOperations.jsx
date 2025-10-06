import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { COLORS } from '../../../../../../styles/colors';

const DetailsOperations = ({ FormatedData = [], onDataChange}) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (FormatedData.length > 0) {
      const data = FormatedData.map((item, index) => ({
        id:item.id,
        product: item.product_id?.name || '',
        from: item.location_id?.name || '',
        lot: item.lot_id?.name || '—',
        reserved: item.product_uom_qty?.toString() || '0',
        done: tableData[index]?.done || item.qty_done?.toString() || '0', 
      }));
      setTableData(data);
    }
  }, [FormatedData]);
  

//   const handleInputChange = (value, index) => {
//     const updatedData = [...tableData];
//     updatedData[index].done = value;
//     setTableData(updatedData);
//   };

const handleInputChange = (value, index) => {
    const updatedData = [...tableData];
    updatedData[index].done = value;
    setTableData(updatedData);

    // 🔹 Notify parent
    if (onDataChange) {
        onDataChange(updatedData[index]); 
      }
  };

  const tableHead = ['Product', 'From', 'Lot/Serial Number', 'Reserved', 'Done'];

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
        <Row
          data={tableHead}
          flexArr={[2, 2, 2, 1, 1]}
          style={styles.head}
          textStyle={styles.text}
        />

        {tableData.map((rowData, index) => (
          <TableWrapper key={index} style={styles.row}>
            <Cell data={rowData.product} textStyle={styles.text} flex={2} />
            <Cell data={rowData.from} textStyle={styles.text} flex={2} />
            <Cell data={rowData.lot} textStyle={styles.text} flex={2} />
            <Cell data={rowData.reserved} textStyle={styles.text} flex={1} />
            <Cell
              flex={1}
              data={
                <TextInput
  style={styles.input}
  value={rowData.done}
  onChangeText={value => {
    const reservedQty = Number(rowData.reserved) || 0;
    if (Number(value) <= reservedQty) {
      handleInputChange(value, index);
    }
  }}
  keyboardType="numeric"
/>

                
              }
            />
            
          </TableWrapper>
        ))}
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 20, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  row: { flexDirection: 'row', height: 40, backgroundColor: '#fff' },
  text: { textAlign: 'center', fontSize: 14 ,color:COLORS.blackColor},
  input: {
    height: 38,
    textAlign: 'center',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    color:COLORS.blackColor
  },
});

export default DetailsOperations;
