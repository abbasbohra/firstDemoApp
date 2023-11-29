import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { BASE_URL } from './endpoint';
// import {_getLocalStorageUser} from './generals';
let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
};
let client = axios.create({
    baseURL: BASE_URL,
    headers,
    withCredentials: false,
});
client.interceptors.request.use(async config => {
    let data: any = await AsyncStorage.getItem('ACCESS_TOKEN');
    let token = JSON.parse(data)


    // console.log('token=========>', token)

    if (typeof token !== undefined && token !== null) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log('----------config----------- ', token);
    return config;
});

client.interceptors.response.use(function (response) {
    return response.data;
});

export const _makeAxiosGetRequest = async (url: any, data: any) => {
    // console.log('request', url);
    const postRequest = await client.get(url, { params: data });
    return postRequest;
};

export const _makeAxiosPostRequest = async (url: any, payload = {}) => {
    console.log('request', url, payload);
    const postRequest = await client.post(url, payload);
    return postRequest;
};

export const _makeAxiosUpdateRequest = async (url: any, payload = {}) => {
    // console.log('request', url, payload);
    const postRequest = await client.put(url, payload);
    return postRequest;
};


export const _makeAxiosDeleteRequest = async (url: any, payload = {}) => {
    // console.log('request', url, payload);
    const postRequest = await client.delete(url, payload);
    return postRequest;
};

export const _makeAxiosPostRequestWithoutAuth = async (url: any, payload = {}) => {
    // console.log('request', url, payload);
    const postRequest = await client.post(url, payload);
    // console.log('Response ', postRequest);

    return postRequest;
};