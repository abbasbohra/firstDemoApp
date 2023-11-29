import { View, Text, Pressable, TextInput, Alert, Image, Modal, ActivityIndicator, TouchableOpacity, ToastAndroid, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-paper';
import auth from '@react-native-firebase/auth'
import axios from 'axios';
import { _makeAxiosPostRequestWithoutAuth } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import { useDispatch } from 'react-redux'
import uuid from 'react-native-uuid'
// import { login } from '../redux/action';
import LoadingScreen from '../../component/LoadingScreen';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../../component/Logo';
import { logIn } from '../../redux/slice/LoginScreenSlice';

const LoginWithEmail = ({ navigation }: { navigation: any }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState('')
    const [errors, setErrors] = useState('')
    const [focus, setFocus] = useState(false);

    const getLonginDetail = () => {
        setLoading(true)
        Keyboard.dismiss()
        const body = new FormData()
        body.append('password', Password)
        body.append('email', email)
        _makeAxiosPostRequestWithoutAuth(endpoint.LoginWithEmail, body).then(async (res) => {
            // console.log('LoginWithEmail=====>', res.data)
            // console.log('tocken====>', res.data.access_token)
            await AsyncStorage.setItem('ACCESS_TOKEN', JSON.stringify(res.data.access_token))
            const data = {
                location_long: res.data.user.location_long,
                location_lat: res.data.user.location_lat
            }
            await AsyncStorage.setItem('Loacation', JSON.stringify(data))
            // console.log('location=========>', data)
            await AsyncStorage.setItem('USERID', JSON.stringify(res.data.user.id))
            // console.log('userImage======>', res.data.user.profile)
            // console.log('tocken====>', res.data.access_token)
            setLoading(false)
            dispatch(logIn(true))
            navigation.navigate('Main')
        })
            .catch((err) => {
                setLoading(false)
                console.error(err.response.data.message)
                // ToastAndroid.show(, ToastAndroid.SHORT)
                setPasswordError(err.response.data.message)
                setErrors(err.response.data.errors.email)
            })

    }


    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ alignItems: "center", justifyContent: "center", top: 35, right: 80 }}>
                <Text style={{ fontSize: 25, fontWeight: '500', color: "black", left: 15 }}> Login With Email  </Text>
                <Text style={{ left: 48, color: "grey", margin: 5 }}> Enter Your Email And Password To Login </Text>
            </View>
            <View>
                <Logo width={250} height={60} left={50} top={60} right={0} />
            </View>
            <View style={{top: 150, }}>
                <View style={{ borderWidth: 1, borderColor: 'white', width: 350, left: 15, backgroundColor: "white", shadowColor: "black", shadowOpacity: 1, shadowOffset: { width: 1.5, height: 1.5 }, elevation: 6, shadowRadius: 1, borderRadius: 5, }}>
                    <TextInput
                        value={email}
                        onFocus={() => setFocus}
                        onChangeText={setEmail}
                        style={{ width: 320, left: 5, }}
                        placeholder='Enter Email'
                        placeholderTextColor={'black'}
                        secureTextEntry={visible}
                        keyboardType='email-address'


                    />
                </View>
                {errors !== ''? <Text style={{ left: 20, color: 'red' }}>  {errors}</Text> : null }
            </View>

            <View style={{ top: 160, left: 249, }}>
                <Text style={{ color: "black", }}> ForgetPassword </Text>
            </View>
            <View style={{ top: 170, }}>
                <View style={{ borderWidth: 1, borderColor: 'white', width: 350, left: 15, backgroundColor: "white", shadowColor: "black", shadowOpacity: 1, shadowOffset: { width: 1.5, height: 1.5 }, elevation: 6, shadowRadius: 1, borderRadius: 5, flexDirection: "row", }}>
                    <TextInput
                        value={Password}
                        onChangeText={setPassword}
                        style={{ width: 320, left: 5, }}
                        placeholder='Password'
                        placeholderTextColor={'black'}
                        secureTextEntry={visible}
                        onSubmitEditing={() => Keyboard.dismiss()}

                    />
                    {visible ? <Icon name='eye-off' color='black' size={25} style={{ top: 10, right: 5 }} onPress={() => setVisible(false)} /> : <Icon name='eye-sharp' color='black' size={25} style={{ top: 10, right: 5 }} onPress={() => setVisible(true)} />}
                </View>
                {passwordError !== '' ? <Text style={{ color: 'red', left: 20 }}>  {passwordError}</Text> : null}

            </View>
            <View style={{ top: 200 }}>
                <TouchableOpacity style={{ backgroundColor: "#27AAE1", width: 330, left: 20, borderRadius: 10, shadowColor: '#5B66B8', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { height: 1, width: 1, }, elevation: 20, }}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 20, margin: 5 }} onPress={() => getLonginDetail()}> Login Now  </Text>
                </TouchableOpacity>
                <Text style={{ color: "black", position: 'relative', top: 10, fontSize: 20, left: 150 }}> or </Text>
                <TouchableOpacity style={{ backgroundColor: "#27AAE1", top: 25, width: 330, left: 20, borderRadius: 10, shadowColor: '#5B66B8', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { height: 1, width: 1, }, elevation: 20, }}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 20, margin: 5 }} onPress={() => navigation.navigate('LoginPage')}> Login With Number  </Text>
                </TouchableOpacity>

                <Text style={{ top: 50, left: 80, color: "black" }}> Don't Have Account ?<Text style={{ color: "#27AAE1" }} onPress={() => navigation.navigate('CreateAccount')}>Sign up</Text> </Text>
                <View style={{ flexDirection: "row", top: 80, }}>
                    <Divider style={{ backgroundColor: "grey", width: 150, left: 10 }} />
                    <Text style={{ color: "black", bottom: 10, left: 20 }}> OR </Text>
                    <Divider style={{ backgroundColor: "grey", width: 150, left: 40 }} />
                </View>
                <View style={{ flexDirection: "row", top: 100, }}>
                    <View style={{ backgroundColor: "white", left: 90, borderRadius: 10, height: 45, width: 45, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 10 }}>
                        <Image source={{ uri: 'https://i.ibb.co/4JtmGmC/google.png"' }} style={{ width: 25, height: 25, margin: 5, left: 5, top: 5 }} />
                    </View>
                    <View style={{ backgroundColor: "white", left: 110, borderRadius: 10, height: 45, width: 45, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 10 }}>
                        <Image source={{ uri: "https://i.ibb.co/yybj7K5/81341.png" }} style={{ width: 30, height: 30, margin: 5, left: 2.5, top: 2, tintColor: "#2E4D8E" }} />
                    </View>
                    <View style={{ backgroundColor: "white", left: 130, borderRadius: 10, height: 45, width: 45, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 10 }}>
                        <Image source={{ uri: 'data:image/png;base64,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' }} style={{ width: 25, height: 20, margin: 5, left: 5, top: 7 }} />
                    </View>
                </View>
            </View>
            {
                loading ? (<View style={{ flex: 1, bottom: 50 }}>
                    <LoadingScreen />
                </View>) : null
            }
        </View>
    )
}

export default LoginWithEmail