"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LogOut, Package, DollarSign, TrendingUp, Users } from "lucide-react"

interface SalesUser {
  email: string
  name: string
  role: string
}

interface SalesDashboardProps {
  user: SalesUser
  onLogout: () => void
}

export function SalesDashboard({ user, onLogout }: SalesDashboardProps) {
  const [myOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "iPhone 15 Pro Max",
      amount: 1199,
      status: "delivered",
      date: "2024-01-20",
    },
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      product: "iPhone 15 Pro Max",
      amount: 1199,
      status: "pending",
      date: "2024-01-17",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "MacBook Air M3",
      amount: 1299,
      status: "processing",
      date: "2024-01-19",
    },
  ])

  const myStats = {
    totalSales: myOrders.reduce((sum, order) => sum + order.amount, 0),
    totalOrders: myOrders.length,
    pendingOrders: myOrders.filter((order) => order.status === "pending").length,
    completedOrders: myOrders.filter((order) => order.status === "delivered").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge variant="default">Processing</Badge>
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${myStats.totalSales.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className="text-primary">This month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in animate-delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.totalOrders}</div>
            <div className="text-xs text-muted-foreground">Total orders handled</div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in animate-delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.pendingOrders}</div>
            <div className="text-xs text-muted-foreground">Require attention</div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in animate-delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.completedOrders}</div>
            <div className="text-xs text-muted-foreground">Successfully delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* My Orders */}
      <Card className="animate-fade-in-up animate-delay-200">
        <CardHeader>
          <CardTitle>My Recent Orders</CardTitle>
          <CardDescription>Orders you've handled recently</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>${order.amount}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
