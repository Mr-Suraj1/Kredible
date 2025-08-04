"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "Perfect for small teams getting started",
    features: [
      "50 candidate verifications/month",
      "GitHub, LinkedIn, Stack Overflow",
      "Basic candidate cards",
      "Email support",
      "Standard integrations",
    ],
    notIncluded: ["Custom branding", "API access", "Priority support", "Advanced analytics"],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "Best for growing recruitment teams",
    features: [
      "200 candidate verifications/month",
      "All platform integrations",
      "Custom branding & white-label",
      "ATS integrations",
      "Priority email support",
      "Advanced analytics",
      "Bulk exports",
      "API access",
    ],
    notIncluded: ["Phone support", "Dedicated success manager"],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited verifications",
      "All Professional features",
      "Phone & priority support",
      "Dedicated success manager",
      "Custom integrations",
      "SLA guarantees",
      "Advanced security features",
      "Custom reporting",
      "Multi-tenant support",
    ],
    notIncluded: [],
    popular: false,
    cta: "Contact Sales",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your team size and needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-blue-500 shadow-lg scale-105 bg-background" : "bg-background"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">/{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 opacity-50">
                      <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">View Feature Comparison</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
