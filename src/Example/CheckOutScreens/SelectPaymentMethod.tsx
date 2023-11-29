import {
    View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Alert,
    FlatList, ScrollView, ActivityIndicator, ToastAndroid, Dimensions
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Header from '../../component/Header'
import { endpoint } from '../../Service/endpoint';
import { _makeAxiosGetRequest, _makeAxiosPostRequest, _makeAxiosDeleteRequest } from '../../Service/axios';
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/Ionicons'
import ExampleReviewOrder from './ReviewOrder';
import { err } from 'react-native-svg/lib/typescript/xml';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'react-native-check-box';


const SelectPaymentMethod = ({ navigation, }: { navigation: any, }) => {
    const [paymentMethod, setPaymentMethod] = useState<any>('')
    const [checked, setChecked] = useState<boolean>(false);

    const nextPage = async () => {
        await AsyncStorage.setItem('SAVEPAYMENTMETHOD', JSON.stringify(paymentMethod))
        navigation.navigate('ReviewOrder')
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white", height: Dimensions.get('screen').height }}>
            <Header onpress={() => navigation.goBack()} title='choose Payment ' showShadow={false} cartleft={-10} searchLeft={5} />
            <View style={{ height: 200 }}>
                <Text style={{ color: "black", fontWeight: 'bold', fontSize: 18, top: 20, left: 10 }}> Select Payment Method</Text>
                <TouchableOpacity onPress={() => setPaymentMethod('Online')} style={{ top: 30, flexDirection: 'row', }}>
                    <Text style={{ color: "black", fontSize: 18, left: 10 }}> Online </Text>
                    <View style={{ left: 330, position: 'absolute' }}>
                        <CheckBox
                            isChecked={paymentMethod === 'Online' ? true : false}
                            onClick={() => setPaymentMethod('Online')}

                            checkBoxColor={checked ? 'black' : 'black'}
                            rightTextStyle={{ color: "#27AAE1", fontSize: 15, bottom: 2.5 }}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPaymentMethod('COD')} style={{ top: 50, }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: "black", fontSize: 18, left: 10 }}> Cash On Delivery </Text>
                        <View style={{ left: 330, position: 'absolute' }}>
                            <CheckBox
                                isChecked={paymentMethod === 'COD' ? true : false}
                                onClick={() => setPaymentMethod('COD')}
                                checkBoxColor={checked ? 'black' : 'black'}
                                rightTextStyle={{ color: "#27AAE1", fontSize: 15, bottom: 2.5 }}
                            />
                        </View>
                    </View>

                </TouchableOpacity>

            </View >
            <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                <TouchableOpacity onPress={() => paymentMethod == '' ? Alert.alert('Please select Payment Method') : nextPage()} style={{ backgroundColor: '#27AAE1', width: '100%', }}>
                    <Text style={{ color: 'white', textAlign: "center", padding: 18, fontSize: 15 }}> Next  </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    shadow: {
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2,
        backgroundColor: "white"
    }
})
export default SelectPaymentMethod