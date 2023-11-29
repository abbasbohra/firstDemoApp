import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { endpoint } from '../../Service/endpoint';
import { _makeAxiosPostRequestWithoutAuth, _makeAxiosPostRequest, _makeAxiosDeleteRequest } from '../../Service/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import SkelatonEffectShoppingCart from '../../component/SkelatonEffect/SkelatonEffectShoppingCart';
import Header from '../../component/Header';
import LottieView from 'lottie-react-native';


type cartItem = {
    id: string
    offer_price: any
    get_product_data: any
    orignal_price: any
    quantity: any
}


const ExampleCart = ({ navigation }: { navigation: any }) => {
    const [cartList, setCartList] = useState<cartItem[]>([])
    const [tocken, setTocken] = useState('')
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(false);


    const price = () => {

        const total = cartList.reduce((a: any, b: any) => {
            return (
                a + b?.get_product_data?.offer_price * parseInt(b?.quantity)
            )
        }, 0)
        return (
            total
        )
    }

    const getCartProduct = async () => {
        setLoading(true)
        const data = {
            'session_id': null,
            'user_id': userId
        }
        _makeAxiosPostRequest(endpoint.cart, data).then((res) => {
            // console.log(res.data)
            setCartList(res.data)
            setLoading(false)
        }).catch((error) => {
            console.log('cart============>', error.response.data)
            setLoading(false)
            Alert.alert(error.response.data.message)

        })
    }

    useFocusEffect(useCallback(() => {
        getTocken();
        getUserId();
        getCartProduct();
        // getTockens()
    }, []))

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        // console.log(userid)
        setUserId(userid)
    }
    const getTocken = async () => {
        const token: any = await AsyncStorage.getItem('ACCESS_TOKEN')
        const Token = JSON.parse(token)
        // console.log('tocken', tocken)
        setTocken(Token)
    }
    const deleteCart = ({ productId }: { productId: any }) => {
        setLoading(true)
        const deleteUrl = `${endpoint.removeCart}/${productId}`
        _makeAxiosDeleteRequest(deleteUrl, {}).then((res: any) => {
            // console.log(res)
            getCartProduct()
            setLoading(false)
        }).catch((err: any) => {
            setLoading(false)
            console.log(err)
            Alert.alert(err.response.data.message)

        })
    }


    const ProductPrice = () => {
        const total = cartList.reduce((a: any, b: any) => {
            return (
                a + b?.get_product_data?.price * parseInt(b?.quantity)
            )
        }, 0)
        return (
            total
        )
    }

    const ProductOfferPrice = () => {
        const total = cartList.reduce((a: any, b: any) => {
            return (
                a + b?.get_product_data?.offer_price * parseInt(b?.quantity)
            )
        }, 0)
        return (
            total
        )
    }

    const ProductDiscount = ProductPrice() - ProductOfferPrice()

    const DeleteCartItem = ({ productId }: { productId: any }) => {
        Alert.alert('Remove Cart Item ', 'Are You Sure To Remove this item ', [
            {
                text: 'remove',
                onPress: () => deleteCart({ productId: productId }),

            },
            { text: 'cancel', onPress: () => console.log('OK Pressed'), style: "default" },
        ]);

    }



    return (
        <View style={style.container}>
            <Header title='My Cart ' showShadow={true} cartleft={-10} searchLeft={5} onpress={() => navigation.navigate('HomePage')} />
            {loading ? (<SkelatonEffectShoppingCart />) :
                (cartList.length == 0 ?
                    (<View style={style.emptycartcontainer}>
                        <LottieView source={require('../../component/Animations/Animation - 1699351711243.json')} style={{ width: 110, height: 110, bottom: 110 }} />
                        <Text style={style.emptytext}> Your Cart is Empty</Text>
                        <View style={{bottom:10}}>
                            <TouchableOpacity onPress={()=> navigation.navigate('HomePage')} style={{ backgroundColor: '#27AAE1', borderRadius:8, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                                <Text style={{ color: 'white', padding: 10, fontSize: 18, }}> Continue Shopping </Text>
                            </TouchableOpacity>
                        </View>
                    </View>) :
                    (<ScrollView style={{ top: 10 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, }}>
                        <View style={{ top: 0, }}>
                            <FlatList

                                style={{}}
                                data={cartList}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity onLongPress={() => DeleteCartItem({ productId: item.id })} style={{ margin: 2, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, }} onPress={() => navigation.navigate('ExampleDetail', { id: item?.product_id })}>
                                            <View style={style.cartlistcontainer}>
                                                <Image source={{ uri: item?.get_product_data?.ImageSrc }} resizeMode='stretch' style={style.cartlistimage} />
                                                <View style={{ position: "absolute", left: 130 }}>
                                                    <Text style={style.cartlistproductname}> {item?.get_product_data?.product_name}</Text>
                                                    <Text style={[style.cartlistproductname, { top: 10 }]} numberOfLines={1}> {item?.get_product_data?.short_desc}</Text>
                                                    <Text style={style.cartlistsoldby}> Sold By : {item?.vendor[0]?.business_name}</Text>
                                                    <View style={style.cartlistdetail}>
                                                        <Text style={style.cartlistqty}>{"QTY:" + item.quantity + ' ' + 'X'}</Text>
                                                        <Text style={style.cartlistofferprice}>{item?.get_product_data?.currency_data?.symbol + ' ' + item?.offer_price}</Text>
                                                        <Text style={style.cartlistoriginalprice}> = {Math.round(item?.quantity * item?.offer_price)}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                    );
                                }} />
                        </View>
                        <View style={{ bottom: 8 }}>
                            <View style={style.pricedetailcontaine}>
                                <Text style={style.pricedetailtitle}> Price Details </Text>
                                <View style={{ flexDirection: 'row', margin: 10 }}>
                                    <Text style={style.pricedetailpricetext}> Product Price </Text>
                                    <Text style={[style.pricedetailprice, { left: Math.round(ProductPrice()) >= 1000 ? 220 : 230 }]}> ₹{Math.round(ProductPrice())}</Text>

                                </View>
                                <View style={{ flexDirection: 'row', margin: 10 }}>
                                    <Text style={style.pricedetaildiscounttext}> Product Discount </Text>
                                    <Text style={[style.pricedetaildiscount, { left: Math.round(ProductDiscount) >= 1000 ? 190 : 210 }]}>₹{Math.round(ProductDiscount)}</Text>
                                </View>
                            </View>
                            <View style={{ width: '100%', backgroundColor: "white", top: 15, shadowColor: "black", shadowOffset: { width: 10, height: 10 }, shadowOpacity: 10, shadowRadius: 50, elevation: 3 }}>
                                <View style={{ padding: 10, flexDirection: 'row', top: 0, }}>
                                    <Text style={style.pricedetailtotalamounttext}> Order Total </Text>
                                    <Text style={[style.pricedetailtotalamount, { marginLeft: ProductOfferPrice() >= 1000 ? 220 : 235 }]}>  ₹{ProductOfferPrice()}</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    ))
            }
            {cartList.length == 0 ? null : <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={{ height: 80, backgroundColor: "white" }}>
                    <View style={style.btncontainer}>
                        <Text style={style.price}> ₹{price()}</Text>
                        <TouchableOpacity onPress={() => { cartList?.length == 0 ? (Alert.alert('No Product In Cart ')) : navigation.navigate('CheckOut') }} style={style.btn}>
                            <Text style={style.btntext}> Continue </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            }

        </View >
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    headercontainer: {
        flexDirection: "row",
        top: 12
    },
    headericonview: {
        width: 35,
        height: 35,
        backgroundColor: "white",
        borderRadius: 50,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
        top: -3,
        left: 15
    },
    headertitle: {
        color: "black",
        fontSize: 20,
        left: 90,
        fontWeight: '900',
        top: 5
    },
    searchicon: {
        left: 165,
        top: 0
    },
    carticon: {
        left: 185,
        top: 0
    },
    emptycartcontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 250
    },
    emptytext: {
        color: "black",
        fontWeight: '800',
        fontStyle: 'italic',
        bottom: 120,
        fontSize:15
    },
    cartlistcontainer: {
        backgroundColor: "#F5F5F5",
        height: 140
    },
    cartlistimage: {
        width: 125,
        height: 125,
        top: 7,
        left: 10
    },
    cartlistproductname: {
        color: "black",
        fontWeight: '800',
        left: 16,
        top: 10
    },
    cartlistdetail: {
        flexDirection: "row",
        top: -15
    },
    cartlistqty: {
        color: "black",
        top: 30,
        left: 25
    },
    cartlistofferprice: {
        color: "black",
        top: 30,
        left: 35
    },
    cartlistoriginalprice: {
        color: "black",
        top: 30,
        left: 40
    },
    cartlisttotalamount: {
        top: 25,
        left: 20,
        color: "black"
    },
    pricedetailcontaine: {
        backgroundColor: 'white',
        top: 10,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2,
    },
    pricedetailtitle: {
        color: "black",
        fontWeight: '900',
        margin: 10,
        fontSize: 15,
        marginTop: 20,
        left: 10
    },
    pricedetailpricetext: {
        color: "black",
        fontWeight: '300',
        fontSize: 15
    },
    pricedetailprice: {
        color: "black",
        fontWeight: '300',
        fontSize: 15,
        // marginLeft: 230,
    },
    pricedetaildiscounttext: {
        color: "black",
        fontWeight: '300',
        fontSize: 15
    },
    pricedetaildiscount: {
        color: "black",
        fontWeight: '300',
        fontSize: 15,
        // marginLeft: 205
    },
    topdivider: {
        borderTopWidth: 0.5,
        top: 10
    },
    pricedetailtotalamounttext: {
        color: "black",
        fontWeight: '900',
        fontSize: 15,
    },
    pricedetailtotalamount: {
        color: "black",
        fontWeight: '900',
        fontSize: 15,
    },
    bottomdivider: {
        borderTopWidth: 0.5,
        top: 30
    },
    price: {
        color: 'black',
        top: 25,
        fontSize: 15,
        fontWeight: '900',
        left: 70
    },
    btn: {
        backgroundColor: '#27AAE1',
        width: 180,
        borderRadius: 11,
        left: 150,
        top: 15
    },
    btntext: {
        color: 'white',
        fontSize: 15,
        padding: 10,
        textAlign: 'center'
    },
    btncontainer: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
    },
    cartlistsoldby: {
        fontSize: 15,
        color: 'black',
        left: 50,
        top: 10
    }
})


export default ExampleCart