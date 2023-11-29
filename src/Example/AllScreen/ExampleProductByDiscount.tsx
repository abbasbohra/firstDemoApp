import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AirbnbRating } from 'react-native-ratings'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _makeAxiosPostRequest, _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import RBSheet from 'react-native-raw-bottom-sheet'
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




const ExamplProductByDiscount = ({ navigation, route }: { navigation: any, route: any }) => {
    const [products, setProducts] = useState<products[]>([]);
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState('');
    const [wishlistData, setWishlistData] = useState([]);
    const { start_discount } = route.params
    const { end_discount } = route.params
    const { title } = route.params
    const OpenBottomsheet = useRef<any>();
    // console.log(start_discount, end_discount)

    const getLoaction = async () => {
        const locat: any = await AsyncStorage.getItem('Loacation')
        const location = JSON.parse(locat)
        setLocation(location)
    }

    useEffect(() => {
        getLoaction();
        getApiData()
        getWishlist()

    }, [])

    const getApiData = async () => {
        setLoading(true)
        const data = {
            id: null,
            end_discount: end_discount,
            start_discount: start_discount,
            page: 1,
        }

        _makeAxiosPostRequest(endpoint.productByCategort, data).then((res) => {
            // console.log('res', res.data.products.data)
            setProducts(res.data.products.data)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }


    console.log(loading)
    const getWishlist = () => {
        _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res: any) => {
            // console.log('wishlistdata=========>', res.data.products.data)
            setWishlistData(res.data.products.data)
        }).catch((error: any) => {
            console.log(error)

        })
    }

    const CheckWishlist = ({ productId }: { productId: any }) => {
        const find = wishlistData.find((elem: any) => elem?.id === productId)
        // console.log('find===>', find)
        return find ? (
            <Icon name='ios-heart' color={'black'} style={{ position: "absolute", left: 160, top: 15 }} size={30} onPress={() => Alert.alert('Product Already Add')} />
        ) : (
            <Icon name='ios-heart-outline' color={'black'} style={{ position: "absolute", left: 160, top: 15 }} size={30} onPress={() => addToWishlist({ productId: productId })} />

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
console.log('width height',)

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ height: 50 }}>
                <Header title={`Sale ${title}`} showShadow={false} searchLeft={-10} cartleft={-10} onpress={() => navigation.goBack()} />
                <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: 'black', top: -8 }}>
                    <View style={{ flexDirection: "row", top: 0, left: 50, padding: 10 }}>
                        <MaterialCommunityIcons name='sort' size={25} style={{ textAlign: "center" }} color={'black'} />
                        <Text style={{ color: "black", top: 2.5 }}> SORT </Text>
                    </View>
                    <View style={{ borderLeftWidth: 0.5, left: 104, borderColor: 'black' }} />
                    <TouchableOpacity onPress={() => OpenBottomsheet.current.open()} style={{ flexDirection: 'row', top: 0, width: 150, left: 120, }}>
                        <MaterialCommunityIcons name='filter-variant' size={25} style={{ textAlign: "center", top: 10, left: 50 }} color={'black'} />
                        <Text style={{ color: "black", top: 12.5, left: 50 }}> SORT </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loading ? (
                <View style={[{ justifyContent: "center", alignContent: "center", alignItems: "center", top: 60, backgroundColor: 'white' }]}>
                    <SkelatonEffectProductPage />
                </View>
            ) :
                (
                    products?.length == 0 ? (
                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", top: 250 }}>
                            <Image source={{ uri: 'https://i.ibb.co/3d2D2BS/no-product-found.png' }} resizeMode='contain' style={{ width: 300, height: 300 }} />
                        </View>
                    ) : (<View style={{ paddingBottom: 100 }}>
                        <FlatList
                            style={{ top: 55, left: 8 }}
                            data={products}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ width: Dimensions.get('screen').width/2, backgroundColor: 'white', borderBottomWidth: 0.5, borderRightWidth: 0.5, borderColor: "black", borderBottomColor: "black", paddingBottom: 20 }}>
                                        <ImageBackground source={{ uri: item.ImageSrc }} resizeMode='contain' style={{ width:  Dimensions.get('screen').width/2-2, height: 180, }} >
                                            {CheckWishlist({ productId: item?.id })}

                                        </ImageBackground>
                                        <TouchableOpacity style={{ top: 10, }} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                            <Text style={{ color: "black", top: 0, right: 0, fontWeight: '900' }} numberOfLines={1}> {item.product_name}</Text>
                                            <Text style={{ color: "black", fontSize: 12, left: 0, top: 0, marginRight: 0 }} numberOfLines={1}> {item?.short_desc}</Text>
                                            <View style={{ flexDirection: "row", right: 10, bottom: -10, paddingBottom: 10 }}>
                                                <Text style={{ color: "black", left: 10, top: 0, marginLeft: 0, fontWeight: '900' }}> ₹{item.offer_price}</Text>
                                                <View style={{ borderBottomWidth: 0.5, borderColor: 'grey', left: 60, top: -10 }}>
                                                    <Text style={{ color: "grey", top: 10 }}> ₹{item.price}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                )
                            }}
                        />
                    </View>)
                )}
            <RBSheet
                ref={OpenBottomsheet}
                o
                closeOnDragDown={true}
                animationType='fade'
                height={500}
                customStyles={{ container: { borderTopLeftRadius: 40, borderTopRightRadius: 40 }, draggableIcon: { backgroundColor: 'white' } }}
            >
                <View>
                    <View style={{ flexDirection: 'row', top: 0 }}>
                        <Text style={{ color: 'black', fontWeight: '900', fontSize: 17, margin: 5 }}> SORT</Text>
                        <Icon name='close' color={'black'} size={30} style={{ left: 280 }} onPress={() => OpenBottomsheet.current.close()} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: 'silver', top: 20 }} />
                    <View style={{ top: 40 }}>
                        <View style={{ flexDirection: 'row', margin: 8 }}>
                            <Text style={{ color: 'black', fontSize: 15 }}> New Arrivals</Text>
                            <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 250 }} />
                        </View>
                        <View style={{ flexDirection: 'row', margin: 8 }}>
                            <Text style={{ color: 'black', fontSize: 15 }}> Most Popular</Text>
                            <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 248 }} />
                        </View>
                        <View style={{ flexDirection: 'row', margin: 8 }}>
                            <Text style={{ color: 'black', fontSize: 15 }}> {`Price(Low to High)`}</Text>
                            <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 210 }} />
                        </View>
                        <View style={{ flexDirection: 'row', margin: 8 }}>
                            <Text style={{ color: 'black', fontSize: 15 }}> {`Price(High to Low)`}</Text>
                            <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 210 }} />
                        </View>
                        <View style={{ flexDirection: 'row', margin: 8 }}>
                            <Text style={{ color: 'black', fontSize: 15 }}> {`Rating(High to Low)`}</Text>
                            <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 200 }} />
                        </View>
                    </View>
                </View>
            </RBSheet>

        </View >
    )
}
const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5

    }
})
export default ExamplProductByDiscount