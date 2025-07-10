import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

  // Get webhook headers and payload
  const payload = await req.text();
  const headersList = await headers();
  const svix_id = headersList.get("svix-id")!;
  const svix_timestamp = headersList.get("svix-timestamp")!;
  const svix_signature = headersList.get("svix-signature")!;

  try {
    // Verify webhook signature
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

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

      return new Response("User created in database", { status: 200 });
    }

    return new Response("Event ignored", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
