import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDb } from '@/config';
import Celebrity from '@/models/Celebrity';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

export async function GET(
    req: NextRequest,
    { params }: any  
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const _params = await params;
        const celebrity = await Celebrity.findById(_params.id);
        
        if (!celebrity) {
            return NextResponse.json({ error: "Celebrity not found" }, { status: 404 });
        }

        return NextResponse.json(celebrity);

    } catch (error: any) {
        console.error("Get celebrity error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get celebrity" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: any
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const data = await req.json();
        const _params = await params;
        
        // If name is changed, generate new slug
        if (data.name) {
            const baseSlug = generateSlug(data.name);
            let slug = baseSlug;
            let counter = 1;
            
            // Find existing celebrity with same slug, excluding current one
            while (await Celebrity.findOne({ 
                _id: { $ne: _params.id }, 
                slug 
            })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            
            data.slug = slug;
        }

        const celebrity = await Celebrity.findByIdAndUpdate(
            _params.id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!celebrity) {
            return NextResponse.json({ error: "Celebrity not found" }, { status: 404 });
        }

        return NextResponse.json(celebrity);

    } catch (error: any) {
        console.error("Update celebrity error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update celebrity" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: any
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const _params = await params;
        const celebrity = await Celebrity.findByIdAndDelete(_params.id);
        
        if (!celebrity) {
            return NextResponse.json({ error: "Celebrity not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Celebrity deleted successfully" });

    } catch (error: any) {
        console.error("Delete celebrity error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete celebrity" },
            { status: 500 }
        );
    }
}
