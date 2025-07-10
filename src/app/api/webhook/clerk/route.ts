import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not defined");
    return NextResponse.json(
      { error: "Server configuration error: WEBHOOK_SECRET missing" },
      { status: 500 }
    );
  }

  // Get webhook headers and payload
  const payload = await req.text();
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  console.log("Webhook received:", {
    svix_id,
    svix_timestamp,
    svix_signature,
    payload,
  });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  try {
    // Verify webhook signature
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("Webhook verified:", evt);

    // Handle user.created event
    if (evt.type === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        username,
      } = evt.data;
      const email = email_addresses[0]?.email_address;

      console.log("Processing user.created:", {
        id,
        email,
        username,
        first_name,
        last_name,
        image_url,
      });

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email: email || "",
          username: username || `user_${id}`,
          firstName: first_name || "",
          lastName: last_name || "",
          photo: image_url || "",
        },
      });

      console.log("User added to database:", { clerkId: id, email });

      return NextResponse.json(
        { message: "User created in database" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: `Webhook error: ${error.message || "Unknown error"}` },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
