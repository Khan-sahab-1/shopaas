
import React, { useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Share,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Headercomp from '../../../../components/Headercomp';
import { BASE_URL } from '../../../../utils/apiurls';
import RNFetchBlob from 'react-native-blob-util';

const PDFExample = ({ route, navigation }) => {
  const { item } = route?.params || {};
  const pdfUrl = item?.reportUrl ? `${BASE_URL}${item.reportUrl}` : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    if (!pdfUrl) return;
  
    const { config, fs } = RNFetchBlob;
    const date = new Date();
    const fileName = `Invoice_${date.getTime()}.pdf`;
  
    if (Platform.OS === 'android') {
      try {
        await config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: fileName,
            description: 'Downloading invoice',
            mime: 'application/pdf',
            path: `${fs.dirs.DownloadDir}/${fileName}`,
          },
        }).fetch('GET', pdfUrl);
  
        Alert.alert('Success', 'Invoice downloaded to Downloads folder');
      } catch (err) {
        console.log('Download error:', err);
        Alert.alert('Error', 'Failed to download file');
      }
    } else {
      // iOS: Save to app folder
      const path = `${fs.dirs.DocumentDir}/${fileName}`;
      try {
        await config({ path, trusty: true }).fetch('GET', pdfUrl);
        Alert.alert('Success', `File saved in app folder: ${path}`);
      } catch (err) {
        console.log('Download error:', err);
        Alert.alert('Error', 'Failed to download file');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Headercomp title={'Invoice'} left={true} onPress={() => navigation.goBack()} />

      {!pdfUrl ? (
        <Text style={styles.errorText}>Invoice Not Available For This Item</Text>
      ) : (
        <>
          {loading && !error && (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          )}

          {error && <Text style={styles.errorText}>Failed to load PDF</Text>}

          <Pdf
            source={{ uri: pdfUrl, cache: true }}
            trustAllCerts={false}
            onLoadComplete={() => setLoading(false)}
            onPageChanged={(page) => console.log(`Current page: ${page}`)}
            onError={(err) => {
              console.log('PDF loading error:', err);
              setError(true);
              setLoading(false);
            }}
            onPressLink={(uri) => console.log(`Link pressed: ${uri}`)}
            style={styles.pdf}
          />

          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
            <Text style={styles.downloadText}>Download Invoice</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PDFExample;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
  pdf: { flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  loader: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20 },
  downloadBtn: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  downloadText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
