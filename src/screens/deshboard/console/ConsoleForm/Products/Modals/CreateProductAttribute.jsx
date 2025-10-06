import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    FlatList,
    TextInput,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import TextInputCompo from '../../../../../../components/TextInputCompo';
  import { COLORS } from '../../../../../../styles/colors';
  import Loader from '../../../../../../components/Loader';
  import makeApiCall from '../../../../../../utils/apiHelper';
  import { API_URLS } from '../../../../../../utils/apiurls';
  import ButtonCompo from '../../../../../../components/ButtonCompo';
  
  const CreateProductAttribute = ({ isVisible, onClose }) => {
    const [attributeData, setAttributeData] = useState({});
    const [tableData, setTableData] = useState([]);
    const [attributeName, setAttributeName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    // Fetch attribute data from API
    const fetchAttribute = async (attribute) => {
      try {
        setIsLoading(true);
        const response = await makeApiCall(API_URLS.ProductAttributeForm, 'POST', {
          jsonrpc: '2.0',
          params: { attributeId: attribute },
        });
        console.log('ATTRIBUTE VALUE', response);
        if (response?.result?.message === 'success') {
          setAttributeData(response?.result?.attribute_data);
          setTableData([
            {
              id: '0',
              value: '',
              isCustom: false,
              company: response?.result?.attribute_data?.company_name || '',
              companyType: response?.result?.attribute_data?.company_type_name || '',
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchAttribute('New');
    }, []);
  
    // Add new row to table
    const addNewLine = () => {
      const newId = tableData.length.toString();
      setTableData([
        ...tableData,
        {
          id: newId,
          value: '',
          isCustom: false,
          company: attributeData?.company_name || '',
          companyType: attributeData?.company_type_name || '',
        },
      ]);
    };
  
    // Update value for a specific row
    const updateRowValue = (id, newValue) => {
      const updatedData = tableData.map((row) =>
        row.id === id ? { ...row, value: newValue } : row
      );
      setTableData(updatedData);
    };
  
    // Handle Save
    const handleSave = async () => {
      if (!attributeName.trim()) {
        alert('Please enter Attribute Name');
        return;
      }
  
      // Prepare values object dynamically
      const values = {};
      tableData.forEach((row, index) => {
        values[`New${index}`] = { name: row.value };
      });
  
      const payload = {
        jsonrpc: '2.0',
        params: {
          attributeId: 'New',
          Updatedata: {
            name: attributeName,
            values: values,
          },
        },
      };
  
      console.log('Submitting Payload:', payload);
  
      try {
        setIsLoading(true);
        const response = await makeApiCall(API_URLS.ProductAttributeForm, 'POST', payload);
        console.log('Response=====:', response);
        if (response?.result?.message === 'success') {
        onClose()
        } else {
          alert('Failed to save attribute');
        }
      } catch (error) {
        console.log(error);
        alert('Error saving attribute');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Modal visible={isVisible} onRequestClose={onClose} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <View style={styles.container}>
            <Text style={styles.title}>Create Attribute</Text>
  
            <Text style={styles.label}>Attribute Name</Text>
            <TextInputCompo
              placeholder="Enter Attribute name"
              style={styles.inputBox}
              value={attributeName}
              onChangeText={setAttributeName}
            />
  
            <ScrollView horizontal>
              <View style={styles.table}>
                {/* Header */}
                <View style={[styles.row, styles.header]}>
                  <Text style={styles.cell}>Value</Text>
                  <Text style={styles.cell}>isCustom</Text>
                  <Text style={styles.cell}>Company</Text>
                  <Text style={styles.cell}>Company Type</Text>
                </View>
  
                {/* Rows */}
                <FlatList
                  data={tableData}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <TextInput
                        style={styles.cell}
                        placeholder="Enter Value"
                        value={item.value}
                        onChangeText={(text) => updateRowValue(item.id, text)}
                      />
                      <Text style={styles.cell}>{item.isCustom ? 'true' : 'false'}</Text>
                      <Text style={styles.cell}>{item.company}</Text>
                      <Text style={styles.cell}>{item.companyType}</Text>
                    </View>
                  )}
                />
              </View>
            </ScrollView>
  
            <ButtonCompo
              title="Add New Line"
              style={{ width: '50%', backgroundColor: COLORS.blueColor, marginTop: 10 }}
              onPress={addNewLine}
            />
  
            {/* Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
  
        <Loader visible={isLoading} />
      </Modal>
    );
  };
  
  export default CreateProductAttribute;
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: COLORS.whiteColor,
      padding: 20,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: COLORS.blackColor,
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.blackColor,
      marginBottom: 5,
    },
    inputBox: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 45,
      marginBottom: 15,
    },
    button: {
      backgroundColor: COLORS.blueColor,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 15,
    },
    buttonText: {
      color: COLORS.whiteColor,
      fontSize: 16,
      fontWeight: '600',
    },
    table: { borderWidth: 1, borderColor: '#ccc', marginTop: 10 },
    row: { flexDirection: 'row' },
    header: { backgroundColor: '#eee' },
    cell: { padding: 10, width: 120, borderWidth: 1, borderColor: '#ccc' },
  });
  