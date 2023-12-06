import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Badge } from 'react-native-paper';
import { _makeAxiosPostRequest } from '../Service/axios';
import { endpoint } from '../Service/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ title, showShadow, cartleft, onpress, searchLeft }: { title: string, showShadow: boolean, cartleft: number, onpress: any, searchLeft: any }) => {
    const [cartList, setCartList] = useState([]);
    const [userId, setUserId] = useState('');

    const navigation = useNavigation();

    const getCartProduct = async () => {
        try {
            const data = {
                session_id: null,
                user_id: userId,
            };
            const res = await _makeAxiosPostRequest(endpoint.cart, data);
            setCartList(res.data);
        } catch (error) {
            console.log('Error fetching cart:', error.response.data);
        }
    };

    const getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('USERID');
            const userid = JSON.parse(id);
            console.log(userid);
            setUserId(userid);
        } catch (error) {
            console.log('Error fetching user ID:', error);
        }
    };

    useEffect(() => {
        getCartProduct();
        getUserId();
    }, []);

    return (
        <View style={{ width: Dimensions.get('screen').width, backgroundColor: 'white', flexDirection: "row", height: 60, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: showShadow ? 5 : 0 }}>
            <Icon name='chevron-back-outline' size={35} color={'black'} style={{ margin: 10 }} onPress={onpress} />
            <View style={{ width: 240 }}>
                <Text style={{ color: 'black', fontSize: 18, margin: 15, right: 10 }}>{title}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ExampleSearch')} style={{ ...styles.iconContainer, marginRight: 10 }}>
                <Icon name='search' color={'black'} size={21} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ShoppingCart')} style={{ ...styles.iconContainer, marginRight: 10 }}>
                <Icon name='ios-cart-outline' color={'black'} size={22} style={styles.icon} />
                <Badge style={styles.badge} size={20} visible={cartList.length > 0}>{cartList.length}</Badge>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    iconContainer: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2,
        borderRadius: 50,
        margin: 12,
        left: 0,
    },
    icon: {
        padding: 2,
        left: 2.5,
        top: 2.5,
    },
    badge: {
        backgroundColor: "#27AAE1",
        left: 5,
        bottom: 35,
        color: "white",
    },
};

export default Header;
