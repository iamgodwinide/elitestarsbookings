import { connectDb } from "@/config";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: any
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { status, notes } = body;

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

        await connectDb();

        const booking = await Booking.findById(params.id)
            .populate('celebrityId', 'name imageUrl');

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Validate status transitions
        const validTransitions: { [key: string]: string[] } = {
            pending: ['approved', 'rejected'],
            approved: ['completed', 'rejected'],
            rejected: [],
            completed: []
        };

        if (!validTransitions[booking.status].includes(status)) {
            return NextResponse.json(
                { error: `Cannot transition from ${booking.status} to ${status}` },
                { status: 400 }
            );
        }

        // Update booking status and notes
        booking.status = status;
        if (notes) {
            booking.notes = notes;
        }

        // If marking as completed, update payment status
        if (status === 'completed') {
            booking.paymentStatus = 'paid';
        }

        await booking.save();

        // TODO: Send email notification to customer about status change

        return NextResponse.json({
            message: "Booking status updated successfully",
            booking
        });
    } catch (error: any) {
        console.error("Booking status update error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update booking status" },
            { status: 500 }
        );
    }
}
