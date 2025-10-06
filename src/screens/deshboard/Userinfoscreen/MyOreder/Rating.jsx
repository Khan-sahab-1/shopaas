import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputCompo from '../../../../components/TextInputCompo';
import makeApiCall from '../../../../utils/apiHelper';
import { API_URLS } from '../../../../utils/apiurls';
const RatingModal = ({ visible, onClose, item }) => {
    console.log(item?.star_rating_count, 'ITEMSRATINGS');
  const [rating, setRating] = useState(item?.star_rating_count||0);
  const [message, setmessage] = useState('');

  const handleStarPress = value => {
    setRating(value);
  };

  const handlestar = async () => {
    const payLoad={
        partner_id: item?.partner_id || item?.partner?.id, 
        order_id: item?.id,
        message: message,
        rating: rating,
    }
    console.log(payLoad,'pyLoad')
    try {
      if (!item) return;
      const res = await makeApiCall(API_URLS.sendFeedback, 'POST', {
        jsonrpc: '2.0',
        params: payLoad,
      });
  
      console.log('Feedback Response:', res);
  
      // Close modal after success
      onClose();
      // Reset fields
      setRating(0);
      setmessage('');
    } catch (error) {
      console.log('Error sending feedback:', error);
    }
  };
  
   
   

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Rate your experience</Text>

          {/* Stars */}
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color="#FFD700"
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInputCompo
            multiline
            style={{
              height: 100,
              borderWidth: 1,
              width: '100%',
              marginVertical: 20,
            }}
            placeholder="Message"
            onChangeText={item => setmessage(item)}
            value={message}
          />
          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handlestar}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  submitBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
