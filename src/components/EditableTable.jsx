// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   ScrollView,
//   TextInput,
// } from 'react-native';
// import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
// import Dropdowncomp from '../components/Dropdowncomp'; // adjust path as needed

// const EditableScrollableTable = () => {
//   const tableHead = ['Product', 'Description', 'Quantity', 'Delivered Quantity', 'Return Quantity', 'UnitPrice', 'Discount Price', 'Taxes', 'Subtotal'];
//   const widthArr = [120, 120, 80, 100, 120, 140, 160, 180, 200];

//   const generateInitialData = () => {
//     const data = [];
//     for (let i = 0; i < 3; i++) {
//       const row = [];
//       for (let j = 0; j < 9; j++) {
//         row.push(''); // Start with empty fields
//       }
//       data.push(row);
//     }
//     return data;
//   };

//   const [tableData, setTableData] = useState(generateInitialData());

//   const dummyDropdownData = [
//     { label: 'Option 1', value: 'opt1' },
//     { label: 'Option 2', value: 'opt2' },
//     { label: 'Option 3', value: 'opt3' },
//   ];

//   const handleCellChange = (value, rowIndex, colIndex) => {
//     const updatedData = [...tableData];
//     updatedData[rowIndex][colIndex] = value;
//     setTableData(updatedData);
//   };

//   const renderInputCell = (cellData, rowIndex, colIndex) => {
//     const isDropdownColumn = colIndex === 0 || colIndex === 7; 
//     if (isDropdownColumn) {
//       return (
//         <Dropdowncomp
//           data={dummyDropdownData}
//           value={cellData}
//           onChange={(item) => handleCellChange(item.value, rowIndex, colIndex)}
//         />
//       );
//     }

//     return (
//       <TextInput
//         style={[styles.input, { width: widthArr[colIndex] }]}
//         value={cellData}
//         onChangeText={(text) => handleCellChange(text, rowIndex, colIndex)}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView horizontal>
//         <View>
//           <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
//             <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
//           </Table>
//           <ScrollView style={styles.dataWrapper}>
//             <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
//               {tableData.map((rowData, rowIndex) => (
//                 <TableWrapper key={rowIndex} style={[styles.row, rowIndex % 2 && { backgroundColor: '#F7F6E7' }]}>
//                   {rowData.map((cellData, colIndex) => (
//                     <Cell
//                       key={colIndex}
//                       data={renderInputCell(cellData, rowIndex, colIndex)}
//                       style={{ width: widthArr[colIndex] }}
//                     />
//                   ))}
//                 </TableWrapper>
//               ))}
//             </Table>
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default EditableScrollableTable;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     paddingTop: 30,
//     backgroundColor: '#fff',
//   },
//   header: {
//     height: 50,
//     backgroundColor: '#537791',
//   },
//   text: {
//     textAlign: 'center',
//     fontWeight: '100',
//     color: '#fff',
//   },
//   dataWrapper: {
//     marginTop: -1,
//   },
//   row: {
//     height: 50,
//     flexDirection: 'row',
//     backgroundColor: '#E7E6E1',
//     alignItems: 'center',
//   },
//   input: {
//     height: 45,
//     paddingHorizontal: 5,
//     borderColor: '#ccc',
//     borderWidth: 0.5,
//     textAlign: 'center',
//   },
// });


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EditableTable = () => {
  return (
    <View style={{padding:10}}>
      {/* <Text>EditableTable</Text> */}
    </View>
  )
}

export default EditableTable

const styles = StyleSheet.create({})