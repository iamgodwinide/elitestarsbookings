import { connectDb } from "@/config";
import Celebrity from "@/models/Celebrity";
import { NextRequest, NextResponse } from "next/server"

export const GET = async () => {
       try{
        await connectDb();
        const celebrities = await Celebrity.find();
        return NextResponse.json({
            message: 'Celebrities fetched successfully',
            celebrities
        }, { status: 200 });
       }catch(error){
            console.log(error);
            return NextResponse.json({
                message: 'Internal Server Error',
            }, { status: 500 })
       }
}

export const POST = async (req:NextRequest) => {
    try{
        await connectDb();
        // get request body and validate fields
        const {name, profession, bio, imageUrl, coverImageUrl, social} = await req.json();

        if(!name || !profession || !bio || !imageUrl || !coverImageUrl) {
            return NextResponse.json({
                message: 'All fields are required',
            }, { status: 400 });
        }

        const celebrity = await Celebrity.create({
            name: name.trim(),
            profession: profession.trim(),
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            bio: bio.trim(),
            imageUrl: imageUrl.trim(),
            coverImageUrl: coverImageUrl.trim(),
            social: {
                instagram: social.instagram?.trim(),
                twitter: social.twitter?.trim(),
                tiktok: social.tiktok?.trim(),
                youtube: social.youtube?.trim()
            }
        });
        
        return NextResponse.json({
            message: 'Celebrity created successfully',
            celebrity
        }, { status: 201 });
    }catch(error){
        console.log(error);
        return NextResponse.json({
            message: 'Internal Server Error',
        }, { status: 500 })
    }
}


