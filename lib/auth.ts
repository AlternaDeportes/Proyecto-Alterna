import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import type { RolNombre } from "@prisma/client";
import { upsertUsuarioDesdeOAuth } from "@/modules/autenticacion/services/usuario-auth.service";

/** Auth configurado si hay secret + Google OAuth */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET
  );
}

const providers: Provider[] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: "/ingresar",
    error: "/ingresar",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider === "google") {
        const email = user.email;
        if (!email) return token;

        const synced = await upsertUsuarioDesdeOAuth({
          email,
          nombre: user.name ?? email.split("@")[0] ?? "Usuario",
          avatarUrl: user.image,
        });

        if (synced) {
          token.usuarioId = synced.id;
          token.rol = synced.rol.nombre;
        } else {
          // Sin DB: sesión JWT local con rol USER por defecto
          token.usuarioId = token.sub ?? email;
          token.rol = "USER" as RolNombre;
        }

        token.name = user.name;
        token.email = email;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.usuarioId as string) ?? token.sub ?? "";
        session.user.rol = (token.rol as RolNombre) ?? ("USER" as RolNombre);
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
