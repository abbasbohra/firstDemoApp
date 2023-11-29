import { View, Text, FlatList, Image, TouchableOpacity, Modal, ToastAndroid, ActivityIndicator, Alert, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import Icon from 'react-native-vector-icons/Ionicons'
import { AirbnbRating } from 'react-native-ratings'
import PoductDetail from '../Screens/PoductDetail'
import { _makeAxiosPostRequest } from '../../Service/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../component/Header'
import LottieView from 'lottie-react-native'

const ExampleWishlist = ({ navigation }: { navigation: any }) => {

    const [wishlistData, setWishlistData] = useState([]);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState([]);
    const [getsizes, setGetSizes] = useState([]);
    const [price, setPrice] = useState<string>('');
    const [offer_Price, setOffer_price] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false)


    const getWishlist = () => {
        setLoading(true)
        _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res) => {
            // console.log('wishlistdata=========>', res.data.products.data)
            setWishlistData(res.data.products.data)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)

        })
    }
    useEffect(() => {
        getUserId();
        getWishlist()
    }, [])
    const selectSizeopen = ({ item: item }: { item: any }) => {
        setOpen(true)
        setProduct(item)
    }

    // console.log(product, 'product')

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        setUserId(userid)
    }

    const addToCart = ({ item }: { item: any }) => {

        const body = new FormData()
        body.append('session_id', userId,)
        body.append('vendor_id', item?.vendor?.id,)
        body.append('product_id', item?.id,)
        body.append('quantity', 1,)
        body.append('orignal_price', item.price,)
        body.append('offer_price', item?.offer_price,)

        if (color != '') {
            body.append('product_option[color]', [color])
        }
        if (size != '') {
            body.append('productSize[size]', [size])

        }
        // console.log('cart data', body)
        _makeAxiosPostRequest(endpoint.getCart, body).then((res) => {
            // console.log(res)
            ToastAndroid.show('Add to item', ToastAndroid.SHORT)
            setOpen(false)

            navigation.navigate('ExampleCart')
        }).catch((err) => {
            console.log(err)
            if (err.response.data.message == null) {
                Alert.alert(err.response.data.errors)
            } else { Alert.alert(err.response.data.message) }
        })
    }
    const removeFromWishlist = ({ productId }: { productId: any }) => {
        const body = new FormData()
        body.append('product_id', productId)

        _makeAxiosPostRequest(endpoint.wishlist, body).then((res) => {
            // console.log(res)
            getWishlist()
        }).catch((err) => {
            console.log(err)
            Alert.alert(err.response.data.message)

        })
    }
    const displaysize = () => {
        return (
            <View style={{ backgroundColor: 'white', height: 320, width: 350, left: 20, top: 180, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, borderRadius: 10 }}>
                <View style={{ bottom: 5, margin: 5, backgroundColor: 'white' }}>
                    <Text style={{ color: "black", top: 20, fontSize: 18 }} numberOfLines={1}> {product?.product_name} </Text>
                    <View style={{ flexDirection: "row", top: 30 }}>
                        <Text style={{ color: "black", fontSize: 15 }}>  {product?.currency_data?.symbol + ' ' + product?.price}</Text>
                        <Text style={{ color: "black", fontSize: 15 }}>  {product?.currency_data?.symbol + ' ' + product?.offer_price}</Text>
                    </View>
                    <View style={{ position: 'absolute', borderTopWidth: 1, width: 50, top: 65, left: 8 }} />
                    <Text style={{ position: 'absolute', color: "black", fontWeight: "900", fontSize: 20, top: 80 }}> Size </Text>

                    <FlatList
                        data={product?.OptionKey?.Size}
                        horizontal
                        style={{ top: 65 }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ backgroundColor: size == item?.values ? '#27AAE1' : "white", borderRadius: 10, borderColor: size == item?.values ? '#27AAE1' : 'black', borderWidth: 1, margin: 5 }}>
                                    <TouchableOpacity onPress={() => { setSize(item.values), setOffer_price(item.offer_price), setPrice(item.price) }}>
                                        <Text style={{ color: size === item?.values ? 'white' : "black", textAlign: "center", right: 5, top: 0, padding: 10 }}> {item.values}</Text>

                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                    {product?.OptionKey?.Colour === undefined ? null : <View style={{ top: 40 }}>
                        <Text style={{ color: "black", fontSize: 20, fontWeight: "900", top: 30 }}> Color </Text>
                        <FlatList
                            data={product?.OptionKey?.Colour}
                            horizontal
                            style={{ top: 35 }}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ backgroundColor: color == item?.values ? '#27AAE1' : "white", borderRadius: 10, borderColor: color === item?.values ? '#27AAE1' : 'black', borderWidth: 1, margin: 5 }}>
                                        <TouchableOpacity onPress={() => setColor(item.values)} >
                                            <Text style={{ color: color == item?.values ? 'white' : "black", textAlign: "center", right: 5, top: 0, padding: 10 }}> {item.values}</Text>

                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                    </View>}
                    <View style={{ top: 100, left: 170, width: 150 }}>
                        <TouchableOpacity style={{ backgroundColor: "#27AAE1", borderRadius: 10 }} onPress={() => addToCart({ item: product })}>
                            <Text style={{ padding: 10, color: "white", textAlign: 'center' }}> Add TO Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {/* <View style={{ flexDirection: "row", top: 10 }}>
                <View style={{ width: 40, height: 40, backgroundColor: "white", borderRadius: 50, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 6, margin: 5, marginLeft: 15, justifyContent: "center", alignItems: "center" }}>
                    <Icon name='chevron-back-outline' color={'black'} size={35} style={{}} onPress={() => navigation.goBack()} />
                </View>
                <Text style={{ color: "#27AAE1", fontSize: 20, textAlign: "center", left: 80, fontWeight: '900', top: 10, position: "absolute" }}> Wishlist </Text>
                <Icon name='search-outline' color={'black'} size={30} style={{ left: 300, top: 8, position: 'absolute' }} />
                <Icon name='cart-outline' color={'black'} size={30} style={{ left: 350, top: 8, position: 'absolute' }} />
            </View> */}
            <Header title='Wishlist' onpress={() => navigation.goBack()} cartleft={-10} searchLeft={5} showShadow={true} />
            {loading ? (

                <View style={{ top: 180, justifyContent: "center", alignItems: 'center' }}>
                    <LottieView source={require('../../component/Animations/Animation - 1699005800056.json')} autoPlay loop style={{ width: 250, height: 250 }} />
                </View>

            ) : wishlistData.length === 0 ? (

                <View style={{ top: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView source={require('../../component/Animations/Animation - 1699268060973.json')} autoPlay loop style={{ height: 180, width: 180 }} />
                    <Text style={{ fontSize: 15, }}> No Data Found</Text>
                </View>

            )
                :
                (<View style={{paddingBottom:70}}>
                    <FlatList
                        data={wishlistData}
                        numColumns={2}
                        keyExtractor={(item: any) => item.id}
                        style={{ top: 10, left: 2.5 }}
                        renderItem={({ item, index }: { item: any, index: any }) => {
                            return (
                                <View style={{ margin: 8, width: 180, paddingBottom: 50, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, backgroundColor: "white" }}>
                                    <ImageBackground source={{ uri: item.ImageSrc }} resizeMode='stretch' style={{ width: 170, height: 170, top: 5, left: 11 }}>
                                        <View style={{ backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2, width: 40, borderRadius: 10, left: 135, bottom: 10 }}>
                                            <Icon name='trash' style={{ left: 0, padding: 5 }} size={30} color={'#27AAE1'} onPress={() => removeFromWishlist({ productId: item.id })} />
                                        </View>
                                    </ImageBackground>
                                    <TouchableOpacity style={{ left: 0, top: 20 }} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                        <Text style={{ color: "black", fontSize: 15, fontWeight: '800' }} numberOfLines={1}> {item.product_name}</Text>
                                        <Text style={{ color: "black", fontSize: 15, left: 1, fontWeight: '600' }} numberOfLines={1}> {item.short_desc}</Text>
                                        <View style={{ flexDirection: "row", right: 10, bottom: 23 }}>
                                            <Text style={{ color: "grey", left: 10, top: 30, marginLeft: 0 }}> {item.offer_price}</Text>

                                            <View style={{ borderBottomWidth: 1, borderColor: 'black', left: 50, top: 20 }}>
                                                <Text style={{ color: "black", top: 8 }}> {item.price}</Text>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', left: 8, top: 20 }}>
                                        <TouchableOpacity style={{ backgroundColor: '#27AAE1', width: 168, borderRadius: 10, top: 15, flexDirection: 'row' }} onPress={() => item?.OptionKey?.length == 0 ? addToCart({ item: item }) : selectSizeopen({ item: item })}>
                                            <Icon name='cart-outline' color={'white'} size={20} style={{ margin: 9 }} />
                                            <Text style={{ color: "white", padding: 10, textAlign: "center" }}> Add To Cart </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            )
                        }}
                    />
                </View>)}
            <Modal
                visible={open}
                transparent={true}
                onRequestClose={() => setOpen(false)}
            >
                <View>
                    {displaysize()}
                </View>
            </Modal>
        </View>
    )
}

export default ExampleWishlist