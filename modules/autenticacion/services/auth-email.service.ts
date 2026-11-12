import { siteConfig } from "@/config/site";
import { getEmailProvider } from "@/lib/email";
import { getAuthOrigin } from "@/lib/auth-url";

function wrapHtml(title: string, body: string, href: string, cta: string, code?: string) {
  const codeBlock = code
    ? `<p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7a776e;">Tu código</p>
       <p style="margin:0 0 24px;font-size:32px;letter-spacing:.28em;font-weight:700;text-align:center;">${code}</p>`
    : "";

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;background:#f6f4ef;font-family:Arial,sans-serif;color:#1D1D1B;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border-radius:16px;padding:32px;border:1px solid #e6e2d8;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#2A5FF4;font-weight:700;">${siteConfig.name}</p>
                <h1 style="margin:0 0 16px;font-size:24px;">${title}</h1>
                <p style="margin:0 0 24px;line-height:1.6;color:#4b4b46;">${body}</p>
                ${codeBlock}
                <p>
                  <a href="${href}" style="display:inline-block;background:#2A5FF4;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700;">${cta}</a>
                </p>
                <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#7a776e;">Si el botón no funciona, copiá este enlace:<br>${href}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendAuthEmail(input: {
  to: string;
  subject: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  code?: string;
}) {
  const provider = getEmailProvider();
  const text = input.code
    ? `${input.body}\n\nCódigo: ${input.code}\n${input.cta}: ${input.href}`
    : `${input.body}\n\n${input.cta}: ${input.href}`;

  await provider.send({
    to: input.to,
    subject: input.subject,
    text,
    html: wrapHtml(input.title, input.body, input.href, input.cta, input.code),
  });
}

export const authEmailService = {
  async enviarVerificacion(email: string, code: string) {
    const href = `${getAuthOrigin()}/verificar-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;
    await sendAuthEmail({
      to: email,
      subject: `Verificá tu cuenta en ${siteConfig.name}`,
      title: "Confirmá tu email",
      body: `Hola. Para activar tu cuenta en ${siteConfig.name} usá el código de 6 dígitos o el botón. Caduca en 2 horas.`,
      href,
      cta: "Verificar email",
      code,
    });
    return href;
  },

  async enviarMagicLink(email: string, token: string) {
    const href = `${getAuthOrigin()}/ingresar/magic?token=${encodeURIComponent(token)}`;
    await sendAuthEmail({
      to: email,
      subject: `Tu enlace para entrar a ${siteConfig.name}`,
      title: "Entrar sin contraseña",
      body: `Usá este enlace para ingresar. Caduca en 15 minutos. Al usarlo, el email queda verificado.`,
      href,
      cta: "Entrar a ALTERNA",
    });
    return href;
  },

  async enviarReset(email: string, token: string) {
    const href = `${getAuthOrigin()}/recuperar/nueva?token=${encodeURIComponent(token)}`;
    await sendAuthEmail({
      to: email,
      subject: `Restablecé tu contraseña de ${siteConfig.name}`,
      title: "Nueva contraseña",
      body: `Recibimos un pedido para cambiar tu contraseña. El enlace caduca en una hora. Si no fuiste vos, ignorá este email.`,
      href,
      cta: "Elegir contraseña",
    });
    return href;
  },
};
