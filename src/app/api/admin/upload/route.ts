import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Get file extension
        const originalName = file.name;
        const ext = path.extname(originalName);

        // Generate unique filename
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;
        
        // Save to public/uploads directory
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadDir, filename);
        
        await writeFile(filePath, buffer);
        
        return NextResponse.json({ 
            url: `/uploads/${filename}`,
            message: "File uploaded successfully" 
        });
        
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload file" },
            { status: 500 }
        );
    }
}
