import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value:[],
}

export const categorySlice = createSlice({
    name:'category',
    initialState,
    reducers: {
        addAllcategory : (state, action)=>{
            //console.log("action" , state)
            state.value = [...action.payload]
            console.log("state" , state.value)
        },
        // addOnephase : (state, action)=>{
        //     console.log("action" , state)
        //     state.value = action.payload
        // },
        // removeOnephase : (state, action)=>{
        //     console.log("action" , state)
        //     state.value = action.payload
        // },
        deleteAllcategory : (state)=>{
            state.value = []
        },
    },
})

export const {addAllcategory , deletecategory } = categorySlice.actions;

export default categorySlice.reducer;