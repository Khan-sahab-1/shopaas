


import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import style from '../DataTransfer/style'
import { COLORS } from '../../../../../styles/colors'

const BackorderModal = ({ isvisible, onclose, data, onButtonPress }) => {
  console.log(data, 'BACKORDER DATA')

  const handleButtonPress = (action) => {
    console.log(action, 'ACTION')
    if (onButtonPress) {
      onButtonPress(action)
    }
    onclose()
  }

  if (!data) return null

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isvisible}
        onRequestClose={onclose}
      >
        <TouchableOpacity 
          style={styles.container}
          activeOpacity={1}
          onPress={onclose}
        >
          <TouchableOpacity 
            style={styles.modalView}
            activeOpacity={1}
            onPress={() => {}} // Prevent modal close when touching content
          >
            {/* Modal Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{data.title || 'Confirmation'}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onclose}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={styles.content}>
              <Text style={styles.message}>
                {data.message}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {data.buttons && Object.entries(data.buttons).map(([buttonText, action]) => (
                <TouchableOpacity
                  key={action}
                  style={[
                    styles.button,
                    action === 'process' ? styles.primaryButton : styles.secondaryButton
                  ]}
                  onPress={() => handleButtonPress(action)}
                >
                  <Text style={[
                    styles.buttonText,
                    action === 'process' ? styles.primaryButtonText : styles.secondaryButtonText
                  ]}>
                    {buttonText}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

export default BackorderModal

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2  
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold'
  },
  content: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'left'
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44
  },
  primaryButton: {
    backgroundColor: '#4a90e2'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  primaryButtonText: {
    color: COLORS.whiteColor || '#fff'
  },
  secondaryButtonText: {
    color: '#666'
  }
})