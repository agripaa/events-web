import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import axios from 'axios';

const initialStore = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    msg: ""
};

export const LoginUser = createAsyncThunk('user/login', async(user, thunkAPI) => {
    try {
        const { email, password } = user;
        const res = await axios.post("http://localhost:5000/login", {
            email: email,
            password: password
        });
        console.log(res);
        return res.data;
    } catch (err) {
        if(err.response){
            const msg = err.response.msg;
            return thunkAPI.rejectWithValue(msg);
        }
    }
})

export const GetUser = createAsyncThunk('user/profile', async(user, thunkAPI) => {
    try {
        const res = await axios.get('http://localhost:5000/profile');
        return res.data;
    } catch (err) {
        if(err.response){
            const msg = err.response.msg;
            return thunkAPI.rejectWithValue(msg);
        }
    }
})

export const LogOut = createAsyncThunk('user/logout', async() => {
    await axios.delete('http://localhost:5000/logout')
})

export const authSlice = createSlice({
    name: 'auth',
    initialState: {},
    reducers: {
        reset: (state) => initialStore
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isErrorLoading = true;
        })
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.msg = action.payload;
        })
        builder.addCase(GetUser.pending, (state) => {
            state.isErrorLoading = true;
        })
        builder.addCase(GetUser.fulfilled, (state, action) => {
            state.isLoading = false; 
            state.isSuccess = true;
            state.user = action.payload;
        })
        builder.addCase(GetUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.msg = action.payload;
        })
    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;