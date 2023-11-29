import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { _makeAxiosPostRequest, } from '../Service/axios'
import { endpoint } from '../Service/endpoint'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Badge } from 'react-native-paper'

const Header = ({ title, showShadow, cartleft, onpress, searchLeft }: { title: string, showShadow: boolean, cartleft: number, onpress: any, searchLeft: any }) => {
    const [cartList, setCartList] = useState([]);
    const [userId, setUserId] = useState('');

    const getCartProduct = async () => {
        const data = {
            'session_id': null,
            'user_id': userId
        }
        _makeAxiosPostRequest(endpoint.cart, data).then((res) => {
            console.log(res.data)

            setCartList(res.data)
        }).catch((error) => { console.log('cart============>', error.response.data) })
    }

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        console.log(userid)
        setUserId(userid)
    }

    useEffect(() => {
        getCartProduct()
        getUserId()
    }, [])


    const navigation: any = useNavigation();
    return (
        <View style={{ width: Dimensions.get('screen').width, backgroundColor: 'white', flexDirection: "row", height: 60, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: showShadow ? 5 : 0 }}>
            <Icon name='chevron-back-outline' size={35} color={'black'} style={{ margin: 10 }} onPress={onpress} />
            <View style={{ width: 240, }}>
                <Text style={{ color: 'black', fontSize: 18, margin: 15, right: 10 }}> {title}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ExampleSearch')} style={{ width: 30, height: 30, backgroundColor: 'white', shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2, borderRadius: 50, margin: 12, left: searchLeft }}>
                <Icon name='search' color={'black'} size={21} style={{ padding: 2,left:2.5,top:2.5 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ShoppingCart')} style={{ width: 30, height: 30, backgroundColor: 'white', shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2, borderRadius: 50, margin: 12, left: cartleft,marginRight:10 }}>
                <Icon name='ios-cart-outline' color={'black'} size={22} style={{ padding: 2,left:1.5,top:2.5 }} />
                <Badge style={{ backgroundColor: "#27AAE1", left: 5, bottom: 35, color: "white", }} size={20} visible={cartList.length == 0 ? false : true} >{cartList?.length}</Badge>

            </TouchableOpacity>
        </View>

    )
}

export default Header