import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../styles/colors';
import Icon from 'react-native-vector-icons/AntDesign';

const FilteringModal = ({
  isVisible,
  onClose,
  catagory,
  companees,
  companeyType,
  setselectedCompaney,
  onApply

}) => {
  const [seemore, setSeemore] = useState(10);
  
  console.log(companees, 'Companees');
  console.log(companeyType, 'companeyType');

  const toggleSeeMore = () => {
    if (seemore === 10) {
      setSeemore(catagory?.length || 0);
    } else {
      setSeemore(10);
    }
  };

  const handleSelectCategory = item => {
    const normalized = { item };
    setselectedCompaney(normalized);
    onApply?.({ category: normalized });
    onClose()
  };
  

  return (
    <Modal visible={isVisible} onRequestClose={onClose} transparent>
      <TouchableOpacity style={styles.container} activeOpacity={1}>
        <View style={styles.whiteBox}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Explore by Category</Text>
            <Icon name="close" size={30} onPress={onClose} />
          </View>

          {/* Scrollable content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.wrapper}>
              {catagory?.slice(0, seemore).map((item, index) => (
                <View key={index} style={styles.categoryItem}>
                  <Text style={styles.categoryText}>{item?.name || 'hi'}</Text>
                </View>
              ))}
            </View>

            {/* See more / See less button */}
            {catagory?.length > 10 && (
              <TouchableOpacity
                onPress={toggleSeeMore}
                style={styles.seeMoreBtn}>
                <Text style={styles.seeMoreText}>
                  {seemore === 10 ? 'See more' : 'See less'}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.title, {marginTop: 20}]}>
              Explore by Company
            </Text>
            {companees?.map((item, index) => {
              const id = Array.isArray(item) ? item[0] : item?.id;
              const name = Array.isArray(item) ? item[1] : item?.name;

              return (
                <TouchableOpacity key={id || index} style={styles.categoryItem}
                onPress={() => handleSelectCategory(item)}>
                  <Text style={styles.categoryText}>{name}</Text>
                </TouchableOpacity>
              );
            })}
            
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilteringModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  whiteBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: COLORS.whiteColor,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.grayColor,
  },
  categoryText: {
    color: COLORS.whiteColor,
    fontWeight: '500',
  },
  seeMoreBtn: {
    alignSelf: 'center',
    // marginVertical: 10,
    // padding: 6,
  },
  seeMoreText: {
    color: COLORS.primaryColor || 'blue',
    fontWeight: '600',
  },
});
