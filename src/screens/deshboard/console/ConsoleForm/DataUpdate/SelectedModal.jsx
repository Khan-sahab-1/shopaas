// // import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList } from 'react-native';
// // import React, { useEffect, useState } from 'react';
// // import CheckBox from '@react-native-community/checkbox'; 
// // import makeApiCall from '../../../../../utils/apiHelper';
// // import { API_URLS } from '../../../../../utils/apiurls';

// // const SelectedModal = ({ isVisible, onClose, item, id ,setselectedOptions}) => {
// //   const [options, setOptions] = useState([]);
// //   const [selectedId, setSelectedId] = useState(null); // single selection

// //   const fetchoptions = async (id, product) => {
// //     try {
// //       const responce = await makeApiCall(API_URLS.getProductOptions, 'POST', {
// //         jsonrpc: '2.0',
// //         params: {
// //           origin: 'product-data-update',
// //           id: id,
// //           type: product === 'category' ? 'product_category' : product,
// //           query: null,
// //         },
// //       });
// //       console.log('OPTIONS', responce);

// //       setOptions(responce?.result?.data?.items || []);
// //     } catch (error) {
// //       console.log('API ERROR', error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (item?.value && id) {
// //       fetchoptions(id, item?.value);
// //     }
// //   }, [item, id]);

// //   const handleSelect = (optionId) => {
// //     setSelectedId(optionId); // only one at a time
// //   };

// //   return (
// //     <Modal
// //       visible={isVisible}
// //       onRequestClose={onClose}
// //       transparent
// //       animationType="fade"
// //     >
// //       <View style={styles.overlay}>
// //         <View style={styles.modalContent}>
// //           <Text style={styles.title}>Select Option</Text>

// //           <FlatList
// //             data={options}
// //             keyExtractor={(item) => item.id.toString()}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity
// //                 style={styles.row}
// //                 onPress={() => handleSelect(item.id)}
// //               >
// //                 <CheckBox
// //                   value={selectedId === item.id}
// //                   onValueChange={() => {handleSelect(item.id)
// //                     setselectedOptions(item)
// //                   }}
// //                 />
// //                 <Text style={styles.rowText}>{item.name}</Text>
// //               </TouchableOpacity>
// //             )}
// //           />

// //           <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
// //             <Text style={styles.closeBtnText}>Done</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </Modal>
// //   );
// // };

// // export default SelectedModal;

// // const styles = StyleSheet.create({
// //   overlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContent: {
// //     backgroundColor: '#fff',
// //     width: '85%',
// //     maxHeight: '70%',
// //     padding: 20,
// //     borderRadius: 12,
// //   },
// //   title: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 10,
// //     textAlign: 'center',
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 6,
// //   },
// //   rowText: {
// //     fontSize: 16,
// //     marginLeft: 8,
// //     color: '#333',
// //   },
// //   closeBtn: {
// //     marginTop: 15,
// //     backgroundColor: '#007AFF',
// //     padding: 12,
// //     borderRadius: 8,
// //   },
// //   closeBtnText: {
// //     color: '#fff',
// //     textAlign: 'center',
// //     fontWeight: '600',
// //   },
// // });






// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Modal,
//   FlatList
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import CheckBox from '@react-native-community/checkbox'; 
// import makeApiCall from '../../../../../utils/apiHelper';
// import { API_URLS } from '../../../../../utils/apiurls';

// const SelectedModal = ({ isVisible, onClose, item, id, setselectedOptions }) => {
//   const [options, setOptions] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);

//   const fetchOptions = async (id, product) => {
//     try {
//       const response = await makeApiCall(API_URLS.getProductOptions, 'POST', {
//         jsonrpc: '2.0',
//         params: {
//           origin: 'product-data-update',
//           id: id,
//           type: product === 'category' ? 'product_category' : product,
//           query: null,
//         },
//       });
//       setOptions(response?.result?.data?.items || []);
//     } catch (error) {
//       console.log('API ERROR', error);
//     }
//   };

//   useEffect(() => {
//     if (item?.value && id) {
//       fetchOptions(id, item?.value);
//     }
//   }, [item, id]);

//   const handleSelect = (option) => {
//     setSelectedId(option.id); // for checkbox
//     setselectedOptions(option); // update parent state
//   };

//   return (
//     <Modal
//       visible={isVisible}
//       onRequestClose={onClose}
//       transparent
//       animationType="fade"
//     >
//       <View style={styles.overlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.title}>Select Option</Text>

//           <FlatList
//             data={options}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.row}
//                 onPress={() => handleSelect(item)}
//               >
//                 <CheckBox
//                   value={selectedId === item.id} 
//                   onValueChange={() => handleSelect(item)}
//                 />
//                 <Text style={styles.rowText}>{item.name}</Text>
//               </TouchableOpacity>
//             )}
//           />

//           <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//             <Text style={styles.closeBtnText}>Done</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default SelectedModal;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     width: '85%',
//     maxHeight: '70%',
//     padding: 20,
//     borderRadius: 12,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//   },
//   rowText: {
//     fontSize: 16,
//     marginLeft: 8,
//     color: '#333',
//   },
//   closeBtn: {
//     marginTop: 15,
//     backgroundColor: '#007AFF',
//     padding: 12,
//     borderRadius: 8,
//   },
//   closeBtnText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });



import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CheckBox from '@react-native-community/checkbox'; 
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You may need to install this

const SelectedModal = ({ isVisible, onClose, item, id, setselectedOptions }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchOptions = async (id, product) => {
    console.log(product,'Products')
    setIsLoading(true);
    try {
      const response = await makeApiCall(API_URLS.getProductOptions, 'POST', {
        jsonrpc: '2.0',
        params: {
          origin: 'product-data-update',
          id: id,
          type: product === 'category' ? 'product_category' : product,
          query: null,
        },
      });
      const fetchedOptions = response?.result?.data?.items || [];
      setOptions(fetchedOptions);
      setFilteredOptions(fetchedOptions); // Initialize filtered options with all options
    } catch (error) {
      console.log('API ERROR', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (item?.value && id) {
      fetchOptions(id, item?.value);
    }
  }, [item, id]);

  // Filter options based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options]);

  const handleSelect = (option) => {
    setSelectedId(option.id);
    setselectedOptions(option);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Option</Text>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          ) : (
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(item)}
                >
                  <CheckBox
                    value={selectedId === item.id}
                    onValueChange={() => handleSelect(item)}
                  />
                  <Text style={styles.rowText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>
                  {searchQuery ? 'No matching options found' : 'No options available'}
                </Text>
              }
            />
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectedModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    maxHeight: '70%',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  rowText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
    flex: 1,
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});