"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  className?: string;
  compact?: boolean;
}

export function UserMenu({ className, compact }: UserMenuProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span
        className={cn("inline-block h-9 w-24 animate-pulse rounded-full bg-white/10", className)}
        aria-hidden
      />
    );
  }

  if (!session?.user) {
    return (
      <ButtonLink
        href="/ingresar"
        variant="secondary"
        size={compact ? "sm" : "md"}
        className={className}
      >
        Ingresar
      </ButtonLink>
    );
  }

  const nombre = session.user.name?.split(" ")[0] ?? "Cuenta";
  const esStaff =
    session.user.rol === "ADMIN" || session.user.rol === "MODERATOR";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href="/perfil"
        className="hidden max-w-[8rem] truncate text-sm font-medium text-white/85 hover:text-white sm:inline"
        title={session.user.email ?? undefined}
      >
        {nombre}
      </Link>
      {session.user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={session.user.image}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full border border-white/20 object-cover"
        />
      ) : null}
      {esStaff ? (
        <ButtonLink href="/panel-admin" variant="ghost" size="sm" className="hidden lg:inline-flex">
          Admin
        </ButtonLink>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Salir
      </Button>
    </div>
  );
}
