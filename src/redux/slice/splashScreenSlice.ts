import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSplash: true
}


const splashScreenSlice = createSlice({
    name: 'showSplash',
    initialState,
    reducers: {
        setShowSplash: (state, action) => {
            state.showSplash = action.payload
        }
    }
})

export const { setShowSplash } = splashScreenSlice.actions
export const selectShowSplash = (state: any) => state.showSplash.showSplash
export default splashScreenSlice.reducer