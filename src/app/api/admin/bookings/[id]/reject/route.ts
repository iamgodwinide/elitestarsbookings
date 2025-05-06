import { connectDb } from "@/config";
import Booking from "@/models/Booking";
import Celebrity from "@/models/Celebrity";
import { sendBookingStatusUpdate } from "@/lib/emails";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: any
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();

        const booking = await Booking.findById(params.id);
        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Only allow rejecting pending bookings
        if (booking.status !== 'pending') {
            return NextResponse.json(
                { error: `Cannot reject booking with status: ${booking.status}` },
                { status: 400 }
            );
        }

        // Update booking status
        booking.status = 'rejected';
        await booking.save();

        // Get celebrity details for email
        const celebrity = await Celebrity.findById(booking.celebrityId);
        if (!celebrity) {
            throw new Error('Celebrity not found');
        }

        // Send status update email
        try {
            await sendBookingStatusUpdate({
                booking: booking.toObject(),
                celebrity: {
                    name: celebrity.name,
                    profession: celebrity.profession
                }
            });
        } catch (error) {
            console.error('Failed to send status update email:', error);
            // Don't throw error here, we still want to return the booking
        }

        // Return updated booking
        const updatedBooking = await Booking.findById(params.id)
            .populate('celebrityId', 'name imageUrl profession');

        return NextResponse.json({
            message: "Booking rejected successfully",
            booking: updatedBooking
        });
    } catch (error: any) {
        console.error("Reject booking error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to reject booking" },
            { status: 500 }
        );
    }
}
