import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export async function POST(request: NextRequest){
    try {
        const { userId } = await auth()
        if(!userId) return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

        const body = await request.json()
        const { name, userId: bodyUserId, parentId = null } = body

        if(userId !== bodyUserId)
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

        if(!name || typeof name !== "string" || name.trim().length === 0)
            return new NextResponse(JSON.stringify({ error: "Invalid folder name" }), { status: 400 })

        if(parentId){
            const [ parentFolder ] = await db.select().from(files).where(and(
                eq(files.id, parentId),
                eq(files.userId, userId),
                eq(files.isFolder, true)
            )).limit(1)

            if(!parentFolder){
                return new NextResponse(JSON.stringify({ error: "Parent folder not found" }), { status: 400 })
            }
        }

        const folderData = {
            id: uuidv4(),
            name: name.trim(),
            path: `/folders/${userId}/${uuidv4()}`,
            size: 0,
            type: "folder",
            fileUrl: "",
            thumbnailUrl: null,
            userId,
            parentId,
            isFolder: true,
            isStarred: false,
            isTrash: false,
        };

        const [ newFolder ] = await db.insert(files).values(folderData).returning();
        return NextResponse.json({ 
            success: true,
            folder: newFolder,
            message: "Folder created successfully" 
        })
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Failed to create folder" }), { status: 500 })
    }
}