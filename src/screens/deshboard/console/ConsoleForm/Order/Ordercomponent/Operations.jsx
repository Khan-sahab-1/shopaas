// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, TextInput } from 'react-native';
// import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
// import { COLORS } from '../../../../../../styles/colors';

// const Operations = ({ FormatedData = [],ButtonStatus={} ,setTableinfo}) => {
//   const [tableData, setTableData] = useState([]);
//   useEffect(() => {
//     const data = FormatedData.map(item => ({
//       product: item.product_id?.name || '',
//       from: item.location_id?.name || '',
//       lot: item.lot_id?.name || '—',
//     //   product_uom_qty:item?.product_uom_qty,
//       reserved: item.product_uom_qty?.toString() || '0',
//       done: item.quantity_done?.toString() || '0',
//     }));
//     setTableData(data);
//     // setTableinfo(data)
//   }, [FormatedData,]);
 


//   console.log(FormatedData,'UpdatedTable data')
// //   setTableinfo(tableData,'TableData')

//   const handleInputChange = (value, index) => {
//     const updatedData = [...tableData];
//     updatedData[index].done = value;
//     setTableData(updatedData);
//   };

//   const tableHead = ['Product', 'Deemand', 'Done'];

//   return (
//     <View style={styles.container}>
//       <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
//         <Row
//           data={tableHead}
//           flexArr={[2, 2, 2, 1, 1]}
//           style={styles.head}
//           textStyle={styles.text}
//         />

//         {tableData.map((rowData, index) => (
//           <TableWrapper key={index} style={styles.row}>
//             <Cell data={rowData.product} textStyle={styles.text} flex={2} />
//             {/* <Cell data={rowData.from} textStyle={styles.text} flex={2} />
//             <Cell data={rowData.lot} textStyle={styles.text} flex={2} /> */}
//             <Cell data={rowData.reserved} textStyle={styles.text} flex={2} />
//             <Cell
//               flex={2}
//               data={
//                 <TextInput
//                   style={styles.input}
//                   value={rowData.done}
//                   onChangeText={value => handleInputChange(value, index)}
//                   keyboardType="numeric"
//                  editable={ButtonStatus?.show_edit?true:false}
//                 />
//               }
//             />
//           </TableWrapper>
//         ))}
//       </Table>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10, paddingTop: 20, backgroundColor: '#fff' },
//   head: { height: 40, backgroundColor: '#f1f8ff' },
//   row: { flexDirection: 'row', height: 40, backgroundColor: '#fff' },
//   text: { textAlign: 'center', fontSize: 14, color: COLORS.blackColor },
//   input: {
//     height: 38,
//     textAlign: 'center',
//     fontSize: 14,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     padding: 4,
//     color: COLORS.blackColor,
//   },
// });

// export default Operations;


import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { COLORS } from '../../../../../../styles/colors';

const Operations = ({ FormatedData = [], ButtonStatus = {}, setTableinfo }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const data = FormatedData.map(item => ({
      id: item.id, 
      product: item.product_id?.name || '',
      from: item.location_id?.name || '',
      lot: item.lot_id?.name || '—',
      reserved: item.product_uom_qty?.toString() || '0',
      done: item.quantity_done?.toString() || '0',
      originalData: item 
    }));
    setTableData(data);
  }, [FormatedData]);




  const handleInputChange = (value, index) => {
    const updatedData = [...tableData];
    updatedData[index].done = value;
    setTableData(updatedData);
    // setTableinfo(updatedData)
  };

  const tableHead = ['Product', 'Demand', 'Done'];

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
        <Row
          data={tableHead}
          flexArr={[2, 2, 2]}
          style={styles.head}
          textStyle={styles.text}
        />

        {tableData.map((rowData, index) => (
          <TableWrapper key={index} style={styles.row}>
            <Cell data={rowData.product} textStyle={styles.text} flex={2} />
            <Cell data={rowData.reserved} textStyle={styles.text} flex={2} />
            <Cell
              flex={2}
              data={
                <TextInput
                  style={styles.input}
                  value={rowData.done}
                  onChangeText={value =>{ handleInputChange(value, index)
                    // setTableinfo(value)
                  }}
                  keyboardType="numeric"
                  editable={ButtonStatus?.show_edit ? true : false}
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
  text: { textAlign: 'center', fontSize: 14, color: COLORS.blackColor },
  input: {
    height: 38,
    textAlign: 'center',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    color: COLORS.blackColor,
  },
});

export default Operations;
