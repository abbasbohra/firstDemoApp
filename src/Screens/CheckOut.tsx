import { View, Text, FlatList, Dimensions, Image, ToastAndroid, TouchableOpacity, Alert, Modal, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../component/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { firebase } from "@react-native-firebase/auth";
import { Divider } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';


type cartitem = {
    ProductQty: number
    ProductName: string
    ProductPrice: number
    ProductImage: string[]
    CartUid: string
    ProductDiscount: number
}
type user = {
    Name: string
    Number: number
    Email: string
}


const CheckOut = ({ navigation, route }: { navigation: any, route: any }) => {
    const [cartItemData, setCartItemData] = useState<cartitem[]>([]);
    const [saveAddress, setSaveAddress] = useState<any>()
    const [qty, setqty] = useState<number>(1)
    const isFocused = useIsFocused();
    const [selectPaymentMethod, setSelectPaymentMethod] = useState<number>(0);
    const [user, setUser] = useState<user>([]);
    const [loading, setLoading] = useState(false)
    const roatedAnimRef = useRef(new Animated.Value(0)).current;


    const StartRotate = () => {
        Animated.timing(roatedAnimRef, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false
        }).start();
    }

    useEffect(() => {
        if (loading) {
            StartRotate()
        } else { null }
    },)

    const interpole = () => {
        return roatedAnimRef.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
    }






    const getuser = () => {
        firestore().collection('users').doc(firebase.auth().currentUser?.uid).get().then(querySnapShot => {
            const Data: any = querySnapShot.data();
            setUser(Data)
        })
    }


    const getCartItem = async () => {
        try {
            const documentSnapShot = await firestore().collection('cartItem').where('uid', '==', firebase.auth().currentUser?.uid).get()
            const data: any = documentSnapShot.docs.map(doc => doc.data())
            // console.log('cartitem', data.CartUid)
            setCartItemData(data)
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        getCartItem();
        getuser();
    }, [])


    const onRemove = ({ uid }: { uid: string }) => {
        // console.log(uid)
        firestore().collection('cartItem').doc(uid).delete().then(() => {
            getCartItem();
            ToastAndroid.show('remove Item', ToastAndroid.SHORT)
        })

    }

    const addQty = ({ uid, ProductQty }: { uid: string, ProductQty: number }) => {
        firestore().collection('cartItem').doc(uid).update({
            ProductQty: ProductQty + 1
        }).then(() => {
            getCartItem();
            ToastAndroid.show('Quantatiy add', ToastAndroid.SHORT)
            console.log(qty)
        })
    }
    const removeQty = ({ uid, ProductQty }: { uid: string, ProductQty: number }) => {
        if (ProductQty <= 0) {
            firestore().collection('cartItem').doc(uid).delete().then(() => {
                getCartItem()
                ToastAndroid.show('Item remove ', ToastAndroid.SHORT)
            }).catch((error) => {
                console.log(error)
            })
        } else {
            firestore().collection('cartItem').doc(uid).update({
                ProductQty: ProductQty - 1
            }).then(() => {
                getCartItem();
                ToastAndroid.show('Quantatiy Remove', ToastAndroid.SHORT)
            })
        }

    }

    const paymentProcess = () => {

        const checkOutPrice = selectPaymentMethod == 3 ? getTotal() * 100 + 10 * 100 : getTotal() * 100

        var options: any = {

            description: 'Credits towards consultation',

            image: 'https://i.ibb.co/wLTpxpH/1.png',
            currency: 'USD',
            key: 'rzp_test_rVSkzB7k9RnMhm', // Your api key
            amount: checkOutPrice,
            name: 'Payment Pvt Ltd.',
            prefill: {
                email: user.Email,
                contact: user.Number,
                name: user.Name
            },
            theme: { color: '#626ABB4' }
        }

        if (selectPaymentMethod == 3) {
            cashOnDelvieryOrder()

        } else {
            RazorpayCheckout.open(options)
                .then((data: { razorpay_payment_id: any }) => {
                    // handle success
                    OrderSucessfull(data.razorpay_payment_id);
                    // alert(`Success: ${data.razorpay_payment_id}`);
                }).catch((error: { code: any; description: any }) => {
                    // handle failure
                    Alert.alert(`Error: ${error.code} | ${error.description}`);
                });
        }
    }

    // const deleteCartCollection = () => {
    //     const collectionRef = firebase.firestore().collection('CartItem')
    //     collectionRef.parent().delete()
    // }
    const OrderSucessfull = (paymentId: string) => {
        setLoading(true)
        const id: any = uuid.v4()
        const date = new Date().getDate()
        const Month = new Date().getMonth() + 1
        const year = new Date().getFullYear()
        const Time = new Date().getHours()
        const Minute = new Date().getMinutes();
        const localDate = date + '/' + Month + "/" + year;
        const day = new Date().getDay() + 4
        const ddate = new Date().getDate() + 4
        const month = new Date().getMonth() + 1
        const Dates = day == 0 ? 'sun' : day == 1 ? 'Mon' : day == 2 ? "Tues" : day == 3 ? "Wed" : day == 4 ? "Thu" : day == 5 ? "Fri" : day == 6 ? "Sat" : null
        const Months = month == 0 ? 'Jan' : month == 2 ? 'Feb' : month == 3 ? 'Mar' : month == 4 ? 'Apri' : month == 5 ? 'May' : month == 6 ? 'June' : month == 7 ? 'July' : month == 8 ? 'Aug' : month == 9 ? 'Sept' : month == 10 ? 'Oct' : month == 11 ? 'Nov' : month == 12 ? 'Dec' : null
        const deliveryDate = Dates + ' ' + ' ' + date + ' ' + Months
        const user: any = firebase.auth().currentUser
        const ActualPrice = getActualPrice()
        const TotalPrice = getTotal()
        firestore().collection('orders').doc(id).set({
            Products: cartItemData,
            Address: saveAddress,
            PaymentId: paymentId,
            OrderDate: localDate,
            uid: user.uid,
            id: id,
            PaymentStatus: 'confirm',
            DeliveryDate: deliveryDate,
            ProductActualPrice: ActualPrice,
            ProductTotalPrice: TotalPrice
        }).then(() => {
            firestore()
                .collection('cartItem')
                .where('uid', '==', firebase.auth().currentUser?.uid)
                .get()
                .then((querySnapShot) => {
                    querySnapShot.forEach((doc) => { doc.ref.delete() })
                }).catch(error => {
                    console.log(error)
                })
            setLoading(false)
            navigation.navigate('OrderSucessfull', { Address: saveAddress, PaymentStatus: selectPaymentMethod == 3 ? 'Pending' : 'confirm', OrderId: id, paymentId: paymentId, deliveryDate: deliveryDate })
            displayNotification()
        })
    }


    console.log(new Date().getDate() + 2)

    const cashOnDelvieryOrder = () => {
        setLoading(true)
        const id: any = uuid.v4()
        const date = new Date().getDate()
        const Month = new Date().getMonth() + 1
        const year = new Date().getFullYear()
        const Paymentid = uuid.v4().slice(25)
        const localDate = date + '/' + Month + "/" + year
        const user: any = firebase.auth().currentUser
        const day = new Date().getDay()
        const Dates = day == 0 ? 'sun' : day == 1 ? 'Mon' : day == 2 ? "Tues" : day == 3 ? "Wed" : day == 4 ? "Thu" : day == 5 ? "Fri" : day == 6 ? "Sat" : null
        const ddate = new Date().getDate() + 2
        const month = new Date().getMonth() + 1
        const Months = month == 1 ? 'Jan' : month == 2 ? 'Feb' : month == 3 ? 'Mar' : month == 4 ? 'Apri' : month == 5 ? 'May' : month == 6 ? 'June' : month == 7 ? 'July' : month == 8 ? 'Aug' : month == 9 ? 'Sept' : month == 10 ? 'Oct' : month == 11 ? 'Nov' : month == 12 ? 'Dec' : null
        const deliveryDate = Dates + ' ' + ' ' + ddate + ' ' + Months
        const ActualPrice = getActualPrice()
        const TotalPrice = getTotal()

        firestore().collection('orders').doc(id).set({
            Products: cartItemData,
            Address: saveAddress,
            PaymentId: Paymentid,
            OrderDate: localDate,
            uid: user.uid,
            id: id,
            PaymentStatus: 'Pending',
            DeliveryDate: deliveryDate,
            ProductActualPrice: ActualPrice,
            ProductTotalPrice: TotalPrice,
            CODCharge: 10,
            CancelOrderStatus: ""
        }).then(() => {
            firestore()
                .collection('cartItem')
                .where('uid', '==', firebase.auth().currentUser?.uid)
                .get()
                .then((querySnapShot) => {
                    querySnapShot.forEach((doc) => { doc.ref.delete() })
                }).catch(error => {
                    console.log(error)
                })
            setLoading(false)
            navigation.navigate('OrderSucessfull2', { Address: saveAddress, paymentId: Paymentid, deliveryDate: deliveryDate })
        })
    }

   

    useEffect(() => {
        getSaveDataFromLocal();
    }, [isFocused])

    const getSaveDataFromLocal = async () => {

        const adress: any = await AsyncStorage.getItem('MY_ADDRESS')
        const Adress = JSON.parse(adress)
        setSaveAddress(Adress)
        console.log('Adress', Adress)
    }
    const deleveryCharge = () => {
        return (
            <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Text style={{ color: "black", right: 200, fontWeight: '700', marginLeft: 10, top: 25 }}> Delveiry Charge  </Text>
                <Text style={{ color: "#626ABB", right: 5, marginRight: 10, top: 25 }}> $10 </Text>
            </View>

        )
    }
    // const getTotalPrice = ({ items }: { items: any }) => {
    //     const initialPrice = items.ProductPrice * items.ProductQty
    //     const Discountis = 1 - Math.round(items.ProductDiscount) / 100
    //     const actualPrice = Math.round(initialPrice / Discountis)
    //     return (
    //         <View style={{ bottom: 10, left: 160 ,position:"absolute"}}>
    //             <View style={{ width: 40, borderBottomWidth: 0.5, borderBottomColor: "#878787", top: 10 }} />
    //             <Text style={{ color: "#878787", marginRight: 20 }}> ${actualPrice} </Text>

    //         </View>
    //     )
    // }
    const getActualPrice = () => {
        const Total = cartItemData.reduce((a, b) => {
            const initialPrice = b.ProductPrice * b.ProductQty
            const Discount = 1 - Math.round(b.ProductDiscount) / 100
            const actualPrice = initialPrice / Discount
            return (
                a + Math.round(actualPrice)
            )
        }, 0)
        return (
            Total
        )
    }

    const getTotal = () => {
        const Total = cartItemData.reduce((a, b) => {
            return (
                a + Math.round(b.ProductPrice * b.ProductQty)
            )
        }, 0)
        return (
            Total
        )
    }

    const displayAdress = () => {
        return (
            <View style={{ bottom: 25, }}>
                <Text style={{ color: "black" }}> State :{saveAddress?.State}</Text>
                <Text style={{ color: "black" }}> city :{saveAddress?.City}</Text>
                <Text style={{ color: "black" }}> Pincode :{saveAddress?.Pincode}</Text>
                <Text style={{ color: "black" }}> AddressType :{saveAddress?.AdressType}</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Header title={'CheckOut'} color='black' />
            <View style={{ height: 250 }}>
                <FlatList
                    // style={{}}
                    data={cartItemData}
                    keyExtractor={item => item.CartUid}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ top: 20 }}>
                                <View style={{ backgroundColor: "white", height: 115, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowRadius: 5, shadowOpacity: 1, elevation: 5 }}>
                                    <Image source={{ uri: item?.ProductImage }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} />
                                    <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 20, textAlign: "center" }}> {item.ProductName.length > 30 ? item.ProductName.substring(0, 25) + '...' + '\n' + item.ProductName.substring(25, 50) : item.ProductName}</Text>
                                </View>
                                <Icon name='ios-trash-outline' color='grey' size={15} style={{ bottom: 110, left: 360 }} onPress={() => onRemove({ uid: item.CartUid })} />
                                <View style={{ bottom: 70, right: 50 }}>
                                    {/* {getTotalPrice({ items: item })} */}
                                    <Text style={{ color: "green", textAlign: 'center', bottom: 8, left: 20 }}> ${item.ProductPrice}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', bottom: 65, left: 130 }}>
                                    <View style={{ right: 5, backgroundColor: "white", height: 20, width: 20, borderRadius: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }} >
                                        <Text style={{ color: "black", fontSize: 25, margin: 0, bottom: 8, left: 2.5 }} onPress={() => removeQty({ uid: item.CartUid, ProductQty: item.ProductQty })}>-</Text>
                                    </View>
                                    <Text style={{ color: "black", right: 2.5 }}> {item.ProductQty}</Text>
                                    <View style={{ right: -8, backgroundColor: "white", height: 20, width: 20, borderRadius: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }} >
                                        <Text style={{ color: "black", left: 5, fontSize: 20, bottom: 4 }} onPress={() => addQty({ uid: item.CartUid, ProductQty: item.ProductQty })}>+</Text>
                                    </View>
                                </View>
                            </View>
                        )

                    }}
                />
            </View>

            <View style={{ flexDirection: "row", top: 10, justifyContent: "space-evenly" }}>
                <Text style={{ color: "black", right: selectPaymentMethod == 3 ? 40 : 100, fontWeight: '700', marginLeft: selectPaymentMethod == 3 ? 20 : 10 }}> Total </Text>
                <Text style={{ color: "#626ABB", left: selectPaymentMethod == 3 ? 210 : 100, marginRight: 10 }}> ${getTotal()} </Text>
                {selectPaymentMethod == 3 ? deleveryCharge() : null}
            </View>
            <Divider style={{ backgroundColor: "black", marginTop: selectPaymentMethod == 3 ? 40 : 20 }} />
            <View style={{ marginTop: 15 }}>
                <Text style={{ color: "black", left: 10, marginTop: 20, fontSize: 18 }}> Select Payment Method </Text>
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 25 }} onPress={() => setSelectPaymentMethod(0)}>
                    <Icon name={selectPaymentMethod == 0 ? 'ios-radio-button-on-outline' : 'ios-radio-button-off-outline'} color='black' size={25} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 30, color: "black", fontWeight: selectPaymentMethod == 0 ? '700' : '200', fontSize: 18 }}> Credit card </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 25 }} onPress={() => setSelectPaymentMethod(1)}>
                    <Icon name={selectPaymentMethod == 1 ? 'ios-radio-button-on-outline' : 'ios-radio-button-off-outline'} color='black' size={25} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 30, color: "black", fontWeight: selectPaymentMethod == 1 ? '700' : '200', fontSize: 18 }}> Debit card </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 25 }} onPress={() => setSelectPaymentMethod(2)}>
                    <Icon name={selectPaymentMethod == 2 ? 'ios-radio-button-on-outline' : 'ios-radio-button-off-outline'} color='black' size={25} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 30, color: "black", fontWeight: selectPaymentMethod == 2 ? '700' : '200', fontSize: 18 }}> Upi  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 25 }} onPress={() => setSelectPaymentMethod(3)}>
                    <Icon name={selectPaymentMethod == 3 ? 'ios-radio-button-on-outline' : 'ios-radio-button-off-outline'} color='black' size={25} style={{ marginLeft: 10 }} />
                    <Text style={{ marginLeft: 30, color: "black", fontWeight: selectPaymentMethod == 3 ? '700' : '200', fontSize: 18 }}> Cash on Delivery  </Text>
                    {selectPaymentMethod == 3 ? <Text style={{ color: "grey", right: 160, fontWeight: '100', marginLeft: 10, top: 25, fontSize: 8 }}> (delivery charge apply on COD )</Text> : null}

                </TouchableOpacity>
            </View>
            <View style={{ top: 20, left: 15, flexDirection: "row" }}>

                <Text style={{ color: "black", fontSize: 18 }}>  Address</Text>
                <Text style={{ color: "#626ABB", left: 180, top: 5, fontSize: 16 }} onPress={() => navigation.navigate('Address')}> Edit Address</Text>
            </View>
            <View style={{ top: 50, padding: 10 }}>
                {saveAddress === '' ? <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('Address')}>
                    <Text style={{ color: "black", fontSize: 18, fontWeight: "300" }}> Select Address</Text>
                </TouchableOpacity> : displayAdress()}
            </View>

            <View style={{ position: "absolute", bottom: 15 }}>
                <TouchableOpacity style={{ height: '100%', width: Dimensions.get('screen').width, justifyContent: "center", alignItems: "center", backgroundColor: "#626ABB", borderRadius: 20 }} onPress={() => paymentProcess()}>
                    <Text style={{ color: "black", fontSize: 18, margin: 10 }}> Pay & Order</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={loading}
                transparent={true}
                onRequestClose={() => setLoading(false)}
            >
                <View style={{ backgroundColor: "white", width: 100, height: 100, justifyContent: "center", alignItems: "center", top: 250, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 10, alignContent: "center", left: 130, borderRadius: 20 }}>
                    <Animated.Image source={{ uri: 'https://imgtr.ee/images/2023/07/29/78141ed1831690f68c6e5f357c6587cc.png' }} style={{ width: 80, height: 80, transform: [{ rotate: interpole() }], borderRadius: 50 }} />
                    <Text style={{ color: "black", position: "absolute", fontSize: 10, top: 70 }}> Processing...</Text>
                </View>

            </Modal>
        </View>
    )
}

export default CheckOut