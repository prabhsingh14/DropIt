import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { is } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { size } from "zod";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if(!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await request.json()
        const { imagekit, userId: bodyUserId } = body

        if(userId !== bodyUserId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        if(!imagekit || !imagekit.url)
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 })

        const fileData = {
            name: imagekit.name || "Unnamed File",
            path: imagekit.filePath || `/dropit/${userId}/${imagekit.name}`,
            size: imagekit.size || 0,
            type: imagekit.fileType || "image",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: null, //root by default
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };

        const [newFile] = await db.insert(files).values(fileData).returning();
        return NextResponse.json({ file: newFile });
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }
}