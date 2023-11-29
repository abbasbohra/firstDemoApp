import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../component/Header'
import uuid from 'react-native-uuid'



const OrderSucessfull2 = ({ navigation, route }: { navigation: any, route: any }) => {

    const { Address } = route.params
    const { deliveryDate } = route.params

    const paymentId = uuid.v4()
    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 680, backgroundColor: "white", width: 370, left: 10, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, top: 5 }}>
                <View style={{ right: 5 }}>
                    <Header title={'Order Placed '} color='black' />
                </View>

                <View style={{ backgroundColor: '#5B66B8', justifyContent: "center", alignContent: "center", alignItems: 'center', height: 100, width: 100, borderRadius: 500, top: 21, left: 130 }}>
                    <Icon name='checkmark' color='black' size={45} style={{}} />
                </View>
                <Text style={{ color: '#5B66B8', fontWeight: "600", top: 30, textAlign: 'center', fontSize: 20 }}> Order Successfull ! </Text>

                <Text style={{ color: 'black', fontWeight: "600", top: 40, textAlign: 'center', fontSize: 15 }}>Payment is Successfull Processed and  you{'\n'}order on the way ✨ </Text>
                <View style={{ top: 100, margin: 5, marginLeft: 15 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'black', fontSize: 15, fontWeight: '500' }}> Order Detail </Text>
                        <Text style={{ color: 'red', fontSize: 15, fontWeight: '500', left: 180 }}> Pending </Text>
                    </View>

                    <View style={{ top: 20 }}>
                        <Text style={{ color: "black", fontWeight: '500', fontSize: 15 }}> Your order # is: {paymentId.slice(20)} </Text>
                        <Text style={{ padding: 5 }}>An email receipt including the detail about your order has been sent to your email ID. </Text>
                    </View>
                    <View style={{ top: 40 }}>
                        <Text style={{ color: "black", fontWeight: '500', fontSize: 15 }}> Your order wiil be shipped to  </Text>
                        <Text style={{ padding: 5 }}>{Address} </Text>
                    </View>
                    <View style={{ top: 60 }}>
                        <Text style={{ color: "black", fontWeight: '500', fontSize: 15 }}> Payment Method  </Text>
                        <Text style={{ padding: 5 }}> Cash On Delivery</Text>
                    </View>
                    <View style={{ top: 80 }}>
                        <Text style={{ color: "black", fontWeight: '500', fontSize: 15 }}> Payment Status  </Text>
                        <Text style={{ padding: 5, color: 'red' }}> pending</Text>
                    </View>
                    <View style={{ top: 80 }}>
                        <Text style={{ color: "black", fontWeight: '500', fontSize: 15 }}> Deliverd on {deliveryDate}  </Text>
                    </View>
                </View>
            </View>
            <View style={{ top: 80 }}>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: "grey", width: 170, left: 170, margin: 20, borderRadius: 5, backgroundColor: "#5B66B8" }} onPress={() => navigation.navigate('Home')}>
                    <Text style={{ margin: 10, fontSize: 15, color: 'white' }}> continue shopping </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: "grey", width: 130, left: 0, margin: 20, borderRadius: 5, backgroundColor: "#5B66B8", bottom: 83 }} onPress={() => navigation.navigate('OrderHistory')}>
                    <Text style={{ margin: 10, fontSize: 15, color: 'white' }}> Track Order  </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OrderSucessfull2