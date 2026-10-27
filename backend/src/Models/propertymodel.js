import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, "please enter your property name"],
    },
    description: {
        type: String,
        required: [true, " please give information about your property"]
    },
    extraInfo: {
        type: String,
        default: "checkin on time.good services"
    },
    propertyType: {
        type: String,
        enum: ["House", "Hotel", "Flat", "Guest House"],
        default: "House"
    },
    RoomType: {
        type: String,
        enum: ["Anytype", "Room", "Entire home"],
        default: "Anytype"
    },
    MaximumGuest: {
        type: Number,
        required: [true, "please give the maximum no of guest that can occupy"]
    },
    amenities: [{
        name: {
            type: String,
            required: true,
            enum: ["wifi", "kitchen", "AC", "Washing machine", "TV", "pool", "free parking"]
        },
        icon: {
            type: String,
            required: true
        }
    }],
    images: {
        type: [
            {
                public_id: {
                    type: String
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        validate: {
            validator: function (arr) {
                return arr.length >= 6;
            },
            message: "The image must contain atleast 6 images"
        }
    },
    price: {
        type: Number,
        required: [true, "please enter the price per night"],
        default: 500
    },
    address: {
        area: String,
        city: String,
        state: String,
        pincode: Number
    },
    currentBookings: [
        {
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            },
            fromDate: {
                type: Date
            },
            toDate: {
                type: Date
            },
            userId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    slug: String,
    checkInTime: { type: String, default: "11:00" },
    checkOutTime: { type: String, default: "13:00" }

})

propertySchema.pre("save", function (next) {
    this.slug = slugify(this.propertyName, { lower: true });
    next();
})

propertySchema.pre("save", function (next) {
    this.address.city = this.address.city.toLowerCase().replaceAll(" ", "");
    next();
})

const Property = mongoose.model("Property", propertySchema);
// const Property = mongoose.model.Property || mongoose.model("property", propertySchema);
export { Property };