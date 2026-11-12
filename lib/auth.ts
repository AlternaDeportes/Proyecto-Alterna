import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import type { RolNombre } from "@prisma/client";
import { isDatabaseConfigured } from "@/config/env";
import { sanitizeAuthUrlForHost } from "@/lib/auth-url";
import {
  AuthServiceError,
  consumirMagicLink,
  loginConPassword,
  upsertUsuarioDesdeOAuth,
} from "@/modules/autenticacion/services/usuario-auth.service";

sanitizeAuthUrlForHost();

class AuthCredentialsError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
  }
}

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

/** Auth listo si hay secret y al menos Google u otra vía con base de datos. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET && (isGoogleConfigured() || isDatabaseConfigured())
  );
}

const providers: Provider[] = [];

if (isGoogleConfigured()) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: { prompt: "select_account" },
      },
    })
  );
}

if (isDatabaseConfigured()) {
  providers.push(
    Credentials({
      id: "credentials",
      name: "Email y contraseña",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString() ?? "";
        const password = credentials?.password?.toString() ?? "";
        try {
          const usuario = await loginConPassword(email, password);
          return {
            id: usuario.id,
            email: usuario.email,
            name: usuario.nombre,
            image: usuario.avatarUrl,
            rol: usuario.rol.nombre,
            emailVerificado: usuario.emailVerificado,
          };
        } catch (error) {
          if (error instanceof AuthServiceError) {
            throw new AuthCredentialsError(error.code);
          }
          throw new AuthCredentialsError("INVALID_CREDENTIALS");
        }
      },
    }),
    Credentials({
      id: "magic-link",
      name: "Enlace mágico",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        const token = credentials?.token?.toString() ?? "";
        try {
          const usuario = await consumirMagicLink(token);
          return {
            id: usuario.id,
            email: usuario.email,
            name: usuario.nombre,
            image: usuario.avatarUrl,
            rol: usuario.rol.nombre,
            emailVerificado: true,
          };
        } catch (error) {
          if (error instanceof AuthServiceError) {
            throw new AuthCredentialsError(error.code);
          }
          throw new AuthCredentialsError("TOKEN_INVALID");
        }
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
        }).catch((error) => {
          console.error("[auth] Google sync:", error);
          return null;
        });

        if (synced) {
          token.usuarioId = synced.id;
          token.rol = synced.rol.nombre;
          token.emailVerificado = synced.emailVerificado;
        } else {
          token.usuarioId = token.sub ?? email;
          token.rol = "USER" as RolNombre;
          token.emailVerificado = true;
        }

        token.name = user.name;
        token.email = email;
        token.picture = user.image;
        return token;
      }

      if (user) {
        token.usuarioId = user.id;
        token.rol = user.rol ?? ("USER" as RolNombre);
        token.emailVerificado = user.emailVerificado ?? true;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if (user.image) token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.usuarioId as string) ?? token.sub ?? "";
        session.user.rol = (token.rol as RolNombre) ?? ("USER" as RolNombre);
        session.user.emailVerificado =
          (token.emailVerificado as boolean | undefined) ?? true;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
