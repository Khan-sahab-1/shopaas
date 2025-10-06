import React from 'react';
import { SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import navigationString from '../navigation/navigationString';

const PayUWebView = ({ route, navigation }) => {
  const { paymentData } = route.params;
  console.log(paymentData,'WEBVIEW')

  const htmlForm = `
    <html>
      <body>
        <form id="payuForm" action="${paymentData.url}" method="post">
          <input type="hidden" name="key" value="${paymentData.key}" />
          <input type="hidden" name="txnid" value="${paymentData.txnid}" />
          <input type="hidden" name="amount" value="${paymentData.amount}" />
          <input type="hidden" name="productinfo" value="${paymentData.productinfo}" />
          <input type="hidden" name="firstname" value="${paymentData.firstname}" />
          <input type="hidden" name="email" value="${paymentData.email}" />
          <input type="hidden" name="phone" value="${paymentData.phone}" />
          <input type="hidden" name="surl" value="${paymentData.surl}" />
          <input type="hidden" name="furl" value="${paymentData.furl}" />
          <input type="hidden" name="hash" value="${paymentData.hash}" />
          <input type="hidden" name="udf1" value="${paymentData.udf1}" />
        </form>
        <script type="text/javascript">
          document.getElementById('payuForm').submit();
        </script>
      </body>
    </html>
  `;

  const handleShouldStartLoad = (request) => {
    const { url } = request;
    console.log("Intercepted URL:", url);
  
    // ✅ Intercept success
    if (url.startsWith("https://shopaas.arkess.com/payment/process")) {
      setTimeout(() => {
        Alert.alert('Success', 'Payment successful!', [
          { text: 'OK', onPress: () => navigation.replace(navigationString.SUCCESS) },
        ]);
      }, 300);
      return false; // ❌ block WebView from loading this URL
    }
  
    // ✅ Intercept failure
    if (url.startsWith("https://shopaas.arkess.com/payment/failed")) {
      setTimeout(() => {
        Alert.alert('Failed', 'Payment failed', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }, 300);
      return false; // ❌ block WebView from loading this URL
    }
  
    return true; // ✅ allow all other requests
  };
  
  
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <WebView
        originWhitelist={['*']}
        source={{ html: htmlForm }}
        onNavigationStateChange={handleNavigation}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />}
      /> */}
      <WebView
  originWhitelist={['*']}
  source={{ html: htmlForm }}
  onShouldStartLoadWithRequest={handleShouldStartLoad}
  startInLoadingState
  renderLoading={() => (
    <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />
  )}
/>
    </SafeAreaView>
  );
};

export default PayUWebView;
