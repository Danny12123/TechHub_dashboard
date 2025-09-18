"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // useEffect(() => {
  //   // Set authentication flag for demo
  //   sessionStorage.setItem("admin-logged-in", "true")
  // }, [])

  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+2 from last month",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Users",
      value: "12",
      change: "+3 from last month",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Orders",
      value: "8",
      change: "+1 from last week",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+15% from last month",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const recentProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: "$1,199",
      status: "Active",
      stock: 15
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      price: "$2,499",
      status: "Active",
      stock: 8
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      price: "$399",
      status: "Low Stock",
      stock: 3
    },
    {
      id: 4,
      name: "Samsung Galaxy S24",
      price: "$1,299",
      status: "Active",
      stock: 12
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/products/new")}
          className="w-fit"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="admin-grid">
        {stats.map((stat, index) =>
          <Card
            key={stat.title}
            className="admin-card animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Products */}
      <Card className="animate-fade-in-up animate-delay-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>
                Latest products added to your inventory
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/products")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="admin-table-responsive">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Stock
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(product =>
                  <tr
                    key={product.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {product.price}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {product.stock}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
