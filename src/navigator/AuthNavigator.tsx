import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../Example/AuthScreen/LoginPage";
import LoginWithEmail from "../Example/AuthScreen/LoginWithEmail";
import SignupOtp from "../Example/AuthScreen/SignupOtp";
import CeateAccountPage from "../Example/AuthScreen/CreateAccountPage";

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName="LoginPage">
            <AuthStack.Group screenOptions={{ headerShown: false }} >
                <AuthStack.Screen name="LoginPage" component={LoginPage} />
                <AuthStack.Screen name="LoginWithEmail" component={LoginWithEmail} />
                <AuthStack.Screen name="SignupOtp" component={SignupOtp} />
                <AuthStack.Screen name="CreateAccount" component={CeateAccountPage} />

            </AuthStack.Group>
        </AuthStack.Navigator>

    );
};

export default AuthNavigator;