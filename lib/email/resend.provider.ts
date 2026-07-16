import { env } from "@/config/env";
import type { EmailMessage, EmailProvider } from "@/lib/email/types";

/** Provider Resend vía REST API (portable, sin SDK propietario). */
export function createResendProvider(): EmailProvider {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Resend no configurado: faltan RESEND_API_KEY o EMAIL_FROM");
  }

  return {
    async send(message: EmailMessage) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          reply_to: message.replyTo,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Resend error ${response.status}: ${body}`);
      }
    },
  };
}
