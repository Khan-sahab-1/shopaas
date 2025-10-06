import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/navigation/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { COLORS } from './src/styles/colors';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.whiteColor} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
              <Routes />
              <FlashMessage position="top" />
            </NavigationContainer>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});



