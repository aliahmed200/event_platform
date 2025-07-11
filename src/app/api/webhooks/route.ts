// import prisma from "@/lib/db";
// import { verifyWebhook } from "@clerk/nextjs/webhooks";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const evt = await verifyWebhook(req);

//     // Do something with payload
//     // For this guide, log payload to console
//     const eventType = evt.type;
//     // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//     // console.log('Webhook payload:', evt.data)
//     if (evt.type === "user.created") {
//       const {
//         id,
//         email_addresses,
//         first_name,
//         image_url,
//         last_name,
//         username,
//       } = evt.data;
//       try {
//         const newUser = await prisma.user.create({
//           data: {
//             clerkId: id,
//             email: email_addresses[0].email_address,
//             username: username!,
//             firstName: first_name!,
//             lastName: last_name!,
//             photo: image_url,
//           },
//         });
//         return new Response(JSON.stringify(newUser), { status: 201 });
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     return new Response("Webhook received", { status: 200 });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error verifying webhook", { status: 400 });
//   }
// }

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
// import { clerkClient } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

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

    // if (newUser) {
    //   await clerkClient.users.updateUserMetadata(id, {
    //     publicMetadata: {
    //       userId: newUser._id,
    //     },
    //   });
    // }

    // return NextResponse.json({ message: "OK", user: newUser });
  }

  //   if (eventType === "user.updated") {
  //     const { id, image_url, first_name, last_name, username } = evt.data;

  //     const user = {
  //       firstName: first_name,
  //       lastName: last_name,
  //       username: username!,
  //       photo: image_url,
  //     };

  //     const updatedUser = await updateUser(id, user);

  //     return NextResponse.json({ message: "OK", user: updatedUser });
  //   }

  //   if (eventType === "user.deleted") {
  //     const { id } = evt.data;

  //     const deletedUser = await deleteUser(id!);

  //     return NextResponse.json({ message: "OK", user: deletedUser });
  //   }

  return new Response("", { status: 200 });
}
