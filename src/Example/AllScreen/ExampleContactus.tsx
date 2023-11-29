import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Header from '../../component/Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ExampleContactus = ({ navigation }: { navigation: any }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [focus, setFocus] = useState(0)

    const submitRequest = () => {
        if (!name) {
            setNameError(true);
        } else {
            setNameError(false);
        }

        if (!email) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }

        if (!message) {
            setMessageError(true);
        } else {
            setMessageError(false);
        }

        if (name && email && message) {
            Alert.alert('Confirm', `Your Request is sumbmit and Respone will sent to mention email ${email}`, [
                {
                    text: 'ok',
                    style: 'default',
                    onPress: () => { setEmail(''), setMessage(''), setName('') }
                },
                {
                    text: 'cancel',
                    style: 'cancel'
                }
            ])
        }

    }

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: "#F5F5F5", paddingBottom: 150 }}>

            <Header title='Contact us' showShadow={true} searchLeft={5} cartleft={-10} onpress={() => navigation.goBack()} titleStyle={{}} />
            <View style={{ alignItems: 'center', justifyContent: "center", alignContent: "center" }}>
                <Icon name='card-account-mail' color={'#27AAE1'} size={130} style={{ top: 30 }} />
            </View>
            <View style={{ top: 50, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: Dimensions.get('screen').width, left: 20, top: 3 }}>
                    <View style={{ width: '90%', borderWidth: 0.5, borderColor: 'black' }}>
                        {focus === 1 ? (<Text style={{ color: "black", position: "absolute", left: 5 }}> Name </Text>) : null}
                        <TextInput
                            value={name}
                            onFocus={() => setFocus(1)}
                            onBlur={() => setFocus(0)}
                            onChangeText={setName}
                            placeholder={focus === 1 ? null : 'Name'}
                            placeholderTextColor={'black'}
                            style={{ top: 3, color: 'black', left: 5 }}
                        />
                    </View>
                    {messageError && <Text style={{ color: 'red' }}> Please Enter name </Text>}

                </View>
                <View style={{ width: Dimensions.get('screen').width, left: 20 }}>
                    <View style={{ width: '90%', borderWidth: 0.5, borderColor: 'black', top: 10 }}>
                        {focus === 2 ? (<Text style={{ color: "black", position: "absolute", left: 5 }}> Email </Text>) : null}

                        <TextInput
                            value={email}
                            onFocus={() => setFocus(2)}
                            onBlur={() => setFocus(0)}
                            onChangeText={setEmail}
                            placeholder={focus === 2 ? null : 'Email'}
                            placeholderTextColor={'black'}
                            style={{ top: 3, left: 5 }}
                            keyboardType='email-address'

                        />
                    </View>
                    {emailError && <Text style={{ color: 'red', top: 10 }}> Please Enter Email</Text>}
                </View>
                <View style={{ width: Dimensions.get('screen').width, left: 20 }}>
                    <View style={{ width: '90%', borderWidth: 0.5, borderColor: 'black', top: 20 }}>
                        {focus === 3 ? (<Text style={{ color: "black", position: "absolute", left: 5 }}> Messsage </Text>) : null}

                        <TextInput
                            value={message}
                            onFocus={() => setFocus(3)}
                            onBlur={() => setFocus(0)}
                            onChangeText={setMessage}
                            placeholder={focus === 3 ? null : 'Message'}
                            placeholderTextColor={'black'}
                            style={{ top: 3, left: 5 }}
                        />
                    </View>
                    {messageError && <Text style={{color:'red',top:20}}> Message lenght should be 5 to 50</Text>}
                </View>
            </View>
            <View style={{ top: 100, justifyContent: "center", alignItems: 'center' }}>
                <TouchableOpacity onPress={() => submitRequest()} style={{ backgroundColor: "#27AAE1", width: '90%', borderRadius: 10, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                    <Text style={{ color: "white", padding: 11, fontSize: 18, textAlign: 'center', fontWeight: "500" }}> Submit </Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}

export default ExampleContactus