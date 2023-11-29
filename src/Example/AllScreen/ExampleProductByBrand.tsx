import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AirbnbRating } from 'react-native-ratings'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _makeAxiosPostRequest, _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../../component/Header'
import SkelatonEffectProductPage from '../../component/SkelatonEffect/SkelatonEffectProductPage'


type products = {
    ImageSrc: string
    product_name: string
    short_desc: string
    price: number
    discounts: number
    offer_price: number
    rating: number
    id: number
}




const ExamplProductByBrand = ({ navigation, route }: { navigation: any, route: any }) => {
    const [products, setProducts] = useState<products[]>([]);
    const [loading, setLoading] = useState(false)
    const [locations, setLocation] = useState();
    const { productId } = route.params
    const { Brandname } = route.params
    const [wishlistData, setWishlistData] = useState([]);
    // console.log(productId)

    const getLoaction = async () => {
        const locat: any = await AsyncStorage.getItem('Loacation')
        const location = JSON.parse(locat)
        console.log('location===========>', location.location_lat)
        setLocation(location)
    }

    const getApiData = async () => {
        setLoading(true)
        console.log('location===========>', locations)
        const data = {
            ' page': 1,
            ' id': null,
            ' brand[0]': Brandname,
        }
        _makeAxiosPostRequest(endpoint.productByCategort, data).then((res) => {
            // console.log('res', res.data.data)
            setProducts(res.data.products.data),
                setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)

        })
    }
    useEffect(() => {
        getLoaction()
        getApiData()
        getWishlist()

    }, [])
    const getWishlist = () => {
        _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res: any) => {
            // console.log('wishlistdata=========>', res.data.products.data)
            setWishlistData(res.data.products.data)
        }).catch((error: any) => {
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }

    const CheckWishlist = ({ productId }: { productId: any }) => {
        const find = wishlistData.find((elem: any) => elem?.id === productId)
        // console.log('find===>', find)
        return find ? (
            <Icon name='ios-heart' color={'black'} style={{ position: "absolute", left: 160, top: 15 }} size={25} onPress={() => Alert.alert('Product Already Add')} />
        ) : (
            <Icon name='ios-heart-outline' color={'black'} style={{ position: "absolute", left: 160, top: 15 }} size={25} onPress={() => addToWishlist({ productId: productId })} />

        )
    }

    const addToWishlist = async ({ productId }: { productId: any }) => {
        setLoading(true)
        const data = {
            product_id: productId
        }
        _makeAxiosPostRequest(endpoint.wishlist, data).then((res) => {
            // console.log(res.data.data)
            setLoading(false)
            getWishlist()
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)


        })

    }
    return (
        <View style={{ flex: 1, backgroundColor: "white", }}>
            <View style={{ height: 50 }}>
                <Header title={`Product (${Brandname})`} searchLeft={-10} cartleft={-10} onpress={() => navigation.goBack()} />
                <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: 'black', top: -7, }}>
                    <View style={{ flexDirection: "row", top: 0, left: 50, padding: 10 }}>
                        <MaterialCommunityIcons name='sort' size={25} style={{ textAlign: "center" }} color={'black'} />
                        <Text style={{ color: "black", top: 2.5 }}> SORT </Text>
                    </View>
                    <View style={{ borderLeftWidth: 0.5, left: 105, borderColor: 'black' }} />
                    <View style={{ flexDirection: "row", top: 0, left: 160, padding: 10 }}>
                        <MaterialCommunityIcons name='filter-variant' size={25} style={{ textAlign: "center" }} color={'black'} />
                        <Text style={{ color: "black", top: 2.5 }}> SORT </Text>
                    </View>
                </View>
            </View>
            {loading ?
                (<View style={{ top: 50 }}>
                    <SkelatonEffectProductPage />
                </View>
                )
                : (
                    products?.length == 0 ?
                        (<View style={{ justifyContent: 'center', alignItems: 'center', top: 250 }}>
                            <Text style={{ color: "black", fontWeight: '800', fontStyle: 'italic' }}> No product Found ! </Text>
                        </View>)
                        :
                        (<View style={{ paddingBottom: 110 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={{ top: 54, left: 8 }}
                                data={products}
                                numColumns={2}
                                keyExtractor={(item: any) => item.id}  
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ backgroundColor: 'white', borderBottomWidth: 0.5, borderRightWidth: 0.5, paddingBottom: 20, width: Dimensions.get('screen').width / 2 }}>
                                            <ImageBackground source={{ uri: item.ImageSrc }} resizeMode='stretch' style={{ width: Dimensions.get('screen').width / 2 - 2, height: 190, }}>
                                                {CheckWishlist({ productId: item?.id })}
                                            </ImageBackground>
                                            <TouchableOpacity style={{ left: 0, top: 10, }} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                                {/* <View style={{width:}}>
                        
                                        </View> */}
                                                <Text style={{ color: "black", top: 0, right: 0, fontWeight: '900' }} numberOfLines={1}> {item.product_name}</Text>
                                                <Text style={{ color: "black", fontSize: 12, left: 0, top: 0, marginRight: 0 }} numberOfLines={1}> {item?.short_desc}</Text>
                                                <View style={{ flexDirection: "row", right: 0, bottom: 0, paddingBottom: 10 }}>
                                                    <Text style={{ color: "black", top: 0, marginLeft: 0, fontWeight: '900' }}> ₹{item.offer_price}</Text>
                                                    <View style={{ borderBottomWidth: 0.5, borderColor: 'grey', left: 80, top: -10 }}>
                                                        <Text style={{ color: "grey", top: 10 }}> ₹{item.price}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        ))}
        </View>
    )
}

export default ExamplProductByBrand