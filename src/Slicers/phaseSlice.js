import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value:[],
}

export const phaseSlice = createSlice({
    name:'phase',
    initialState,
    reducers: {
        addAllphases : (state, action)=>{
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
        deleteAllphases : (state)=>{
            state.value = []
        },
    },
})

export const {addAllphases , deletephase } = phaseSlice.actions;

export default phaseSlice.reducer;