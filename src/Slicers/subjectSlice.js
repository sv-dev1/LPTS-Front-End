import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value:[],
}

export const subjectSlice = createSlice({
    name:'subject',
    initialState,
    reducers: {
        addAllSubjects : (state, action)=>{
            console.log("action" , state)
            state.value =[ ...action.payload]
        },
        // addOneSubject : (state, action)=>{
        //     console.log("action" , state)
        //     state.value = action.payload
        // },
        // removeOneSubject : (state, action)=>{
        //     console.log("action" , state)
        //     state.value = action.payload
        // },
        deleteAllSubjects : (state)=>{
            state.value = []
        },
    },
})

export const {addAllSubjects , deleteAllSubjects } = subjectSlice.actions;

export default subjectSlice.reducer;