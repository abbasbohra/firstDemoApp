import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, ToastAndroid, TextInput, BackHandler, StatusBar, Keyboard } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Appbar, Avatar, Badge, Divider, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import { _makeAxiosPostRequest, _makeAxiosGetRequest } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import { AirbnbRating } from 'react-native-ratings'
import Header from '../../component/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SkelatonEffectSearch from '../../component/SkelatonEffect/SkelatonEffectSearch';
import LottieView from 'lottie-react-native';

const ExampleSearch = ({ route, navigation }: { route: any, navigation: any }) => {

    const [search, setSearch] = useState('')
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false)
    const searchRef = useRef<any>();
    const [wishlistData, setWishlistData] = useState([]);

    // console.log(search)



    const getWishlist = () => {
        _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res) => {
            // console.log('wishlistdata=========>', res.data.products.data)
            setWishlistData(res.data.products.data)
        }).catch((error) => {
            console.log(error)
        })
    }
    useEffect(() => {
        getWishlist()
        Search()

    }, [])

    const addToWishlist = async ({ productId }: { productId: any }) => {
        const data = {
            product_id: productId
        }
        _makeAxiosPostRequest(endpoint.wishlist, data).then((res: any) => {
            // console.log(res.data.data)
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
            getWishlist()
        }).catch((error) => {
            console.log(error)

        })

    }

    const CheckWishlist = ({ productId }: { productId: any }) => {
        const find = wishlistData.find((elem: any) => elem?.id === productId)
        // console.log('find===>', find)
        return find ? (<Icon name='heart' style={{ position: "absolute", left: 170, top: 15 }} size={20} color={'black'} onPress={() => addToWishlist({ productId: productId })} />) : (<Icon name='ios-heart-outline' style={{ position: "absolute", left: 160, top: 15 }} size={20} color={'black'} onPress={() => addToWishlist({ productId: productId })} />)
    }

    const Search = () => {
        setLoading(true)
        const data = {
            search: search,
            type: 'most-popular'
        }

        _makeAxiosPostRequest(endpoint.search_product, data).then((res) => {
            // console.log(res.data)
            setProducts(res.data.data)
            setLoading(false)
        }).catch((error) => {
            console.log(error.response.data.message)
            setLoading(false)
            Alert.alert(error.response.data.message)

        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>

            <View style={{ flexDirection: 'row', top: 3, backgroundColor: "white", width: '100%', height: 45, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2 }}>
                <FontAwesome name='search' size={20} style={{ margin: 5, left: 5, top: 7 }} color={"black"} />
                <TextInput value={search} onChangeText={setSearch} onChange={() => Search()} placeholder='Search for Product' style={{ left: 10, color: "black", fontSize: 15, fontWeight: '400', width: '90%' }} placeholderTextColor={'black'} onSubmitEditing={() => Keyboard.dismiss()} />
            </View>
            {loading ? (
                <SkelatonEffectSearch />
            ) :
                products?.length === 0 || search === '' ? (
                    <View style={{ top: 150, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView source={require('../../component/Animations/Animation - 1699268060973.json')} autoPlay loop style={{ height: 180, width: 180 }} />
                        <Text style={{ fontSize: 15, }}> No Data Found</Text>
                    </View>
                ) :

                    (
                        <View style={{ paddingBottom: 45 }}>
                            <FlatList
                                style={{ top: 5, left: 8 }}
                                data={products}
                                keyExtractor={(item: any) => item.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ width: '95%', backgroundColor: 'white', margin: 5, paddingBottom: 30, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, right: 3 }}>
                                            {/* {CheckWishlist({ productId: item?.id })} */}
                                            <Image source={{ uri: item.ImageSrc }} resizeMode='stretch' style={{ width: 100, height: 100, top: 10, margin: 5 }} />
                                            <TouchableOpacity style={{ position: "absolute", left: 100, top: 10 }} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                                <View style={{ width: '86%', top: 10, }}>
                                                    <Text style={{ color: "black", right: -15, fontWeight: '900', fontSize: 13.7 }} >{item.product_name}</Text>
                                                </View>
                                                <Text style={{ color: "black", fontSize: 15, left: 10, top: 20, marginRight: 0 }} numberOfLines={1}> {item?.short_desc}</Text>
                                                <View style={{ flexDirection: "row", right: -10, bottom: 0, paddingBottom: 10 }}>
                                                    <Text style={{ color: "black", left: 10, top: 30, marginLeft: 0, fontWeight: '900' }}> ₹{item.offer_price}</Text>
                                                    <View style={{ borderBottomWidth: 0.5, borderColor: 'grey', left: 40, top: 20 }}>
                                                        <Text style={{ color: "grey", top: 10 }}> ₹{item.price}</Text>
                                                    </View>
                                                </View>



                                            </TouchableOpacity>

                                        </View>
                                    )
                                }}
                            />
                        </View>
                    )}
            <StatusBar
                backgroundColor={'#BDC6C1'}
                barStyle={'light-content'}
            />
        </View>
    )
}

export default ExampleSearch