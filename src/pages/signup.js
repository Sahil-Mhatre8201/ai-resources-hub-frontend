"use client"

import React from "react"
import { useRouter } from "next/router"
import LoginForm from "@/components/auth/LoginForm"
import { isAuthenticated } from "@/utils/auth"

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
      <LoginForm />
    </div>
  )
}

