import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Adebayo Johnson",
      location: "Lagos, Nigeria",
      rating: 5,
      text: "Excellent service! Got my iPhone 15 Pro delivered within 24 hours. The packaging was perfect and the phone is 100% authentic. Will definitely shop here again.",
      product: "iPhone 15 Pro Max",
    },
    {
      name: "Sarah Okonkwo",
      location: "Abuja, Nigeria",
      rating: 5,
      text: "TechHub has the best customer service I've experienced. When I had an issue with my laptop, they resolved it immediately and even offered a replacement. Highly recommended!",
      product: "MacBook Pro M3",
    },
    {
      name: "Michael Chen",
      location: "Port Harcourt, Nigeria",
      rating: 5,
      text: "Great prices and fast delivery. I've bought multiple items from TechHub and they never disappoint. The warranty support is also excellent.",
      product: "Samsung Galaxy S24 Ultra",
    },
    {
      name: "Fatima Abdullahi",
      location: "Kano, Nigeria",
      rating: 5,
      text: "I was skeptical about buying expensive electronics online, but TechHub proved me wrong. Everything was perfect from ordering to delivery. Thank you!",
      product: 'iPad Pro 12.9"',
    },
    {
      name: "David Okafor",
      location: "Enugu, Nigeria",
      rating: 5,
      text: "The best tech store in Nigeria! Authentic products, competitive prices, and amazing customer support. I've recommended TechHub to all my friends.",
      product: "Sony WH-1000XM5",
    },
    {
      name: "Grace Emeka",
      location: "Calabar, Nigeria",
      rating: 5,
      text: "Fast delivery, great packaging, and the product was exactly as described. The return policy gave me confidence to make the purchase. Very satisfied!",
      product: "Dell XPS 13",
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Customer Reviews
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Join thousands of satisfied customers who trust TechHub for their technology needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="absolute top-4 right-4 opacity-10 hover:opacity-20 transition-opacity">
                  <Quote className="h-12 w-12 text-primary" />
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.product}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
