import { connectDb } from "@/config";
import { NextRequest, NextResponse } from "next/server";
import Celebrity from "@/models/Celebrity";
import mongoose from "mongoose";

// Define the application schema
const ApplicationSchema = new mongoose.Schema({
    celebrityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Celebrity',
        required: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['meet-greet', 'vip-card', 'donate']
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    cardType: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum', 'event']
    },
    donationAmount: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['crypto', 'bank']
    },
    message: String,
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model if it doesn't exist
const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const data = await req.json();
        const {
            celebrityId,
            serviceType,
            fullName,
            email,
            phone,
            date,
            cardType,
            donationAmount,
            paymentMethod,
            message
        } = data;

        // Validate celebrity exists
        const celebrity = await Celebrity.findById(celebrityId);
        if (!celebrity) {
            return NextResponse.json(
                { error: 'Celebrity not found' },
                { status: 404 }
            );
        }

        // Validate required fields based on service type
        if (serviceType === 'meet-greet' && !date) {
            return NextResponse.json(
                { error: 'Date is required for meet & greet applications' },
                { status: 400 }
            );
        }

        if (serviceType === 'vip-card' && !cardType) {
            return NextResponse.json(
                { error: 'Card type is required for VIP fan card applications' },
                { status: 400 }
            );
        }

        if (serviceType === 'donate' && !donationAmount) {
            return NextResponse.json(
                { error: 'Donation amount is required for donation applications' },
                { status: 400 }
            );
        }

        // Create the application
        const application = new Application({
            celebrityId,
            serviceType,
            fullName,
            email,
            phone,
            date: date ? new Date(date) : undefined,
            cardType,
            donationAmount: donationAmount ? Number(donationAmount) : undefined,
            paymentMethod,
            message
        });

        await application.save();

        return NextResponse.json({
            message: 'Application submitted successfully',
            applicationId: application._id
        });
    } catch (error: any) {
        console.error('Error creating application:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { error: 'Validation failed', errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to submit application' },
            { status: 500 }
        );
    }
}
