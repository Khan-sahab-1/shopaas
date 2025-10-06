import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import SingledropdownPicker from '../components/SingledropdownPicker';
import { COLORS } from '../styles/colors';
import ButtonCompo from '../components/ButtonCompo';

const FilterModal = ({
  isVisible,
  onClose,
  sortByOptions,
  filterByOptions,
  onApplyFilters,
}) => {
  //   console.log('FilterBy', filterByOptions);
  const [selectedSortBy, setSelectedSortBy] = useState(null);
  const [selectedFilterBy, setSelectedFilterBy] = useState(null);
  const [selectedGroupBy, setSelectedGroupBy] = useState(null);
  const dropdownItems = Array.isArray(sortByOptions)
    ? sortByOptions.map(item => ({
        label: item.name,
        value: item.value,
      }))
    : [];

  const dropdownItemsOption = Array.isArray(filterByOptions)
    ? filterByOptions.map(item => ({
        label: item.name,
        value: item.value,
      }))
    : [];
  //   console.log(dropdownItemsOption, '00000000');
  const handleApply = () => {
    const selectedFilters = {
      sortBy: selectedSortBy,
      filterBy: selectedFilterBy,
      groupBy: selectedGroupBy,
    };
    console.log('Selected Filters =>', selectedFilters);
    onApplyFilters(selectedFilters);
    onClose();
  };
  return (
    <>
      <Modal visible={isVisible} onRequestClose={onClose} transparent>
        <TouchableOpacity style={{ ...styles.container }} onPress={onClose}>
          <View style={{ ...styles.whitebox }}>
            <Text style={styles.title}>Change State</Text>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: COLORS.blackColor,
                  //   paddingVertical: 8,
                }}
              >
                Sort by
              </Text>
              <SingledropdownPicker
                items={dropdownItems}
                dropDownDirection={'TOP'}
                search={false}
                placeholder={'Sort by'}
                color={COLORS.GARY}
                onSelect={item => setSelectedSortBy(item.value)}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: COLORS.blackColor,
                  //   paddingVertical: 8,
                }}
              >
                Filter by
              </Text>
              <SingledropdownPicker
                items={dropdownItemsOption}
                dropDownDirection={'TOP'}
                search={false}
                placeholder={'Filter by'}
                color={COLORS.GARY}
                onSelect={item => setSelectedFilterBy(item.value)}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: COLORS.blackColor,
                  //   paddingVertical: 8,
                }}
              >
                Group by
              </Text>
              <SingledropdownPicker
                items={[
                  { label: 'Status', value: 'state' },
                  //   { label: 'Option 2', value: 2 },
                ]}
                dropDownDirection={'TOP'}
                search={false}
                placeholder={'Group by'}
                color={COLORS.GARY}
                onSelect={item => setSelectedGroupBy(item.value)}
              />
            <ButtonCompo title='Apply' onPress={handleApply}/> 
            </View>
            {/* <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: COLORS.blackColor,
                  //   : 8,
                }}
              >
                Group by
              </Text>
              <SingledropdownPicker
                items={[
                  { label: 'Option 1', value: 1 },
                  { label: 'Option 2', value: 2 },
                ]}
                dropDownDirection={'TOP'}
              />
            </View> */}
            {/* <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={{ color: COLORS.blackColor, fontWeight: 'bold' }}>
                Apply
              </Text>
            </TouchableOpacity> */}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  whitebox: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 25,
    alignItems: 'center',
    maxHeight: '70%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
