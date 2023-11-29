import { View, Text, FlatList, Dimensions, Image, TouchableOpacity, RefreshControl, ScrollView, Alert, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import Header from '../../component/Header';
import { useIsFocused } from '@react-navigation/native'
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { horizontal } from 'react-native-swiper-flatlist/src/themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { _makeAxiosGetRequest } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import { err } from 'react-native-svg/lib/typescript/xml';
import SkelatonEffectOrderHistory from '../../component/SkelatonEffect/SkelatonEffectOrderHistory';

type products = {
    ProductName: string
    PoductQty: number
    ProductImage: string[]
    CardId: string
}

type orderdata = {
    id: string
    OrderDate: string
    PaymentStatus: string
    Products: products
    CancelOrderStatus: string
}


const OrderHistory = ({ navigation, }: { navigation: any }) => {
    const isFocused = useIsFocused();
    const [orderData, setOrderData] = useState<orderdata[]>([]);
    const [refreshing, SetRefreshing] = useState<boolean>(false)
    const [OrderProductDetail, setOrderProductDetail] = useState([])

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getOrderHistort()
    }, [isFocused])

    const getOrderHistort = () => {
        setLoading(true)
        _makeAxiosGetRequest(endpoint.getHistory, {}).then((res: any) => {
            // console.log('orderdata', res.data.orderdata.data)
            setOrderData(res.data.orderdata.data)
            setLoading(false)
        }).catch((error: any) => {
            console.log(error.response.data.message)
            if (error.message === 'Request failed with status code 500') {
                setLoading(false)
                ToastAndroid.show('Server Down try later', ToastAndroid.SHORT)

                ToastAndroid.show('Something Wrong ', ToastAndroid.SHORT)
            } else { }
            console.log(error.message)
        })
    }

    // console.log('set', OrderProductDetail)

    const displayaddress = (item: any) => {
        const Parse = JSON.parse(item)
        // console.log('address', Parse)
        return (
            <View>
                <Text style={{ color: "black", fontSize: 15, top: 2.5 }}> {Parse?.address}</Text>
            </View>
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View>
                <Header title={'Orders'} onpress={() => navigation.navigate('HomePage')} showShadow={true} searchLeft={5} cartleft={-10} titleStyle={{ top: 20, left: 130, fontSize: 20, color: 'black', fontWeight: '500' }} />
            </View>

            {loading ? (
                <SkelatonEffectOrderHistory />
            )
                : orderData?.length <= 0 ?
                    <Text style={{ color: "black", fontWeight: '500', fontSize: 20, textAlign: "center", top: 250 }}> No Order ! </Text>
                    : <View style={{ paddingBottom: 60, top: 0 }}>
                        <FlatList
                            data={orderData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item, index }: { item: any, index: any }) => {
                                const get_item = item?.get_item
                                return (
                                    <View style={{ margin: 5 }}>
                                        <View style={{ borderRadius: 3, backgroundColor: "white", width: 350, paddingBottom: 20, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, left: 16, }}>
                                            <View style={{ margin: 10 }}>
                                                <View style={{ flexDirection: 'row', left: 3 }}>
                                                    <Text style={{ color: 'silver', fontSize: 15 }}>Order no : </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}>{item?.order_number}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', top: 5 }}>
                                                    <Text style={{ color: 'silver', fontSize: 16 }}> Sold By :</Text>
                                                    <Text style={{ color: 'black', fontSize: 16 }}>{item?.get_vendor?.business_name}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', top: 9 }}>
                                                    <Text style={{ color: 'silver', fontSize: 16 }}> Total :</Text>
                                                    <Text style={{ color: 'black', fontSize: 16 }}> Rs{item?.total_price}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', top: 13 }}>
                                                    <View style={{ backgroundColor: item?.status === 'Cancelled' ? "red" : 'green', width: 10, height: 10, borderRadius: 20, top: 7 }} />
                                                    <Text style={{ color: 'black', fontSize: 16 }}> {item?.status}</Text>
                                                </View>
                                                <View style={{ width: '95%', borderTopWidth: 2, borderColor: 'silver', top: 30, left: 3, paddingBottom: 20 }} />
                                            </View>
                                            <TouchableOpacity style={{}} onPress={() => navigation.navigate('TrackOrder', { orderId: item?.id })}>
                                                {get_item?.length > 1 ?
                                                    (<View style={{ left: 10 }}>
                                                        {get_item[0]?.select_option?.length === undefined ? null :
                                                            <View style={{ left: 120, top: 80, }}>
                                                                {get_item[0]?.select_option?.map((item, index) => (
                                                                    <View style={{}}>
                                                                        <Text> {item?.attr_type} : {item?.value}</Text>
                                                                    </View>
                                                                ))}
                                                            </View>}
                                                        <View style={{ top: get_item[0]?.select_option?.length === undefined ? 80 : item?.select_option?.length > 1 ? 120 : 120, left: 120, position: 'absolute' }}>
                                                            <Text style={{ color: 'black' }}> {get_item[0]?.quantity} x Rs {get_item[0]?.offer_price} =  </Text>
                                                        </View>

                                                        {get_item[0]?.product_detail.map((item, index) => (
                                                            <View>
                                                                <View style={{ backgroundColor: '#F5F5F5', width: 110, height: 110 }}>
                                                                    <Image source={{ uri: item?.ImageSrc }} resizeMode='contain' style={{ width: 105, height: 105, top: 5 }} />
                                                                </View>
                                                                <View style={{ position: 'absolute', left: 120 }}>
                                                                    <Text style={{ color: 'black', fontWeight: '900' }}> {item?.brand}</Text>
                                                                    <Text style={{ color: 'black', fontWeight: '900', width: 200, }} numberOfLines={1}>{item?.product_name}</Text>
                                                                    <Text style={{ color: 'black', top: 43, left: 80, marginLeft: 5 }}> {item?.customer_cost}</Text>
                                                                    <Icon name='chevron-forward-outline' size={25} style={{ left: 180 }} color={'grey'} />
                                                                </View>
                                                            </View>
                                                        ))}

                                                        <View style={{ flexDirection: 'row', top: -8, left: 110, }}>
                                                            <View style={{ backgroundColor: item?.status === 'Cancelled' ? "red" : 'green', width: 10, height: 10, borderRadius: 20, top: 7 }} />
                                                            <Text style={{ color: 'black', fontSize: 16 }}> {get_item[0]?.status}</Text>
                                                        </View>
                                                        <Text style={{ color: 'silver', left: 120, bottom: 7 }}> +{get_item?.length} More item</Text>

                                                    </View>
                                                    )
                                                    :
                                                    (<View>

                                                        <FlatList
                                                            data={get_item}
                                                            keyExtractor={(item) => item.id}
                                                            renderItem={({ item, index }) => {
                                                                const getItem = JSON?.parse(item.product_data)
                                                                // console.log('itemselect', getItem)
                                                                return (
                                                                    <View style={{ left: 10 }}>
                                                                        {item?.select_option?.length === undefined ? null : <View style={{ left: 120, top: item?.select_option?.length > 1 ? 80 : 70 }}>
                                                                            {item?.select_option?.map((item, index) => (
                                                                                <View>
                                                                                    <Text> {item?.attr_type} : {item?.value}</Text>
                                                                                </View>
                                                                            ))}
                                                                        </View>}
                                                                        <View style={{ top: item?.select_option === null ? 80 : item?.select_option?.length > 1 ? 120 : 100, left: 120, position: 'absolute' }}>
                                                                            <Text style={{ color: 'black' }}> {item?.quantity} x Rs {item?.offer_price} =  </Text>
                                                                        </View>

                                                                        {item?.product_detail.map((item, index) => (
                                                                            <View>
                                                                                <View style={{ backgroundColor: '#F5F5F5', width: 110, height: 110 }}>
                                                                                    <Image source={{ uri: item?.ImageSrc }} resizeMode='contain' style={{ width: 105, height: 105, top: 5 }} />
                                                                                </View>
                                                                                <View style={{ position: 'absolute', left: 120 }}>
                                                                                    <Text style={{ color: 'black', fontWeight: '900' }}> {item?.brand}</Text>
                                                                                    <Text style={{ color: 'black', fontWeight: '900', width: 200, }} numberOfLines={1}>{item?.product_name}</Text>
                                                                                    <Text style={{ color: 'black', top: 43, left: 80, marginLeft: 5 }}> {item?.customer_cost}</Text>
                                                                                    <Icon name='chevron-forward-outline' size={25} style={{ left: 180 }} color={'grey'} />
                                                                                </View>
                                                                            </View>
                                                                        ))}
                                                                        <View style={{ flexDirection: 'row', top: -8, left: 110, }}>
                                                                            <View style={{ backgroundColor: item?.status === 'Cancelled' ? "red" : 'green', width: 10, height: 10, borderRadius: 20, top: 7 }} />
                                                                            <Text style={{ color: 'black', fontSize: 16 }}> {item?.status}</Text>
                                                                        </View>

                                                                    </View>
                                                                )
                                                            }}
                                                        /></View>)}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                        />

                    </View>
            }
        </View>
    )
}

export default OrderHistory


