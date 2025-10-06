import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import MenuComponent from './MenuComponent';

const FoodItem = ({ item }) => {
  const data = [item];
  const [selected, setSelected] = useState(['Recommended']);

  const handleItemSelect = item => {
    const itemSelected = selected.find(c => c === item);
    if (itemSelected) {
      setSelected(selected.filter(selec => selec !== item));
    } else {
      setSelected([...selected, item]);
    }
  };
  return (
    <View>
      {data?.map((item, ind) => (
        <>
          {/* 
                    Always showing recommended but when clicked down arrow it will hide and 
                    for whatever (recommended/rice) you selects, item will be shown
                */}
          <Pressable
            onPress={() => handleItemSelect(item.name)}
            key={ind}
            style={{
              margin: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {item.name} ({item.items.length})
            </Text>
            <AntDesign name="down" size={24} color="black" />
          </Pressable>
          {/* {selected.includes(item.name) ?
                        (
                            item.items.map((food, index) => (
                                <MenuComponent food={food} key={index} />
                            ))
                        ) : null
                    } */}
        </>
      ))}
    </View>
  );
};

export default FoodItem;

const styles = StyleSheet.create({});
