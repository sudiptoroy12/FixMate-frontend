
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select an image." },
        { status: 400 }
      );
    }

    // Validate image type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG and WEBP images are allowed." },
        { status: 400 }
      );
    }

    // Validate image size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 5MB." },
        { status: 400 }
      );
    }

    // Convert image to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Prepare ImgBB request
    const imgbbForm = new FormData();
    imgbbForm.append("image", base64Image);

    // Upload to ImgBB
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imgbbForm,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { error: "Failed to upload image to ImgBB." },
        { status: 500 }
      );
    }

    // Return uploaded image URL
    return NextResponse.json({
      success: true,
      imageUrl: result.data.display_url,
    });

  } catch (error) {
    console.error("ImgBB upload error:", error);

    return NextResponse.json(
      { error: "Something went wrong while uploading image." },
      { status: 500 }
    );
  }
}
