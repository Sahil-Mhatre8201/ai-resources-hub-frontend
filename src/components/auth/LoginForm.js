"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { setAuthCookie } from "@/utils/auth"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include", // Include cookies in the request
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong")
      }

      // Set the auth cookie using our utility function
      // If the backend response includes user_id, use it
      if (data.user_id) {
        setAuthCookie(data.user_id)
      } else {
        // If not, set a placeholder value
        setAuthCookie("authenticated")

        // For debugging - log what we're setting
        console.log('No user_id in response, using placeholder "authenticated"')
      }

      // For debugging - manually check if the cookie was set
      setTimeout(() => {
        console.log("After login - cookie check:", Cookies.get("user_id"))
        console.log("After login - localStorage check:", localStorage.getItem("user_id"))
      }, 100)

      // Redirect to home page or dashboard
      router.push("/")
    } catch (error) {
      setApiError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm sm:max-w-md mx-auto">
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-center">Log in</CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">{apiError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`text-sm sm:text-base ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-xs sm:text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Link href="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:underline whitespace-nowrap">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`text-sm sm:text-base ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && <p className="text-xs sm:text-sm text-red-500">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center px-4 sm:px-6 py-4 sm:py-6">
        <p className="text-xs sm:text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}


