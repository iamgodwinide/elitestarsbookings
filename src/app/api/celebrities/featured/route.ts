import { connectDb } from "@/config";
import Celebrity from "@/models/Celebrity";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();
        
        // First try to get featured celebrities
        let celebrities = await Celebrity.find({ featured: true })
            .select('name profession imageUrl slug')
            .sort({ createdAt: -1 })
            .limit(4);

        // If no featured celebrities, get the most recent ones
        if (celebrities.length === 0) {
            celebrities = await Celebrity.find()
                .select('name profession imageUrl slug')
                .sort({ createdAt: -1 })
                .limit(4);
        }

        console.log('Found celebrities:', celebrities);

        return NextResponse.json(celebrities);
    } catch (error) {
        console.error('Error fetching featured celebrities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured celebrities' },
            { status: 500 }
        );
    }
}
