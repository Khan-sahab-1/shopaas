import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Headercomp from '../../../components/Headercomp';
import makeApiCall from '../../../utils/apiHelper';
import { API_URLS } from '../../../utils/apiurls';
import Legal from './Legal';
import Faqs from './Faqs';
import { COLORS } from '../../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';


  
 
  const Tab = createMaterialTopTabNavigator();
const HelpandSupport = ({navigation}) => {
    const handleFetchlegal=async()=>{
        try {
            const res=await makeApiCall(API_URLS.getLEGALS,"POST",{
                jsonrpc:"2.0",
                parems:{}
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        handleFetchlegal()
    },[])
  return (
    <>
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.whiteColor}}>
        <Headercomp title={'Help And Support'} left={true} onPress={()=>navigation.goBack()}/>

    <View style={{ flex:1}}>
        
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIndicatorStyle: { backgroundColor: '#ff5722' },
        }}
      >
        <Tab.Screen name="Legal" component={Legal} />
        <Tab.Screen name="FAQs" component={Faqs} />
      </Tab.Navigator>
    </View>
    </SafeAreaView>
    </>
  )
}

export default HelpandSupport

const styles = StyleSheet.create({})