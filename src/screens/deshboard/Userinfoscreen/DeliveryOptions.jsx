// DeliveryOptions.js
import React from 'react';
import { View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const DeliveryOptions = ({ options, selectedOption, onSelectOption }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {options.map((option, index) => (
        <View
          key={index}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
        >
          <CheckBox
            value={selectedOption === option}
            onValueChange={() => onSelectOption(option)}
          />
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  );
};

export default DeliveryOptions;
