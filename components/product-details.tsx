import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive" | "out-of-stock"
  image: string
  description: string
  brand: string
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-6">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-32 h-32 rounded-lg object-cover"
        />
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-lg text-muted-foreground">{product.brand}</p>
          <div className="flex items-center space-x-2">
            {getStatusBadge(product.status)}
            <Badge variant="outline">{product.category}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${product.price}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{product.stock}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{product.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
