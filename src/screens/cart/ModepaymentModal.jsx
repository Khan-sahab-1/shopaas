import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Modal} from 'react-native';
import {COLORS} from '../../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons'; // make sure you installed this

const ModepaymentModal = ({isVisible, onclose}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {id: 'home', label: 'Home Delivery'},
    {id: 'pickup', label: 'Pickup - Free'},
    {id: 'cod', label: 'COD'},
  ];

  const handleSelect = id => {
    setSelectedOption(id);
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onclose}
      transparent
      animationType="slide">
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onclose}>
        <View style={styles.whiteBox}>
          <Text style={styles.title}>Select Mode of Delivery</Text>

          {options.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={styles.optionRow}
              onPress={() => handleSelect(opt.id)}>
              <Icon
                name={selectedOption === opt.id ? 'checkbox' : 'square-outline'}
                size={22}
                color={
                  selectedOption === opt.id
                    ? COLORS.primaryColor
                    : COLORS.grayColor
                }
              />
              <Text style={styles.label}>{opt.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => {
              console.log('Selected:', selectedOption);
              onclose();
            }}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModepaymentModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  whiteBox: {
    backgroundColor: COLORS.whiteColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.blackColor,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.blackColor,
    marginLeft: 10,
  },
  doneBtn: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  doneText: {
    color: COLORS.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
});
