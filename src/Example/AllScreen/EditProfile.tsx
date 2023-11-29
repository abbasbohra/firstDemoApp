import { View, Text, TextInput, Modal, TouchableOpacity, ToastAndroid, Image, Pressable, ScrollView, Alert, StyleSheet, Animated } from 'react-native'
import React, { BlockquoteHTMLAttributes, useEffect, useRef, useState } from 'react'
import { Avatar, Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import auth from '@react-native-firebase/auth'
import { BlurView } from '@react-native-community/blur'
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";
import storage from '@react-native-firebase/storage'
import CountDown from 'react-native-countdown-component';
import axios from 'axios'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import NetInfo from "@react-native-community/netinfo";
import Networt from '../../component/Networt'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../../component/Header'
import SkelatonEffectEditProfile from '../../component/SkelatonEffect/SkelatonEffectEditProfile'
import LottieView from 'lottie-react-native'
import RBSheet from 'react-native-raw-bottom-sheet'






type user = {
    category_id: string
    dialing_code: string
    email: string
    phone: any
    name: any

}


const EditProfile = ({ navigation }: { navigation: any }) => {
    const [user, setUser] = useState<any>();
    const [name, setName] = useState<string>('');
    const [passwordAlert, setPasswordAlert] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [image, setImage] = useState('');
    const [number, setNumber] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [updateButton, setUpdateButton] = useState<boolean>(false)
    const [timer, setTimer] = useState<boolean>(false)
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [dailingCode, setDailingCode] = useState('')
    const [focus, setFocus] = useState<number>(0)
    const [updateModal, setUpdateModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [updatePhone, setUpdatePhone] = useState(false);
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConnect, setIsConected] = useState<boolean>(false)
    const [skelton, setSkeleton] = useState(false);
    const pickerRef = useRef<any>();
    const ImagePickerRef = useRef<any>();
    const fadeAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        getUserDetail()
    }, [])




    useEffect(() => {
        const Unsubcribe = NetInfo.addEventListener((state: any) => {
            // console.log('connection', state.type)
            // console.log('isconected?', state.isConnected)
            setIsConected(state.isConnected)
        })

        return () => {
            Unsubcribe();
        }
    })
    // console.log(isConnect, 'connect')

    const StartAnimation = () => {
        Animated.timing(fadeAnim, {
            toValue: 20,
            useNativeDriver: false,
            duration: 5000,
        }).start()
    }

    useEffect(() => {
        if (isConnect === false) {
            StartAnimation()
        } else { null }
    }, [])

    const updateProfile = async () => {
        setLoading(true)
        const Name = name === '' ? user?.name : name
        const Number = number === '' ? user?.phone : number
        const Email = email === '' ? user?.email : email
        const DailingCode = dailingCode === '' ? user?.dialing_code : dailingCode
        const body = new FormData()
        if (image === '') {
            body.append('profileImage', user?.profile)
        } else {
            body.append('profileImage', {
                uri: image,
                type: 'image/jpg',
                name: 'image.jpg',
            })
        }

        // body.append('Content-Type', 'image/jpg')
        body.append('name', Name)
        body.append('email', Email)
        body.append('phone', Number)
        body.append('category_id', user?.category_id)
        body.append('dialing_code', DailingCode,)

        // body.append('location_lat', null,)
        // body.append('location_long', null)
        _makeAxiosPostRequest(endpoint.profileUpdate, body).then((res: any) => {
            console.log(res)
            getUserDetail();
            setLoading(false)
        }).catch((error) => {
            console.log(error.response.data.message)
            setLoading(false)
        })
    }
    // console.log(
    //     'ImagePath =========> ', image
    // )

    const UpdateRequest = () => {
        if (email === '') {
            Alert.alert('Please change email id ')
        } else {
            setLoading(true)
            const body = new FormData()
            body.append('new_value', email)
            body.append('type', 'email')
            // console.log(body)
            _makeAxiosPostRequest(endpoint.updateRequest, body).then((res: any) => {
                // console.log(res)
                setUpdateModal(true)
            }).catch((error) => {

                setLoading(false)
                console.log(error.response.data.code)
                Alert.alert(error.response.data.errors)
            })
        }

    }

    const UpdateOtpEmail = () => {
        setLoading(true)
        const body = new FormData()
        body.append('otp', otp) 
        body.append('phone', user?.phone)
        body.append('dailing_code', user?.dialing_code)
        body.append('type', 'email')

        _makeAxiosPostRequest(endpoint.updateotp, body).then((res: any) => {
            // console.log(res)
            setUpdateModal(false)
            getUserDetail()
            setLoading(false)
            // ToastAndroid.show(res?.message, ToastAndroid.SHORT)
        }).catch((err) => {
            setLoading(false)
            console.log(err)
            Alert.alert(err.response.data.message)

        })

    }

    const UpdateRequestPhone = () => {
        if (number == '') {
            Alert.alert('Please Change number')
        } else {
            setLoading(true)
            const body = new FormData()
            body.append('new_value', number)
            body.append('type', 'phone')
            _makeAxiosPostRequest(endpoint.updateRequest, body).then((res: any) => {
                // console.log(res)
                setUpdatePhone(true)
            }).catch((error) => {
                console.log(error)
                setLoading(false)
                Alert.alert(error.respnse.data.errors)
            })
        }

    }
    const UpdateOtpPhone = () => {
        setLoading(true)
        const body = new FormData()
        body.append('otp', otp)
        body.append('phone', user?.phone)
        body.append('dailing_code', user?.dialing_code)
        body.append('type', 'phone')
        _makeAxiosPostRequest(endpoint.updateotp, body).then((res: any) => {
            // console.log(res)
            setUpdatePhone(false)
            getUserDetail()
            setLoading(false)
            ToastAndroid.show(res?.message, ToastAndroid.SHORT)
        }).catch((err: any) => {
            console.log(err.response.data.error)
            console.log(err.response.data.message)
            Alert.alert(err.response.data.error)

        })

    }

    const getUserDetail = () => {
        setSkeleton(true)
        _makeAxiosGetRequest(endpoint.myProfile, {}).then((res: any) => {
            // console.log(res)
            setUser(res.data.user)
            // ToastAndroid.show(res?.message, ToastAndroid.SHORT)
            setSkeleton(false)

        }).catch((err) => {
            console.log(err)
            setSkeleton(false)

        })
    }

    const openCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
            mediaType: "photo",
            includeBase64: true
        }).then(image => {
            if (image.size > 5000000) {
                Alert.alert('please select Image Less Then 5 MB')
            } else {
                setImage(image.path)
            }
            setVisible(false)
        })
    }

    // console.log('imagesize', image)
    const openGallery = () => {
        ImagePicker.openPicker({
            width: undefined,
            height: undefined,
            cropping: true,
            mediaType: "photo",
            includeBase64: true
        }).then(image => {
            if (image.size > 5000000) {
                Alert.alert(' please select Image Less Then 5 MB')
            } else {
                setImage(image.path)
            }
            setVisible(false)
        })
    }
    useEffect(() => {
        setTimeout(() => {
            setTimer(false)
        }, 22000)
    }, [timer])


    useEffect(() => {
        if (newPassword === confirmPassword) {
            setPasswordAlert(false)
        } else { setPasswordAlert(true) }

    }, [confirmPassword])

    const userPasswordChange = () => {
        setLoading(true)

        const data = {
            current_password: oldPassword,
            new_password: newPassword,
            password_confirmation: confirmPassword,
        }
        _makeAxiosPostRequest(endpoint.userPasswordChange, data).then((res: any) => {
            // console.log(res)
            setLoading(false)
            ToastAndroid.show(res?.message, ToastAndroid.SHORT)



        }).catch((error) => {
            setLoading(false)
            Alert.alert(error.response.data.message)
        })
    }
    return (
        <ScrollView contentContainerStyle={{ backgroundColor: "white", paddingBottom: 0, flex: 1 }}>
            <Header title='EditProfile' cartleft={-10} searchLeft={-10} onpress={() => navigation.goBack()} showShadow={true} />
            {skelton ? (<SkelatonEffectEditProfile />) : (<View>
                <View style={{}}>
                    <TouchableOpacity onPress={() => ImagePickerRef.current.open()} style={{ top: 10, left: 125, width: 140, height: 130 }}>
                        {image == '' ? <Avatar.Image size={130} source={{ uri: user?.profile == null ? 'https://i.ibb.co/Hdtgm2R/images.jpg' : user?.profile }} style={{ backgroundColor: "white", left: 3 }} /> :
                            <Avatar.Image size={130} source={{ uri: image }} style={{ backgroundColor: "white" }} />
                        }
                    </TouchableOpacity>
                    <Text style={{ color: 'black', fontSize: 10, top: 15, left: 110 }}> Recommended Size :500 * 500Px </Text>
                </View>
                <View style={[{ top: 30, left: 18, backgroundColor: "white", width: '90%', justifyContent: "center", alignContent: "center", borderWidth: 0.5, borderColor: "silver" }]}>
                    <TextInput
                        value={name}
                        placeholderTextColor={'black'}
                        placeholder={user?.name}
                        onChangeText={setName}
                        style={{ width: 330, bottom: 0, fontSize: 18 }}
                    />
                </View>
                <View style={{ backgroundColor: "#27AAE1", width: '90%', borderRadius: 10, left: 15, top: 50, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { height: 1, width: 1, }, elevation: 5, }}>
                    <Text onPress={() => updateProfile()} style={{ color: "white", padding: 15, fontSize: 18, textAlign: "center", }}> Update Now </Text>
                </View>
                <View style={{ flexDirection: "row", top: 50 }}>
                    <View style={{ top: 50, left: 10, backgroundColor: 'white', width: '70%', borderWidth: 0.5, borderColor: "silver" }}>
                        <TextInput
                            value={email}
                            placeholderTextColor={'black'}
                            placeholder={user?.email}
                            onChangeText={setEmail}
                            style={{}}
                        />
                    </View>
                    <TouchableOpacity onPress={() => UpdateRequest()} style={{ backgroundColor: "#27AAE1", width: '25%', borderRadius: 10, left: 15, top: 50, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { height: 1, width: 1, }, elevation: 3, }}>
                        <Text style={{ color: "white", padding: 5, fontSize: 18, textAlign: "center", top: 5 }}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", top: 130, }}>
                    <View style={{ top: 0, left: 10, backgroundColor: "white", width: '70%', borderWidth: 0.5, borderColor: 'silver' }}>
                        <TextInput
                            value={number}
                            placeholder={user?.phone}
                            onChangeText={setNumber}
                            keyboardType='phone-pad'
                            maxLength={11}
                            placeholderTextColor={'black'}
                            style={{}}
                        />
                    </View>
                    <TouchableOpacity onPress={() => UpdateRequestPhone()} style={{ backgroundColor: "#27AAE1", width: '25%', borderRadius: 10, left: 15, top: 0, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { height: 1, width: 1, }, elevation: 3, }}>
                        <Text style={{ color: "white", padding: 5, fontSize: 18, textAlign: "center", top: 8 }}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>)
            }
            <View>
                <Modal
                    visible={loading}
                    onRequestClose={() => setLoading(false)}
                    transparent={true}
                    animationType='slide'
                >
                    <View style={{ flex: 1, backgroundColor: "white", justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView source={require('../../component/Animations/Animation - 1699526175306.json')} style={{ width: 150, height: 150 }} autoPlay loop />
                    </View>
                </Modal>
            </View>

            <View>
                <Modal
                    visible={updateModal}
                    transparent={true}
                    onRequestClose={() => setUpdateModal(false)}
                >
                    <View style={{ backgroundColor: 'white', height: 310, width: 350, left: 25, top: 200, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                        <View style={{ backgroundColor: "#27AAE1", height: 50 }}>
                            <Text style={{ color: 'white', margin: 10, fontSize: 18, fontWeight: '800' }}> OTP  Verification </Text>
                        </View>
                        <Text style={{ fontSize: 18, textAlign: 'center', top: 30 }}> Otp has been  Send to Your eamil- </Text>
                        <Text style={{ color: 'black', top: 30, fontSize: 15, textAlign: "center" }}> {number}</Text>
                        <View style={{ height: 70, backgroundColor: '#27AAE1', top: 60, width: 310, left: 20 }}>
                            <Text style={{ padding: 10, color: "white", fontSize: 15 }}> Please Enter The Otp </Text>
                            <TextInput
                                style={{ bottom: 20, left: 10 }}
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType='number-pad'

                            />
                        </View>
                        <View style={{ flexDirection: 'row', top: 100, left: 150 }}>
                            <TouchableOpacity onPress={() => { setUpdateModal(false), setLoading(false) }} style={{ width: 80, backgroundColor: "#27AAE1", borderRadius: 11, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                                <Text style={{ color: "white", fontSize: 12, padding: 10, textAlign: 'center' }}> Cancel </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => UpdateOtpEmail()} style={{ width: 80, backgroundColor: "#27AAE1", borderRadius: 11, left: 25, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                                <Text style={{ color: "white", fontSize: 12, padding: 5, textAlign: 'center', top: 5 }}> Verify </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
            </View>
            <View>
                <Modal
                    visible={updatePhone}
                    transparent={true}
                    onRequestClose={() => setUpdatePhone(false)}
                >
                    <View style={{ backgroundColor: 'white', height: 310, width: 350, left: 25, top: 200, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                        <View style={{ backgroundColor: "#27AAE1", height: 50 }}>
                            <Text style={{ color: 'white', margin: 10, fontSize: 18, fontWeight: '800' }}> OTP  Verification </Text>
                        </View>
                        <Text style={{ fontSize: 18, textAlign: 'center', top: 30 }}> Otp has been  Send to Your eamil- </Text>
                        <Text style={{ color: 'black', top: 30, fontSize: 15, textAlign: "center" }}> {number}</Text>
                        <View style={{ height: 70, backgroundColor: '#27AAE1', top: 60, width: 310, left: 20 }}>
                            <Text style={{ padding: 10, color: "white", fontSize: 15 }}> Please Enter The Otp </Text>
                            <TextInput
                                style={{ bottom: 20, left: 10 }}
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType='number-pad'

                            />
                        </View>
                        <View style={{ flexDirection: 'row', top: 100, left: 150 }}>
                            <TouchableOpacity onPress={() => { setUpdatePhone(false), setLoading(false) }} style={{ width: 80, backgroundColor: "#27AAE1", borderRadius: 11, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                                <Text style={{ color: "white", fontSize: 12, padding: 10, textAlign: 'center' }}> Cancel </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => UpdateOtpPhone()} style={{ width: 80, backgroundColor: "#27AAE1", borderRadius: 11, left: 25, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                                <Text style={{ color: "white", fontSize: 12, padding: 5, textAlign: 'center', top: 5 }}> Verify </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
            </View>
            <View>
                <RBSheet
                    ref={ImagePickerRef}
                    height={220}
                    animationType='fade'
                >
                    <View style={{ backgroundColor: "white", }}>
                        <View style={{ marginTop: 0 }}>
                            <Text style={{ color: 'grey', fontSize: 18, margin: 10 }}>Select an Image </Text>
                        </View>
                        <TouchableOpacity style={{ flexDirection: "row", top: 20, left: -20, marginLeft: 30, }} onPress={() => openCamera()}>
                            <Text style={{ color: "black", textAlign: "center", fontSize: 18 }} > From Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", top: 45, left: -20, marginLeft: 30, }} onPress={() => openGallery()} >
                            <Text style={{ color: "black", textAlign: "center", fontSize: 18 }}> From Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", top: 75, left: -20, marginLeft: 30, }} onPress={() => ImagePickerRef.current.close()} >
                            <Text style={{ color: "black", textAlign: "center", fontSize: 18 }}> Cancel </Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet>
            </View>

            {isConnect == false ? <Modal
                visible={true}
            >
                <View style={{ backgroundColor: "white", top: 150 }}>
                    <Animated.View style={{ transform: [{ translateX: fadeAnim }] }}>

                        <MaterialCommunityIcons name='access-point-network-off' color={'black'} size={200} style={{ position: "absolute", left: 80 }} />
                    </Animated.View>

                    <Text style={{ color: 'black', fontWeight: "700", textAlign: 'center', top: 250 }}> No Connection Found Please Try Again Later....  </Text>
                </View>
            </Modal> : null}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1
    }
})

export default EditProfile
