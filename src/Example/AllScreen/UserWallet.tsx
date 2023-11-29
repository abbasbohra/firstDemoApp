import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Badge } from 'react-native-paper'
import { _makeAxiosPostRequest, _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../component/Header'


type user = {
    Name: string
    Email: string
    profile: string
}

const UserWallet = ({ navigation }: { navigation: any }) => {
    const [cartList, setCartList] = useState([]);
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState<user>([])
    const [refresh, setRefresh] = useState(false)
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
        getUserId(),
            getDetail()

    }, [])

    const onRefresh = () => {
        getDetail();
        getCartProduct()
    }

    const getDetail = () => {
        _makeAxiosGetRequest(endpoint.myProfile, {}).then((res) => {
            console.log(res)
            setUser(res.data.user)
            // ToastAndroid.show(res?.message, ToastAndroid.SHORT)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Header title='My Wallet' cartleft={-10} searchLeft={5} showShadow={true} onpress={() => navigation.goBack()} />
            <ScrollView  contentContainerStyle={{backgroundColor:'white',paddingBottom:20,top:10}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
                <View style={{ width: '90%', paddingBottom: 150, backgroundColor: '#27AAE1', margin: 20, top: 26, borderRadius: 10 }}>
                    <Text style={{ color: "white", margin: 10, fontSize: 20, fontWeight: "800" }}> Wallet Balance </Text>
                    <Text style={{ color: "white", fontWeight: "800", left: 20, fontSize: 20 }}> ₹{user?.wallet_balance == '' ? 0 : user?.wallet_balance}</Text>
                    <Text style={{ color: "white", fontSize: 16, margin: 5, left: 5 }}> invite your freinds to FashionLeo and get</Text>
                    <Text style={{ color: "white", fontSize: 16, margin: 5, bottom: 10, left: 5 }}> cashback on their first sucessfull order</Text>
                    <Text style={{ color: "white", fontSize: 16, margin: 5, bottom: 20, left: 5 }}> For more info read Terms & Conditions</Text>
                    <Text style={{ color: "white", fontSize: 20, margin: 5, fontWeight: '900', bottom: 20 }}> Refferral Code</Text>
                    <Text style={{ color: "white", fontSize: 20, margin: 5, fontWeight: '900', bottom: 20 }}> No Referal Code</Text>
                </View>
            </ScrollView>
        </View>

    )
}

export default UserWallet