// import React,{ useState,useEffect } from 'react';
// import {View, Button, StyleSheet, Text, TextInput, Pressable, ScrollView} from 'react-native';
// import Dialog, {DialogTitle,DialogContent,DialogFooter,DialogButton,SlideAnimation,ScaleAnimation, FadeAnimation} from 'react-native-popup-dialog';
// import { getProductOptions,fetchSpecificData } from './Servicess';
// import style from '../../../Shared/style';
// import  AntDesign  from 'react-native-vector-icons/AntDesign';
// import CheckBox from '@react-native-community/checkbox';

// export default function ItemPopup(props) {

// 	const [state,setState]  = useState({items:[],selectedItem:null});
// 	const [input,GetInput]  = useState([]);

// 	useEffect(() => {
// 		if(props.open === true){
// 			fetchItems();
// 		}
// 		else{
//             changeState({items:[]});			
// 		}
// 	}, [props.open])

// 	const fetchItems=async()=>{
// 		let type = (props.type === 'product'?'product':'product_category');
// 		type = props.type === 'lot'?'lot':type;
//         let res = await getProductOptions(props.origin,props.id,type);
// 		console.log('resssss',res)
//         if(res.error || res.result.errorMessage){
//             alert(res.error || res.result.errorMessage);
//         }
//         else{
//             changeState({items:res.result.data.items});
//         }
// 	}

// 	const fetchItems1=async(dat)=>{
// 		let type = (props.type === 'product'?'product':'product_category');
//         let res = await fetchSpecificData(dat,type,props.id,props.origin);
//         if(res.error || res.result.errorMessage){
//             alert(res.error || res.result.errorMessage);
//         }
//         else{
//             changeState({items:res.result.items});
//         }
// 	}

// 	const getMoreData = () =>{
// 		console.log('add itemssss',input)
// 		fetchItems1(input);
// 	}

// 	const changeState=(newState)=>{
// 		let tempState = state;
// 		tempState = {...tempState,...newState};
// 		setState(tempState);
// 	}

// 	const handleChange=(e,item)=>{
// 		if(item !== state.selectedItem)
// 			changeState({selectedItem:item});
// 		else
// 			changeState({selectedItem:null});
// 	}

// 	return (
// 		<View  style={{marginHorizontal:50}}>
// 			<Dialog
// 				visible={props.open}
// 				onTouchOutside={()=>props.handlePopupActions()}
// 				width={0.8}
// 				height={'98%'}
// 				dialogTitle={
// 					// <DialogTitle 
// 					// 	title={`Select ${props.type}`}
// 					// />
// 					<DialogTitle title={
// 						props.type === 'product'?'Select Product':(props.type === 'lot'?'Select Lot':'Select Category')
// 					}/>
// 				}
// 			>
// 				{/* Search  code */}
// 				<View style={{flexDirection:'row',alignSelf:'center',marginTop:5}}>
//                     <TextInput 
//                     type="text"
//                     placeholder="Enter Product Name"
//                     onChangeText={(val)=>GetInput(val)}
//                     style={{ fontSize: 19,
//                     borderColor: style.blueColor,width:'80%', backgroundColor:'#F0F0F0',height:32,padding:5}}
//                     />
//                     <AntDesign name="search1" size={27} color="#72A0C1"
//                         // onPress={(val)=> getMoreData(val)}
// 						onPress={getMoreData}
//                     />
//                 </View>
//                 {/* Search  Code End */}
// 				<DialogContent style={{maxHeight:'80%'}}>
// 					<ScrollView  >
						
// 						<View>
// 							{Object.values(state.items).map((row,idx)=>(
// 								<View>
// 									{/* <Text> */}
// 										<CheckBox
											
// 											title={row['name'].toString()}
// 											iconLeft
// 											name="selectedItems"
// 											checked={state.selectedItem?.id === row['id']}
// 											onPress = {(e)=>handleChange(e,row)}
// 										/>
// 									{/* </Text> */}
// 									{/* <Text>{row['name']}</Text> */}
// 								</View>
// 							))}
// 						</View>
// 					</ScrollView>
// 				</DialogContent>
// 				<DialogFooter style={{flexDirection:'row',justifyContent:'space-around'}}>
// 					<Button onPress={()=>props.handlePopupActions()} title="Cancel"/>
// 					<Button onPress={()=>props.handlePopupActions(state.selectedItem)} 
// 								disabled={!state.selectedItem} title="Select"/>
// 				</DialogFooter>
				
