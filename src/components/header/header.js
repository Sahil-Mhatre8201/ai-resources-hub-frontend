"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Github, Heart, Menu, PlusCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Helper function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState("/")

  // Use useEffect to get the current path in a way that works in both App Router and Pages Router
  // This avoids the getInitialProps error
  if (typeof window !== "undefined") {
    // Client-side only code
    if (currentPath !== window.location.pathname) {
      setCurrentPath(window.location.pathname)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // San Jose State University colors
  const sjsuBlue = "#0055A2"
  const sjsuGold = "#E5A823"

  const navigation = [
    {
      name: "Knowledge Base",
      href: "/knowledge-base",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "GitHub Explorer",
      href: "/github-explorer",
      icon: <Github className="h-4 w-4 mr-2" />,
    },
    {
      name: "Submit a Resource",
      href: "/upload-resource",
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
    },
    {
      name: "My Favourites",
      href: "/my-bookmarks",
      icon: <Heart className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black dark:border-gray-800">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3 pl-4">
          <Link href="/" className="flex items-center space-x-3">
            {/* Logo image option */}
            {/* Uncomment and replace with your actual logo path */}
            {/* <img 
              src="/logo.png" 
              alt="Spartan AI Hub Logo" 
              width={40} 
              height={40} 
              className="rounded-md"
            /> */}

            {/* Fallback to text if no image is provided */}
            <div className="flex flex-col">
              <span className="font-bold text-xl">
                <span style={{ color: sjsuBlue }}>Spartan</span>
                <span style={{ color: sjsuGold }}> AI Hub</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors",
                currentPath === item.href
                  ? "text-blue-600 dark:text-yellow-300" // High contrast active link
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-yellow-300", // Better contrast for inactive links
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-600 dark:text-white" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600 dark:text-white" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-top-1 md:hidden bg-white dark:bg-gray-900">
          <div className="relative z-20 grid gap-6 rounded-md p-4">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center py-3 text-sm font-medium transition-colors",
                    currentPath === item.href
                      ? "text-blue-600 dark:text-yellow-300" // High contrast active link
                      : "text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-yellow-300", // Better contrast for inactive links
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

