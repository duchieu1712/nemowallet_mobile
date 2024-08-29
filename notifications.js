import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from 'react-native';

export const getFcmToken = async () => {
    try {
        const newFcmToken = await messaging().getToken();
        // console.log(newFcmToken);
        return newFcmToken;
    } catch (error) {
        // console.error(error);
        return null;
    }
};

export const getFcmTokenFromLocalStorage = async () => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    if (!fcmtoken) {
        try {
            const newFcmToken = await messaging().getToken();
            await AsyncStorage.setItem('fcmtoken', newFcmToken);
        } catch (error) {
            return null
            // console.error(error);
        }
    }
};

export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        // console.log('Authorization status:', authStatus);
    }
};

export const notificationListener = (notifLocal) => {

    messaging().onNotificationOpenedApp(remoteMessage => {
        // console.log(
        //     'Notification caused app to open from background state:',
        //     remoteMessage.notification,
        // );
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            console.log(
                'Notification caused app to open from quit state:',
                remoteMessage,
            );
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        })
        .catch(error => console.log('failed', error));

    // Foreground State
    messaging().onMessage(async remoteMessage => {
        // if (!remoteMessage) return
        // console.log('annnnnn', remoteMessage);
        if (Platform.OS == 'android') {
            notifLocal.localNotifMessage(remoteMessage)
        } else if (Platform.OS == 'ios') {
        }
    });
};