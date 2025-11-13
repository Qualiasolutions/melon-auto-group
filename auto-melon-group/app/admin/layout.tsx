"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Truck,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { useState } from "react"

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/admin/vehicles', icon: Truck },
  { name: 'Add Vehicle', href: '/admin/vehicles/new', icon: Plus },
  { name: 'Import Vehicle', href: '/admin/vehicles/import', icon: Download },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white border-gray-200 shadow-sm"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Auto Melon Group</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-red-50 text-red-700 border-l-2 border-red-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@automelon.com</p>
              </div>
            </div>
            <form action="/auth/signout" method="post" className="w-full">
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64 min-h-screen">
        {/* Top bar */}
        <div className="h-16 border-b border-gray-200 bg-white flex-shrink-0 lg:px-6 px-4">
          <div className="h-full flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => pathname === item.href)?.name || 'Admin Panel'}
              </h2>
              <p className="text-sm text-gray-500">Vehicle Management System</p>
            </div>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" asChild>
              <Link href="/">
                View Website
              </Link>
            </Button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 lg:p-6 p-4">
          {children}
        </div>
      </main>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Toast notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
