import { connectDb } from "@/config";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Import schemas
import { CelebritySchema } from "@/models/Celebrity";
import { BookingSchema } from "@/models/Booking";

// Ensure models are registered
let Celebrity: any;
let Booking: any;

try {
    Celebrity = mongoose.model('Celebrity');
} catch {
    Celebrity = mongoose.model('Celebrity', CelebritySchema);
}

try {
    Booking = mongoose.model('Booking');
} catch {
    Booking = mongoose.model('Booking', BookingSchema);
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();

        // Get filter params
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const service = searchParams.get('service') || '';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build query
        const query: any = {};

        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { customerEmail: { $regex: search, $options: 'i' } },
                { customerPhone: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        if (service) {
            query.service = service;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Get total count
        const total = await Booking.countDocuments(query);

        // Get paginated results
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Manually populate celebrity data
        const populatedBookings = await Promise.all(bookings.map(async (booking:any) => {
            const bookingObj = booking.toObject();
            if (bookingObj.celebrityId) {
                const celebrity = await Celebrity.findById(bookingObj.celebrityId)
                    .select('name imageUrl profession');
                if (celebrity) {
                    bookingObj.celebrity = celebrity.toObject();
                }
            }
            return bookingObj;
        }));

        // Get summary stats
        const [stats] = await Booking.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    avgAmount: { $avg: "$amount" },
                    pendingCount: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    approvedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
                    },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    rejectedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                    }
                }
            }
        ]);

        return NextResponse.json({
            bookings: populatedBookings,
            stats: stats || {
                totalAmount: 0,
                avgAmount: 0,
                pendingCount: 0,
                approvedCount: 0,
                completedCount: 0,
                rejectedCount: 0
            },
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error("Get bookings error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
