import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/events/:id",
    "/api/webhooks/",
    "/api/webhooks/stripe",
    "/api/uploadthing",
  ],
  ignoredRoutes: ["api/webhooks", "/api/webhook/stripe", "/api/uploadthing"],
} as any);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
