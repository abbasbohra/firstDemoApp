import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from '../../component/Header'
import Icon from 'react-native-vector-icons/Ionicons'
const ExampleFAQ = ({ navigation }: { navigation: any }) => {

    const [visible, setVisible] = useState(false)

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <Header title='FAQ' searchLeft={5} cartleft={-10} showShadow={true} onpress={() => navigation.goBack()} />
            <View style={{ top: 15, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { visible ? setVisible(false) : setVisible(true) }} style={{ width: '95%', backgroundColor: 'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                    <Text style={{ margin: 5, color: 'black', fontSize: 18 }}> How To Place order on {'\n'} Fashionleo ?</Text>
                    <Icon name='chevron-down' color={'blacks'} size={20} style={{ left: 100, bottom: 0 }} />
                </TouchableOpacity>
                {visible ? (
                    <View style={{ top: 0, right: -10, width: '95%' }}>
                        <Text style={{ color: "black", margin: 5, fontSize: 15 }}> {'1) Select your desired product.'} </Text>
                        <Text style={{ color: "black", margin: 5, fontSize: 15 }}> {'2) Add to cart.'} </Text>
                        <Text style={{ color: "black", margin: 5, fontSize: 15 }}> {'3) Checkout. '} </Text>
                        <Text style={{ color: "black", margin: 5, fontSize: 15 }}> {'4) Make online payment from the available payment options.'} </Text>

                    </View>
                ) : null}
            </View>
        </View>
    )
}

export default ExampleFAQ