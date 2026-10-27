import mongoose from 'mongoose';
// import { Property } from './propertymodel.js';
const bookingSchema = new mongoose.Schema(
    {
        property :{
            type : mongoose.Schema.ObjectId,
            ref : "Property",
            required : [true, "booking must belong to a property"]
        },
        user : {
            type: mongoose.Schema.ObjectId,
            ref : "User",
            required: [true, "booking must belong to a user"]
        },
        price : {
            type : Number,
            required:[true, "booking must have a price"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        paid : {
            type: Boolean,
            default: true
        },
        fromDate : {
            type: Date
        },
        toDate : {
            type: Date
        },
        guests : {
            type: Number
        },
        numberOfnights: {
            type: Number
        }
    },
    {timestamps: true}
);

bookingSchema.pre(/^find/, function(){
    this.populate("user");
    this.populate({        //populate fetches the real user and real property instead of id
        path: "property",
        select: " MaximumGuest images propertyName address"
    });
})

const Booking = mongoose.model("Booking", bookingSchema);

export {Booking};