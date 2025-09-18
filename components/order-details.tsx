import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Calendar, CreditCard, Package } from "lucide-react"

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

interface OrderDetailsProps {
  order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
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

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{order.id}</h2>
          <p className="text-muted-foreground">Order placed on {order.orderDate}</p>
        </div>
        <div className="flex space-x-2">
          {getStatusBadge(order.status)}
          {getPaymentStatusBadge(order.paymentStatus)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{order.customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{order.customer.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Order Date: {order.orderDate}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Payment Method: </span>
              <span className="capitalize">{order.paymentMethod.replace("-", " ")}</span>
            </div>
            {order.salesPerson && (
              <div className="text-sm">
                <span className="text-muted-foreground">Sales Person: </span>
                <span>{order.salesPerson}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.products.map((product, index) => (
              <div key={product.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Total: ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                {index < order.products.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span>${order.total}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
