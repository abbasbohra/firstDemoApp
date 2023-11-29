import { View, Text } from 'react-native'
import React from 'react'
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
// import { Icon } from 'react-native-vector-icons/Ionicons';

const DisplayNotification = async ({ body }: { body: any }) => {
    await notifee.requestPermission()
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'iphone',
        importance: AndroidImportance.DEFAULT,
        badge: true,
        vibration: false,

    });
    await notifee.displayNotification({
        title: 'Fashion Leo',
        // body: body,
        android: {
            channelId,
            sound: 'iphone',
            style: { type: AndroidStyle.BIGTEXT, text: body },

            pressAction: {
                id: 'default',

            },
            largeIcon: require('./IconImage/fashionLeoLogo.png')
        },
    });
}

export default DisplayNotification