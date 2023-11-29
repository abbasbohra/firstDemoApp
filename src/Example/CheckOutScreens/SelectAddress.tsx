import { View, Text, FlatList, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../component/Header'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { _makeAxiosDeleteRequest, _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import axios from 'axios'
import SkelatonEffectSelectAddress from '../../component/SkelatonEffect/SkelatonEffectSelectAddress'
import { Dimensions } from 'react-native'


type adresss = {
    id: any
    state: string
    city: string
    pincode: any
    address_type: string
    address: string
    name: any
}

const SelectAddress = ({ navigation }: { navigation: any }) => {
    const [adress, setAddress] = useState<adresss[]>([]);
    const [selectAddress, setSelectAddress] = useState<any>()
    const [loading, setLoading] = useState(false)
    const isFocused = useIsFocused();

    const getAddress = async () => {
        setLoading(true)
        _makeAxiosGetRequest(endpoint.getAllAddress, {}).then((res) => {
            // console.log(res.data)
            setAddress(res.data)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log(error)

        })

    }

    useEffect(() => {
        getAddress();
    }, [isFocused])

    const deleteAddress = ({ id }: { id: any }) => {
        const deleteUrl = `${endpoint.deleteAddress}/${id}`
        _makeAxiosDeleteRequest(deleteUrl, {}).then((res: any) => {
            // console.log(res.data)
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
        }).catch((error) => {
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }

    const nextPage = async () => {
        await AsyncStorage.setItem('SAVEADDRESS', JSON.stringify(selectAddress))
        navigation.navigate('SelectPaymentMethod')
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5', height: Dimensions.get('screen').height }}>
            <Header onpress={() => navigation.goBack()} title={'Select Address'} showShadow={true} cartleft={-10} searchLeft={5} />
            {loading ? (<SkelatonEffectSelectAddress />) : <View style={{ flex: 1 }}>

                <View style={{ top: 20, paddingBottom: 150, }}>
                    <FlatList
                        style={{}}
                        data={adress}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }: { item: any, index: any }) => {
                            return (
                                <TouchableOpacity onPress={() => setSelectAddress(item)} style={{ margin: 5, width: '100%', alignContent: "center", left: 0, backgroundColor: "white" }}>
                                    <Icon name={selectAddress?.id === item?.id ? 'radio-button-on' : 'radio-button-off'} style={{ position: "absolute", top: 40, left: 4 }} color={'black'} size={25} />
                                    <View style={{ top: 30, left: 20 }}>
                                        <Text style={{ color: "black", fontWeight: '900', fontSize: 15, left: 15, }}> {item.name.toLowerCase()}</Text>
                                        <View style={{ width: '73%', margin: 5 }}>
                                            <Text style={{ color: "black", fontSize: 15, marginLeft: 15, }}>{item?.address},{item?.city},{item?.pincode},{item?.state},{item?.landmark}</Text>
                                        </View>

                                    </View>
                                    <View style={{ top: -60, margin: 10, left: 20 }}>
                                        <View style={{ backgroundColor: "white", borderRadius: 30, marginLeft: 5, left: 280, top: -10, borderWidth: 1, borderColor: '#27AAE1', width: '13%' }}>
                                            <Text style={{ padding: 5, color: "#27AAE1", fontSize: 10, left: 2.5 }}>{item?.address_type} </Text>
                                        </View>
                                        <Icon name='create' color='black' size={25} style={{ left: 300, top: 25, position: "absolute" }} onPress={() => navigation.navigate('AddAddress', { type: 'edit', Data: item })} />
                                        <Icon name='ios-trash-outline' color='black' size={25} style={{ left: 300, top: 60, position: "absolute" }} onPress={() => deleteAddress({ id: item.id })} />
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />

                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', bottom:adress.length ===0 ? 40:0}} >
                    <FAB
                        icon={() => (<Icon name='add' color={'white'} size={30} style={{ bottom: 8, right: 5 }} />)}
                        style={{ width: 50, height: 50, backgroundColor: "#27AAE1", left: 300, top: 0, borderRadius: 60 }}
                        onPress={() => navigation.navigate('AddAddress', { type: 'select' })}
                        rippleColor={'white'}

                    />
                    <TouchableOpacity onPress={() => selectAddress === '' ? Alert.alert('Please Select Address ') : nextPage()} style={{ top: adress.length === 0 ? 55 : 20, backgroundColor: "#27AAE1", width: '100%', paddingBottom: 15 }}>
                        <Text style={{ color: 'white', fontSize: 20, padding: 15, textAlign: 'center' }}> Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
    )
}

export default SelectAddress