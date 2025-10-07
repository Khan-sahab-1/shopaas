// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Modal,
//   ScrollView,
// } from 'react-native';
// import React, {useState} from 'react';
// import {COLORS} from '../../styles/colors';
// import Icon from 'react-native-vector-icons/AntDesign';

// const FilteringModal = ({
//   isVisible,
//   onClose,
//   catagory,
//   companees,
//   companeyType,
//   setselectedCompaney,
//   onApply

// }) => {
//   const [seemore, setSeemore] = useState(10);

//   console.log(companees, 'Companees');
//   console.log(companeyType, 'companeyType');

//   const toggleSeeMore = () => {
//     if (seemore === 10) {
//       setSeemore(catagory?.length || 0);
//     } else {
//       setSeemore(10);
//     }
//   };

//   const handleSelectCategory = item => {
//     const normalized = { item };
//     setselectedCompaney(normalized);
//     onApply?.({ category: normalized });
//     onClose()
//   };

//   return (
//     <Modal visible={isVisible} onRequestClose={onClose} transparent>
//       <TouchableOpacity style={styles.container} activeOpacity={1}>
//         <View style={styles.whiteBox}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Explore by Category</Text>
//             <Icon name="close" size={30} onPress={onClose} />
//           </View>

//           {/* Scrollable content */}
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <View style={styles.wrapper}>
//               {catagory?.slice(0, seemore).map((item, index) => (
//                 <View key={index} style={styles.categoryItem}>
//                   <Text style={styles.categoryText}>{item?.name || 'hi'}</Text>
//                 </View>
//               ))}
//             </View>

//             {/* See more / See less button */}
//             {catagory?.length > 10 && (
//               <TouchableOpacity
//                 onPress={toggleSeeMore}
//                 style={styles.seeMoreBtn}>
//                 <Text style={styles.seeMoreText}>
//                   {seemore === 10 ? 'See more' : 'See less'}
//                 </Text>
//               </TouchableOpacity>
//             )}

//             <Text style={[styles.title, {marginTop: 20}]}>
//               Explore by Company
//             </Text>
//             {companees?.map((item, index) => {
//               const id = Array.isArray(item) ? item[0] : item?.id;
//               const name = Array.isArray(item) ? item[1] : item?.name;

//               return (
//                 <TouchableOpacity key={id || index} style={styles.categoryItem}
//                 onPress={() => handleSelectCategory(item)}>
//                   <Text style={styles.categoryText}>{name}</Text>
//                 </TouchableOpacity>
//               );
//             })}

//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// export default FilteringModal;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   whiteBox: {
//     padding: 20,
//     borderRadius: 10,
//     backgroundColor: COLORS.whiteColor,
//     width: '100%',
//     maxHeight: '80%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   wrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   categoryItem: {
//     margin: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     backgroundColor: COLORS.grayColor,
//   },
//   categoryText: {
//     color: COLORS.whiteColor,
//     fontWeight: '500',
//   },
//   seeMoreBtn: {
//     alignSelf: 'center',
//     // marginVertical: 10,
//     // padding: 6,
//   },
//   seeMoreText: {
//     color: COLORS.primaryColor || 'blue',
//     fontWeight: '600',
//   },
// });

// src/components/FilteringModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {moderateScale} from '../../styles/responsiveSize';
import {COLORS} from '../../styles/colors';

export default function FilteringModal({
  isVisible,
  onClose,
  categories = [],
  companies = [],
  selectedCategory,
  selectedCompany,
  onSelectCategory,
  onSelectCompany,
  onApply,
  onReset,
}) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>Filter Products</Text>

          <Text style={styles.sub}>Categories</Text>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={i => `${i.id}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedCategory &&
                    (selectedCategory.id ?? selectedCategory) ==
                      (item.id ?? item) &&
                    styles.chipActive,
                ]}
                onPress={() => onSelectCategory(item)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.sub}>Companies</Text>
          <FlatList
            horizontal
            data={companies}
            keyExtractor={i => `${i.id}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedCompany &&
                    (selectedCompany.id ?? selectedCompany) ==
                      (item.id ?? item) &&
                    styles.chipActive,
                ]}
                onPress={() => onSelectCompany(item)}>
                <Text numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.actionBtn}>
              <Text>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onApply?.();
                onClose?.();
              }}
              style={[styles.actionBtn, styles.applyBtn]}>
              <Text style={{color: '#fff'}}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '60%',
  },
  heading: {fontSize: 18, fontWeight: '700', marginBottom: 8},
  sub: {fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 6},
  chip: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  chipActive: {backgroundColor: '#dbeafe'},
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {padding: 10},
  applyBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});
