import { View, Text, Dimensions, Image } from 'react-native'
import React from 'react'
// import AnimatedLoader from 'react-native-animated-loader'
import LottieView from 'lottie-react-native';
const LoadingScreen = () => {
    return (
        <View style={{ backgroundColor: 'white', height: Dimensions.get('screen').height, }}>
            <View style={{ justifyContent: "center", alignItems: 'center', alignContent: 'center', top: 260 }}>
                <LottieView source={require('./Animations/Animation - 1699003455610.json')} speed={1} autoPlay loop style={{width:250,height:250}} />
            </View>
        </View>
    )
}

export default LoadingScreen