"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesLoginModal } from "@/components/sales-login-modal"
import { SalesDashboard } from "@/components/sales-dashboard"
import { User, ShoppingBag, TrendingUp } from "lucide-react"

interface SalesUser {
  email: string
  name: string
  role: string
}

export default function SalesPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [salesUser, setSalesUser] = useState<SalesUser | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("salesAuth")
    if (savedUser) {
      setSalesUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (credentials: { email: string; role: string }) => {
    const savedUser = localStorage.getItem("salesAuth")
    if (savedUser) {
      setSalesUser(JSON.parse(savedUser))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("salesAuth")
    setSalesUser(null)
  }

  if (salesUser) {
    return <SalesDashboard user={salesUser} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 animate-fade-in-up">
            <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">TechHub Sales Portal</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access your personalized sales dashboard to track orders, manage customers, and monitor your performance.
            </p>
          </div>

          {/* Login Button */}
          <div className="animate-scale-in animate-delay-200">
            <Button size="lg" onClick={() => setIsLoginModalOpen(true)} className="text-lg px-8 py-3">
              <User className="mr-2 h-5 w-5" />
              Sales Login
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 animate-fade-in-up animate-delay-300">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Track Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your sales metrics, track order progress, and view your performance analytics in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Manage Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access customer information, order history, and manage relationships to provide better service.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View and update order statuses, track shipments, and ensure smooth order fulfillment processes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SalesLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </div>
  )
}
