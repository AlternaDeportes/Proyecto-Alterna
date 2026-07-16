import { env } from "@/config/env";
import { consoleEmailProvider } from "@/lib/email/console.provider";
import { createResendProvider } from "@/lib/email/resend.provider";
import type { EmailProvider } from "@/lib/email/types";

export function getEmailProvider(): EmailProvider {
  if (env.RESEND_API_KEY && env.EMAIL_FROM) {
    return createResendProvider();
  }

  return consoleEmailProvider;
}

export type { EmailMessage, EmailProvider } from "@/lib/email/types";
