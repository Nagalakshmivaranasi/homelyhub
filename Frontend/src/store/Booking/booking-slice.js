//managing booking state

//store all bookings
//store individual booking details
//track the API loading status
// add new bookings when booking is created
//update existing bookings when booking is updated

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    bookings: [],
    bookingDetails: {},
    loading: false,
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingRequest(state) {
            state.loading=true
        },
        //stores all the bookings recieved from the api
        setBookings(state, action) {
            state.bookings= action.payload
            state.loading=false
        },
        
        addBooking:(state, action)=> {
            state.bookings.push(action.payload);
        },
        setBookingDetails:(state, action)=> {
            state.bookingDetails = action.payload.bookings;
        }
    }

})

export const {setBookingDetails, addBooking, setBookings} = bookingSlice.actions;
export default bookingSlice;