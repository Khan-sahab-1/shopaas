import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const StateChangeModal = ({ isvisible, onclose, item }) => {
  console.log('Data', item.states);

  const ArrayData = item?.states
    ? Object.entries(item.states).map(([key, label]) => ({ key, label }))
    : [];

  const handleStateChange = (stateKey, stateValue) => {
    // Handle state change logic here
    console.log('Selected state:', stateKey, stateValue);
    onclose();
  };

  return (
    <>
      <Modal
        visible={isvisible}
        onRequestClose={onclose}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={styles.container}
          onPress={onclose}
          activeOpacity={1}
        >
          <TouchableOpacity style={styles.whitebox} activeOpacity={1}>
            <Text style={styles.title}>Change State</Text>

            {ArrayData.map(state => (
              <TouchableOpacity
                key={state.key}
                style={styles.stateButton}
                onPress={() => handleStateChange(state.key, state.label)}
              >
                <Text style={styles.stateText}>{state.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.cancelButton} onPress={onclose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default StateChangeModal;

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
    alignItems: 'center',
    maxHeight: '70%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  stateButton: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  stateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
