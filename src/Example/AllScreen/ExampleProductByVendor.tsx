import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image, ToastAndroid, Alert, ActivityIndicator, ScrollView, RefreshControl, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import Icon from 'react-native-vector-icons/Ionicons'
import { Avatar } from 'react-native-paper'
import { useIsFocused } from '@react-navigation/native'
import { NavigationActions } from 'react-navigation';
import Header from '../../component/Header'
import SkelatonEffectSeller from '../../component/SkelatonEffect/SkelatonEffectSeller'

type vendorDetails = {
    total_product: any
    total_follow: any
    rating: any
    vendor: any
    profile: any

}


const ExampleProductByVendor = ({ route, navigation }: { route: any, navigation: any }) => {
    const [vendorDetail, setvendorDetauil] = useState<any>()
    const [vendorProducts, setVendorProducts] = useState([])
    const [vendorIsFollow, setVendorIsFollow] = useState(false)
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const { vendorId } = route.params
    const focused = useIsFocused();

    const getVenndorDetail = async () => {
        setLoading(true)
        const vendorUrl = `${endpoint.getByVendorId}/${vendorId}?page=1`
        _makeAxiosGetRequest(vendorUrl, {}).then((res) => {
            setvendorDetauil(res.data.user)
            setVendorIsFollow(res.data.user.is_follow)
            setVendorProducts(res.data.products.data)
            // setLoading(false)
        }).catch((error) => {
            setLoading(false)
            Alert.alert(error.response.data.message)
            console.log(error)
        })
    }
    const onRefresh = () => {
        getVenndorDetail();
    }
    useEffect(() => {
        getVenndorDetail();
    }, [focused])

    const followVendor = () => {
        const data = {
            follower_id: vendorId
        }
        _makeAxiosPostRequest(endpoint.followVendor, data).then((res: any) => {
            // console.log(res.data)
            getVenndorDetail()
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
        }).catch((error) => {
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }
    const allProducts = () => {
        return (
            <View>
                {(
                    vendorProducts?.length === 0 ? (
                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", top: 0 }}>
                            <Image source={{ uri: 'https://i.ibb.co/3d2D2BS/no-product-found.png' }} resizeMode='contain' style={{ width: 300, height: 300 }} />
                        </View>
                    ) :
                        (<View>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: "500", left: 20, margin: 10 }}>Product</Text>
                            <FlatList
                                data={vendorProducts}
                                numColumns={2}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item: any) => item.id}
                                renderItem={
                                    ({ item, index }: { item: any, index: any }) => {
                                        return (
                                            <View style={{ backgroundColor: 'white', borderBottomWidth: 0.5, borderRightWidth: 0.5, paddingBottom: 20, width: Dimensions.get('screen').width / 2 }}>
                                                <ImageBackground source={{ uri: item.ImageSrc }} resizeMode='stretch' style={{ width: Dimensions.get('screen').width / 2 - 2, height: 190, }}>
                                                    {/* {CheckWishlist({ productId: item?.id })} */}
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
                        </View >)
                )}

            </View >
        )
    }



    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <Header title='Seller' showShadow={true} searchLeft={-10} cartleft={-10} onpress={() => navigation.goBack()} />
            {loading ? (<SkelatonEffectSeller />) : (<ScrollView contentContainerStyle={{ backgroundColor: '#F5F5F5', paddingBottom: 100 }} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
                <View style={{ borderTopWidth: 1 }}>
                    <ImageBackground source={{ uri: vendorDetail?.profile }} style={{ width: '100%', height: 200 }} resizeMode='stretch'>
                        <Avatar.Image source={{ uri: vendorDetail?.profile }} style={{ backgroundColor: 'white', top: 30, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, left: 20, }} size={100} />
                    </ImageBackground>
                    <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingBottom: 20, bottom: 10 }}>
                        <Text style={{ margin: 10, fontSize: 20, fontWeight: '700', color: 'black' }}> {vendorDetail?.name}</Text>
                        <TouchableOpacity onPress={() => followVendor()} style={{ width: 100, borderRadius: 8, top: 10, left: 0, backgroundColor: "#27AAE1", height: 35 }}>
                            {vendorIsFollow ? <Text style={{ padding: 5, color: 'white', fontSize: 16, textAlign: 'center' }}> Following </Text> : <Text style={{ padding: 8, color: 'white', fontSize: 16, textAlign: 'center' }}> Follow </Text>}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ padding: 10, backgroundColor: "white", borderRadius: 3, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 1, paddingBottom: 20 }}>
                    <Text style={{ color: "black", fontWeight: '900', }}> Sold by </Text>
                    <View style={{ flexDirection: 'row', bottom: 20 }}>
                        <Avatar.Image source={{ uri: vendorDetail?.profile }} style={{ backgroundColor: 'white', top: 25, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, left: 0, }} size={55} />
                        <Text style={{ color: "black", fontSize: 18, left: 0, top: 40, fontWeight: '900', fontFamily: 'Rubik-SemiBold', }}> {vendorDetail?.vendor?.business_name.toUpperCase()}</Text>
                    </View>
                    <View style={{ left: 20 }}>
                        <View style={{ flexDirection: 'row', top: 0 }}>
                            <Text style={{ color: "black", fontSize: 20, left: 60 }}> {vendorDetail?.rating}</Text>
                            <Text style={{ color: "black", fontSize: 20, left: 150 }}> {vendorDetail?.total_follow}</Text>
                            <Text style={{ color: "black", fontSize: 20, left: 235 }}> {vendorDetail?.total_product}</Text>
                        </View>
                        <View style={{ flexDirection: "row", bottom: 10 }}>
                            <Text style={{ color: "black", fontSize: 15, left: 40, top: 20, fontWeight: '500' }}> Ratings</Text>
                            <Text style={{ color: "black", fontSize: 15, left: 80, top: 20, fontWeight: '500' }}> Follower</Text>
                            <Text style={{ color: "black", fontSize: 15, left: 115, top: 20, fontWeight: "500" }}> Products</Text>

                        </View>
                    </View>
                </View>
                <View style={{ top: 10, backgroundColor: 'white' }}>
                    {allProducts()}
                </View>
            </ScrollView>)}
        </View>
    )
}

export default ExampleProductByVendor