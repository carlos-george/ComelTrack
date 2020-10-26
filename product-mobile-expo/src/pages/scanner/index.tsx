import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;


function Scanner() {

  const { navigate } = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data = '' }) => {

    //alert(`Bar code with data ${data} has been scanned!`);
    navigate('Detail', { data });
  };

  if (hasPermission === false) {
    return <Text>Necessário conceder permissão para uso da câmera.</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={[StyleSheet.absoluteFill, styles.container]}>
        <Image
          style={styles.qr}
          source={require('../../assets/qrCodeLogo.png')}
        />
      </BarCodeScanner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  qr: {
    marginTop: '20%',
    marginBottom: '20%',
    width: qrSize,
    height: qrSize,
  },
});


export default Scanner;