// 			</Dialog>
// 		</View>
// 		// <View style={{width: '90%', alignSelf: 'center'}}>

// 		// 	<Dialog 
// 		// 		visible={props.open}
// 		// 		SlideAnimation={true}
// 		// 		style={{width: '100%'}}
// 		// 		dialogTitle={<DialogTitle title={
// 		// 			props.type === 'product'?'Select Product':(props.type === 'lot'?'Select Lot':'Select Category')
// 		// 		}/>}
// 		// 	>
// 		// 			<DialogContent 
// 		// 				style={{width: '70%', alignContent:'center'}}
// 		// 			>
// 		// 				<ScrollView 
// 		// 					style={{width: 400, height: 490, alignSelf: 'flex-start', marginVertical: 6, borderWidth: 1, borderColor: '#333', borderRadius: 8,
// 		// 					elevation: 4, shadowOffset: {width: 4, height: 4}, shadowColor: '#333', shadowOpacity: 0.3, shadowRadius: 2,padding:5}}
// 		// 					horizontal={false}
// 		// 					showsVerticalScrollIndicator={false}
// 		// 				>
// 		// 					{
// 		// 						Object.values(state.items).map((row, idx) => (
// 		// 							<ProfileCard>
// 		// 								<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
// 		// 									<Text style={style.bold_font}>
// 		// 										<CheckBox
// 		// 											name="selectedItem"
// 		// 											checked={state.selectedItem?.id === row['id']}
// 		// 											onPress = {(e)=>handleChange(e,row)}
// 		// 										/>
// 		// 									</Text>
// 		// 									<Text style={style.general_font}>{row['name']}</Text>
// 		// 								</View>
// 		// 							</ProfileCard>
// 		// 						))
// 		// 					}
// 		// 				</ScrollView>
// 		// 				<View style={{width: '100%', borderWidth: 1, borderColor: style.greenColor, paddingVertical: 10, marginVertical: 10,
// 		// 					paddingHorizontal: 6, flexDirection: 'row', borderRadius: 8, justifyContent: 'space-between'}}>
// 		// 					<Pressable 
// 		// 						style={!state.selectedItem?style.pressable:styles.pressable}
// 		// 						onPress={()=>props.handlePopupActions(state.selectedItem)} 
// 		// 						disabled={!state.selectedItem}
// 		// 					>
// 		// 						<Text style={!state.selectedItem?style.pressable__text:styles.pressable_text}>
// 		// 							Select
// 		// 						</Text>
// 		// 					</Pressable>
// 		// 					<Pressable 
// 		// 						style={styles.pressable}
// 		// 						onPress={()=>props.handlePopupActions()}
// 		// 					>
// 		// 						<Text style={styles.pressable_text}>
// 		// 							Cancel
// 		// 						</Text>
// 		// 					</Pressable>
// 		// 				</View>
// 		// 			</DialogContent>
// 		// 	</Dialog>	
			
			
// 		// 	{/* <Dialog
// 		// 		visible={props.open}
// 		// 		style={{width: '70%', borderColor: 'green', borderWidth: 2, height: 60, alignSelf: 'center'}}
// 		// 		dialogTitle={
// 		// 			<DialogTitle 
// 		// 				title={props.type === 'product'?'Select Product':(props.type === 'lot'?'Select Lot':'Select Category')} 
// 		// 			/>
// 		// 		}
// 		// 	>
// 		// 		<DialogContent 
// 		// 		style={{width: '70%', borderColor: 'red', borderWidth: 2, height: '60%'}}>
// 		// 			<View style={{width: '70%', borderColor: 'red', borderWidth: 2, height: '60%'}}>
// 		// 				<View style={styles.rows}>
// 		// 					<View style={styles.row}>
// 		// 						<Text>Select</Text>
// 		// 						<Text>Name</Text>
// 		// 					</View>
// 		// 					{Object.values(state.items).map((row,idx)=>(
// 		// 						<View style={styles.row}>
// 		// 							<Text >
// 		// 								<CheckBox
// 		// 									name="selectedItem"
// 		// 									checked={state.selectedItem?.id === row['id']}
// 		// 									onPress = {(e)=>handleChange(e,row)}
// 		// 								/>
// 		// 							</Text>
// 		// 							<Text>{row['name']}</Text>
// 		// 						</View>
// 		// 					))}
// 		// 				</View>
// 		// 			</View>					
// 		// 		</DialogContent>
				
