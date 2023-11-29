import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import Header from '../../component/Header'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native';
const OrderSucessfull = ({ }) => {
    const navigation: any = useNavigation()
    return (
        <View style={{ flex: 1, backgroundColor: '#3490DC', justifyContent: 'center', alignItems: 'center' }}>
            {/* <Header onpress={() => navigation.navigate('HomePage')} title='ORDER' cartleft={0} showShadow={false} titleStyle={{ top: 20, left: 120, fontSize: 20, color: 'black', fontWeight: '500' }} /> */}
            {/* <ImageBackground style={{ width: '100%', height: Dimensions.get('screen').height }} resizeMode='stretch' source={require('../../component/IconImage/backgroundcolorshade.jpg')}> */}

            <View style={{top:50}}>
                <LottieView source={require('../../component/Animations/Animation - 1697093463307.json')} style={{ width: 200, height: 200, top: -100,left:30 }} autoPlay loop speed={1} />
                <Text style={{ color: 'white', fontSize: 30, top: -110, fontWeight: '700', textAlign: 'center' }}>Thank You</Text>
                <TouchableOpacity onPressOut={() => navigation.navigate('Home')} style={{ width: 250, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, justifyContent: 'center', alignContent: "center", alignItems: 'center', borderRadius: 30, top: -80 }}>
                    <Text style={{ color: "black", fontSize: 15, fontWeight: '500', padding: 13 }}>  Countine Shopping  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPressOut={() => navigation.navigate('Orderhistory')} style={{ width: 250, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, justifyContent: 'center', alignContent: "center", alignItems: 'center', borderRadius: 30, top: -50 }}>
                    <Text style={{ color: "black", fontSize: 15, fontWeight: '500', padding: 13, textAlign: 'center' }}>  Order Details </Text>
                </TouchableOpacity>
                {/* </ImageBackground> */}
                <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#3490DC'} />
            </View>

        </View>
    )
}
export default OrderSucessfull