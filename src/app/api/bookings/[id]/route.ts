import { connectDb } from "@/config";
import Booking from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: any
) {
    try {
        await connectDb();

        const booking = await Booking.findById(params.id)
            .populate('celebrityId', 'name imageUrl profession');

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(booking);
    } catch (error: any) {
        console.error("Booking fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch booking" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: any
) {
    try {
        const body = await req.json();
        await connectDb();

        const booking = await Booking.findById(params.id);

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Validate status transitions
        if (body.status) {
            const validTransitions: { [key: string]: string[] } = {
                pending: ['approved', 'rejected'],
                approved: ['completed', 'rejected'],
                rejected: [],
                completed: []
            };

            if (!validTransitions[booking.status].includes(body.status)) {
                return NextResponse.json(
                    { error: `Cannot transition from ${booking.status} to ${body.status}` },
                    { status: 400 }
                );
            }
        }

        // Update booking
        Object.assign(booking, body);
        await booking.save();
        await booking.populate('celebrityId', 'name imageUrl profession');

        return NextResponse.json(booking);
    } catch (error: any) {
        console.error("Booking update error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update booking" },
            { status: 400 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: any
) {
    try {
        await connectDb();

        const booking = await Booking.findById(params.id);

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Only allow cancellation of pending bookings
        if (!booking.canCancel()) {
            return NextResponse.json(
                { error: "Cannot cancel this booking" },
                { status: 400 }
            );
        }

        await booking.deleteOne();

        return NextResponse.json(
            { message: "Booking cancelled successfully" }
        );
    } catch (error: any) {
        console.error("Booking deletion error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to cancel booking" },
            { status: 500 }
        );
    }
}
