"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, Truck } from "lucide-react"
import { login } from "./actions"

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-200">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-red-600 flex items-center justify-center">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Auto Melon Group Management System
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form action={login} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@automelon.com"
                  className="pl-10 h-10"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 h-10"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-red-600 hover:bg-red-700 text-white"
            >
              <Lock className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Authorized access only</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-400 text-xs">
          Powered by{" "}
          <a
            href="https://www.qualiasolutions.cy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Qualia Solutions
          </a>
        </p>
      </div>
    </div>
  )
}
