import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import TextInputCompo from '../../../../../components/TextInputCompo';
import { COLORS } from '../../../../../styles/colors';

const Note = ({ data, trackChanges, setTrackChanges,isEditable }) => {
    
  const [note, setNote] = useState(data?.note?.note || '');

  // Update trackChanges whenever note changes
  const handleChange = text => {
    setNote(text);
    setTrackChanges(prev => ({
      ...prev,
      note: {note:text },
    }));
  };

  // Reset note if trackChanges is cleared after successful submission
  useEffect(() => {
    if (!trackChanges.note || Object.keys(trackChanges.note).length === 0) {
      setNote(data?.note?.note || '');
    }
  }, [trackChanges.note, data]);

  return (
    <View style={styles.container}>
      <TextInputCompo
        style={{
          height: 150,
          textAlignVertical: 'top',
          borderWidth: 1,
          borderColor: COLORS.blackColor,
          borderRadius: 8,
          padding: 10,
        }}
        placeholder="Write Note..."
        multiline
        onChangeText={handleChange}
        value={note}
        editable={isEditable}
      />
    </View>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
  },
});
