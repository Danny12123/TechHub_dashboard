"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface ProductGridProps {
  viewMode: "grid" | "list"
  sortBy: string
  filters: any
}

// Extended product data
const allProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "phones",
    brand: "apple",
    price: 1199,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 1250,
    image: "/modern-smartphone.png",
    badge: "Best Seller",
    badgeVariant: "destructive" as const,
    description: "The most advanced iPhone with titanium design and A17 Pro chip",
    inStock: true,
    features: ["A17 Pro Chip", "48MP Camera", "Titanium Design", "USB-C"],
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    category: "computers",
    brand: "apple",
    price: 2499,
    originalPrice: null,
    rating: 4.8,
    reviews: 890,
    image: "/macbook.jpg",
    badge: "New Arrival",
    badgeVariant: "secondary" as const,
    description: "Supercharged by M3 Pro and M3 Max chips for extreme performance",
    inStock: true,
    features: ["M3 Pro Chip", "16-inch Display", "22-hour Battery", "Liquid Retina XDR"],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "speakers",
    brand: "sony",
    price: 399,
    originalPrice: 449,
    rating: 4.7,
    reviews: 2100,
    image: "/diverse-people-listening-headphones.png",
    badge: "Sale",
    badgeVariant: "destructive" as const,
    description: "Industry-leading noise canceling with premium sound quality",
    inStock: true,
    features: ["Noise Canceling", "30-hour Battery", "Quick Charge", "Multipoint Connection"],
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    category: "phones",
    brand: "samsung",
    price: 1299,
    originalPrice: null,
    rating: 4.8,
    reviews: 950,
    image: "/samsung-products.png",
    badge: "Featured",
    badgeVariant: "default" as const,
    description: "Galaxy AI is here. Search like never before, get real-time interpretation",
    inStock: true,
    features: ["Galaxy AI", "200MP Camera", "S Pen", "Titanium Frame"],
  },
  {
    id: 5,
    name: "Dell XPS 13",
    category: "computers",
    brand: "dell",
    price: 1199,
    originalPrice: 1399,
    rating: 4.6,
    reviews: 670,
    image: "/dell-laptop.png",
    badge: "Deal",
    badgeVariant: "secondary" as const,
    description: "Ultra-portable laptop with stunning InfinityEdge display",
    inStock: true,
    features: ["Intel Core i7", "13.4-inch Display", "16GB RAM", "512GB SSD"],
  },
  {
    id: 6,
    name: "JBL Charge 5",
    category: "speakers",
    brand: "jbl",
    price: 179,
    originalPrice: 199,
    rating: 4.5,
    reviews: 1800,
    image: "/jbl-speaker.jpg",
    badge: "Popular",
    badgeVariant: "outline" as const,
    description: "Portable Bluetooth speaker with powerful sound and powerbank feature",
    inStock: true,
    features: ["20-hour Playtime", "IP67 Waterproof", "PowerBank", "JBL Pro Sound"],
  },
]

export function ProductGrid({ viewMode, sortBy, filters }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<number[]>([])
  const { addItem } = useCart()
  const { toast } = useToast()

  // Filter and sort products
  let filteredProducts = allProducts.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category) return false
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false
    if (filters.rating > 0 && product.rating < filters.rating) return false
    return true
  })

  // Sort products
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-64 h-48 md:h-auto overflow-hidden rounded-l-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {product.badge && (
                    <Badge variant={product.badgeVariant} className="absolute top-3 left-3">
                      {product.badge}
                    </Badge>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between h-full">
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {product.category}
                        </span>
                        <h3 className="font-semibold text-xl hover:text-primary transition-colors">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {product.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="md:text-right space-y-4 mt-4 md:mt-0 md:ml-6">
                      <div>
                        <div className="flex items-center gap-2 md:justify-end">
                          <span className="text-2xl font-bold text-primary">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 md:justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleWishlist(product.id)}
                          className={wishlist.includes(product.id) ? "text-red-500" : ""}
                        >
                          <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
                        </Button>

                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          disabled={!product.inStock}
                          className="min-w-32"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product, index) => (
        <Card
          key={product.id}
          className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in border-0 bg-card/50 backdrop-blur"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
              />

              {product.badge && (
                <Badge variant={product.badgeVariant} className="absolute top-3 left-3">
                  {product.badge}
                </Badge>
              )}

              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              )}

              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => toggleWishlist(product.id)}>
                  <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <div className="mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</span>
              </div>

              <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{product.name}</h3>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 hover:scale-105 transition-transform"
                  disabled={!product.inStock}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
