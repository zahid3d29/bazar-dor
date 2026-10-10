import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function asOrigin(value?: string) {
  if (!value) return undefined;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).origin;
  } catch {
    return undefined;
  }
}

const configuredUrl = asOrigin(process.env.BETTER_AUTH_URL);
const vercelUrl =
  process.env.VERCEL_ENV === "production"
    ? asOrigin(
        process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
      )
    : asOrigin(process.env.VERCEL_URL);
const appUrl =
  (process.env.VERCEL && configuredUrl === "http://localhost:3000"
    ? vercelUrl
    : configuredUrl) ??
  vercelUrl ??
  asOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  "http://localhost:3000";

const trustedOrigins = [
  appUrl,
  configuredUrl,
  asOrigin(process.env.VERCEL_URL),
  asOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

const authSecret = process.env.BETTER_AUTH_SECRET;
if (process.env.NODE_ENV === "production" && !authSecret) {
  throw new Error("BETTER_AUTH_SECRET must be configured in production");
}

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: appUrl,
  trustedOrigins,
  secret:
    authSecret ?? "bazar-dor-local-development-secret-change-before-deployment",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  socialProviders,
});
