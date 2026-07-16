import type { EmailMessage, EmailProvider } from "@/lib/email/types";

/** Provider de desarrollo: registra el email en consola sin enviarlo. */
export const consoleEmailProvider: EmailProvider = {
  async send(message: EmailMessage) {
    console.info("[email:console]", {
      to: message.to,
      subject: message.subject,
      replyTo: message.replyTo,
      preview: message.text.slice(0, 200),
    });
  },
};
