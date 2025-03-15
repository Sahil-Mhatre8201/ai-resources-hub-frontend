import "@/styles/globals.css";
import { SearchProvider } from "@/context/SearchContext";
import Chatbot from "@/components/chatbot/Chatbot";
import { isAuthenticated } from "@/utils/auth"
import { useRouter } from "next/router";
import { useEffect } from "react";

// List of routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/forgot-password"]

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Check authentication on route change
    const handleRouteChange = (url) => {
      // Extract the path from the URL (remove query params)
      const path = url.split("?")[0]

      // Check if the route is public
      const isPublicRoute = publicRoutes.includes(path)

      // Only check auth if we're in the browser
      if (typeof window !== "undefined") {
        const authenticated = isAuthenticated()

        console.log("Route change to:", path, "Public:", isPublicRoute, "Authenticated:", authenticated)

        // If not public and user is not authenticated, redirect to login
        if (!isPublicRoute && !authenticated) {
          router.push("/login")
        }
      }
    }

    // Run once on initial load
    handleRouteChange(router.pathname)

    // Add event listener for route changes
    router.events.on("routeChangeStart", handleRouteChange)

    // Clean up event listener
    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router])

  return (
    <SearchProvider>
      <Component {...pageProps} />
      <Chatbot apiEndpoint="http://127.0.0.1:8000/chat" />
    </SearchProvider>
  );
}