// 		// 		<DialogFooter>	
// 		// 			<Button title="Select" onPress={()=>props.handlePopupActions(state.selectedItem)} disabled={!state.selectedItem}/>
// 		// 			<Button title="Cancel" onPress={()=>props.handlePopupActions()}/>
// 		// 		</DialogFooter>
// 		// 	</Dialog> */}
// 		// </View>
// 	);
// }

// const styles = StyleSheet.create({
// 	rows:{
//         flex: 1, 
//         alignItems: 'center', 
//         justifyContent: 'center',
//     },
//     row:{
// 		display:'flex',
// 		flexDirection:'column',
//         flex: 1, 
//         alignSelf: 'stretch', 
//         flexDirection: 'row',
// 		alignItems:'center'
//     },
// 	pressable_text: {
// 		color: '#FFF',
// 		fontSize: 14,
//         fontWeight: '600',
//         textTransform: 'capitalize',
// 	},
// 	pressable: {
//         borderWidth: 2, 
//         borderColor: '#009e53',
//         borderRadius: 6, 
//         padding: 5,
// 		backgroundColor: '#009e53',
//     },
// })


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import { getProductOptions, fetchSpecificData } from './Servicess';
import style from './style';

export default function ItemPopup(props) {
  const [state, setState] = useState({ items: [], selectedItem: null });
  const [input, setInput] = useState('');
  const [isloding,setIsloding]=useState(false)

  useEffect(() => {
    if (props.open) {
      fetchItems();
    } else {
      changeState({ items: [] });
    }
  }, [props.open]);

  const fetchItems = async () => {
    let type = props.type === 'product' ? 'product' : 'product_category';
    type = props.type === 'lot' ? 'lot' : type;
    let res = await getProductOptions(props.origin, props.id, type);
    if (res.error || res.result?.errorMessage) {
      alert(res.error || res.result.errorMessage);
    } else {
      changeState({ items: res.result.data.items });
    }
  };

  const fetchItems1 = async dat => {
    let type = props.type === 'product' ? 'product' : 'product_category';
    let res = await fetchSpecificData(dat, type, props.id, props.origin);
    if (res.error || res.result?.errorMessage) {
      alert(res.error || res.result.errorMessage);
    } else {
      changeState({ items: res.result.items });
    }
  };

  const getMoreData = () => {
    fetchItems1(input);
  };

  const changeState = newState => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const handleChange = (item) => {
    if (item !== state.selectedItem) {
      changeState({ selectedItem: item });
    } else {
      changeState({ selectedItem: null });
    }
  };

  return (
    <Modal
      visible={props.open}
      transparent
      animationType="slide" 
      onRequestClose={() => props.handlePopupActions()}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>
            {props.type === 'product'
              ? 'Select Product'
              : props.type === 'lot'
              ? 'Select Lot'
              : 'Select Category'}
          </Text>

          {/* Search bar */}
          <View style={styles.searchRow}>
            <TextInput
              placeholder="Enter Product Name"
              value={input}
              onChangeText={setInput}
              style={styles.searchInput}
            />
            <AntDesign
              name="search1"
              size={24}
              color="#72A0C1"
              onPress={getMoreData}
            />
          </View>

          {/* Items */}
          <ScrollView style={{ maxHeight: 300 }}>
            {Object.values(state.items).map((row, idx) => (
              <View key={idx} style={styles.itemRow}>
                <CheckBox
                  value={state.selectedItem?.id === row['id']}
                  onValueChange={() => handleChange(row)}
                />
                <Text style={styles.itemText}>{row['name']}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => props.handlePopupActions()}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: state.selectedItem ? '#009e53' : '#aaa' },
              ]}
              disabled={!state.selectedItem}
              onPress={() => props.handlePopupActions(state.selectedItem)}
            >
              <Text style={styles.btnText}>Select</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: style.blueColor,
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#F0F0F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemText: {
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
