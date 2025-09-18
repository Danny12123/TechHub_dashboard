"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <Badge variant="secondary" className="animate-scale-in">
                <Zap className="h-3 w-3 mr-1" />
                Latest Tech Arrivals
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Discover the <span className="text-primary">Future</span> of Technology
              </h1>

              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                From cutting-edge smartphones to powerful computers and premium speakers. Find the perfect tech that
                matches your lifestyle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-200">
              <Button size="lg" asChild>
                <Link href="/products" className="hover:scale-105 transition-transform">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-8 animate-fade-in-up animate-delay-300">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.9/5 from 2,500+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
