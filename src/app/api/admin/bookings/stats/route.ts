import { connectDb } from "@/config";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDb();

        // Get date range from query params
        const searchParams = req.nextUrl.searchParams;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const dateQuery: any = {};
        if (startDate) dateQuery.$gte = new Date(startDate);
        if (endDate) dateQuery.$lte = new Date(endDate);

        // Get basic stats
        const [
            totalBookings,
            totalRevenue,
            statusStats,
            serviceStats,
            dailyStats
        ] = await Promise.all([
            // Total bookings
            Booking.countDocuments(startDate || endDate ? { date: dateQuery } : {}),
            
            // Total revenue
            Booking.aggregate([
                ...(startDate || endDate ? [{ $match: { date: dateQuery } }] : []),
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // Bookings by status
            Booking.aggregate([
                ...(startDate || endDate ? [{ $match: { date: dateQuery } }] : []),
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        revenue: { $sum: "$amount" }
                    }
                }
            ]),

            // Bookings by service
            Booking.aggregate([
                ...(startDate || endDate ? [{ $match: { date: dateQuery } }] : []),
                {
                    $group: {
                        _id: "$service",
                        count: { $sum: 1 },
                        revenue: { $sum: "$amount" }
                    }
                }
            ]),

            // Daily booking stats for the last 30 days
            Booking.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 },
                        revenue: { $sum: "$amount" }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        return NextResponse.json({
            totalBookings,
            totalRevenue: totalRevenue[0]?.total || 0,
            statusStats: statusStats.reduce((acc: any, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    revenue: stat.revenue
                };
                return acc;
            }, {}),
            serviceStats: serviceStats.reduce((acc: any, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    revenue: stat.revenue
                };
                return acc;
            }, {}),
            dailyStats: dailyStats.map(stat => ({
                date: stat._id,
                count: stat.count,
                revenue: stat.revenue
            }))
        });
    } catch (error: any) {
        console.error("Booking stats error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch booking statistics" },
            { status: 500 }
        );
    }
}
