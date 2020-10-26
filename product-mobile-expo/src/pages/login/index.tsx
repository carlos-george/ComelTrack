import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const qrSize = width * 0.8;

import api from '../../services/api';

const Login = () => {

  const { navigate, setOptions } = useNavigation();
  const [userEmail, setUserEmail] = useState<string>('reba@contato.com');
  const [userPassword, setUserPassword] = useState<string>('123456');
  const [styleInputEmail, setStyleInputEmail] = useState();
  const [styleInputPass, setStyleInputPass] = useState();

  useEffect(() => {

    setOptions({
      headerLeft: () => { },
      headerRight: () => { },
    });
  }, []);

  async function handleLogin() {

    await api.post('authenticate', { email: userEmail, password: userPassword }).then(res => {
      AsyncStorage.setItem('@token', res.data.token);
      navigate('Home', { isToRefresh: false });
    }).catch(err => {

      if (err.response) {

        alert(err.response.data.message);
      }
    });
  }

  const onFocus = (input) => {

    if (input === 'tracker') {
      setStyleInputEmail({
        borderColor: '#FCA90D',
        borderStyle: 'solid',
        borderWidth: 2
      });
    }
    if (input === 'desc') {
      setStyleInputPass({
        borderColor: '#FCA90D',
        borderStyle: 'solid',
        borderWidth: 2
      });
    }

  }

  const onBlur = (input) => {
    if (input === 'tracker') {
      setStyleInputEmail({});
    }
    if (input === 'desc') {
      setStyleInputPass({});
    }
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      >
        <View style={styles.main}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={[styles.input, styleInputEmail]}
              onFocus={() => onFocus('tracker')}
              onBlur={() => onBlur('tracker')}
              value={userEmail}
              textContentType="emailAddress"
              placeholder="email@contato.com"
              keyboardType="email-address"
              onChangeText={setUserEmail}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, styleInputPass]}
              onFocus={() => onFocus('desc')}
              onBlur={() => onBlur('desc')}
              value={userPassword}
              secureTextEntry={true}
              textContentType="password"
              onChangeText={setUserPassword}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
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
    width: qrSize,
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

export default Login;