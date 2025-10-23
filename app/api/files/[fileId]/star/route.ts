import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    props: {
        params: Promise<{ fileId: string }>
    }
){
    try {
        const { userId } = await auth()
        if(!userId) return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    
        const { fileId } = await props.params
        if(!fileId) return new NextResponse(JSON.stringify({ error: "File Id is required" }), { status: 400 })

        const [ file ] = await db.select().from(files).where(and(
            eq(files.id, fileId),
            eq(files.userId, userId)
        ))
        if(!file) return new NextResponse(JSON.stringify({ error: "File not found" }), { status: 404 })

        const updatedFiles = await db.update(files).set({
            isStarred: !file.isStarred
        }).where(
            and(eq(files.id, fileId), eq(files.userId, userId))
        ).returning();

        const updatedFile = updatedFiles[0];
        return NextResponse.json({ file: updatedFile })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to star file" }, { status: 500 })
    }
}