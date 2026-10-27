//state manager
//redux - due to prop drilling , it moves entire application's state into a global location called store
//the store -> action -> reducers(updates the state)
// useSelecter(), useDispatch()
// - all list of properties
// - count
//-search filters
//-loading flag
// - error

import { createSlice } from "@reduxjs/toolkit";
import { object } from "prop-types";

const propertySlice = createSlice({
    name: "property",
    initialState: {
        properties: [],
        totalProperties: 0,
        searchParams: {},
        error: null,
        loading: true
    },
    reducers: {
        getRequest(state) {
            state.loading = true;
        },
        getProperties(state, action) {
            state.properties = action.payload.data;
            state.totalProperties = action.payload.all_properties;
            state.loading = false;
        },
        updateSearchParams: (state, action) => {
            state.searchParams = Object.keys(action.payload).length === 0 ? {} : {
                ...state.searchParams,
                ...action.payload
            }
        },
        getErrors(state, action) {
            state.error = action.payload
        }
    }
})

export const propertyAction = propertySlice.actions

export default propertySlice;