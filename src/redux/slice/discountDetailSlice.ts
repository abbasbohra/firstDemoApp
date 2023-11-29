import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CouponDetail: null
}

const discountDeatilSlice = createSlice({
    name: 'CouponData',
    initialState,
    reducers: {
        setDiscountDetail: (state, action) => {
            state.CouponDetail = action.payload
        }
    }
})

export const { setDiscountDetail } = discountDeatilSlice.actions
export default discountDeatilSlice.reducer