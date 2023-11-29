/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    displayNotification(remoteMessage)
});
messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    displayNotification(remoteMessage)
})
const displayNotification = async data => {
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
            // importance: AndroidImportance.MIN,
            pressAction: {
                id: 'default',
            },
        },
    });
}
AppRegistry.registerComponent(appName, () => App);
