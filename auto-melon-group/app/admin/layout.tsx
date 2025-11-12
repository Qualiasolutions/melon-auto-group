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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl">
          {/* Logo */}
          <div className="h-20 flex items-center justify-center border-b border-slate-700 bg-slate-900/50">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-orange-600 flex items-center justify-center shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
                <p className="text-xs text-slate-400">Truck Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-brand-red to-orange-600 text-white shadow-lg shadow-brand-red/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900/50">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">admin@automelon.com</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 text-slate-300 hover:text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/">
                <LogOut className="h-4 w-4 mr-2" />
                Exit Admin
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="min-h-screen">
          {/* Top bar */}
          <div className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
            <div className="h-full px-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {navigation.find(item => pathname === item.href)?.name || 'Admin Panel'}
                </h2>
                <p className="text-sm text-slate-600">Manage your truck inventory</p>
              </div>
              <Button className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg" asChild>
                <Link href="/">
                  View Website
                </Link>
              </Button>
            </div>
          </div>

          {/* Page content */}
          <div className="p-8">
            {children}
          </div>
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
