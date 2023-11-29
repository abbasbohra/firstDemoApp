import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ExampleDeatil from '../Example/AllScreen/ExampleDeatil';
import ExampleCancelAllProduct from '../Example/AllScreen/ExampleCancelAllProduct';
import ExampleCart from '../Example/AllScreen/ExampleCart';
import ExampleChangePassword from '../Example/AllScreen/ExampleChangePassword';
// import ExampleCheckOut from '../Example/ExampleCheckOut';
import ExampleContactus from '../Example/AllScreen/ExampleContactus';
import ExampleFAQ from '../Example/AllScreen/ExampleFAQ';
import ExampleFeatureAllProduct from '../Example/AllScreen/ExampleFeatureAllProduct';
import ExamplProductByBrand from '../Example/AllScreen/ExampleProductByBrand';
import ExamplProductByDiscount from '../Example/AllScreen/ExampleProductByDiscount';
import ExampleFreshArrivalAllProduct from '../Example/AllScreen/ExampleFreshArrivalAllProduct';
import ExampleOrdercancel from '../Example/AllScreen/ExampleOrdercancel';
import ExampleProductByVendor from '../Example/AllScreen/ExampleProductByVendor';
// import ReviewOrder from '../Example/ExampleReviewOrder';
import ExampleSearch from '../Example/AllScreen/ExampleSearch';
import ExampleSuccessfull from '../Example/AllScreen/ExampleSuccessFull';
import ExampleTopAllProduct from '../Example/AllScreen/ExampleTopAllProduct';
import ExampleTrendingAllProduct from '../Example/AllScreen/ExampleTrendingAllProduct';
import ExampleWishlist from '../Example/AllScreen/ExampleWishlist';
import ExampleWomenCloths from '../Example/AllScreen/ExampleWomenCloths';
import Laungage from '../Example/AllScreen/Laungage';
import UserWallet from '../Example/AllScreen/UserWallet';
import AddAddress from '../Example/AllScreen/AddAddress';
import Address from '../Example/AllScreen/Address';
import EditProfile from '../Example/AllScreen/EditProfile';
import Profile from '../Example/AllScreen/Profile';
import Notifucations from '../Example/AllScreen/Notifucations';
import OrderHistory from '../Example/AllScreen/OrderHistory';
import OrderSucessfull from '../Example/AllScreen/OrderSucessfull';
import SignupOtp from '../Example/AuthScreen/SignupOtp';
import TrackOrder from '../Example/AllScreen/TrackOrder';
import Wishlist from '../Example/AllScreen/Wishlist';
import HomePage from '../Example/AllScreen/HomePage';
import MainNavigator from './MainNavigator';
import Example from '../Example/AllScreen/Example';
import ExampleCmsDetail from '../Example/AllScreen/ExampleCmsDetail';
import VendorFollowingList from '../Example/AllScreen/VendorFollowingList';
import ExampleTestimonial from '../Example/AllScreen/ExampleTestimonial';

const Homestack = createStackNavigator();
const HomePageStack = () => {
    return (
        <Homestack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
            <Homestack.Screen name='Home' component={MainNavigator} />
            <Homestack.Screen name='ExampleCart' component={ExampleCart} />
            <Homestack.Screen name='ExampleChangePassword' component={ExampleChangePassword} />
            {/* <Homestack.Screen name='ExampleCheckout' component={ExampleCheckOut} /> */}
            <Homestack.Screen name='ExampleContactus' component={ExampleContactus} />
            <Homestack.Screen name='ExampleFAQ' component={ExampleFAQ} />
            <Homestack.Screen name='ExampleFeatureAllProduct' component={ExampleFeatureAllProduct} />
            <Homestack.Screen name='ExampleProductByBrand' component={ExamplProductByBrand} />
            <Homestack.Screen name='ExampleAllOrdercancel' component={ExampleCancelAllProduct} />
            <Homestack.Screen name='ExampleProductByDiscount' component={ExamplProductByDiscount} />
            <Homestack.Screen name='ExampleFreshArrivalAllProduct' component={ExampleFreshArrivalAllProduct} />
            <Homestack.Screen name='ExampleOrderCancel' component={ExampleOrdercancel} />
            <Homestack.Screen name='ExampleProductByVendor' component={ExampleProductByVendor} />
            {/* <Homestack.Screen name='ExampleReviewOrder' component={ExampleReviewOrder} /> */}
            <Homestack.Screen name='ExampleSearch' component={ExampleSearch} />
            <Homestack.Screen name='ExampleSuccessfull' component={ExampleSuccessfull} />
            <Homestack.Screen name='ExampleTopAllProduct' component={ExampleTopAllProduct} />
            <Homestack.Screen name='ExampleTrendingAllProduct' component={ExampleTrendingAllProduct} />
            <Homestack.Screen name='ExampleWishlist' component={ExampleWishlist} />
            <Homestack.Screen name='ExampleWomenCloths' component={ExampleWomenCloths} />
            <Homestack.Screen name='Laungage' component={Laungage} />
            <Homestack.Screen name='UserWallet' component={UserWallet} />
            <Homestack.Screen name='AddAddress' component={AddAddress} />
            <Homestack.Screen name='ExampleDetail' component={ExampleDeatil} />
            <Homestack.Screen name='Address' component={Address} />
            <Homestack.Screen name='EditProfile' component={EditProfile} />
            <Homestack.Screen name='Profile' component={Profile} />
            <Homestack.Screen name='Notification' component={Notifucations} />
            <Homestack.Screen name='OrderHistory' component={OrderHistory} />
            <Homestack.Screen name='OrderSucessfull' component={OrderSucessfull} />
            <Homestack.Screen name='TrackOrder' component={TrackOrder} />
            <Homestack.Screen name='Wishlist' component={Wishlist} />
            <Homestack.Screen name='ExampleCancelAllProduct' component={ExampleCancelAllProduct} />
            <Homestack.Screen name='Example' component={Example} />
            <Homestack.Screen name='ExampleCmsDetail' component={ExampleCmsDetail} />
            <Homestack.Screen name='VendorFollowingsList' component={VendorFollowingList} />
            <Homestack.Screen name='ExampleTestimonial' component={ExampleTestimonial} />

        </Homestack.Navigator>
    )
}

export default HomePageStack