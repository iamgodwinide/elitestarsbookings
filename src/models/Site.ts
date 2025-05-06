import mongoose, { Schema } from 'mongoose';

export const SiteSchema = new Schema({
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        trim: true,
        uppercase: true,
        enum: {
            values: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'],
            message: '{VALUE} is not a supported currency'
        },
        default: 'USD'
    }
}, {
    timestamps: true
});

const Site = mongoose.models.Site || mongoose.model('Site', SiteSchema);

export default Site;