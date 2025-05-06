import { connectDb } from "@/config";
import Celebrity from "@/models/Celebrity";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(req: NextRequest, context: any) {
    const { params } = context;
    try {
        await connectDb();
        const { id } = await params;

        if (!id) {
            console.error('No ID provided in params');
            return NextResponse.json(
                { error: 'Celebrity ID is required' },
                { status: 400 }
            );
        }

        console.log('Processing request for celebrity ID:', id);

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid celebrity ID' },
                { status: 400 }
            );
        }

        const celebrity = await Celebrity.findById(id);
        if (!celebrity) {
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
