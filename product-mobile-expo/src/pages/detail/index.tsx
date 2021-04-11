import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, ParamListBase } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import api from '../../services/api';

interface Package {
  id: string;
  trackerNumber: string;
  description: string;
  status: number;
  urlImage: string;
}

interface Params {
  id: number;
  data: string;
}

interface QrCodeData {
  protocol: string;
  trackerNumber: string;
}

function Detail() {

  const { navigate } = useNavigation();
  const route = useRoute();
  const { id, data } = route.params as Params;
  const [userPackage, setUserPackage] = useState<Package>({} as Package);
  const [qrCodeData, setQrCodeData] = useState<QrCodeData>({} as QrCodeData);

  useEffect(() => {
    api.get(`packages/${id}`).then(res => {
      setUserPackage(res.data);
    }).catch(error => {
      if (error.response) {
        alert(error.response.data.message);
      }
    });

  }, [id]);

  useEffect(() => {
    if (data) {

      const dataDesc = data.split(';');

      setQrCodeData({
        protocol: dataDesc[0],
        trackerNumber: dataDesc[1]
      });
    }

  }, [data]);

  return (
    <SafeAreaView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        {/* <Text style={styles.title}>{userPackage.trackerNumber}</Text> */}
        <Text style={styles.title}>OK544966528BR</Text>
        {/* <Text style={styles.description}>{userPackage.description}</Text> */}
        <Text style={styles.description}>Computador Descktop</Text>
        <View style={styles.containerData}>
          {/* <Image style={styles.image}
                        source={{uri: userPackage.urlImage}}
                  /> */}
          <TouchableOpacity onPress={() => navigate('Scanner')}>
            <Image style={styles.image} source={require('../../assets/qrCodeIcon.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28
  },
  containerData: {
    width: '100%',
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  description: {
    fontSize: 24
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover'
  }
});

export default Detail;