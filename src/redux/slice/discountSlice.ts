import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    couponAmount: 0
}

const discountSlice = createSlice({
    name: "discount",
    initialState,
    reducers: {
        setCouponAmount: (state, action) => {
            state.couponAmount = action.payload
        }
    }
})

export const { setCouponAmount } = discountSlice.actions
export const selectCouponAmount = (state: any) => state.discount.couponAmount
export default discountSlice.reducer
