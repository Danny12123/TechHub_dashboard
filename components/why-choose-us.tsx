import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Truck, Headphones, Award, Clock, Heart } from "lucide-react"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "100% Authentic",
      description: "All products come with manufacturer warranty and authenticity guarantee",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Express delivery within 24-48 hours in major cities across Nigeria",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support via phone, email, and live chat",
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive pricing with regular discounts and special offers",
    },
    {
      icon: Clock,
      title: "Easy Returns",
      description: "Hassle-free 30-day return policy with full refund guarantee",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Over 50,000 satisfied customers with 99.8% satisfaction rate",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Why Choose TechHub
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Your Trusted Technology Partner</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            We're committed to providing the best technology shopping experience with unmatched service and support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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
