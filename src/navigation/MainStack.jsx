import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import navigationString from './navigationString';
import Tabroute from './Tabroute';
import Loyality from '../screens/deshboard/console/Loyality';
import {
  AttributePreview,
  BillingAddress,
  Brands,
  CaompareProduct,
  Compananees,
  ConfirmOrder,
  Console,
  ContectUs,
  CreateOrder,
  CreatePriceList,
  CreateProducts,
  CreatePromotion,
  CreateUserConsole,
  Dashboard,
  Delivery,
  Dispatch,
  Dispatchpreview,
  EcommerceCategries,
  EditConsoleUser,
  Editorder,
  EditPriceList,
  EditproductVarients,
  HelpandSupport,
  HomeScreen,
  Invoice,
  Menuscreen,
  MyAdrress,
  MyCoupens,
  MyOrder,
  Order,
  PackOrder,
  Packpreview,
  PaymentOption,
  PayUWebView,
  PdfePreviewDownload,
  PickOrder,
  PreviewconsoleDelivery,
  PreviewOrder,
  PreviewPick,
  PreviewProductorder,
  PreviewQtyUpdate,
  PreviewVarientprod,
  PriceList,
  Productattribute,
  ProductCategories,
  ProductDataUpdate,
  ProductEdit,
  ProductlistPage,
  Products,
  ProductsPreview,
  ProductsTransfer,
  ProductVarient,
  Profile,
  Promotion,
  RenewMembership,
  Screenshot,
  Serchingscreens,
  Serials,
  StockInventory,
  Success,
  Uom,
  UpdatePromotion,
  UpdateQuentity,
  Users,
  Varientprod,
  YourLocation,
  PreviewProductsComo
} from '../screens/Index';


