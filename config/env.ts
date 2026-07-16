import { z } from "zod";

/** Convierte cadenas vacías en undefined para variables opcionales */
function optionalString(schema: z.ZodType<string>) {
  return z.preprocess((v) => (v === "" || v === undefined ? undefined : v), schema.optional());
}

const optionalUrl = optionalString(z.string().url());
const optionalEmail = optionalString(z.string().email());

/**
 * Variables de entorno validadas con Zod.
 * Portable: mismos nombres en Vercel, Neon, Railway, Docker o VPS.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: optionalUrl,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  AUTH_SECRET: optionalString(z.string().min(32)),
  AUTH_GOOGLE_ID: optionalString(z.string().min(1)),
  AUTH_GOOGLE_SECRET: optionalString(z.string().min(1)),
  CLOUDINARY_CLOUD_NAME: optionalString(z.string().min(1)),
  CLOUDINARY_API_KEY: optionalString(z.string().min(1)),
  CLOUDINARY_API_SECRET: optionalString(z.string().min(1)),
  EMAIL_FROM: optionalEmail,
  RESEND_API_KEY: optionalString(z.string().min(1)),
  REDIS_URL: optionalUrl,
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Variables de entorno inválidas:", result.error.flatten().fieldErrors);
    throw new Error("Configuración de entorno inválida");
  }

  return result.data;
}

/** Solo usar en servidor (API routes, Server Components, Prisma) */
export const env = parseEnv();

/** Comprueba si la base de datos está configurada */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
