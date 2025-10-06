import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../../../../styles/colors';

const MultiSelectorDropdown = ({ 
  data = [], 
  value = [], 
  onChange, 
  label = "Select Items",
  placeholder = "Search...",
  maxHeight = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Filter data based on search
  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Check if an item is selected
  const isSelected = (itemValue) => {
    if (Array.isArray(value)) {
      return value.some(selectedItem => 
        (typeof selectedItem === 'object' ? selectedItem.value : selectedItem) === itemValue
      );
    }
    return false;
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    let newSelectedItems = [...value];
    
    const isCurrentlySelected = isSelected(item.value);
    
    if (isCurrentlySelected) {
      // Remove item
      newSelectedItems = newSelectedItems.filter(selectedItem =>
        (typeof selectedItem === 'object' ? selectedItem.value : selectedItem) !== item.value
      );
    } else {
      // Add item
      newSelectedItems.push(item);
    }
    
    onChange(newSelectedItems);
  };

  // Handle removing a selected item
  const handleRemoveItem = (itemValue) => {
    const newSelectedItems = value.filter(selectedItem =>
      (typeof selectedItem === 'object' ? selectedItem.value : selectedItem) !== itemValue
    );
    onChange(newSelectedItems);
  };

  // Get display text for dropdown button
  const getDisplayText = () => {
    if (!value || value.length === 0) {
      return label;
    }
    
    if (value.length === 1) {
      const item = value[0];
      return typeof item === 'object' ? item.label : 
        data.find(d => d.value === item)?.label || item;
    }
    
    return `${value.length} items selected`;
  };

  // Render dropdown item
  const renderItem = ({ item }) => {
    const selected = isSelected(item.value);
    
    return (
      <TouchableOpacity
        style={[styles.dropdownItem, selected && styles.selectedItem]}
        onPress={() => handleItemSelect(item)}
      >
        <Text style={[styles.itemText, selected && styles.selectedItemText]}>
          {item.label}
        </Text>
        {selected && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  // Render selected items as chips
  const renderSelectedItems = () => {
    if (!value || value.length === 0) {
      return null;
    }

    return (
      <View style={styles.selectedItemsContainer}>
        <Text style={styles.selectedItemsLabel}>Selected:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.selectedItemsScroll}
        >
          <View style={styles.selectedItemsList}>
            {value.map((selectedItem, index) => {
              const itemValue = typeof selectedItem === 'object' ? selectedItem.value : selectedItem;
              const itemLabel = typeof selectedItem === 'object' ? selectedItem.label : 
                data.find(d => d.value === selectedItem)?.label || selectedItem;
              
              return (
                <View key={index} style={styles.selectedItemChip}>
                  <Text style={styles.selectedItemText} numberOfLines={1}>
                    {itemLabel}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => handleRemoveItem(itemValue)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.selectorText, 
          (!value || value.length === 0) && styles.placeholderText
        ]}>
          {getDisplayText()}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {/* Show selected items below the dropdown */}
      {renderSelectedItems()}

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* Selected count */}
            {value && value.length > 0 && (
              <Text style={styles.selectedCount}>
                {value.length} item{value.length !== 1 ? 's' : ''} selected
              </Text>
            )}

            {/* List */}
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.value.toString()}
              style={[styles.list, { maxHeight }]}
              showsVerticalScrollIndicator={true}
            />

            {/* Done Button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.blackColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  // Selected items styles
  selectedItemsContainer: {
    marginTop: 8,
  },
  selectedItemsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  selectedItemsScroll: {
    maxHeight: 80,
  },
  selectedItemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    // borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
    maxWidth: 200,
    paddingHorizontal:20,
    borderRadius:10
  },
  selectedItemText: {
    fontSize: 14,
    color: '#1976d2',
    marginRight: 4,
    flexShrink: 1,
  },
  removeButton: {
    padding: 2,
    marginLeft: 4,
  },
  removeButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  list: {
    flexGrow: 0,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedItemText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MultiSelectorDropdown;