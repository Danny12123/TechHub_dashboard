"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User } from "lucide-react"

interface SalesLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (credentials: { email: string; role: string }) => void
}

export function SalesLoginModal({ isOpen, onClose, onLogin }: SalesLoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const salesUsers = [
    { email: "john.doe@techhub.com", password: "sales123", name: "John Doe", role: "sales" },
    { email: "jane.smith@techhub.com", password: "sales123", name: "Jane Smith", role: "sales" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication
    const user = salesUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem("salesAuth", JSON.stringify({ email: user.email, name: user.name, role: user.role }))
      onLogin({ email: user.email, role: user.role })
      onClose()
      setEmail("")
      setPassword("")
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    setEmail("")
    setPassword("")
    setError("")
    setShowPassword(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-accent-foreground" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold">Sales Login</DialogTitle>
            <DialogDescription>Access your sales dashboard</DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sales-email">Email</Label>
            <Input
              id="sales-email"
              type="email"
              placeholder="your.email@techhub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sales-password">Password</Label>
            <div className="relative">
              <Input
                id="sales-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo Sales Accounts:</p>
          <p>john.doe@techhub.com / sales123</p>
          <p>jane.smith@techhub.com / sales123</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
