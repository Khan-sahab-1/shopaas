import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const FILTRED_DATA = [
  { name: 'Order Date', value: 'date' },
  { name: 'Reference', value: 'name' },
  { name: 'Stage', value: 'stage' },
];

const MyOrderfilterModal = ({ isvisible, onclose, onselect }) => {
  return (
    <Modal visible={isvisible} onRequestClose={onclose} transparent animationType="slide">
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onclose}>
        <View style={styles.whitebox}>
          {FILTRED_DATA.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                onselect(item);   
                onclose();        
              }}
            >
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MyOrderfilterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  whitebox: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 25,
    maxHeight: '70%',
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
