"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Eye, Edit, Trash2, Package } from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: "$1,199",
      category: "Smartphones",
      status: "Active",
      stock: 15,
      image: "/modern-smartphone.png",
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      price: "$2,499",
      category: "Computers",
      status: "Active",
      stock: 8,
      image: "/macbook.jpg",
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      price: "$399",
      category: "Audio",
      status: "Low Stock",
      stock: 3,
      image: "/diverse-people-listening-headphones.png",
    },
    {
      id: 4,
      name: "Samsung Galaxy S24",
      price: "$1,299",
      category: "Smartphones",
      status: "Active",
      stock: 12,
      image: "/samsung-products.png",
    },
    {
      id: 5,
      name: "iPad Pro 12.9",
      price: "$1,099",
      category: "Tablets",
      status: "Active",
      stock: 20,
      image: "/silver-ipad-on-wooden-desk.png",
    },
    {
      id: 6,
      name: "Dell XPS 13",
      price: "$1,299",
      category: "Computers",
      status: "Out of Stock",
      stock: 0,
      image: "/dell-laptop.png",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase().replace(" ", "-") === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and listings</p>
        </div>
        <Button onClick={() => router.push("/dashboard/products/new")} className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Products</CardTitle>
          <CardDescription>Search and filter your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="admin-grid">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="admin-card animate-fade-in-up hover:shadow-lg transition-all duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary">{product.price}</span>
                    <Badge
                      variant={
                        product.status === "Active"
                          ? "default"
                          : product.status === "Low Stock"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Stock: {product.stock}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"}
            </p>
            <Button onClick={() => router.push("/dashboard/products/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
