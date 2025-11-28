import "@/styles/globals.css";
import { SearchProvider } from "@/context/SearchContext";
import Chatbot from "@/components/chatbot/Chatbot";
import { isAuthenticated } from "@/utils/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header/header";

// PWA components
import InstallPrompt from "@/components/InstallPrompt";
import IOSInstallMessage from "@/components/IOSInstallMessage";

// Public routes
const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Authentication guard
  useEffect(() => {
    const handleRouteChange = (url) => {
      const path = url.split("?")[0];
      const isPublic = PUBLIC_ROUTES.includes(path);

      const authenticated = isAuthenticated();
      console.log("[Auth] Navigated to:", path, "Public:", isPublic, "Auth:", authenticated);

      if (!isPublic && !authenticated) {
        console.log("[Auth] Redirecting user to login");
        router.push("/login");
      }
    };

    handleRouteChange(router.pathname);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router]);

  return (
    <SearchProvider>
      <Header />

      {/* MAIN CONTENT */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
        <Component {...pageProps} />
      </div>

      <Chatbot apiEndpoint="https://ai-resources-hub-backend.onrender.com/chat" />

      <Toaster
        theme="system"
        richColors
        closeButton
        style={{
          "--toast-text": "hsl(var(--foreground))",
          "--toast-border": "hsl(var(--border))",
          "--toast-background": "hsl(var(--background))",
        }}
      />

      {/* PWA INSTALL BUTTONS MUST BE OUTSIDE ANY ROUTER GUARDS */}
      <InstallPrompt />
      <IOSInstallMessage />
    </SearchProvider>
  );
}
