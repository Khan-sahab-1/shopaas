import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../../../../styles/colors';


const Note = () => {
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Enter your note here..."
        multiline={true}
        numberOfLines={6} // initial visible lines
        textAlignVertical="top" // ensures text starts at the top
      />
    </View>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.whiteColor, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    height:100
  },
});
