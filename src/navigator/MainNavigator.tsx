import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useEffect, useState, useCallback, } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import ExampleCart from '../Example/AllScreen/ExampleCart';
import { useDispatch } from 'react-redux'
import { _makeAxiosGetRequest, _makeAxiosPostRequest, } from '../Service/axios';
import { endpoint } from '../Service/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import HomePage from '../Example/AllScreen/HomePage'
import Wishlist from '../Example/AllScreen/Wishlist'
import OrderHistory from '../Example/AllScreen/OrderHistory'
import Profile from '../Example/AllScreen/Profile'
import HomePageStack from './HomePageStack'

const Tab = createBottomTabNavigator();



type cartitem = {

}




const MainNavigator = ({ navigation }: { navigation: any }) => {
    const [cartItem, setCartItem] = useState<cartitem[]>([])
    const IsFocused = useIsFocused();
    const [scrolToTop, setScrollToTop] = useState<boolean>(false)
    const [userId, setUserId] = useState('')
    const [cartList, setCartList] = useState([])
    const dispatch = useDispatch();

    const getCartProduct = async () => {
        const data = {
            'session_id': null,
            'user_id': userId
        }
        _makeAxiosPostRequest(endpoint.cart, data).then((res) => {
            // console.log(res.data)

            setCartList(res.data)
        }).catch((error) => { console.log('cart============>', error.response.data) })
    }

    useFocusEffect(useCallback(() => {
        getUserId();
        getCartProduct();
    }, []))

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        // console.log(userid)
        setUserId(userid)
    }
    // console.log('id======>', userId)
    return (
        <Tab.Navigator sceneContainerStyle={{ backgroundColor: 'white', bottom: 0 }} backBehavior='none' screenOptions={{
            headerShown: false,
            tabBarLabelStyle: { bottom: 8, fontWeight: "900", fontSize: 12 },
            tabBarActiveTintColor: 'black',
            tabBarStyle: {
                backgroundColor: "#FCFCFC",
                bottom: 0,
                shadowColor: "black",
                // borderTopLeftRadius: 20,
                // borderTopRightRadius: 20,
                height: 60,
            }, tabBarHideOnKeyboard: true,
        }}>
            <Tab.Screen name='HomePage' component={HomePage} options={{ tabBarIcon: ({ focused }) => focused ? <Image source={require('../component/IconImage/fashionLeoLogo.png')} style={{ width: 30, height: 30 }} /> : <Icon name='ios-home-outline' color='black' size={25} style={{}} />, title: 'Home' }} />
            <Tab.Screen name='Wishlists' component={Wishlist} options={{ tabBarIcon: ({ focused }) => <Image source={require('../component/IconImage/layout.png')} style={{ width: 25, height: 25, tintColor: focused ? 'black' : 'grey' }} />, title: "Category", }} />
            <Tab.Screen name='ShoppingCart' component={ExampleCart} options={{ tabBarBadgeStyle: { backgroundColor: "#27AAE1", top: 0, color: "white" }, tabBarBadge: cartList?.length, tabBarIcon: ({ focused }) => <Icon name='cart' color={focused ? 'black' : 'grey'} size={30} />, title: 'My Cart ' }} />
            <Tab.Screen name='Orderhistory' component={OrderHistory} options={{ tabBarIcon: ({ focused }) => focused ? <Image source={require('../component/IconImage/shopping-bag-grid.png')} style={{ width: 25, height: 25, bottom: 4 }} /> : <Image source={require('../component/IconImage/shopping-bag.png')} style={{ width: 25, height: 25, bottom: 2 }} />, title: 'Orders ' }} />
            <Tab.Screen name='Profile' component={Profile} options={{ tabBarIcon: ({ focused }) => focused ? <Icon name='ios-person' color='black' size={30} style={{}} /> : <Icon name='ios-person-outline' color='black' size={25} style={{ bottom: 1 }} />, title: 'My Account' }} />
        </Tab.Navigator>
    )
}

export default MainNavigator;