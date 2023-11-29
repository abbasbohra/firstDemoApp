import 'react-native-gesture-handler'
import React, { useEffect } from 'react';
import { View, Text, LogBox, Alert, StatusBar } from 'react-native'
import AppNavigator from './src/Example/AllScreen/AppNavigator'
import messaging from '@react-native-firebase/messaging'
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {

  useEffect(() => {
    messaging().requestPermission()
    getTocken()
  }, [])

  const getTocken = async () => {
    const tocken = await messaging().getToken()
    await AsyncStorage.setItem('FCMTOCKEN', JSON.stringify(tocken))
    // console.log('tocken fcm', tocken)
  }
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      displayNotification(remoteMessage)
    });

    return unsubscribe;
  }, []);

  const displayNotification = async (data: any) => {
    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: data.notification.title,
      body: data.notification.body,
      android: {
        channelId,
        smallIcon: 'https://i.ibb.co/0Q2RzkR/fashion-Leo-Logo.png" alt="fashion-Leo-Logo',

        // importance: AndroidImportance.MIN,
        loopSound: true,
        color: '#626ABB',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  useEffect(() => {
    LogBox.ignoreAllLogs()
  })
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={'#BDC6C1'}
        barStyle={'light-content'}
      />
      <Provider store={store}>
        <AppNavigator navigation={undefined} />
      </Provider>

    </View>

  )
}

export default App