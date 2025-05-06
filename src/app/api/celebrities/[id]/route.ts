import { connectDb } from "@/config";
import Celebrity from "@/models/Celebrity";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(
    request: NextRequest,
    { params }: any
) {
    try {
        await connectDb();

        // Ensure we have an ID
        if (!params?.id) {
            console.error('No ID provided in params');
            return NextResponse.json(
                { error: 'Celebrity ID is required' },
                { status: 400 }
            );
        }

        const id = params.id;
        console.log('Processing request for celebrity ID:', id);

        // Validate MongoDB ObjectId
        if (!Types.ObjectId.isValid(id)) {
            console.error('Invalid MongoDB ObjectId:', id);
            return NextResponse.json(
                { error: 'Invalid celebrity ID format' },
                { status: 400 }
            );
        }

        // Find the celebrity
        const celebrity = await Celebrity.findById(id);
        if (!celebrity) {
            console.error('Celebrity not found with ID:', id);
            return NextResponse.json(
                { error: 'Celebrity not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(celebrity);
    } catch (error) {
        console.error('Error fetching celebrity:', error);
        return NextResponse.json(
            { error: 'Failed to fetch celebrity' },
            { status: 500 }
        );
    }
}
