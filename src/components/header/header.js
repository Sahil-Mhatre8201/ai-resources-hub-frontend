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
      <div className="w-full flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
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
              <span className="font-bold text-base sm:text-lg lg:text-xl">
                <span style={{ color: sjsuBlue }}>Spartan</span>
                <span style={{ color: sjsuGold }}> AI</span>
              </span>
              <span className="hidden sm:inline font-bold text-base sm:text-lg lg:text-xl">
                <span style={{ color: sjsuGold }}>Hub</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center text-xs sm:text-sm lg:text-sm font-medium transition-colors px-2 lg:px-3 py-1 rounded-md",
                currentPath === item.href
                  ? "text-blue-600 dark:text-yellow-300 bg-blue-50 dark:bg-opacity-10" // High contrast active link
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-yellow-300 dark:hover:bg-gray-800", // Better contrast for inactive links
              )}
            >
              <span className="hidden lg:inline">{item.icon}</span>
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden">{item.icon}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 sm:h-10 sm:w-10" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-white" />
          ) : (
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-white" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-auto p-4 sm:p-6 pb-32 shadow-md animate-in slide-in-from-top-1 md:hidden bg-white dark:bg-gray-900">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm sm:text-base font-medium transition-colors rounded-lg",
                  currentPath === item.href
                    ? "text-blue-600 dark:text-yellow-300 bg-blue-50 dark:bg-opacity-10" // High contrast active link
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-yellow-300 dark:hover:bg-gray-800", // Better contrast for inactive links
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

