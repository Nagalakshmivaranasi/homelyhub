//create a slice name
//create initial state
//request starts
//property data recieved
//error occuurs
//export actions
//export slice

import { createSlice } from "@reduxjs/toolkit";

const propertyDetailsSlice = createSlice({
    name : "propertyDetails",
    initialState: {
        propertyDetails: null,
        loading: null,
        error: null
    },
    //reducers helps to change our redux state
    reducers : {
        getListRequest(state) {
            state.loading=true
        },
        getPropertiesDetails(state, action) {
            state.propertyDetails = action.payload;
            state.loading=false
        },
        getErrors(state, action) {
            state.error = action.payload;
            state.loading=false
        }
    }
})

export const propertyDetailsAction = propertyDetailsSlice.actions;
export default propertyDetailsSlice;