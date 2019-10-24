import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { makeRequest } from './Utils';

const status = async () => {
    // Status: live, ask
    const currStatus = await AsyncStorage.getItem('pushStatus');
    return currStatus ? currStatus : 'ask';
}

const checkPermission = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    return status;
}

const getPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    return status;
}

const retrieveToken = async () => {
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    return token;
}

const registerToken = async (deviceToken) => {
    const payload = await makeRequest('/api/notification/registerNotification', { deviceToken });
    if (!payload.error) {
        await AsyncStorage.setItem('pushToken', deviceToken);
        await AsyncStorage.setItem('pushStatus', 'live');
    }
}

const unregisterToken = async () => {
    const deviceToken = await AsyncStorage.getItem('pushToken');
    if (deviceToken) {
        const payload = await makeRequest('/api/notification/unregisterNotification', { deviceToken });
        if (!payload.error) {
            await AsyncStorage.removeItem('pushToken');
        }
    }
    await AsyncStorage.removeItem('pushStatus');
}


export { status, checkPermission, getPermission, retrieveToken, registerToken, unregisterToken };