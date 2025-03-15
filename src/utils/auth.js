"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"

// List of routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/forgot-password"]

// Check if user is authenticated - client-side only
export const isAuthenticated = () => {
  // Only run in browser environment
  if (typeof window === "undefined") {
    return false
  }

  // Try to get the auth token from js-cookie
  const userId = Cookies.get("user_id")

  // If cookie is not found, check localStorage as fallback
  const localStorageUserId = localStorage.getItem("user_id")

  // Debug log
  console.log("Auth check - cookie user_id:", userId)
  console.log("Auth check - localStorage user_id:", localStorageUserId)

  return !!(userId || localStorageUserId)
}

// Higher Order Component for protected routes
export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // Check if the route is public
      const isPublicRoute = publicRoutes.includes(router.pathname)
      const authenticated = isAuthenticated()

      console.log("Route:", router.pathname, "Public:", isPublicRoute, "Authenticated:", authenticated)

      // If not public and user is not authenticated, redirect to login
      if (!isPublicRoute && !authenticated) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    }, [router])

    // Show nothing while checking authentication
    if (loading) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    // If authenticated or public route, render the component
    return <Component {...props} />
  }
}

// Hook for checking authentication in components
export function useAuth() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated()
      setAuthenticated(auth)
      setLoading(false)

      // If not authenticated and not on a public route, redirect
      const isPublicRoute = publicRoutes.includes(router.pathname)
      if (!auth && !isPublicRoute) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  return { authenticated, loading }
}

// Function to set auth cookie and localStorage
export const setAuthCookie = (userId) => {
  // Set in both cookie and localStorage for redundancy
  try {
    Cookies.set("user_id", userId, {
      expires: 7, // 7 days
      path: "/",
      sameSite: "Lax",
    })
    localStorage.setItem("user_id", userId)
    console.log("Set auth data - cookie and localStorage:", userId)
  } catch (error) {
    console.error("Error setting auth data:", error)
    // Fallback to just localStorage if cookies fail
    localStorage.setItem("user_id", userId)
  }
}

// Function to remove auth cookie (logout)
export const removeAuthCookie = () => {
  try {
    Cookies.remove("user_id", { path: "/" })
    localStorage.removeItem("user_id")
    console.log("Removed auth data from cookie and localStorage")
  } catch (error) {
    console.error("Error removing auth data:", error)
    // Fallback to just localStorage if cookies fail
    localStorage.removeItem("user_id")
  }
}

