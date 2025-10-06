import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const SuccessfullModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.whitebox}>
          <LottieView
            source={require('../assets/lottie/placedorder.json')}
            autoPlay
            loop={false}
            style={{ width: 100, height: 100 }}
          />
          <Text style={styles.successText}>Success!</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SuccessfullModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whitebox: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#4CAF50',
  },
});
