import { connectDb } from "@/config";
import Celebrity from "@/models/Celebrity";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();

        // Get pagination params
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        // Build query
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { profession: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        // Get total count
        const total = await Celebrity.countDocuments(query);

        // Get paginated results
        const celebrities = await Celebrity.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({
            celebrities,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error("Get celebrities error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch celebrities" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        await connectDb();

        // Generate slug from name
        const baseSlug = generateSlug(body.name);
        
        // Check for existing slugs to avoid duplicates
        let slug = baseSlug;
        let counter = 1;
        while (await Celebrity.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const celebrity = await Celebrity.create({
            ...body,
            slug
        });

        return NextResponse.json({
            message: "Celebrity created successfully",
            celebrity
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create celebrity error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create celebrity" },
            { status: 500 }
        );
    }
}
