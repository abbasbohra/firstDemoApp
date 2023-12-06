import { View, Text, Pressable, TextInput, Image, Alert, TouchableOpacity, FlatList, Dimensions, ScrollView, StyleSheet, ActivityIndicator, Modal, Linking, } from 'react-native'
import React, { Children, useEffect, useRef, useState } from 'react'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import Header from '../../component/Header'
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/Ionicons'
import CheckBox from 'react-native-check-box'
import LoadingScreen from '../../component/LoadingScreen'
import notifee, { AndroidImportance, AndroidLaunchActivityFlag, AndroidStyle } from '@notifee/react-native';
import LottieView from 'lottie-react-native'


const ExampleOrdercancel = ({ route, navigation }: { route: any, navigation: any }) => {

    const { orderId } = route.params
    const { order_item_id } = route.params
    const pickerRef = useRef<any>();
    const [orderDetail, setOrderDetail] = useState([]);
    const [cancelReason, setCancelReason] = useState('');
    const [focus, setFocus] = useState(false)
    const [comment, setComments] = useState('');
    const [orderProductDetail, setOderProductDetail] = useState([]);
    const [selectProduct, setSelectProduct] = useState<string>(order_item_id)
    const [orderItemId, setOrderItem] = useState('');
    const [loading, setLoading] = useState(false)
    const [isChecked, setIsChecked] = useState(false);
    // console.log('orderId=====>', orderId,
    //     'orderItemId=====>', order_item_id,)

    const getOrderDetail = () => {
        setLoading(true)
        const url = `${endpoint.OrderDetailbyid}/${orderId}`
        _makeAxiosGetRequest(url, {}).then((res) => {
            // console.log(res.data)
            setOrderDetail(res.data.data)
            setOderProductDetail(res.data.data[0].get_item)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)
        })
    }

    useEffect(() => {
        getOrderDetail();
    }, [])

    const cancelProduct = () => {
        setLoading(true)
        const body = new FormData()
        body.append('reason', cancelReason,)
        body.append('remark', comment,)

        orderProductDetail.forEach((item, index) => {
            body.append(`order_item_id[${index}]`, item?.id)
        })
        orderDetail?.forEach((item, index) => {
            body.append('order_id', orderId)
        })
        if (selectProduct) {
            _makeAxiosPostRequest(endpoint.order_cancel, body).then((res) => {
                setLoading(false)
                DisplayNotification()
                navigation.navigate('Orderhistory')
            }).catch((error) => {
                setLoading(false)
                console.log(error)
                Alert.alert(error.response.data.message)
                navigation.navigate('Orderhistory')

            })
        } else { Alert.alert('please Select Product') }


    }

    const DisplayNotification = async () => {
        await notifee.requestPermission()
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            sound: 'iphone',
            importance: AndroidImportance.HIGH,
            badge: true,
            // vibration: false,

        });
        await notifee.displayNotification({
            title: 'Product Cancel',
            body: `Hope to see you soon 😭`,
            android: {
                channelId,
                sound: 'default',
                pressAction: {
                    id: 'default',
                },
                largeIcon: require('../../component/IconImage/fashionLeoLogo.png'),
            },
        });
    }

    const displyorderDetail = () => {
        return (
            <View style={{ position: 'absolute', top: 70, left: 125, }}>
                <FlatList
                    data={orderDetail}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <View>
                                <View style={{ margin: 5 }}>
                                    <Text style={{ color: 'black', marginTop: 0, left: 3, }}>Order Amount: <Text style={{ color: "black", fontWeight: '800' }}> {item?.total_price}</Text></Text>
                                    <Text style={{ color: 'black', marginTop: 0, left: 0 }}> Delivery Charges:<Text style={{ color: "black", fontWeight: '800' }}> {item?.delivery_charges}</Text></Text>

                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }

    return (
        <ScrollView style={{}} contentContainerStyle={{ backgroundColor: "white", paddingBottom: 280 }}>
            <Header title='ORDER CANCEL' cartleft={-10} searchLeft={5} showShadow={true} onpress={() => navigation.goBack()} />
            <View style={style.orderdetailcon}>

                <FlatList
                    data={orderProductDetail}
                    keyExtractor={(item) => item.id}

                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }: { item: any, index: any }) => {
                        return (
                            <View style={{ backgroundColor: "white", width: '95%', height: 200, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2, top: 0, margin: 5, paddingBottom: 10, left: 5 }}>

                                <CheckBox
                                    isChecked={true}
                                    onClick={() => setSelectProduct(item?.id)}
                                    style={{ top: 10, left: 20 }} />
                                <Text style={{ color: 'black', position: 'absolute', top: 110, left: 130 }}> Qty:{item?.quantity}</Text>
                                <Text style={{ color: 'black', position: "absolute", top: 130, left: 130 }}> Price: <Text style={{ fontWeight: "800", color: "black" }}>{item?.offer_price} </Text> </Text>

                                {displyorderDetail()}
                                <FlatList
                                    style={{ top: 5 }}
                                    data={item?.product_detail}
                                    keyExtractor={(item: any) => item.id}
                                    renderItem={({ item, index }: { item: any, index: any }) => {
                                        return (
                                            <View style={{ margin: 5 }}>
                                                <View style={{ shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, backgroundColor: 'white', width: 105, height: 105, margin: 10, top: 0 }}>
                                                    <Image source={{ uri: item?.ImageSrc }} style={{ width: 110, height: 110, }} resizeMode='contain' />
                                                </View>
                                                <Text style={{ color: "black", position: 'absolute', marginLeft: 128, top: 20, fontSize: 15, fontWeight: '800', }} numberOfLines={1}>{item?.product_name}</Text>

                                            </View>
                                        )
                                    }}
                                />
                                <View style={{ left: 130, flexDirection: 'row', top: 160, position: 'absolute' }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: item?.status === 'Cancelled' ? 'red' : 'green' }} />
                                    <Text style={{ color: item?.status === 'Cancelled' ? 'red' : 'black', bottom: 5, left: 10 }}> {item?.status}</Text>
                                </View>
                            </View>
                        )
                    }}
                />

            </View>

            <View style={{ top: 50 }}>
                <Text style={{ color: 'black', fontWeight: '900', fontSize: 15, margin: 10 }}> Reason </Text>

                <View style={{ width: '95%', height: 50, backgroundColor: 'white', borderRadius: 10, top: 10, borderWidth: 1, left: 10 }}>
                    <Pressable onPress={() => pickerRef.current.focus()}>
                        <Picker
                            selectedValue={cancelReason}
                            mode='dialog'
                            onValueChange={setCancelReason}
                            ref={pickerRef}
                            dropdownIconColor={'black'}
                            dropdownIconRippleColor={'black'}
                            focusable={focus}
                            placeholder={'reason fo cancel'}
                            style={{}}
                        >
                            <Picker.Item style={{ fontSize: 11, }} label='I want to cancel due to product quality reason' value={'I want to cancel due to product quality reason'} />
                            <Picker.Item style={{ fontSize: 11 }} label='Price of the product has decreased ' value={'Price of the product has decreased '} />
                            <Picker.Item style={{ fontSize: 11 }} label='Excepted delivery time is very long  ' value={'Excepted delivery time is very long '} />
                            <Picker.Item style={{ fontSize: 11 }} label='I have purchase the product elsewhere' value={'I have purchase the product elsewhere'} />
                            <Picker.Item style={{ fontSize: 11 }} label='I want to change address for the order' value={'I want to change address for the order'} />
                            <Picker.Item style={{ fontSize: 11 }} label='I have change my mind' value={'I have change my mind'} />
                            <Picker.Item style={{ fontSize: 11 }} label='I want to convert my order to prepaid' value={'I want to convert my order to prepaid'} />
                            <Picker.Item style={{ fontSize: 11 }} label='I want to change my phobe number' value={'I want to change my phobe number'} />
                        </Picker>
                    </Pressable>
                </View>
            </View>


            <View style={{ top: 80, }}>
                <View>
                    <Text style={{ color: 'black', fontWeight: '900', fontSize: 15, left: 20 }}>Remark</Text>
                </View>
                <TextInput
                    placeholder='Remark'
                    value={comment}
                    onChangeText={setComments}
                    style={{ width: '95%', top: 20, backgroundColor: '#F5F5F5', borderBottomWidth: 1, borderRadius: 10, left: 10 }}
                />
            </View>

            <View style={{ top: 120 }}>
                <Text style={{ color: "black", fontSize: 15, fontWeight: '400', margin: 10, left: 20 }}>Please send unpaking video ,photos of item delivered to</Text>
            </View>
            <TouchableOpacity style={{ top: 110 }} onPress={() => Linking.openURL('support@fashionleo.in')}>
                <Text style={{ margin: 10, color: "#27AAE1", fontWeight: '500', left: 20 }}>support@fashionleo.in</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", top: 120 }}>
                <CheckBox
                    style={{ margin: 5, left: 10, top: 5 }}
                    isChecked={isChecked}
                    onClick={() => setIsChecked(isChecked ? false : true)}
                    checkBoxColor={isChecked ? '#27AAE1' : 'grey'}
                />
                <Text style={{ color: "black", fontSize: 15, margin: 15, bottom: 10, }}>I havent used this product All tags and shoebox are if applicable</Text>
            </View>


            <TouchableOpacity disabled={isChecked ? false : true} style={{ backgroundColor: isChecked ? "#27AAE1" : 'grey', shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, marginLeft: 20, marginRight: 20, borderRadius: 20, top: 150 }} onPress={() => cancelProduct()}>
                <Text style={{ textAlign: "center", padding: 10, color: 'white' }}> Cancel </Text>
            </TouchableOpacity>




            {loading ? (
                <Modal
                    visible={loading}
                    onRequestClose={() => setLoading(false)}

                >
                    <View style={style.loadingmodalcon}>
                        <View style={style.loadingmodalstyle}>
                            <LottieView style={{ width: 200, height: 200, top: 300, left: 90 }} source={require('../../component/Animations/Animation - 1699005800056.json')} autoPlay loop />

                        </View>
                    </View>
                </Modal>
            ) : null}
        </ScrollView>
    )
}
const style = StyleSheet.create({
    orderdetailcon: {
        top: 10,
        backgroundColor: '#F5F5F5'
    },
    loadingmodalcon: {
        flex: 1,
        backgroundColor: 'white'
    },
    loadingmodalstyle: {

    },
    loader: {
        top: 350
    },
    loadertext: {
        color: 'black',
        textAlign: 'center',
        top: 360,
        fontSize: 20
    }
})
export default ExampleOrdercancel;
