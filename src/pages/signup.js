"use client"

import React from "react"
import { useRouter } from "next/router"
import { isAuthenticated } from "@/utils/auth"
import SignupForm from "@/components/auth/SignUpForm"

export default function LoginPage() {
  const router = useRouter()

  // If user is already authenticated, redirect to home page
  React.useEffect(() => {
    if (isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <SignupForm />
    </div>
  )
}