const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={navigationString.TABROUTE} component={Tabroute} />
      <Stack.Screen name={navigationString.MENUSCREEN} component={Menuscreen} />
      <Stack.Screen name={navigationString.LOCATION} component={YourLocation} />
      <Stack.Screen
        name={navigationString.SEACRHINGSCREEN}
        component={Serchingscreens}
      />
      <Stack.Screen name={navigationString.COMPANESS} component={Compananees} />
      <Stack.Screen name={navigationString.BILLINGADDRESS} component={BillingAddress} />

      {/* Profile & Orders */}
      <Stack.Screen name={navigationString.PROFILE} component={Profile} />
      <Stack.Screen name={navigationString.MYORDER} component={MyOrder} />
      <Stack.Screen name={navigationString.PREVIEVORDER} component={PreviewOrder} />
      <Stack.Screen name={navigationString.PDFPREVIEWDOWNLOAD} component={PdfePreviewDownload} />
      <Stack.Screen name={navigationString.MYCOUPEN} component={MyCoupens} />
      <Stack.Screen name={navigationString.MYADDRESS} component={MyAdrress} />
      <Stack.Screen name={navigationString.HELPANDSUPPORT} component={HelpandSupport} />
      <Stack.Screen name={navigationString.CONSOLE} component={Console} />
      <Stack.Screen name={navigationString.CONTECTUS} component={ContectUs} />

      {/* Console / Product Screens */}
      <Stack.Screen name={navigationString.ORDER} component={Order} />
      <Stack.Screen name={navigationString.COMPANEYBRAND} component={Brands} />
      <Stack.Screen name={navigationString.PICKORDER} component={PickOrder} />
      <Stack.Screen name={navigationString.PACKORDER} component={PackOrder} />
      <Stack.Screen name={navigationString.DISPATCH} component={Dispatch} />
      <Stack.Screen name={navigationString.USERS} component={Users} />
      <Stack.Screen name={navigationString.PRODUCTS} component={Products} />
      <Stack.Screen name={navigationString.CONFIRMORDER} component={ConfirmOrder} />
      <Stack.Screen name={navigationString.SUCCESS} component={Success} />
      <Stack.Screen name={navigationString.PRODUCTSCREEN} component={ProductlistPage} />
      <Stack.Screen name={navigationString.PRODUCTCATEGORIES} component={ProductCategories} />
      <Stack.Screen name={navigationString.PRODUCTVARIENT} component={ProductVarient} />
      <Stack.Screen name={navigationString.ECOMMERCECATEGORIES} component={EcommerceCategries} />
      <Stack.Screen name={navigationString.PRICELISTS} component={PriceList} />
      <Stack.Screen name={navigationString.PRODUCTTRANSFER} component={ProductsTransfer} />
      <Stack.Screen name={navigationString.PRODUCTDATAUPDATE} component={ProductDataUpdate} />
      <Stack.Screen name={navigationString.STOCKINVENTORY} component={StockInventory} />
      <Stack.Screen name={navigationString.DASHBOARD} component={Dashboard} />
      <Stack.Screen name={navigationString.PROMOTION} component={Promotion} />
      <Stack.Screen name={navigationString.LOYALITY} component={Loyality} />
      <Stack.Screen name={navigationString.BRAND} component={Brands} />
      <Stack.Screen name={navigationString.UOM} component={Uom} />
      <Stack.Screen name={navigationString.SCREENSHOT} component={Screenshot} />
      <Stack.Screen name={navigationString.PAYMENTOPTION} component={PaymentOption} />

      {/* Forms */}
      <Stack.Screen name={navigationString.CREATEORDER} component={CreateOrder} />
      <Stack.Screen name={navigationString.EDITORDER} component={Editorder} />
      <Stack.Screen name={navigationString.INVOICE} component={Invoice} />
      <Stack.Screen name={navigationString.DELIVERY} component={Delivery} />

      {/* Previews */}
      <Stack.Screen name={navigationString.PREVIEWPICK} component={PreviewPick} />
      <Stack.Screen name={navigationString.PACKPREVIEW} component={Packpreview} />
      <Stack.Screen name={navigationString.DISPATCHPREVIEW} component={Dispatchpreview} />
      <Stack.Screen name={navigationString.PRODUCTS_PREVIEW} component={ProductsPreview} />

      {/* Product Management */}
      <Stack.Screen name={navigationString.CREATE_PRODUCTS} component={CreateProducts} />
      <Stack.Screen name={navigationString.PRODUCTSEDIT} component={ProductEdit} />
      <Stack.Screen name={navigationString.VARIENTPROD} component={Varientprod} />
      <Stack.Screen name={navigationString.PRODUCTATTRIBUTE} component={Productattribute} />
      <Stack.Screen name={navigationString.UPDATEQUENTITY} component={UpdateQuentity} />
      <Stack.Screen name={navigationString.EDITPTODUCTVARIENTS} component={EditproductVarients} />
      <Stack.Screen name={navigationString.CREATEPRICELIST} component={CreatePriceList} />
      <Stack.Screen name={navigationString.EDITPRICELIST} component={EditPriceList} />
      <Stack.Screen name={navigationString.CREATEUSERCONSOLE} component={CreateUserConsole} />
      <Stack.Screen name={navigationString.EDITUSERCONSOLE} component={EditConsoleUser} />
      <Stack.Screen name={navigationString.CREATEPROMOTION} component={CreatePromotion} />
      <Stack.Screen name={navigationString.UPDATEPROMOTION} component={UpdatePromotion} />
      <Stack.Screen name={navigationString.ATTRIBUTEPREVIEW} component={AttributePreview} />
      <Stack.Screen name={navigationString.SERIALS} component={Serials} />
      <Stack.Screen name={navigationString.PAYUWEBVIEW} component={PayUWebView} />
      <Stack.Screen name={navigationString.PREVIEWQTYUPDATE} component={PreviewQtyUpdate} />
      <Stack.Screen name={navigationString.COMPAREPRODUCT} component={CaompareProduct} />
      <Stack.Screen name={navigationString.PREVIEWPRODUCTORDER} component={PreviewProductorder} />
      <Stack.Screen name={navigationString.PREVIEWCONSOLEDELIVERY} component={PreviewconsoleDelivery} />
      <Stack.Screen name={navigationString.PREVIEWVARIENTPROD} component={PreviewVarientprod} />
      <Stack.Screen name={navigationString.RENEWMEMBERSHIP} component={RenewMembership} />
      <Stack.Screen name={navigationString.PREVIEWPRODUCTSCOMPO} component={PreviewProductsComo} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
