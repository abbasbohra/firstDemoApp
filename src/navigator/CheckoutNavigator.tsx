import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CeateAccountPage from "../Example/AuthScreen/CreateAccountPage";
import SelectAddress from "../Example/CheckOutScreens/SelectAddress";
import ReviewOrder from "../Example/CheckOutScreens/ReviewOrder";
import SelectPaymentMethod from "../Example/CheckOutScreens/SelectPaymentMethod";
import coupon from "../Example/CheckOutScreens/coupon";

const checkOutStack = createStackNavigator();

const CheckOutNavigator = () => {
    return (
        <checkOutStack.Navigator initialRouteName="SelectAddress">
            <checkOutStack.Group screenOptions={{ headerShown: false }} >
                <checkOutStack.Screen name="SelectAddress" component={SelectAddress} />
                <checkOutStack.Screen name="ReviewOrder" component={ReviewOrder} />
                <checkOutStack.Screen name="SelectPaymentMethod" component={SelectPaymentMethod} />
                <checkOutStack.Screen name="coupon" component={coupon} />
            </checkOutStack.Group>
        </checkOutStack.Navigator>

    );
};

export default CheckOutNavigator;