import { Modal, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import TextInputCompo from '../../../../../../components/TextInputCompo'
import Dropdowncomp from '../../../../../../components/Dropdowncomp'
import { COLORS } from '../../../../../../styles/colors'
import ImagePicker from 'react-native-image-crop-picker'

const MediaModal = ({ isVisible, onClose,item }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [name, setName] = useState('')
  const [dropdownValue, setDropdownValue] = useState(null)
  console.log(item,'ITEMS')

  const media = item?.result?.all_ecommerce_data?.extra_media_form_option?.companies || [];

  const dropdowndata = media.map(company => ({
    label: company?.name || 'Unknown',
    value: company?.id ?? '',
  }));
  
  console.log('Media', dropdowndata);
  
  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      })
      setSelectedImage({ uri: image.path })
    } catch (error) {
      console.log('Image selection cancelled', error)
    }
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Upload Media</Text>

          {/* Name input */}
          <TextInputCompo
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
            style={{ borderWidth:1,borderRadius:10,marginBottom:10}}
          />

          {/* Dropdown */}
          <Dropdowncomp
            data={dropdowndata}
            placeholder={'Selecet Companey'}
            value={dropdownValue}
            onChange={setDropdownValue}
          />

          {/* Upload Button */}
          <TouchableOpacity style={styles.uploadBtn} onPress={openGallery}>
            <Text style={styles.uploadText}>
              {selectedImage ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>

          {/* Show selected image */}
          {selectedImage && (
            <Image source={selectedImage} style={styles.imagePreview} />
          )}

          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default MediaModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.whiteColor,
    padding: 20,
    borderRadius: 12,
    width: '85%',
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.black,

  },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  uploadText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 15,
    alignSelf: 'center',
  },
  closeBtn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.red,
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.white,
    fontWeight: '600',
  },
})
