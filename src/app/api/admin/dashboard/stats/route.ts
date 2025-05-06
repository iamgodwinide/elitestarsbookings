import { connectDb } from "@/config";
import Booking from "@/models/Booking";
import Celebrity from "@/models/Celebrity";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();

        const [
            totalCelebs,
            totalBookings,
            recentBookings,
            recentCelebs
        ] = await Promise.all([
            Celebrity.countDocuments(),
            Booking.countDocuments(),
            Booking.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('celebrityId', 'name imageUrl'),
            Celebrity.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name imageUrl profession')
        ]);

        const bookingStats = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        return NextResponse.json({
            totalCelebs,
            totalBookings,
            recentBookings,
            recentCelebs,
            bookingStats
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}
