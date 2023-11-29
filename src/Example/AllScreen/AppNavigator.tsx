import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../AllScreen/SplashScreen";
import AuthNavigator from "../../navigator/AuthNavigator";
import MainNavigator from "../../navigator/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux'
import CheckOutNavigator from "../../navigator/CheckoutNavigator";
import { selectShowSplash, setShowSplash } from "../../redux/slice/splashScreenSlice";
// import { setShowLogin, selectShowLogin } from '../../redux/slice/LoginScreenSlice'j
import { RootState } from "../../redux/store";
import HomePageStack from "../../navigator/HomePageStack";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { loggedIn } = useSelector((state: RootState) => state.loggedIn);
    const { showSplash } = useSelector((state: RootState) => state.showSplash)
    console.log('login', loggedIn);
    console.log('splash', showSplash)
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {showSplash ? <Stack.Screen name="Splash" component={SplashScreen} /> : null}
                {loggedIn ? <Stack.Screen name="Main" component={HomePageStack} /> :
                    <Stack.Screen name="Auth" component={AuthNavigator} />}
                <Stack.Screen name="CheckOut" component={CheckOutNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;