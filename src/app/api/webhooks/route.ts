import prisma from "@/lib/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    // const eventType = evt.type;
    // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    // console.log('Webhook payload:', evt.data)
    if (evt.type === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        image_url,
        last_name,
        username,
      } = evt.data;
      try {
        const newUser = await prisma.user.create({
          data: {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username!,
            firstName: first_name!,
            lastName: last_name!,
            photo: image_url,
          },
        });
        return new Response(JSON.stringify(newUser), { status: 201 });
      } catch (err) {
        console.log(err);
      }
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
