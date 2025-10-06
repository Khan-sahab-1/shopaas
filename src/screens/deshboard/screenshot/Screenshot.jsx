import React, { useState } from 'react';
import { 
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from "react-native-image-crop-picker";
import ButtonCompo from '../../../components/ButtonCompo';
import { COLORS } from '../../../styles/colors';
import TextInputCompo from '../../../components/TextInputCompo';

const Screenshot = ({ isVisible, onclose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [comment,setComment]=useState('')

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      console.log('Captured image:', image);
      setSelectedImage(image.path);
    } catch (err) {
      console.log('Camera error:', err);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      console.log('Picked image:', image);
      setSelectedImage(image.path);
    } catch (err) {
      console.log('Gallery error:', err);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  return (
    <Modal 
      visible={isVisible} 
      onRequestClose={onclose} 
      transparent 
      animationType="slide"
    >
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={1} 
        onPress={onclose}
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity activeOpacity={1} style={styles.whiteBox}>
            <Text style={styles.title}>Upload Screenshot</Text>
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.imagePreview} 
              />
            )}

            <TextInputCompo placeholder='Comment:'
            style={{...styles.inputBox}}
            onChangeText={(text)=>setComment(text)}
            value={comment}/>

            <ButtonCompo title='Open Camera' onPress={openCamera}/>
            <View style={{ height: 10 }} />
            <ButtonCompo title='Choose from Gallery' onPress={openGallery}/>

            <ButtonCompo title='Proceed'/>

            
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

export default Screenshot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  whiteBox: {
    backgroundColor: COLORS.whiteColor,
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  inputBox:{
    height:100,
    borderWidth:1,
    marginTop:10,
    borderRadius:10
  }
});
