import { View, Text, TextInput, KeyboardAvoidingView, Image, ToastAndroid, Modal, ActivityIndicator, Alert, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import firebase from '@react-native-firebase/firestore';
import { _makeAxiosPostRequestWithoutAuth } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import { Picker } from '@react-native-picker/picker'
import LoadingScreen from '../../component/LoadingScreen';
import Logo from '../../component/Logo';
import CheckBox from 'react-native-check-box';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import the KeyboardAwareScrollView
const CeateAccountPage = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState<string>('');
  const [dailingCode, setDailingCode] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [focus, setFocus] = useState<number>(0)


  const signUp = () => {
    setLoading(true)
    const body = new FormData()
    body.append('phone', mobileNumber)
    body.append('dialing_code', '+91')
    body.append('name', name)
    body.append('username', name)
    body.append('referral_code', referralCode)
    body.append('dialing_code', '+91')
    body.append('password', password)
    body.append('email', email)

    _makeAxiosPostRequestWithoutAuth(endpoint.singUp, body).then((res) => {
      // console.log(res)
      setEmail('')
      setReferralCode('');
      setDailingCode('');
      setMobileNumber('');
      setName('')
      setLoading(false)
      navigation.navigate('SignupOtp', { numb: mobileNumber, name: name, dailingCode: dailingCode, email: email, password: password, referral: referralCode })
    }).catch((error) => {
      console.log(error)
      setLoading(false)
      Alert.alert(error.respone.message)

    })
  }

  return (
    <ScrollView
    style={{ backgroundColor: 'white',  }}
    contentContainerStyle={{ paddingBottom:330}}
  >
      <View style={{ top: 10, left: 10 }}>
        <Logo width={250} height={50} left={50} right={0} top={20} />
        <Text style={{ fontSize: 23, color: "black", fontWeight: 'bold', fontFamily: "", top: 80, left: 80 }}>  Create Account </Text>
      </View>
      <View style={{ top: 150 }}>
        <View style={{ borderWidth: 1, borderColor: 'white', width: '92%', left: 15, backgroundColor: "white", shadowColor: "black", shadowOpacity: 1, shadowOffset: { width: 1.5, height: 1.5 }, elevation: 6, shadowRadius: 1, borderRadius: 5 }}>
          {focus === 1 ? (<Text style={{ color: 'black', position: "absolute" }}> First Name</Text>) : null}
          <TextInput
            value={name}
            onFocus={() => setFocus(1)}
            onBlur={() => setFocus(0)}
            onChangeText={setName}
            style={{ top: focus === 1 ? 5 : 0, color: 'black' }}
            placeholder={focus === 1 ? null : 'First Name :'}
            placeholderTextColor={'black'}
          />
        </View>
        <View style={{ borderWidth: 1, borderColor: 'white', width: '92%', left: 15, backgroundColor: "white", shadowColor: "black", shadowOpacity: 1, shadowOffset: { width: 1.5, height: 1.5 }, elevation: 6, shadowRadius: 1, borderRadius: 5, top: 20 }}>
          {focus === 2 ? (<Text style={{ color: 'black', position: "absolute" }}> Email Address</Text>) : null}

          <TextInput
            value={email}
            onFocus={() => setFocus(2)}
            onBlur={() => setFocus(0)}
            onChangeText={setEmail}
            placeholder={focus === 2 ? null : 'Email address :'}
            style={{ top: focus === 2 ? 5 : 0, color: 'black' }}
            placeholderTextColor={'black'}
            keyboardType='email-address'
          />
        </View>
        <View style={{ borderWidth: 1, borderColor: 'white', width: '92%', left: 15, backgroundColor: "white", shadowColor: "black", shadowOpacity: 1, shadowOffset: { width: 1.5, height: 1.5 }, elevation: 6, shadowRadius: 1, borderRadius: 5, top: 40 }}>
          {focus === 3 ? (<Text style={{ color: 'black', position: "absolute" }}> Mobile Number</Text>) : null}

          <TextInput
            value={mobileNumber}
            onFocus={() => setFocus(3)}
            onBlur={() => setFocus(0)}
            onChangeText={setMobileNumber}
            placeholder={focus === 3 ? null : 'Mobile Number :'}
            style={{ top: focus === 3 ? 5 : 0, color: 'black' }}

            placeholderTextColor={'black'}
          />
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: 'white', width: '92%', left: 15, backgroundColor: "white", shadowColor: "black", shadowOpacity: 1, shadowOffset: { width: 1.5, height: 1.5 }, elevation: 6, shadowRadius: 1, borderRadius: 5, top: 60 }}>
          {focus === 4 ? (<Text style={{ color: 'black', position: "absolute" }}> Password</Text>) : null}

          <TextInput
            value={password}
            onFocus={() => setFocus(4)}
            onBlur={() => setFocus(0)}
            onChangeText={setPassword}
            style={{ color: "black", width: 300, top: focus === 4 ? 5 : 0 }}
            placeholder={focus === 4 ? null : 'Password :'}
            placeholderTextColor={'black'}
          />
          <Icon name='ios-eye' color="black" size={25} style={{ top: 10, left: 0 }} />
        </View>

        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: 'white', width: '92%', left: 15, backgroundColor: "white", shadowColor: "black", shadowOpacity: 1, shadowOffset: { width: 1.5, height: 1.5 }, elevation: 6, shadowRadius: 1, borderRadius: 5, top: 80 }}>
          {focus === 5 ? (<Text style={{ color: 'black', position: "absolute" }}> referral Code</Text>) : null}
          <TextInput
            value={referralCode}
            onFocus={() => setFocus(5)}
            onBlur={() => setFocus(0)}
            onChangeText={setReferralCode}
            style={{ color: "black", width: 300, top: focus === 5 ? 5 : 0 }}
            placeholder={focus === 5 ? null : 'referral Code'}
            placeholderTextColor={'black'}
          />
        </View>
      </View>

      <View style={{ top: 250, left: 10 }}>
        <CheckBox
          isChecked={checked}
          onClick={() => checked ? setChecked(false) : setChecked(true)}
          checkBoxColor={checked ? '#27AAE1' : 'black'}
          rightText='I aaccept all the term & condition'
          rightTextStyle={{ color: "#27AAE1", fontSize: 15, bottom: 2.5 }}
        />
      </View>
      <TouchableOpacity onPress={() => signUp()} disabled={checked ? false : true} style={{ top: 280, borderRadius: 5, width: '92%', left: 13, backgroundColor: checked ? "#27AAE1" : 'grey', shadowColor: "black", shadowOffset: { width: 10, height: 10 }, shadowOpacity: 10, shadowRadius: 10, elevation: 5 }}>
        <Text style={{ textAlign: "center", margin: 10, color: "white", fontSize: 18 }} > Register Now </Text>
      </TouchableOpacity>
      <Text style={{ top: 300, left: 80, color: "black" }}> Already Have Account ?<Text style={{ color: "#27AAE1" }} onPress={() => navigation.goBack()}>Sign in</Text> </Text>
      {
        loading ? (<View style={{ bottom: 100}}>
          <LoadingScreen />
        </View>) : null
      }

    </ScrollView>
  )
}

export default CeateAccountPage