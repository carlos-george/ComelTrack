import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Updates from 'expo-updates';
import { AppLoading } from 'expo';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import Routes from './src/routes';

const App = () => {

  // useEffect(() => {
  //   async function updateApp() {
  //     const { isAvailable } = await Updates.checkForUpdateAsync();

  //     if(isAvailable) {
  //       await Updates.fetchUpdateAsync();

  //       await Updates.reloadAsync();
  //     }
  //   }

  //   updateApp();

  // }, []);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold,
  });


  if (!fontsLoaded) return <AppLoading />;
  return (
    <>
      <StatusBar
          barStyle="light-content"
          backgroundColor="#FCA90D"
          translucent
        />
      <Routes/>
    </>
  );
}

export default App;

