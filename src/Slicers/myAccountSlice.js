import {createSlice} from "@reduxjs/toolkit";
const initialState = {
    value:'',
}

export const myAccountSlice = createSlice({
    name:'myAccount',
    initialState,
    reducers: {
        updateMyAccount : (state, action)=>{
            console.log("action" , action)
            state.value = action.payload
        },
        deleteMyAccount : (state)=>{
            state.value = ''
        },
    },
})

export const {updateMyAccount , deleteMyAccount } = myAccountSlice.actions;

export default myAccountSlice.reducer;