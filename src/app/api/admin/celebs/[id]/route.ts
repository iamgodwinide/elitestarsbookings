import { connectDb } from "@/config";
import Celebrity from "@/models/Celebrity";
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req:NextRequest, { params }: any) => {
       try{
        await connectDb();
        const id = await params.id;
        const celebrity = await Celebrity.findById(id);
        return NextResponse.json({
            message: 'Celebrity fetched successfully',
            celebrity
        }, { status: 200 });
       }catch(error){
            console.log(error);
            return NextResponse.json({
                message: 'Internal Server Error',
            }, { status: 500 })
       }
}

export const POST = async (req:NextRequest, { params }: any) => {
    try{
        await connectDb();
        // get request body and validate fields
        const {name, profession, bio, imageUrl, coverImageUrl, social} = await req.json();

        if(!name || !profession || !bio || !imageUrl || !coverImageUrl) {
            return NextResponse.json({
                message: 'All fields are required',
            }, { status: 400 });
        }

        const id = await params.id;
        const celebrity = await Celebrity.findById(id);

        celebrity.name = name;
        celebrity.profession = profession;
        celebrity.bio = bio;
        celebrity.imageUrl = imageUrl;
        celebrity.coverImageUrl = coverImageUrl;
        celebrity.social = social;
        
        return NextResponse.json({
            message: 'Celebrity updated successfully',
            celebrity
        }, { status: 201 });
    }catch(error){
        console.log(error);
        return NextResponse.json({
            message: 'Internal Server Error',
        }, { status: 500 })
    }
}


export const DELETE = async (req:NextRequest, { params }: any) => {
    try{
        await connectDb();
        const id = await params.id;
        const celebrity = await Celebrity.findByIdAndDelete(id);
        return NextResponse.json({
            message: 'Celebrity deleted successfully',
            celebrity
        }, { status: 200 });
    }catch(error){
        console.log(error);
        return NextResponse.json({
            message: 'Internal Server Error',
        }, { status: 500 })
    }
}

