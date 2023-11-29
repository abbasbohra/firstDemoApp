import { View, Text, TextInput, TouchableOpacity, ToastAndroid, StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import React, { useState, useRef } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import uuid from 'react-native-uuid'
import Header from '../../component/Header';
import { _makeAxiosPostRequest } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import { Picker } from '@react-native-picker/picker'
import { ActivityIndicator, Modal } from 'react-native-paper';


const AddAddress = ({ navigation, route }: { navigation: any, route: any }) => {
    const { type } = route.params
    const { Data } = route.params
    const [state, setState] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [pincode, setPincode] = useState<string>('');
    const [addressType, setAddressType] = useState<string>(Data?.address_type == null ? 'Home' : Data?.address_type);
    const [countryCode, setCountryCode] = useState<string>('')
    const [StateCode, setStateCode] = useState<string>('');
    const [country, setCountry] = useState<string>('')
    const [name, setName] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [landMark, setLankMark] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [focus, setFocus] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false)
    const pickerRef = useRef<any>();
    const pickerRefState = useRef<any>()


    const saveAddress = () => {
        setLoading(true)
        const body = new FormData()
        body.append('country_code', 'india',)
        body.append('name', name)
        body.append('mobile', mobile)
        body.append('dialing_code', '+91')
        body.append('address', address)
        body.append('state', state)
        body.append('city', city)
        body.append('landmark', landMark)
        body.append('country', 'India')
        body.append('pincode', pincode)
        body.append('address_type', addressType)
        body.append('state_code', StateCode,)
        _makeAxiosPostRequest(endpoint.addNewAddress, body).then((res: any) => {
            // console.log(res)
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
            setLoading(false)
            navigation.navigate(type === 'select' ? 'SelectAddress' : 'Address')
        }).catch((error) => {
            setLoading(false)
            console.log(error)
            Alert.alert(error.response.data.message)
        })
    }

    const UpdateAddress = () => {
        setLoading(true)
        const Name = name == '' ? Data?.name : name
        const Number = mobile == '' ? Data?.mobile : mobile
        const Address = address == '' ? Data?.address : address
        const State = state == '' ? Data?.state : state
        const City = city == '' ? Data?.city : city
        const Landmark = landMark == '' ? Data?.landmark : landMark
        const Country = city == '' ? Data?.country : country
        const Pincode = pincode == '' ? Data?.pincode : pincode
        const AddressType = addressType == '' ? Data?.address_type : addressType

        const body = new FormData()
        body.append('id', Data?.id)
        body.append('name', Name)
        body.append('mobile', Number)
        body.append('dialing_code', '+91')
        body.append('address', Address)
        body.append('state', State)
        body.append('city', City)
        body.append('landmark', Landmark)
        body.append('country', Country)
        body.append('pincode', Pincode)
        body.append('address_type', AddressType)

        _makeAxiosPostRequest(endpoint.updateAddress, body).then((res: any) => {
            setLoading(false)
            // console.log(res.data)
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
            navigation.navigate(type === 'select' ? 'SelectAddress' : 'Address')
        }).catch((error) => {
            setLoading(false)
            console.log(error)
            Alert.alert(error.respone.data.message)
        })
    }

    // console.log('country ==========>', country)
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ backgroundColor: "white", paddingBottom: 200 }}>

            <Header onpress={() => navigation.goBack()} title={'New Address'} searchLeft={5} showShadow={true} titleStyle={{ fontSize: 18, textAlign: 'center', left: 80, top: 20, color: 'black' }} cartleft={-10} />

            <View style={{ justifyContent: 'center', alignContent: "center", top: 20, alignItems: 'center' }}>
                <View style={[{ width: '90%', borderWidth: 0.5, borderColor: "black" }]}>
                    {focus === 1 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}> Full Name</Text> : null}
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setFocus(1)}
                        onBlur={() => setFocus(0)}
                        placeholder={focus === 1 ? null : Data?.name == null ? ' Full Name' : Data?.name}
                        style={{ color: "black" }}
                        placeholderTextColor={'black'}
                    />
                </View>
                <View style={[{ width: '90%', borderWidth: 0.5, borderColor: "black", marginTop: 15 }]}>
                    {focus === 2 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}> City</Text> : null}
                    <TextInput
                        value={city}
                        onChangeText={setCity}
                        style={{ color: "black" }}
                        onFocus={() => setFocus(2)}
                        onBlur={() => setFocus(0)}
                        placeholder={focus === 2 ? null : Data?.name == null ? 'city' : Data?.city}

                        placeholderTextColor={'black'}
                    />
                </View>
                <View style={[{ width: '90%', marginTop: 10, borderWidth: 0.5, borderColor: "black" }]}>
                    {focus === 3 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}>State</Text> : null}

                    <Pressable>
                        <Picker
                            selectedValue={state}
                            placeholder='select State'
                            mode='dropdown'
                            onFocus={() => setFocus(3)}
                            onBlur={() => setFocus(0)}
                            style={{ width: 355, right: 10, borderBottomWidth: 1, borderColor: 'red', height: 50, color: 'black' }}
                            onValueChange={(itemValue) => setState(itemValue)}
                            ref={pickerRefState}
                        >
                            <Picker.Item label='Andhra Pradesh' value={'Andhra Pradesh'} />
                            <Picker.Item label='Arunachal Pradesh' value={'Arunachal Pradesh'} />
                            <Picker.Item label='Assam' value={'Assam'} />
                            <Picker.Item label='Bihar' value={'Bihar'} />
                            <Picker.Item label='Chhattisgarh' value={'Chhattisgarh'} />
                            <Picker.Item label='Goa' value={'Goa'} />
                            <Picker.Item label='Gujarat' value={' Gujarat'} />
                            <Picker.Item label='Haryana' value={'Haryana'} />
                            <Picker.Item label='Himachal Pradesh' value={'Himachal Pradesh'} />
                            <Picker.Item label='Jammu and Kashmir' value={'Jammu and Kashmir'} />
                            <Picker.Item label='Jharkhand' value={'Jharkhand'} />
                            <Picker.Item label='Karnataka' value={'Karnataka'} />
                            <Picker.Item label='Kerala' value={'Kerala'} />
                            <Picker.Item label='Madhya Pradesh' value={'Madhya Pradesh'} />
                            <Picker.Item label='Maharashtra	' value={'Maharashtra	'} />
                            <Picker.Item label='Manipur' value={'Manipur'} />
                            <Picker.Item label='Meghalaya' value={'Meghalaya'} />
                            <Picker.Item label='Mizoram' value={'Mizoram'} />
                            <Picker.Item label='Nagaland' value={'Nagaland'} />
                            <Picker.Item label='Odisha' value={'Odisha'} />
                            <Picker.Item label='Punjab' value={'Punjab'} />
                            <Picker.Item label='Rajasthan' value={'Rajasthan'} />
                            <Picker.Item label='Sikkim' value={'Sikkim'} />
                            <Picker.Item label='Tamil Nadu' value={'Tamil Nadu'} />
                            <Picker.Item label='Telangana' value={'Telangana'} />
                            <Picker.Item label='Tripura' value={'Tripura'} />
                            <Picker.Item label='Uttar Pradesh' value={'Uttar Pradesh'} />
                            <Picker.Item label='Uttarakhand' value={'Uttarakhand'} />
                            <Picker.Item label='West Bengal' value={'West Bengal'} />
                        </Picker>
                    </Pressable>
                </View>
                <View style={[{ width: '90%', top: 15, borderWidth: 0.5, borderColor: "black" }]}>
                    {focus === 4 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}>State Code</Text> : null}

                    <Pressable >
                        <Picker
                            selectedValue={StateCode}
                            mode='dropdown'
                            onFocus={() => setFocus(4)}
                            onBlur={() => setFocus(0)}
                            style={{ width: 355, right: 10, borderBottomWidth: 1, borderColor: 'red', height: 50, color: 'black' }}
                            onValueChange={(itemValue) => setStateCode(itemValue)}
                            ref={pickerRef}
                        >
                            <Picker.Item label='AP' value={'AP'} />
                            <Picker.Item label='AR' value={'AR'} />
                            <Picker.Item label='AS' value={'AS'} />
                            <Picker.Item label='BR' value={'BR'} />
                            <Picker.Item label='CG' value={'CG'} />
                            <Picker.Item label='GA' value={'GA'} />
                            <Picker.Item label='GJ' value={'GJ'} />
                            <Picker.Item label='HR' value={'HR'} />
                            <Picker.Item label='HP' value={'HP'} />
                            <Picker.Item label='KH' value={'JK'} />
                            <Picker.Item label='JH' value={'JH'} />
                            <Picker.Item label='KA' value={'KA'} />
                            <Picker.Item label='KL' value={'KL'} />
                            <Picker.Item label='MP' value={'MP'} />
                            <Picker.Item label='MH' value={'MH'} />
                            <Picker.Item label='MN' value={'MN'} />
                            <Picker.Item label='ML' value={'ML'} />
                            <Picker.Item label='MZ' value={'MZ'} />
                            <Picker.Item label='NL' value={'NL'} />
                            <Picker.Item label='OR' value={'OR'} />
                            <Picker.Item label='PB' value={'PB'} />
                            <Picker.Item label='RJ' value={'RJ'} />
                            <Picker.Item label='SK' value={'SK'} />
                            <Picker.Item label='TN' value={'TN'} />
                            <Picker.Item label='TR' value={'TR'} />
                            <Picker.Item label='UK' value={'UK'} />
                            <Picker.Item label='UP' value={'UP'} />
                            <Picker.Item label='WB' value={'WB'} />
                        </Picker>
                    </Pressable>
                </View>
                <View style={[{ width: '90%', marginTop: 30, borderWidth: 0.5, borderColor: "black" }]}>
                    {focus === 5 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}> Number</Text> : null}

                    <TextInput
                        value={mobile}
                        onChangeText={setMobile}
                        onFocus={() => setFocus(5)}
                        onBlur={() => setFocus(0)}
                        placeholder={focus === 5 ? null : Data?.name == null ? 'Number' : Data?.mobile}
                        style={{ color: "black" }}

                        placeholderTextColor={'black'}
                        keyboardType='number-pad'
                    />
                </View>
                <View style={[{ width: '90%', marginTop: 20, borderWidth: 0.5, borderColor: "black" }]}>
                    {focus === 6 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}> Landmark</Text> : null}

                    <TextInput
                        value={landMark}
                        onChangeText={setLankMark}
                        onFocus={() => setFocus(6)}
                        onBlur={() => setFocus(0)}
                        placeholder={focus === 6 ? null : Data?.name == null ? 'LandMark' : Data?.landmark}
                        style={{ color: "black" }}

                        placeholderTextColor={'black'}
                    />
                </View>
                <View style={[{ width: '90%', marginTop: 20, borderWidth: 0.5, borderColor: "black" }]}>
                    {focus === 8 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}> Address</Text> : null}

                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        onFocus={() => setFocus(8)}
                        onBlur={() => setFocus(0)}
                        placeholder={focus === 8 ? null : Data?.name == null ? 'Address' : Data?.address}
                        style={{ color: "black" }}

                        placeholderTextColor={'black'}

                    />
                </View>
                <View style={[{ width: '90%', marginTop: 20, borderWidth: 0.5, borderColor: "black" }]}>
                    {focus === 9 ? <Text style={{ color: "black", fontWeight: '800', fontSize: 12 }}>  Pincode</Text> : null}

                    <TextInput
                        value={pincode}
                        onChangeText={setPincode}
                        onFocus={() => setFocus(9)}
                        onBlur={() => setFocus(0)}
                        placeholder={focus === 9 ? null : Data?.name == null ? 'Pincode' : Data?.pincode}
                        style={{ color: "black" }}

                        placeholderTextColor={'black'}
                        keyboardType='number-pad'
                    />
                </View>

                <View style={{ flexDirection: "row", top: 20 }}>
                    <Text style={{ position: 'absolute', fontSize: 20, color: 'black', fontWeight: '500', left: -75 }}> Address Type </Text>
                    <View style={{ width: 110, right: 50, top: 50 }}>
                        <TouchableOpacity style={{ right: 0, flexDirection: "row" }} onPress={() => setAddressType('Home')}>
                            <Icon name={addressType === 'Home' ? 'ios-radio-button-on-outline' : 'ios-radio-button-off-outline'} color='#27AAE1' size={25} style={{ marginLeft: 10 }} />
                            <Text style={{ color: "#27AAE1", top: 0, fontSize: 18 }}> Home </Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ width: 110, right: -50, top: 50 }}>
                        <TouchableOpacity style={{ right: 0, flexDirection: "row" }} onPress={() => setAddressType('Office')}>
                            <Icon name={addressType === 'Office' ? 'ios-radio-button-on-outline' : 'ios-radio-button-off-outline'} color='#27AAE1' size={25} style={{ marginLeft: 10 }} />
                            <Text style={{ color: "#27AAE1", top: 0, fontSize: 18 }}> Office </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
            {type == 'edit' ? <TouchableOpacity disabled={loading ? true : false} onPress={() => UpdateAddress()} style={{ top: 150, width: 280, backgroundColor: loading ? 'grey' : "#27AAE1", alignContent: "center", justifyContent: "center", alignItems: "center", left: 55, borderRadius: 15 }}>
                {loading ? <ActivityIndicator size={30} style={{ padding: 10 }} color={'#27AAE1'} /> : <Text style={{ margin: 10, fontSize: 18, fontWeight: '700', color: 'white' }} >Update Address </Text>}
            </TouchableOpacity> : <TouchableOpacity disabled={loading ? true : false} onPress={() => saveAddress()} style={{ top: 150, width: 280, backgroundColor: loading ? 'grey' : "#27AAE1", alignContent: "center", justifyContent: "center", alignItems: "center", left: 55, borderRadius: 15 }}>
                {loading ? <ActivityIndicator size={30} style={{ padding: 10 }} color={'#27AAE1'} /> : <Text style={{ margin: 10, fontSize: 18, fontWeight: '700', color: 'white' }} >{' Save Address '}</Text>}
            </TouchableOpacity>}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2,
        backgroundColor: "#F5F5F5"
    }
})

export default AddAddress