import { View, Text, Image, TextInput, ToastAndroid, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Badge } from 'react-native-paper'
import { _makeAxiosPostRequest, _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../component/Header'
import LottieView from 'lottie-react-native'


type user = {
    Name: string
    Email: string
    profile: string
}
const ExampleChangePassword = ({ navigation }: { navigation: any }) => {
    const [cartList, setCartList] = useState([]);
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState<user>()
    const [refresh, setRefresh] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordAlert, setPasswordAlert] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [visibleOldPassword, setVisibleOldPassword] = useState(false)
    const [visibleNewPassword, setVisibleNewPassword] = useState(false)
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const getCartProduct = async () => {
        const data = {
            'session_id': null,
            'user_id': userId
        }
        _makeAxiosPostRequest(endpoint.cart, data).then((res) => {
            console.log(res.data)
            setCartList(res.data)
        }).catch((error) => { console.log('cart============>', error.response.data) })
    }

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        console.log(userid)
        setUserId(userid)
    }

    useEffect(() => {
        getCartProduct()
        getUserId(),
            getDetail()
        const CheckPassword = () => {
            if (newPassword === confirmPassword) {
                setPasswordAlert(false)
            } else { setPasswordAlert(true) }
        }
        CheckPassword()
    }, [])

    const onRefresh = () => {
        getDetail();
        getCartProduct()
    }

    const getDetail = () => {
        _makeAxiosGetRequest(endpoint.myProfile, {}).then((res) => {
            console.log(res)
            setUser(res.data.user)
            // ToastAndroid.show(res?.message, ToastAndroid.SHORT)
        }).catch((err) => {
            console.log(err)
        })
    }

    const userPasswordChange = () => {
        setLoading(true)
        const body = new FormData()
        body.append('current_password', oldPassword)
        body.append('new_password', newPassword)
        body.append('password_confirmation', confirmPassword)
        if (newPassword === confirmPassword) {
            setPasswordAlert(false)
            _makeAxiosPostRequest(endpoint.userPasswordChange, body).then((res: any) => {
                // console.log(res)
                setLoading(false)
                ToastAndroid.show(res?.message, ToastAndroid.SHORT)
            }).catch((error) => {
                setLoading(false)
                error.response.data.errors.current_password.map((item: any, index: any) => {
                    setPasswordError(item)
                })

                // Alert.alert(error.response.data.message)
            })
        } else { setLoading(false), setPasswordAlert(true) }
    }
    return (


        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Header title='Change Password' showShadow={true} searchLeft={5} cartleft={-10} onpress={() => navigation.goBack()} />

            <View style={{ alignItems: "center", justifyContent: "center", top: 150 }}>
                <Image source={require('../../component/IconImage/padlock.png')} style={{ width: 80, height: 80, tintColor: "#27AAE1" }} />
            </View>
            {/* <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === "android" ? 10 : 0} style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
            <View style={{ top: 170 }}>
                <View style={{ top: 40 }}>
                    <View style={[{ flexDirection: "row", left: 50 }]}>
                        <TextInput
                            value={oldPassword}
                            placeholder={'Old Password'}
                            placeholderTextColor={'black'}
                            onChangeText={setOldPassword}
                            style={{ width: '80%', bottom: 5, left: -30, fontSize: 15, borderWidth: 0.5, color: 'black' }}
                            passwordRules={''}
                            secureTextEntry={visibleOldPassword}
                        />
                        <Icon name={visibleOldPassword ? 'eye-off' : 'eye'} color={'black'} size={25} style={{ right: 10 }} onPress={() => { visibleOldPassword ? setVisibleOldPassword(false) : setVisibleOldPassword(true) }} />
                    </View>
                    {passwordError !== '' ? <Text style={{ color: 'red', top: 0,left:20 }}> {passwordError}</Text> : null}

                </View>

                <View style={[{ top: 60, left: 50, flexDirection: "row" },]}>
                    <TextInput
                        value={newPassword}
                        secureTextEntry={visibleNewPassword}
                        placeholder={'New Password'}
                        placeholderTextColor={'black'}
                        onChangeText={setNewPassword}
                        style={{ width: '80%', bottom: 5, left: -30, fontSize: 15, borderWidth: 0.5, color: 'black' }}
                    />
                    <Icon name={visibleNewPassword ? 'eye-off' : 'eye'} color={'black'} size={25} style={{ right: 10 }} onPress={() => { visibleNewPassword ? setVisibleNewPassword(false) : setVisibleNewPassword(true) }} />

                </View>
                <View style={[{ top: 80, left: 50, flexDirection: 'row', },]}>
                    <TextInput
                        value={confirmPassword}
                        secureTextEntry={visibleConfirmPassword}
                        placeholder={'Confirm Password'}
                        placeholderTextColor={'black'}
                        onChangeText={setConfirmPassword}
                        style={{ width: '80%', bottom: 5, fontSize: 15, left: -30, borderWidth: 0.5, color: 'black' }}
                    />
                    <Icon name={visibleConfirmPassword ? 'eye-off' : 'eye'} color={'black'} size={25} style={{ right: 10 }} onPress={() => { visibleConfirmPassword ? setVisibleConfirmPassword(false) : setVisibleConfirmPassword(true) }} />

                </View>
                {passwordAlert ? (<View style={{ top: 80, left: 40 }}>
                    <Text style={{ color: "red", fontSize: 15, left: 5 }}> confirm Password does not match   </Text>
                </View>) : null}
                <TouchableOpacity disabled={loading ? true : false} onPress={() => userPasswordChange()} style={{ backgroundColor: "#27AAE1", top: 100, width: '90%', left: 15, borderRadius: 10, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { height: 1, width: 1, }, elevation: 3, }}>
                    {loading ? <ActivityIndicator style={{ padding: 10 }} size={30} color={'white'} /> : <Text style={{ color: "white", textAlign: "center", fontSize: 15, margin: 5, padding: 10 }} > Update now  </Text>}
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default ExampleChangePassword