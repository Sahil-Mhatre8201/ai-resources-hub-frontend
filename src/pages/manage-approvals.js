"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import PendingResourcesList from "@/components/admin/PendingResourcesList"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function PendingResourcesPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get auth token from cookies or localStorage
//   const getAuthToken = () => {
//     return Cookies.get("auth_token") || localStorage.getItem("auth_token")
//   }


//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-screen">
//         <div className="animate-pulse text-lg">Loading...</div>
//       </div>
//     )
//   }



  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pending Resources</h1>
          <p className="text-muted-foreground mt-1">Review and manage user-submitted resources</p>
        </div>

      </div>

      <PendingResourcesList />
    </div>
  )
}

