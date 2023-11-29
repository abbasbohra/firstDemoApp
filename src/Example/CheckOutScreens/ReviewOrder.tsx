import { View, Text, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity, ToastAndroid, Modal, Alert, Dimensions } from 'react-native'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'
import CheckBox from 'react-native-check-box'
import { ActivityIndicator, Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Header from '../../component/Header'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector, useDispatch } from 'react-redux';
import { selectCouponAmount, setCouponAmount } from '../../redux/slice/discountSlice'
import notifee, { AndroidImportance } from '@notifee/react-native';
import { setDiscountDetail, } from '../../redux/slice/discountDetailSlice'
import { RootState } from '../../redux/store'
import DisplayNotification from '../../component/DisplayNotification';
import LottieView from 'lottie-react-native';

type user = {
    wallet: any
}


const ReviewOrder = ({ route, }: { route: any }) => {
    const [user, setUser] = useState<user>();
    const [address, setAddress] = useState<any>('');
    const couponDiscount = useSelector(selectCouponAmount)
    const [userId, setUserId] = useState<any>('')
    const [cartList, setCartList] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [allCoupon, setAllCoupon] = useState([]);
    // const [selectCoupon, setselectCoupon] = useState<any>('')
    const [isSelected, setIsSelected] = useState<any>(0);
    const navigation: any = useNavigation<any>();
    const [paymentMethod, setPaymentMethod] = useState<any>('');
    const [loader, setLoader] = useState<boolean>(false)
    const [openCouponModal, setOpenCouponModal] = useState<boolean>(false);
    const [fcmTocken, setFcmToken] = useState<any>('');
    const dispatch = useDispatch()
    const selectCoupon: any = useSelector((state: RootState) => state.CouponDetail.CouponDetail)

    // console.log('couponsetail', selectCoupon)
    const getTockens = async () => {
        const data: any = await AsyncStorage.getItem('FCMTOCKEN')
        const fcm = JSON.parse(data)
        setFcmToken(fcm)
        // console.log('fcm====>', fcm)
    }

    const getCartProduct = async () => {
        setLoader(true)
        const data = {
            'session_id': null,
            'user_id': userId
        }
        _makeAxiosPostRequest(endpoint.cart, data).then((res) => {
            // console.log('cartlist', res.data)
            setCartList(res.data)
            setLoader(false)
        }).catch((error) => {
            setLoader(false)
            console.log('cart============>', error.response.data)
        })
    }

    useFocusEffect(useCallback(() => {
        getUserId();
        getCartProduct();
        getSaveAddress();
        getPaymentMethod();
        getCurrency();
        getUserDetail();
        getItemCount();
        getTockens()
    }, []))

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        // console.log(userid)
        setUserId(userid)
    }
    // console.log('id======>', userId)

    const getCurrency = () => {
        _makeAxiosGetRequest(endpoint.currency, {}).then((res) => {
            // console.log(res.data)
        }).catch((error) => {
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }

    const Productitem: any = cartList[0]
    const DeliveryFees = Productitem?.free_delivery == true ? 0 : 40

    const getUserDetail = () => {
        _makeAxiosGetRequest(endpoint.myProfile, {}).then((res: any) => {
            // console.log(res)
            setUser(res.data.user)
            // ToastAndroid.show(res?.message, ToastAndroid.SHORT)
        }).catch((err) => {
            console.log(err)
            Alert.alert(err.response.data.message)

        })
    }


    const payNow = async () => {
        setLoading(true)
        const OrignalPrice: any = Productitem?.orignal_price == '' ? '' : Productitem?.orignal_price
        const CouponCode: any = selectCoupon?.coupon_code == null ? '' : selectCoupon?.coupon_code

        const body = new FormData()
        body.append('total_price', originalPrice())
        if (couponDiscount != 0) {
            body.append('discount_price', couponDiscount,)
        }
        if (selectCoupon) {
            console.log('coupon=======>', selectCoupon)
            body.append('coupon_detail', JSON.stringify(selectCoupon),)
        }
        if (CouponCode) {
            body.append('coupon_code', CouponCode,)
        }
        if (Productitem?.free_delivery != true) {
            body.append('delivery_charges', Productitem?.free_delivery)
        }
        // body.append('delivery_request', null,)
        body.append('original_price', originalPrice(),)
        body.append('reselling', 'No',)
        body.append('payment_method', 'COD',)
        body.append('addressid', address?.id,)
        body.append('currency', 162,)
        if (isSelected != 0) {
            body.append('wallet_amount', isSelected,)
        }
        console.log('body=========>', body)
        _makeAxiosPostRequest(endpoint.createOrder, body).then(async (res) => {
            checkOut({ orderId: res?.data?.saveorder })
            dispatch(setCouponAmount(0))
            dispatch(setDiscountDetail(null))
        }).catch((error) => {
            setLoading(false)
            console.log(error)
            Alert.alert(error.response.data.errors)
            Alert.alert(error.response.data.message)
        })
        // console.log('send check out data', body)

    }
    const checkOut = ({ orderId }: { orderId: any }) => {
        const body = new FormData()
        // console.log(orderId)
        orderId?.forEach((item: any, index: any) => {
            body.append(`order_id[${index}]`, item?.id)
        })
        _makeAxiosPostRequest(endpoint.checkOut, body).then((res: any) => {
            setLoading(false)
            const data = res.data
            data.forEach((item: any, index: any) => {
                DisplayNotification({
                    body: ` Your Order has been Place Successfull on FashionLeo .Orderid #${item?.order_number} and amount is Rs${item?.total_price}`
                })
            })

            navigation.navigate('OrderSucessfull')
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
        }).catch((error) => {
            setLoading(false)
            console.log('error--->', error.response)
        })
    }

    // const displayNotification = async () => {
    //     // Request permissions (required for iOS)
    //     await notifee.requestPermission()

    //     // Create a channel (required for Android)
    //     const channelId = await notifee.createChannel({  
    //         id: 'default',
    //         name: 'Default Channel',
    //     });

    //     // Display a notification
    //     await notifee.displayNotification({
    //         title: 'Order Update',
    //         body: 'Order Place Sucessfull',
    //         android: {
    //             channelId,
    //             // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //             // pressAction is needed if you want the notification to open the app when pressed
    //             pressAction: {
    //                 id: 'default',
    //             },
    //         },
    //     });
    // }
    const originalPrice = () => {
        const total = cartList.reduce((a: any, b: any) => {
            return (
                a + b?.get_product_data?.price * parseInt(b?.quantity)
            )
        }, 0)
        return (
            total
        )
    }
    const getItemCount = () => {
        _makeAxiosPostRequest(endpoint.item_count, {}).then((res) => {
            // console.log(res.data)
        }).catch((error) => {
            console.log(error.response.data.message)
        })
    }
    const TotalPrice = () => {
        const total = cartList.reduce((a: any, b: any) => {
            return (
                a + b?.get_product_data?.offer_price * parseInt(b?.quantity)
            )
        }, 0)
        return (
            total
        )
    }

    const getSaveAddress = async () => {
        const data: any = await AsyncStorage.getItem('SAVEADDRESS')
        const address = JSON.parse(data)
        setAddress(address)
    }

    const getPaymentMethod = async () => {
        const data: any = await AsyncStorage.getItem('SAVEPAYMENTMETHOD')
        const paymentMethod = JSON.parse(data)
        setPaymentMethod(paymentMethod)
    }

    const TotalSave = couponDiscount === 0 ? originalPrice() - TotalPrice() : originalPrice() - TotalPrice() + parseInt(couponDiscount)
    const TotalProductPrice = couponDiscount === 0 ? TotalPrice() : TotalPrice() - parseInt(couponDiscount)
    const ProductDiscount = Math.round(originalPrice() - TotalPrice())
    const totalPrice = () => {
        return (
            <View style={[{ width: '100%', backgroundColor: "white", paddingBottom: 30 }, styles.shadow]}>
                <Text style={{ color: "black", fontSize: 15, fontWeight: '900', top: 15, left: 20 }}> Price details </Text>
                <View style={{ flexDirection: "row", top: 10 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 20, fontWeight: '800' }}> Product Price</Text>
                    <Text style={{ color: 'black', margin: 10, marginTop: 20, fontWeight: '800', marginLeft: originalPrice() >= 1000 ? 225 : 228, marginRight: 0 }}> {'₹' + originalPrice()}</Text>

                </View>
                {/* <View style={{ flexDirection: "row", marginTop: 5, top: 10 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, fontWeight: '800' }}> Delivery Fee</Text>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, marginLeft: 150, fontWeight: '800', left: Productitem?.free_delivery == true ? 90 : 80 }}> -{'₹' + DeliveryFees}</Text>

                </View> */}
                <View style={{ flexDirection: "row", marginTop: 5, top: 10 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, fontWeight: '800' }}> Product Discount</Text>
                    <Text style={{ color: 'green', margin: 10, marginTop: 0, marginLeft: ProductDiscount >= 1000 ? 195 : 200, fontWeight: '800' }}> ₹{Math.round(TotalPrice() - originalPrice())}</Text>

                </View>
                {couponDiscount === 0 ? null : <View style={{ flexDirection: "row", marginTop: 5, top: 10 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, fontWeight: '800' }}> Coupon  Discount</Text>
                    <Text style={{ color: '#27AAE1', margin: 10, marginTop: 0,left: 185, fontWeight: '800',marginRight:5 }}> -Rs{+ Math.round(couponDiscount)}</Text>

                </View>}
                {isSelected ? <View style={{ flexDirection: "row", marginTop: 5, top: 10 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, fontWeight: '800' }}> Wallet </Text>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, marginLeft: 265, fontWeight: '800' }}> -{'₹' + isSelected}</Text>

                </View> : null}
                <View style={{ flexDirection: "row", marginTop: 5, top: 10 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, fontWeight: '800' }}> You Save </Text>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, marginLeft: ProductDiscount > 1000 ? 250 : 255, fontWeight: '800' }}> {'₹' + Math.round(TotalSave)}</Text>
                </View>
                {Productitem?.free_delivery == true ? (
                    <View>
                        <Text style={{ color: '#27AAE1', top: 10, fontWeight: '800', left: 10 }}> Free Delivery</Text>

                    </View>
                ) : (<View style={{ flexDirection: "row", marginTop: 5, top: 10 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, fontWeight: '800' }}> Delivery Fee</Text>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, marginLeft: 150, fontWeight: '800', }}> -{'₹' + DeliveryFees}</Text>

                </View>)}
                <View style={{ borderWidth: 0.5, borderColor: 'grey', top: 20 }} />
                <View style={{ flexDirection: "row", marginTop: 5, top: 20 }}>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, fontWeight: '900', width: '50%', }}> Order Total</Text>
                    <Text style={{ color: 'black', margin: 10, marginTop: 0, marginLeft: TotalProductPrice >= 1000 ? 120 : 130, fontWeight: '900' }}> ₹{isSelected == 0 ? + TotalProductPrice : TotalProductPrice - isSelected}</Text>

                </View>

            </View>
        )
    }
    return (
        <View>
            <Header title='Order Summary' showShadow={false} searchLeft={5} cartleft={-10} onpress={async () => { navigation.goBack(), dispatch(setCouponAmount(0)), await AsyncStorage.removeItem('COUPONDETAIL'), dispatch(setDiscountDetail(null)) }} />
            <ScrollView style={{ top: 0, }} contentContainerStyle={{ backgroundColor: "#F5F5F5", paddingBottom: 250 }}>
                <View style={{ top: 15, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2 }}>
                    <FlatList
                        data={cartList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item, index }: { item: any, index: any }) => {
                            const Productsize = JSON.parse(item?.product_option)
                            return (
                                <View style={[{ width: '100%', backgroundColor: "white", margin: 1, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2, paddingBottom: 50 }]}>
                                    <Image source={{ uri: item?.get_product_data?.ImageSrc }} style={{ width: 130, height: 130, borderRadius: 10, top: 20, right: -10 }} resizeMode='contain' />
                                    <View style={{ position: "absolute", width: 150, height: 120, left: 170, top: 20 }}>
                                        <View style={{ right: 5 }}>
                                            <Text style={{ color: "black", fontWeight: '900', fontSize: 18, marginLeft: 0, width: 220 }} numberOfLines={2} >{item?.get_product_data?.product_name}</Text>
                                            <Text style={{ color: "black", fontWeight: '900', fontSize: 10, marginLeft: 0, top: 10 }}>{item?.get_product_data?.short_desc}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", top: 20, right: 10 }}>
                                            <Text style={{ marginRight: 10, color: 'black', fontWeight: '500', fontSize: 15 }} onPress={() => Alert.alert(`productProce${item?.get_product_data?.offer_price}`)}> Size :</Text>
                                            {Productsize === null ? null : <Text style={{ color: 'black', fontWeight: '500', fontSize: 15 }}>{Productsize[0]?.value}</Text>}
                                        </View>
                                        <View style={{ flexDirection: "row", top: 20, right: 10 }}>
                                            <Text style={{ marginRight: 10, color: 'black', fontWeight: '500', }}> Qty :</Text>
                                            <Text style={{ color: 'black', fontSize: 15, fontWeight: '500', }}> {item?.quantity} x {item?.quantity * item?.offer_price} </Text>
                                            <View style={{ borderBottomWidth: 1, top: -10, left: 5 }}>
                                                <Text style={{ color: 'black', bottom: -10, fontSize: 13, fontWeight: '500', }}>  {item?.quantity * item?.orignal_price} </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", top: 20, right: 5 }}>
                                            <Text style={{ marginRight: 10, color: "black" }}>Total: </Text>
                                            <Text style={{ color: 'black' }}> {item?.offer_price}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
                <View style={[{ width: '100%', top: 40, backgroundColor: 'white', paddingBottom: 20 }]}>
                    <Text style={{ color: 'black', fontSize: 15, margin: 20, fontWeight: '900' }}>  Delivery Address </Text>
                    <View style={{ width: '65%', bottom: 10, marginLeft: 25 }}>
                        <Text style={{ color: 'black', fontSize: 15, fontWeight: '300', }}>{address?.name?.toLowerCase()}</Text>
                        <Text style={{ color: "black", fontSize: 15, fontWeight: "300", }}>{address?.address?.toLowerCase()} {address?.city?.toLowerCase()} {address?.state?.toLowerCase()} {address?.pincode?.toLowerCase()} {address?.landmark?.toLowerCase()}</Text>
                    </View>
                </View>
                <View style={[{ width: '100%', top: 50, backgroundColor: 'white', paddingBottom: 20 }]}>
                    <Text style={{ color: 'black', fontSize: 15, margin: 20, fontWeight: '900' }}>  Payment Method </Text>
                    <Text style={{ color: 'black', fontWeight: '800', left: 20, fontSize: 15 }}> {paymentMethod === 'COD' ? 'Cash On Delivery' : paymentMethod}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('coupon')} style={[{ width: '100%', top: 60, backgroundColor: 'white', paddingBottom: 30 }]}>
                    <MaterialCommunityIcon name={couponDiscount === 0 ? 'tag' : 'close'} color={'grey'} size={35} style={{ position: 'absolute', margin: 15, top: 10 }} />
                    <Text style={{ color: 'black', fontSize: 18, margin: 20, top: 10, left: 50, fontWeight: '700' }}> {couponDiscount === 0 ? ' Apply  Coupon' : 'Applied'} </Text>
                    <Icon name='chevron-forward' style={{ position: 'absolute', top: 30, left: 350 }} color={'black'} size={25} />
                </TouchableOpacity>

                <View style={[{ width: Dimensions.get('screen').width, top: 70, backgroundColor: 'white', paddingBottom: 20 }]}>
                    <View style={{ flexDirection: "row" }}>
                        <Icon name='wallet' style={{ left: 20, top: 20 }} size={25} color={'grey'} />
                        <Text style={{ color: 'black', fontSize: 16, margin: 20, left: 20, fontWeight: "700" }}> Wallet Balance  </Text>
                        <Text style={{ color: 'black', fontSize: 15, margin: 20, left: isSelected ? 350 : 330, position: "absolute" }}>{isSelected ? '₹' + 0 : '₹' + user?.wallet?.balance} </Text>
                    </View>
                    <TouchableOpacity onPress={() => isSelected === 0 ? setIsSelected(parseInt(user?.wallet?.balance)) : setIsSelected(0)} style={{ flexDirection: "row", top: 10, }}>
                        <Text style={{ color: 'black', left: 50, fontSize: 15, fontWeight: '700' }}>use wallet balance </Text>
                        <View style={{ left: 205, }}>
                            <CheckBox
                                isChecked={isSelected === 0 ? false : true}
                                onClick={() => isSelected === 0 ? setIsSelected(parseInt(user?.wallet?.balance)) : setIsSelected(0)}
                                style={{}}
                            />
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={{ top: 80 }}>
                    {totalPrice()}
                </View>
                <Modal
                    visible={loading}
                    onRequestClose={() => setLoading(false)}
                >
                    <View style={{ backgroundColor: "white", top: 100 }}>

                        <LottieView source={require('../../component/Animations/Animation - 1699004765306.json')} speed={1} autoPlay loop style={{ width: 550, height: 550, right: 75 }} />
                    </View>
                </Modal>
                {loader ? <View>
                    <Modal
                        visible={loader}
                        // transparent={true}
                        onRequestClose={() => setLoader(false)}
                    >
                        <View style={{ backgroundColor: "white", width: 140, height: 100, top: 280, left: 125, }}>
                            {/* <ActivityIndicator size={35} color='black' style={{ top: 110 }} /> */}
                            <LottieView source={require('../../component/Animations/Animation - 1699005800056.json')} speed={1} autoPlay loop style={{ width: 250, height: 250, right: 50 }} />

                        </View>
                    </Modal>
                </View> : null}
            </ScrollView>
            <TouchableOpacity onPress={() => payNow()} style={{ backgroundColor: '#27AAE1', width: '100%', bottom: 115 }}>
                <Text style={{ color: 'white', textAlign: "center", padding: 12, fontWeight: '800', fontSize: 20 }}>  Submit  </Text>
            </TouchableOpacity>
        </View>
    )

}
const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2
    }
})

export default ReviewOrder;