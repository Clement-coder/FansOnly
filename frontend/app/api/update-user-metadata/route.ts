import { NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/node";

const PRIVY_APP_ID = process.env.PRIVY_APP_ID || "";
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || "";

const privy = new PrivyClient({
  appId: PRIVY_APP_ID,
  appSecret: PRIVY_APP_SECRET,
});

export async function POST(request: Request) {
  try {
    const { userId, metadata } = await request.json();

    if (!userId || !metadata) {
      return NextResponse.json(
        { error: "Missing userId or metadata" },
        { status: 400 }
      );
    }

    // Update user metadata properly
    const updatedUser = await privy.users().setCustomMetadata(userId, {
      custom_metadata: metadata,
    });

    console.log("✅ User metadata updated:", updatedUser);

    return NextResponse.json({
      message: "User metadata updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("🔥 Error in /api/update-user-metadata:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to update user metadata",
        details: error,
      },
      { status: 500 }
    );
  }
}
