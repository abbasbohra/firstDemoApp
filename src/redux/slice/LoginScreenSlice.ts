import { createSlice } from "@reduxjs/toolkit";

type user_info = {
    loggedIn: null
}

const initialState = {
    loggedIn: null
} as user_info;

const LoginScreenShow = createSlice({
    name: "mySlice",
    initialState,
    reducers: {
        logIn: (state,actions) => {
            state.loggedIn =actions.payload
        },
        logOut: (state,actions) => {
            state.loggedIn = actions.payload
        }
    }
})

export const { logIn, logOut } = LoginScreenShow.actions;
export default LoginScreenShow.reducer