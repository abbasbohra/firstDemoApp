import { View, Text, Image, Animated, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { selectShowSplash, setShowSplash } from '../../redux/slice/splashScreenSlice'
import { logIn, logOut } from '../../redux/slice/LoginScreenSlice'
import LoadingScreen from '../../component/LoadingScreen'



const SplashScreen = ({ navigation }: { navigation: any }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current
    const showSplash = useSelector(selectShowSplash)
    const dispatch = useDispatch()
    const Focused = useIsFocused()
    const [tocken, setTocken] = useState('')
    const [loading, setLoading] = useState(false)

    const animationStart = () => {
        Animated.timing(fadeAnim, {
            toValue: 1.5,
            useNativeDriver: false,
            duration: 3000,
        }).start();
    }

    // console.log('splash', showSplash)

    const getTocken = async () => {
        const data: any = await AsyncStorage.getItem('ACCESS_TOKEN')
        const tocken = JSON.parse(data)
        // console.log('tockrn======>', tocken)

        setTocken(tocken)
    }
    useEffect(() => {
        getTocken()
        tocken ? dispatch(logIn(true)) : dispatch(logOut(false))
        animationStart();
        setTimeout(() => {
            dispatch(setShowSplash(false))
            tocken ? navigation.navigate('Main') : navigation.navigate('Auth')
        }, 2000)
    }, [Focused])

    return (
        <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", alignContent: "center" }}>

            <Animated.Image
                source={{ uri: "https://i.ibb.co/XLTLNPt/fashion-Leo-Logo-With-Name-56bc05da.png" }}
                style={{ width: 200, height: 35, transform: [{ scale: fadeAnim }], bottom: 20 }}
            />
            {/* <Animated.View style={{ transform: [{ scale: fadeAnim }] ,backgroundColor:"red"}}>
                <Text style={{ color: "black" }}> Hello </Text>
            </Animated.View> */}
            {loading ? (<LoadingScreen />) : null}
        </View>
    )
}

export default SplashScreen