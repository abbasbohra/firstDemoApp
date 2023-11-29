import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useEffect, useState, useCallback, } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomePage from './HomePage';
import Profile from './Profile'
import Wishlist from './Wishlist';
import Search from '../Screens/Search';
import ShoppingCart from '../Screens/ShoppingCart';
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import ExampleCart from './ExampleCart';
import { useDispatch } from 'react-redux'
import { scrollToTop } from '../redux/action';
import { _makeAxiosGetRequest, _makeAxiosPostRequest, } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import TrackOrder from './TrackOrder';
import OrderHistory from './OrderHistory';
import HomePageStack from '../../navigator/HomePageStack';

const Tab = createBottomTabNavigator();



type cartitem = {

}




const BottomPage = ({ navigation }: { navigation: any }) => {
    const [cartItem, setCartItem] = useState<cartitem[]>([])
    const IsFocused = useIsFocused();
    const [scrolToTop, setScrollToTop] = useState<boolean>(false)
    const [userId, setUserId] = useState('')
    const [cartList, setCartList] = useState([])
    const dispatch = useDispatch();
    const getCartItem = async () => {
        try {
            const querySnapShot = await firestore().collection('cartItem').where('uid', '==', firebase.auth().currentUser?.uid).get()
            const data = querySnapShot.docs.map(doc => doc.data())
            setCartItem(data)
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        getCartItem();
    }, [IsFocused])

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
            tabBarStyle: {
                backgroundColor: "#FCFCFC",
                bottom: 0,
                shadowColor: "black",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: 60,
            }, tabBarHideOnKeyboard: true,
        }}>
            <Tab.Screen name='HomePage' component={HomePageStack} options={{ tabBarIcon: ({ focused }) => focused ? <Icon name='ios-home' color='black' size={25} style={{}} /> : <Icon name='ios-home-outline' color='red' size={20} style={{}} />, tabBarShowLabel: false }} />
            <Tab.Screen name='Wishlist' component={Wishlist} options={{ tabBarIcon: ({ focused }) => focused ? <Icon name='grid' color='black' size={25} style={{}} /> : <Icon name='grid-outline' color='black' size={20} style={{}} />, tabBarShowLabel: false }} />
            <Tab.Screen name='ShoppingCart' component={ExampleCart} options={{ tabBarBadgeStyle: { backgroundColor: "#27AAE1", top: 10, color: "white" }, tabBarBadge: cartList?.length, tabBarIcon: ({ focused }) => <Icon name='cart' color='black' size={30} style={{ bottom: -5, backgroundColor: "#F5F5F5", padding: 8, borderRadius: 50, shadowColor: 'black', shadowOpacity: 1, shadowRadius: 5, width: 50, height: 50, shadowOffset: { height: 0.5, width: 0.5, }, elevation: 5, }} />, tabBarShowLabel: false, tabBarItemStyle: { bottom: 15, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#FCFCFC' } }} />
            <Tab.Screen name='OrderHistory' component={OrderHistory} options={{ tabBarIcon: ({ focused }) => focused ? <Image source={require('../../component/IconImage/shopping-bag-grid.png')} style={{ width: 25, height: 25, bottom: 4 }} /> : <Image source={require('../../component/IconImage/shopping-bag.png')} style={{ width: 20, height: 20 }} />, tabBarShowLabel: false }} />
            <Tab.Screen name='Profile' component={Profile} options={{ tabBarIcon: ({ focused }) => focused ? <Icon name='ios-person' color='black' size={25} style={{}} /> : <Icon name='ios-person-outline' color='black' size={20} style={{}} />, tabBarShowLabel: false, }} />
        </Tab.Navigator>
    )
}

export default BottomPage