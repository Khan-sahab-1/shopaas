// src/components/FilteringModal.js
import React, {useState, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconSearch from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../styles/colors';

export default function FilteringModal({
  isVisible,
  onClose,
  categories = [],
  companies = [],
  companyTypes = [],
  selectedCategory,
  selectedCompany,
  onSelectCategory,
  onSelectCompany,
  onApply,
  onReset,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  // console.log(companies, 'cccccc');

  // Handle both array format [id, name] and object format {id, name}
  const normalizeItem = item => {
    if (Array.isArray(item)) {
      return {id: item[0], name: item[1]};
    }
    return item;
  };

  // Remove duplicates based on name (case-insensitive)
  const removeDuplicates = items => {
    const seen = new Map();
    items.forEach(item => {
      const normalizedName = item.name?.toLowerCase().trim();
      // Keep first occurrence or replace if current has more complete data
      if (
        !seen.has(normalizedName) ||
        (item.id && !seen.get(normalizedName).id)
      ) {
        seen.set(normalizedName, item);
      }
    });
    return Array.from(seen.values());
  };

  // Normalize and deduplicate companies & categories
  const normalizedCompanies = useMemo(() => {
    const normalized = companies.map(normalizeItem);
    const deduped = removeDuplicates(normalized);
    // Sort alphabetically
    return deduped.sort((a, b) => a.name?.localeCompare(b.name));
  }, [companies]);

  const normalizedCategories = useMemo(() => {
    const normalized = categories.map(normalizeItem);
    const deduped = removeDuplicates(normalized);
    return deduped.sort((a, b) => a.name?.localeCompare(b.name));
  }, [categories]);

  // Filter companies based on search query
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return normalizedCompanies;

    const query = searchQuery.toLowerCase().trim();
    return normalizedCompanies.filter(company =>
      company.name?.toLowerCase().includes(query),
    );
  }, [normalizedCompanies, searchQuery]);

  const handleReset = () => {
    setSearchQuery('');
    onReset?.();
    onClose?.();
  };

  const handleApply = () => {
    setSearchQuery('');
    onApply?.();
    onClose?.();
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose?.();
  };

  const isCompanySelected = company => {
    if (!selectedCompany) return false;
    const selectedId = selectedCompany.id ?? selectedCompany;
    const companyId = company.id ?? company;
    return selectedId === companyId;
  };

  const isCategorySelected = category => {
    if (!selectedCategory) return false;
    const selectedId = selectedCategory.id ?? selectedCategory;
    const categoryId = category.id ?? category;
    return selectedId === categoryId;
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      onRequestClose={handleClose}
      transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Filter Products</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Icon name="close" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Categories Section */}
          {normalizedCategories.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Categories ({normalizedCategories.length})
              </Text>
              <View style={styles.chipContainer}>
                {normalizedCategories.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.chip,
                      isCategorySelected(item) && styles.chipActive,
                    ]}
                    onPress={() => onSelectCategory(item)}>
                    <Text
                      style={[
                        styles.chipText,
                        isCategorySelected(item) && styles.chipTextActive,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Companies Section */}
          {normalizedCompanies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Companies ({normalizedCompanies.length})
              </Text>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <IconSearch
                  name="search-outline"
                  size={20}
                  color="#666"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search companies..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={styles.clearBtn}>
                    <Icon name="closecircle" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Company List */}
              <View style={styles.companyList}>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.companyCard,
                        isCompanySelected(item) && styles.companyCardActive,
                      ]}
                      onPress={() => onSelectCompany(item)}>
                      <View style={styles.companyContent}>
                        <Text
                          style={[
                            styles.companyName,
                            isCompanySelected(item) && styles.companyNameActive,
                          ]}
                          numberOfLines={2}>
                          {item.name}
                        </Text>
                        {isCompanySelected(item) && (
                          <Icon
                            name="checkcircle"
                            size={20}
                            color="#007AFF"
                            style={styles.checkIcon}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <IconSearch name="search-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>No companies found</Text>
                    <Text style={styles.emptySubtext}>
                      Try a different search term
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons - Fixed at bottom */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleApply} style={styles.applyBtn}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeBtn: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  companyList: {
    paddingHorizontal: 20,
  },
  companyCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
  },
  companyCardActive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  companyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  companyNameActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    backgroundColor: '#fff',
  },
  resetBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  applyBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
