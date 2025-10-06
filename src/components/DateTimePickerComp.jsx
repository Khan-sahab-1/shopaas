import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateTimePickerComp = ({
  isVisible,
  mode = 'date',
  onConfirm,
  onCancel,
  minimumDate = null,
  maximumDate = null,
}) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      onConfirm={onConfirm}
      onCancel={onCancel}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );
};

export default DateTimePickerComp;