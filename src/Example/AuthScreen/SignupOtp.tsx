import { View, Text, TextInput, Modal, ActivityIndicator, ToastAndroid, Keyboard, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { _makeAxiosPostRequestWithoutAuth } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import LoadingScreen from '../../component/LoadingScreen'
import { useDispatch } from 'react-redux'
import { logIn } from '../../redux/slice/LoginScreenSlice'
import messaging from '@react-native-firebase/messaging'

const SignupOtp = ({ navigation, route }: { navigation: any, route: any }) => {
    const [loader, setLoader] = useState<any>()
    const [otp, setOpt] = useState<string>('');
    const { numb } = route.params
    const { name } = route.params
    const { email } = route.params
    const { password } = route.params
    const { dailingCode } = route.params
    const { referral } = route.params
    const [otpError, setOtpError] = useState('')
    const [tocken, setTocken] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const VerifyOtp = () => {
        setLoading(true)
        const body = new FormData()
        body.append('phone', numb)
        body.append('dialing_code', '+91')
        if (name != '') {
            body.append('name', name)
        }
        if (name != '') {
            body.append('username', name)
        }
        if (referral != '') {
            body.append('referral_code', referral)
        }
        body.append('dialing_code', '+91')
        if (email != '') {
            body.append('email', email)
        }
        if (password != '') {
            body.append('password', password)
        }

        body.append('otp', otp)
        console.log('verifyotp data', body)
        _makeAxiosPostRequestWithoutAuth(endpoint.VerifyOtp, body).then(async (res) => {
            // console.log('tocken====>', res.data.access_token)
            await AsyncStorage.setItem('ACCESS_TOKEN', JSON.stringify(res.data.access_token))
            const data = {
                location_long: res.data.user.location_long,
                location_lat: res.data.user.location_lat
            }
            await AsyncStorage.setItem('Loacation', JSON.stringify(data))
            // console.log('location=========>', data)
            // await AsyncStorage.setItem('UserImage', JSON.stringify(res.data.data.user.profile))
            await AsyncStorage.setItem('USERID', JSON.stringify(res.data.user.id))
            // console.log('userImage======>', res.data.user.profile)
            // console.log('tocken====>', res.data.access_token)
            const tocken = await messaging().getToken()
            await AsyncStorage.setItem('FCMTOCKEN', JSON.stringify(tocken))
            setLoading(false)
            dispatch(logIn(true))
            navigation.navigate('Main')
        }).catch((error) => {
            setLoading(false)
            error.response.data.errors.otp.map((item: any, index: any) => {
                setOtpError(item)
            })
            console.log(error)
        })
    }

    const ResendOtp = () => {
        setLoading(true)
        const body = new FormData()
        body.append('phone', numb)
        body.append('dialing_code', dailingCode)
        console.log(body)
        _makeAxiosPostRequestWithoutAuth(endpoint.login, body).then((res) => {
            // console.log(res.data)
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
        })


    }

    useEffect(() => {
        if (loading) {
            Keyboard.dismiss()
        } else { null }
    })

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            {loading ? (<View style={{}}>
                <LoadingScreen />
            </View>) : < View >

                <View style={{ top: 20, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "black", fontSize: 26, textAlign: 'center', fontFamily: 'NotoSansVithkuqi-Regular', fontWeight: '800' }}> Enter OTP </Text>
                    <Image source={require('../../component/IconImage/fashionLeoLogo.png')} style={{ width: 260, height: 240, top: 30, }} />
                </View>
                <View style={{ top: 80 }}>
                    <Text style={{ color: 'black', fontSize: 21, textAlign: "center" }}> OTP has been sent on {numb}</Text>
                </View>
                <View style={{ top: 50 }}>
                    <TextInput
                        placeholder=' Enter OTP'
                        onChangeText={setOpt}
                        value={otp}
                        keyboardType='number-pad'
                        style={{ borderColor: "black", borderWidth: 0.5, width: '90%', left: 20, top: 70, backgroundColor: "white", color: 'black' }}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    {otpError !== '' ? <Text style={{ color: "red", top: 75, left: 20 }}>{otpError}</Text> : null}
                    <TouchableOpacity onPress={() => ResendOtp()} style={{ top: 90 }}>
                        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: '900', color: "black" }}> Resend OTP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => VerifyOtp()} touchSoundDisabled={false} style={{ backgroundColor: "#27AAE1", width: '87%', top: 115, left: 25, }}>
                        <Text style={{ color: "white", padding: 11, textAlign: "center", fontSize: 18 }}> Submit </Text>
                    </TouchableOpacity>
                </View>
            </View>}

        </View >
    )
}

export default SignupOtp