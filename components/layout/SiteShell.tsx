import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthSessionProvider } from "@/modules/autenticacion/components/AuthSessionProvider";
import { AnalyticsGate } from "@/modules/legal/components/AnalyticsGate";
import { CookieBanner } from "@/modules/legal/components/CookieBanner";
import { InstallPrompt } from "@/modules/pwa/components/InstallPrompt";
import { ServiceWorkerRegister } from "@/modules/pwa/components/ServiceWorkerRegister";

interface SiteShellProps {
  children: React.ReactNode;
}

/** Layout global: navegación + contenido + pie */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <AuthSessionProvider>
      <Navbar />
      <div className="flex min-h-dvh flex-col bg-brand-ink">{children}</div>
      <Footer />
      <CookieBanner />
      <AnalyticsGate />
      <InstallPrompt />
      <ServiceWorkerRegister />
    </AuthSessionProvider>
  );
}
