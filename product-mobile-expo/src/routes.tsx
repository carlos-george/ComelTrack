import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import Home from './pages/home';
import Login from './pages/login';
import Detail from './pages/detail';
import Scanner from './pages/scanner';
import AddPackage from './pages/addPackage';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          headerMode="float"
          initialRouteName='Login'
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FCA90D',
              height: 80
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={Detail} options={{ title: 'Detalhe'}}/>
          <Stack.Screen name="Scanner" component={Scanner} options={{ title: 'QR Code'}}/>
          <Stack.Screen name="AddPackage" component={AddPackage} options={{ title: 'Adicionar'}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}  

export default Routes;
