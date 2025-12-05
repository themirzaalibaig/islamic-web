import type { User } from "@/types/user"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
export type AuthState = {
    isAuthenticated: boolean
    verificationEmail: string | null
    forgotPasswordEmail: string | null
    user: User | null
    token: {
        accessToken: string
        refreshToken: string
    } | null
}

const initialState: AuthState = {
    isAuthenticated: false,
    verificationEmail: null,
    forgotPasswordEmail: null,
    user: null,
    token: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{
                user: User
                token: { accessToken: string; refreshToken: string }
            }>
        ) => {
            state.isAuthenticated = true
            state.user = action.payload.user
            state.token = action.payload.token
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            state.token = null
        },
        refreshToken: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            if (state.token) {
                state.token.accessToken = action.payload.accessToken
                state.token.refreshToken = action.payload.refreshToken
            }
        },
        setVerificationEmail: (state, action: PayloadAction<string>) => {
            state.verificationEmail = action.payload
        },
        setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
            state.forgotPasswordEmail = action.payload
        },
    },
})

export const { login, logout, refreshToken, setVerificationEmail, setForgotPasswordEmail } = authSlice.actions
export const authReducer = authSlice.reducer
