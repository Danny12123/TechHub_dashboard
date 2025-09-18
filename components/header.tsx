"use client"

import { useState } from "react"
import Link from "next/link"
import { Smartphone, Laptop, Speaker } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TechHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/phones"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Smartphone className="h-4 w-4" />
                Phones
              </Link>
              <Link
                href="/computers"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Laptop className="h-4 w-4" />
                Computers
              </Link>
              <Link
                href="/speakers"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Speaker className="h-4 w-4" />
                Speakers
              </Link>
              <div className="relative">
                <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors peer">
                  Company
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/shipping"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      Shipping Info
                    </Link>
                    <Link
                      href="/returns"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      Returns & Exchanges
                    </Link>
                    <Link
                      href="/warranty"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      Warranty
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
