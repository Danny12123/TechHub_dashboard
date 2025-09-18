"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, Edit, Package, TrendingUp, DollarSign, Users } from "lucide-react"
import { OrderDetails } from "@/components/order-details"
import { SalesChart } from "@/components/sales-chart"

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  products: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "online" | "cash-on-delivery"
  paymentStatus: "paid" | "pending" | "failed"
  orderDate: string
  salesPerson?: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    products: [
      { id: "1", name: "iPhone 15 Pro Max", quantity: 1, price: 1199 },
      { id: "2", name: "AirPods Pro", quantity: 1, price: 249 },
    ],
    total: 1448,
    status: "delivered",
    paymentMethod: "online",
    paymentStatus: "paid",
    orderDate: "2024-01-20",
    salesPerson: "Jane Smith",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
    },
    products: [{ id: "3", name: "MacBook Air M3", quantity: 1, price: 1299 }],
    total: 1299,
    status: "processing",
    paymentMethod: "cash-on-delivery",
    paymentStatus: "pending",
    orderDate: "2024-01-19",
    salesPerson: "John Doe",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1 (555) 456-7890",
    },
    products: [{ id: "4", name: "Samsung Galaxy S24", quantity: 2, price: 899 }],
    total: 1798,
    status: "shipped",
    paymentMethod: "online",
    paymentStatus: "paid",
    orderDate: "2024-01-18",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1 (555) 321-0987",
    },
    products: [{ id: "1", name: "iPhone 15 Pro Max", quantity: 1, price: 1199 }],
    total: 1199,
    status: "pending",
    paymentMethod: "cash-on-delivery",
    paymentStatus: "pending",
    orderDate: "2024-01-17",
    salesPerson: "Jane Smith",
  },
]

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge variant="default">Processing</Badge>
      case "shipped":
        return <Badge variant="outline">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
    }
  }

  const getPaymentStatusBadge = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
        <p className="text-muted-foreground">Track orders and manage sales performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className="text-primary">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in animate-delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className="text-primary">+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in animate-delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <div className="text-xs text-muted-foreground">Require attention</div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in animate-delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
            <div className="text-xs text-muted-foreground">Successfully completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="animate-fade-in-up animate-delay-200">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="animate-fade-in-up animate-delay-300">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>{filteredOrders.length} orders found</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Sales Person</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                  <TableCell>{order.salesPerson || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Mark Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}>
                          <Package className="mr-2 h-4 w-4" />
                          Mark Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                          <Package className="mr-2 h-4 w-4" />
                          Mark Delivered
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
