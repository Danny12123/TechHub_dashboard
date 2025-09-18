import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Calendar, Clock, ShoppingBag, DollarSign } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "sales" | "customer"
  status: "active" | "inactive" | "suspended"
  avatar: string
  phone: string
  joinDate: string
  lastLogin: string
  totalOrders: number
  totalSpent: number
}

interface UserDetailsProps {
  user: User
}

export function UserDetails({ user }: UserDetailsProps) {
  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
    }
  }

  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">Admin</Badge>
      case "sales":
        return <Badge variant="outline">Sales</Badge>
      case "customer":
        return <Badge variant="secondary">Customer</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-6">
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="flex items-center space-x-2">
            {getStatusBadge(user.status)}
            {getRoleBadge(user.role)}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Join Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{user.joinDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Last Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{user.lastLogin}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${user.totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
