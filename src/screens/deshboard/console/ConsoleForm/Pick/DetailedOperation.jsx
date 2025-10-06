import {StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import Dropdowncomp from '../../../../../components/Dropdowncomp';

const DetailedOperation = ({
  data,
  trackChanges,
  setTrackChanges,
  isEditable,
}) => {
  // Convert object to array and map to proper table format
  console.log(data?.move_line_ids_without_package);
  const [selectedLot,setselectedLot]=useState(null)
  console.log(selectedLot,'pppppp')
  const formatData = () => {
    if (!data || !data.move_line_ids_without_package) return [];

    return Object.values(data.move_line_ids_without_package).map(item => ({
      id: item.id,
      product: item.product_id?.name || 'N/A',
      from: item.location_id?.name || 'N/A',
      lotNo: item.lot_id || 'No Lot',
      reserve: item.product_uom_qty || 0,
      done: item.qty_done || 0,
      lot_options: item?.lot_options || [],
      lot_id: item.lot_id?.id
      ? { id: item.lot_id.id, name: item.lot_id.name } 
      : null,
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

  // const handleDoneChange = (index, value) => {
  //   let numericValue = parseInt(value) || 0;
  //   if (numericValue > tableData[index].reserve) {
  //     numericValue = tableData[index].reserve;
  //   }

  //   const updatedData = [...tableData];
  //   updatedData[index].done = numericValue;
  //   setTableData(updatedData);

  //   // ✅ Update trackChanges state correctly
  //   setTrackChanges(prev => ({
  //     ...prev,
  //     move_line_ids_without_package: {
  //       ...prev.move_line_ids_without_package,
  //       [updatedData[index].id]: {qty_done: numericValue,lot_id:selectedLot},
  //     },
  //   }));
  // };


  const handleDoneChange = (index, value) => {
    let numericValue = parseInt(value) || 0;
    if (numericValue > tableData[index].reserve) {
      numericValue = tableData[index].reserve;
    }
  
    const updatedData = [...tableData];
    updatedData[index].done = numericValue;
    setTableData(updatedData);
  
    setTrackChanges(prev => {
      const updateObj = { qty_done: numericValue };
  
      // ✅ Include lot_id only if selected in that row
      if (updatedData[index].lot_id?.id) {
        updateObj.lot_id = updatedData[index].lot_id.id;
      }
  
      return {
        ...prev,
        move_line_ids_without_package: {
          ...prev.move_line_ids_without_package,
          [updatedData[index].id]: updateObj,
        },
      };
    });
  };
  
  const handleLotChange = (index, value, label) => {
    const updatedData = [...tableData];
    updatedData[index].lot_id = { id: value, name: label };
    setTableData(updatedData);
  
    setTrackChanges(prev => ({
      ...prev,
      move_line_ids_without_package: {
        ...prev.move_line_ids_without_package,
        [updatedData[index].id]: {
          ...prev.move_line_ids_without_package?.[updatedData[index].id],
          lot_id: value,
        },
      },
    }));
  };
  



  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, styles.productColumn]}>Product</Text>
      <Text style={[styles.headerText, styles.fromColumn]}>From</Text>
      <Text style={[styles.headerText, styles.lotColumn]}>Lot/Serial Number</Text>
      <Text style={[styles.headerText, styles.reserveColumn]}>Reserve</Text>
      <Text style={[styles.headerText, styles.doneColumn]}>Done</Text>
    </View>
  );

  const renderTableRow = (item, index) => {
    // console.log(item, 'CURRENT ITEM');
    // console.log(item.lot_options, 'LOT OPTIONS');
    const dropdowndata = (item.lot_options || []).map(lot => ({
      label: lot.lot_name,
      value: lot.lot_id,
    }));

    // console.log(dropdowndata);

    return (
      <View
        key={item.id}
        style={[
          styles.tableRow,
          index % 2 === 0 ? styles.evenRow : styles.oddRow,
        ]}>
        <Text style={[styles.cellText, styles.productColumn]}>
          {item.product}
        </Text>
        <Text style={[styles.cellText, styles.fromColumn]}>{item.from}</Text>

        {/* <Text style={[styles.cellText, styles.lotColumn]}>{item.lotNo}</Text> */}
        {item?.lot_options?.length > 0 ? (
          <Dropdowncomp
            data={item.lot_options.map(lot => ({
              label: lot.lot_name,
              value: lot.lot_id,
            }))}
            value={item.lot_id?.id || selectedLot} 
            placeholder="Select Lot"
            style={{height: 35, borderWidth: 0.1,width:100}}
            onChange={selected => {
              handleLotChange(index, selected.value, selected.label);
            }}
          />
        ) : (
          <Text style={[styles.cellText, styles.lotColumn]}>
            {item.lot_id?.name || ' '}
          </Text>
        )}

        <Text style={[styles.cellText, styles.reserveColumn]}>
          {item.reserve}
        </Text>
        <TextInput
          style={[styles.cellText, styles.doneColumn, styles.input]}
          keyboardType="numeric"
          value={String(item.done)}
          onChangeText={text => handleDoneChange(index, text)}
          editable={isEditable}
        />
      </View>
    );
  };

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

export default DetailedOperation;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#f5f5f5'},
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  evenRow: {backgroundColor: '#f9f9f9'},
  oddRow: {backgroundColor: '#fff'},
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    textAlign: 'center',
  },
  productColumn: {width: 200},
  fromColumn: {width: 150},
  lotColumn: {width: 100},
  reserveColumn: {width: 80},
  doneColumn: {width: 100},
});
