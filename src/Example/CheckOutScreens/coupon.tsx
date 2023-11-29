import { View, Text, Alert, FlatList, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../component/Header'
import CheckBox from 'react-native-check-box'
import { selectCouponAmount, setCouponAmount } from '../../redux/slice/discountSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setDiscountDetail } from '../../redux/slice/discountDetailSlice'
import LottieView from 'lottie-react-native'
const coupon = ({ navigation }: { navigation: any }) => {
    const [allCoupon, setAllCoupon] = useState([]);
    const [selectCoupon, setselectCoupon] = useState<any>()
    const [couponDiscount, setCouponDiscount] = useState('');
    const [loading, setLoading] = useState(false)
    const couponMount = useSelector(selectCouponAmount)
    const dispatch = useDispatch()
    const getAllCoupon = () => {
        setLoading(true)
        _makeAxiosGetRequest(endpoint.get_coupon_code, {}).then((res) => {
            // console.log(res.data)
            setAllCoupon(res.data)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)

        })
    }
    const applyCoupon = () => {
        setLoading(true)
        const data = {
            coupon: selectCoupon?.coupon_code
        }
        _makeAxiosPostRequest(endpoint.apply_coupon, data).then(async (res: any) => {
            // console.log(res.data)
            setCouponDiscount(res.data.discount_price)
            // await AsyncStorage('COUPONDETAIL',res?.data?.discount_price)
            setLoading(false)
            dispatch(setCouponAmount(res.data.discount_price))
            dispatch(setDiscountDetail(selectCoupon))
            await AsyncStorage.setItem('COUPONDETAIL', JSON.stringify(selectCoupon))
            navigation.navigate('ReviewOrder', { couponDiscount: res.data.discount_price })
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
        }).catch((error) => {
            if (error.message === 'Request failed with status code 400') {
                ToastAndroid.show('Minimum order value should be greater than 500', ToastAndroid.SHORT)
                setselectCoupon('')
            } else {
                ToastAndroid.show('something Error Try Later', ToastAndroid.SHORT)
                setselectCoupon('')
                Alert.alert(error.response.data.message)

            }
            setselectCoupon('')

            console.log(error)
        })
    }
    useEffect(() => {
        getAllCoupon()
    }, [])

    // console.log('solectco', selectCoupon)

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <Header title='Coupons' showShadow={true} searchLeft={5} cartleft={-10} onpress={() => navigation.goBack()} />
            {loading ? (
                <View style={{ flex: 1, backgroundColor: 'white',justifyContent:'center',alignItems:'center' }}>
                  <LottieView source={require('../../component/Animations/Animation - 1699005800056.json')} style={{width:250,height:250,bottom:50}} autoPlay loop/>
                </View>
            ) : (
                <View style={{flex:1}}>
                    <View style={{ paddingBottom: 100 }}>
                        <FlatList
                            data={allCoupon}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity onPress={() => setselectCoupon(item)} style={[{ width: '100%', height: 180, backgroundColor: 'white', margin: 5 }]}>
                                        <CheckBox isChecked={selectCoupon === item ? true : false} checkedCheckBoxColor='#27AAE1' onClick={() => setselectCoupon(item)} style={{ margin: 10, position: 'absolute', top: 5 }} />
                                        <View style={{ borderStyle: "dashed", borderColor: 'black', borderWidth: 1, width: 180, position: "absolute", top: 15, left: 50, borderRadius: 5 }}>
                                            <Text style={{ color: "black", fontSize: 10, padding: 10, textAlign: 'center' }}> {item?.coupon_code}</Text>
                                        </View>

                                        <Text style={{ color: "black", bottom: -70, left: 20 }}> Minimum order value is {item?.min_order_value}</Text>
                                        <Text style={{ color: "black", bottom: -70, left: 22 }}>Maximum discount is {item?.maximum_discount}</Text>
                                        <View style={{ flexDirection: 'row', top: 70, left: 20 }}>
                                            <Text style={{ color: "black", left: 0 }}> Expire on :</Text>
                                            <Text style={{ color: "black", left: 5 }}>{item?.valid_till} </Text>
                                        </View>


                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        {selectCoupon === '' ? null : <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: "black", fontSize: 15 }}> Your coupon code is </Text>
                            <Text style={{ fontSize: 15, color: 'black', fontWeight: '700' }}>  {selectCoupon?.coupon_code}</Text>
                        </View>}

                        {loading ? null : <View style={{ width: '100%', backgroundColor: 'white', height: 80, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 10 }}>
                            <TouchableOpacity onPress={() => applyCoupon()} style={{ width: '90%', backgroundColor: '#27AAE1', padding: 15, top: 15, left: 15, borderRadius: 6 }}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}> Apply</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
            )}



        </View>
    )
}

export default coupon