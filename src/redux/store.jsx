// // import { configureStore } from '@reduxjs/toolkit';
// // import { persistStore, persistReducer } from 'redux-persist';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { combineReducers } from 'redux';

// // import authReducer from './reducers/authreducers';
// // import signupReducer from './reducers/signupSlice';
// // import CartReducer from './reducers/CartReducer';
// // import locationReducer from './reducers/locationSlice';
// // import counterSlice from './reducers/counterReducers';
// // import addressReducer from './reducers/addressSlice';
// // import productTypeReducer from './reducers/productTypeSlice'

// // const persistConfig = {
// //   key: 'root',
// //   storage: AsyncStorage,
// //   whitelist: ['auth', 'location', 'cart'],
// // };

// // const rootReducer = combineReducers({
// //   auth: authReducer,
// //   signup: signupReducer,
// //   cart: CartReducer,
// //   location: locationReducer,
// //   counter: counterSlice,
// //   address: addressReducer,
// //   productType: productTypeReducer,
// // });

// // const persistedReducer = persistReducer(persistConfig, rootReducer);

// // export const store = configureStore({
// //   reducer: persistedReducer,
// //   middleware: getDefaultMiddleware =>
// //     getDefaultMiddleware({
// //       serializableCheck: {
// //         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
// //       },
// //     }),
// // });

// // export const persistor = persistStore(store);


// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { combineReducers } from 'redux';

// import authReducer from './reducers/authreducers';
// import signupReducer from './reducers/signupSlice';
// import CartReducer from './reducers/fetchCartData';
// import locationReducer from './reducers/locationSlice';
// import counterSlice from './reducers/counterReducers';
// import addressReducer from './reducers/addressSlice';
// import productTypeReducer from './reducers/productTypeSlice'

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['auth', 'location', 'cart'],
// };

// const appReducer = combineReducers({
//   auth: authReducer,
//   signup: signupReducer,
//   cart: CartReducer,
//   location: locationReducer,
//   counter: counterSlice,
//   address: addressReducer,
//   productType: productTypeReducer,
// });

// const rootReducer = (state, action) => {
//   if (action.type === 'LOGOUT') {
//     state = undefined; // 💥 Reset ALL slices
//   }
//   return appReducer(state, action);
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [
//           'persist/PERSIST',
//           'persist/REHYDRATE',
//           'persist/PAUSE',
//           'persist/FLUSH',
//           'persist/PURGE',
//           'persist/REGISTER',
//         ],
//       },
//       immutableCheck: false,
//     }),
// });


// export const persistor = persistStore(store);



import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import authReducer from './reducers/authreducers';
import sessionReducer from './reducers/sessionSlice';
import signupReducer from './reducers/signupSlice';
import cartReducer from './reducers/fetchCartData'
import locationReducer from './reducers/locationSlice';
import counterSlice from './reducers/counterReducers';
import addressReducer from './reducers/addressSlice';
import productTypeReducer from './reducers/productTypeSlice';
import {AllproductsApi} from './rtkQuery/Productsfetch';
import { productsApi } from './rtkQuery/Servicess';
import addTocartSlice from './reducers/addTocart';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'location','session'],
};

const appReducer = combineReducers({
  auth: authReducer,
  signup: signupReducer,
  cart: cartReducer,
  location: locationReducer,
  counter: counterSlice,
  address: addressReducer,
  productType: productTypeReducer,
  session: sessionReducer,
  cartinfo: addTocartSlice,
  [productsApi.reducerPath]: productsApi.reducer,
  [AllproductsApi.reducerPath]: AllproductsApi.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined; // Reset all slices on logout
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, 
      immutableCheck: false,
    }).concat(productsApi.middleware),
});

export const persistor = persistStore(store);
