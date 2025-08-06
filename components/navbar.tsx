"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Bell, Menu, Moon, Sun, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navigationItems = [
  {
    title: "How It Works",
    href: "#how-it-works",
    description: "Learn about our 3-step verification process",
  },
  {
    title: "Features",
    href: "#features",
    description: "Discover powerful automation capabilities",
  },
  {
    title: "Demo",
    href: "#demo",
    description: "See Kredible in action",
  },
  {
    title: "Pricing",
    href: "#pricing",
    description: "Choose the right plan for your team",
  },
  {
    title: "FAQ",
    href: "#faq",
    description: "Frequently asked questions",
  },
]

const recruiterNavigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "View all candidate profiles",
  },
  {
    title: "New Request",
    href: "/recruiter-signup",
    description: "Send verification request",
  },
  {
    title: "Help",
    href: "#contact",
    description: "Get support",
  },
]

interface NavbarProps {
  isLoggedIn?: boolean
  userRole?: "recruiter" | "candidate"
  notifications?: number
}

export function Navbar({ isLoggedIn = false, userRole = "recruiter", notifications = 3 }: NavbarProps) {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const scrollToSection = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("#")
          }}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img src="/images/kredible-logo.png" alt="Kredible Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-foreground">Kredible</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {(isLoggedIn && userRole === "recruiter" ? recruiterNavigationItems : navigationItems).map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={(e) => {
                if (item.href.startsWith("#")) {
                  e.preventDefault()
                  scrollToSection(item.href)
                }
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications (if logged in) */}
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notifications > 9 ? "9+" : notifications}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Sarah Chen submitted profiles</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Profile verification completed</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">New candidate invitation sent</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Role Indicator (if logged in) */}
          {isLoggedIn && (
            <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-muted rounded-md">
              {userRole === "recruiter" ? (
                <Users className="h-3 w-3 text-muted-foreground" />
              ) : (
                <User className="h-3 w-3 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userRole === "recruiter" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/recruiter-signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <img src="/images/kredible-logo.png" alt="Kredible Logo" className="w-6 h-6" />
                  <span>Kredible</span>
                </SheetTitle>
                <SheetDescription>Navigate to different sections</SheetDescription>
              </SheetHeader>

              <div className="flex flex-col space-y-4 mt-8">
                {(isLoggedIn && userRole === "recruiter" ? recruiterNavigationItems : navigationItems).map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault()
                        scrollToSection(item.href)
                      } else {
                        setIsOpen(false)
                      }
                    }}
                    className="flex flex-col space-y-1 p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </Link>
                ))}

                <div className="border-t pt-4 mt-4">
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        {userRole === "recruiter" ? (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm capitalize">{userRole}</span>
                      </div>
                      {userRole === "recruiter" && (
                        <Button className="w-full bg-transparent" variant="outline" asChild>
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        </Button>
                      )}
                      <Button className="w-full bg-transparent" variant="outline">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full bg-transparent" variant="outline">
                        Sign In
                      </Button>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href="/recruiter-signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
