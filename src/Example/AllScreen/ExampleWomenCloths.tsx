import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _makeAxiosPostRequest, _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import Header from '../../component/Header'
import { AirbnbRating } from 'react-native-ratings'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SkelatonEffectProductPage from '../../component/SkelatonEffect/SkelatonEffectProductPage'
import LottieView from 'lottie-react-native'
import axios, { Axios } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
const ExampleWomenCloths = ({ navigation, route }: { navigation: any, route: any }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false)
    const [wishlistData, setWishlistData] = useState([])
    const [onEnd, setOnEnd] = useState(false)
    const { id } = route.params
    const { get_sub_categoryid } = route.params
    const { title } = route.params
    const [url, setUrl] = useState('')
    const [loadProduct, setLoadProduct] = useState([])
    // console.log('id====>', id)
    // console.log('get_sub_categotyId====>', get_sub_categoryid)

    const getProducts = () => {
        setLoading(true)
        const body = new FormData()
        body.append('id', id)
        body.append('getSubCategory', get_sub_categoryid)
        body.append('page', '1')
        body.append('type', 'most - popular')

        console.log(body)

        _makeAxiosPostRequest(endpoint.productByCategort, body).then((res) => {
            // console.log(res.data.products.data)
            setProducts(res.data.products.data)
            setUrl(res.data.products.next_page_url)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }
    useEffect(() => {
        getProducts()
        getWishlist()

    }, [])

    const getWishlist = () => {
        // setLoading(true)

        _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res) => {
            // console.log('wishlistdata=========>', res.data.products.data)
            setWishlistData(res.data.products.data)
            // setLoading(false)
        }).catch((error) => {
            // setLoading(false)
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }
    const CheckWishlist = ({ productId }: { productId: any }) => {
        const find = wishlistData.find((elem: any) => elem?.id === productId)
        // console.log('find===>', find)
        return find ? (
            <Icon name='ios-heart' color={'black'} style={{ position: "absolute", left: 150, top: 5 }} size={25} onPress={() => Alert.alert('Product Already Add')} />
        ) : (
            <Icon name='ios-heart-outline' color={'black'} style={{ position: "absolute", left: 150, top: 5 }} size={25} onPress={() => addToWishlist({ productId: productId })} />

        )
    }

    const addToWishlist = async ({ productId }: { productId: any }) => {
        // setLoading(true)
        const data = {
            product_id: productId
        }
        _makeAxiosPostRequest(endpoint.wishlist, data).then((res) => {
            // console.log(res.data.data)
            // setLoading(false)
            getWishlist()
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)
        })

    }



    const onPressLoadMore = async () => {
        try {
            const userToken: any = await AsyncStorage.getItem('ACCESS_TOKEN');
            const token = JSON.parse(userToken);
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const res = await axios.post(url, {}, { headers });
            console.log('resssss', res.data);
            setLoadProduct(res.data.products.data);
            setOnEnd(false);

        } catch (error: any) {
            console.error('Error:', error.response ? error.response.data.message : error.message);
            setOnEnd(false);
            throw error;
        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ height: 80 }}>
                <Header onpress={() => navigation.navigate('Wishlists')} title={title} showShadow={false} cartleft={-10} searchLeft={-10} />
                <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: 'black', top: -10 }}>
                    <View style={{ flexDirection: "row", top: 0, left: 50, padding: 10 }}>
                        <MaterialCommunityIcons name='sort' size={25} style={{ textAlign: "center" }} color={'black'} />
                        <Text style={{ color: "black", top: 2.5 }}> SORT </Text>
                    </View>
                    <View style={{ borderLeftWidth: 0.5, left: 100, borderColor: 'black' }} />
                    <View style={{ flexDirection: "row", top: 0, left: 160, padding: 10 }}>
                        <MaterialCommunityIcons name='filter-variant' size={25} style={{ textAlign: "center" }} color={'black'} />
                        <Text style={{ color: "black", top: 2.5 }}> SORT </Text>
                    </View>
                </View>
            </View>

            {loading ? (
                <SkelatonEffectProductPage />
            ) : (
                products?.length == 0 ? (
                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", top: 50 }}>
                        <LottieView source={require('../../component/Animations/Animation - 1699268060973.json')} autoPlay loop style={{ height: 180, width: 180 }} />
                        <Text style={{ fontSize: 15, }}> No Data Found</Text>
                    </View>
                ) :
                    (
                        <View style={{ paddingBottom: 110 }}>

                            <FlatList
                                style={{ top: 20, left: 6 }}
                                data={products}
                                numColumns={2}
                                // onScrollToTop={() => setOnEnd(false)}
                                onEndReached={() => { setOnEnd(true), onPressLoadMore() }}
                                keyExtractor={(item: any) => item.id}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ width: Dimensions.get('screen').width / 2 - 2, height: 280, backgroundColor: 'white', borderBottomWidth: 0.5, borderLeftWidth: 0.5, borderColor: 'grey' }}>
                                            <ImageBackground source={{ uri: item?.ImageSrc }} resizeMode='stretch' style={{ width: Dimensions.get('screen').width / 2 - 2, height: 180, margin: 2 }}>
                                                {CheckWishlist({ productId: item?.id })}
                                            </ImageBackground>
                                            <TouchableOpacity style={{ position: "absolute", left: 100, top: 200, }} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                                <Text style={{ color: "black", right: 95, fontWeight: '900' }} numberOfLines={1}> {item?.product_name}</Text>
                                                <Text style={{ color: "black", fontSize: 12, left: -95, marginRight: 0, top: 5 }} numberOfLines={1}> {item?.short_desc}</Text>
                                                <View style={{ flexDirection: "row", right: 95, paddingBottom: 10, top: 10 }}>
                                                    <Text style={{ color: "black", top: 0, marginLeft: 0, fontWeight: '900' }}> ₹{item?.offer_price}</Text>
                                                    <View style={{ borderBottomWidth: 0.5, borderColor: 'grey', left: 70, top: -10 }}>
                                                        <Text style={{ color: "grey", top: 10 }}> ₹{item?.price}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    )
                                }}
                            />
                            <View>
                                {onEnd ? (<TouchableOpacity onPress={() => setOnEnd(false)} style={{ top: 0, backgroundColor: "white", paddingBottom: 20 }}>
                                    <ActivityIndicator color={'black'} size={35} />
                                </TouchableOpacity>) : null}
                            </View>
                        </View>
                    )
            )}
        </View>
    )
}

export default ExampleWomenCloths