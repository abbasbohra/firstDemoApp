import { createStore, combineReducers } from 'redux';
import discountSlice from '../slice/discountSlice';
import splashScreenSlice from '../slice/splashScreenSlice';
import LoginScreenSlice from '../slice/LoginScreenSlice';
import discountDetailSlice from '../slice/discountDetailSlice';
const rootReducer = combineReducers({
    showSplash: splashScreenSlice,
    discount: discountSlice,
    loggedIn: LoginScreenSlice,
    CouponDetail: discountDetailSlice
})

export default rootReducer;
