import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm"
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";
import { form } from "@heroui/theme";
import { th } from "zod/v4/locales";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if(!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const formData = await request.formData()
        const file = formData.get("file") as File
        const formUserId = formData.get("userId") as string
        const parentId = formData.get("parentId") as string || null

        if(userId !== formUserId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        if(!file)
            return NextResponse.json({ error: "Invalid file" }, { status: 400 })
        
        if(parentId){
            const [ parentFolder ] = await db.select().from(files).where(and(
                eq(files.id, parentId),
                eq(files.userId, userId),
                eq(files.isFolder, true)
            )).limit(1)
        }
        if(!parentId) return NextResponse.json({ error: "Parent folder not found" }, { status: 400 })

        // Validate MIME type if provided (allow images and PDF)
        if (file.type) {
            if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
                return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
            }
        }

        const buffer = await file.arrayBuffer()
        const fileBuffer = Buffer.from(buffer)

        const folderPath = parentId ? `/dropit/${userId}/folder/${parentId}` : `/dropit/${userId}`
        
        const originalFileName = file.name || ""
        const fileExtension = originalFileName.includes('.') ? (originalFileName.split('.').pop() || "") : ""

        // check for empty extension
        if (!fileExtension || fileExtension.trim() === "") {
            return NextResponse.json({ error: "File extension missing" }, { status: 400 })
        }

        // whitelist extensions: common images + pdf
        const allowedExtensions = ["jpg","jpeg","png","webp","gif","svg","bmp","tiff","pdf"]
        if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
            return NextResponse.json({ error: "File extension not allowed" }, { status: 400 })
        }

        // Additional cross-check: if MIME is present, ensure it matches extension semantics
        if (file.type) {
            const isImageMime = file.type.startsWith('image/')
            const isPdfMime = file.type === 'application/pdf'

            if (!isImageMime && !isPdfMime) {
                return NextResponse.json({ error: "Invalid MIME type" }, { status: 400 })
            }

            if (fileExtension.toLowerCase() === 'pdf' && !isPdfMime) {
                return NextResponse.json({ error: "MIME type does not match .pdf extension" }, { status: 400 })
            }

            if (fileExtension.toLowerCase() !== 'pdf' && isPdfMime) {
                return NextResponse.json({ error: "MIME type indicates PDF but extension is not .pdf" }, { status: 400 })
            }
        }

        const uniqueFileName = `${uuidv4()}.${fileExtension}`

        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: uniqueFileName,
            folder: folderPath,
            useUniqueFileName: false
        })

        const fileData = {
            name: originalFileName,
            path: uploadResponse.filePath,
            size: file.size,
            type: file.type,
            fileUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            userId: userId,
            parentId: parentId,
            isFolder: false,
            isStarred: false,
            isTrash: false
        }

        const [ newFile ] = await db.insert(files).values(fileData).returning();
        return NextResponse.json({ file: newFile })
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }
}