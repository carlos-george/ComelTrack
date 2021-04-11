import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const qrSize = width * 0.8;

import api from '../../services/api';

interface InputStyle {
  borderColor: string;
  borderStyle: string,
  borderWidth: number
}

function AddPackage() {
  const { navigate, goBack, setOptions } = useNavigation();
  const [userTrackerNumber, setUserTrackerNumber] = useState<string>();
  const [userPackageDesc, setUserPackageDesc] = useState<string>();
  const [styleInputTracker, setStyleInputTracker] = useState<InputStyle>({} as InputStyle);
  const [styleInputDesc, setStyleInputDesc] = useState<InputStyle>({} as InputStyle);

  useEffect(() => {

    setOptions({
      headerLeft: () => (
        <Button
          onPress={() => goBack()}
          title="Cancelar"
          color="#fff"
        />
      )
    });
  }, []);

  const handelsavePackage = async () => {

    await api.post('packages', {
      trackerNumber: userTrackerNumber,
      description: userPackageDesc
    }
    ).then(() => navigate('Home', { isToRefresh: true })
    ).catch(error => {
      alert(error.response.data.mensage);
    });
  }

  const onFocus = (input) => {

    if (input === 'tracker') {
      setStyleInputTracker({
        borderColor: '#FCA90D',
        borderStyle: 'solid',
        borderWidth: 2
      });
    }
    if (input === 'desc') {
      setStyleInputDesc({
        borderColor: '#FCA90D',
        borderStyle: 'solid',
        borderWidth: 2
      });
    }

  }

  const onBlur = (input) => {
    if (input === 'tracker') {
      setStyleInputTracker({} as InputStyle);
    }
    if (input === 'desc') {
      setStyleInputDesc({} as InputStyle);
    }
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      >
        <View style={styles.main}>
          <Text style={styles.title}>Cadastre sua encomenda</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Rastreio:</Text>
            <TextInput
              style={[styles.input, styleInputTracker && {}]}
              onFocus={() => onFocus('tracker')}
              onBlur={() => onBlur('tracker')}
              value={userTrackerNumber}
              autoCapitalize="characters"
              placeholder="OK123456789BR"
              onChangeText={text => setUserTrackerNumber(text)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styleInputDesc && {}]}
              onFocus={() => onFocus('desc')}
              onBlur={() => onBlur('desc')}
              value={userPackageDesc}
              autoCapitalize="words"
              placeholder="PlayStation Batman"
              onChangeText={text => setUserPackageDesc(text)}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.loginButton} onPress={handelsavePackage}>
              <Text style={styles.loginButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 300,
    maxWidth: 360,
    height: 60,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  fieldGroup: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  label: {
    color: '#322153',
    fontSize: 22,
    marginBottom: 15
  },
  title: {
    color: '#322153',
    fontSize: 28,
    marginBottom: 15,
  },
  loginButton: {
    width: qrSize,
    height: 60,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FCA90D',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FCA90D'
  },
});

export default AddPackage;