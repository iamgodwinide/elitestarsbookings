import mongoose, { Schema } from 'mongoose';

export const BookingSchema = new Schema({
    celebrityId: {
        type: Schema.Types.ObjectId,
        ref: 'Celebrity',
        required: [true, 'Celebrity is required']
    },
    service: {
        type: String,
        required: [true, 'Service type is required'],
        enum: {
            values: ['meet-and-greet', 'vip-fan-cards', 'donation', 'subscription'],
            message: '{VALUE} is not a valid service type'
        }
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    customerEmail: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    customerPhone: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'approved', 'rejected', 'completed'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    date: {
        type: Date,
        required: [true, 'Booking date is required'],
        validate: {
            validator: function(value: Date) {
                return value > new Date();
            },
            message: 'Booking date must be in the future'
        }
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ['pending', 'paid', 'refunded'],
            message: '{VALUE} is not a valid payment status'
        },
        default: 'pending'
    },
    paymentMethod: {
        type: String,
    },
    transactionId: {
        type: String,
        sparse: true,
        trim: true
    },
    metadata: {
        type: Map,
        of: String,
        default: new Map()
    }
}, {
    timestamps: true
});

// Indexes
BookingSchema.index({ celebrityId: 1, date: 1 });
BookingSchema.index({ customerEmail: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });

// Virtual populate for celebrity details
BookingSchema.virtual('celebrity', {
    ref: 'Celebrity',
    localField: 'celebrityId',
    foreignField: '_id',
    justOne: true
});

// Methods
BookingSchema.methods.canCancel = function() {
    const now = new Date();
    const bookingDate = new Date(this.date);
    const hoursDifference = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= 24 && this.status === 'pending';
};

// Middleware
BookingSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'completed') {
        this.paymentStatus = 'paid';
    }
    next();
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking;
