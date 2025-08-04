"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "This would cut our screening time in half. The automated verification is exactly what we've been looking for.",
    author: "Rachel Thompson",
    role: "Senior Recruiter",
    company: "TechFlow",
    type: "Early Feedback",
  },
  {
    quote:
      "Finally, a solution that aggregates all the social proof we need in one place. This is a game-changer for technical hiring.",
    author: "Michael Chen",
    role: "Head of Talent",
    company: "DevCorp",
    type: "Beta User",
  },
  {
    quote:
      "The time savings alone would justify the cost. But the consistency in candidate evaluation is the real value.",
    author: "Sarah Williams",
    role: "VP of Engineering",
    company: "StartupLab",
    type: "Advisor Feedback",
  },
]

const companyLogos = [
  { name: "TechFlow", logo: "/placeholder.svg?height=40&width=120&text=TechFlow" },
  { name: "DevCorp", logo: "/placeholder.svg?height=40&width=120&text=DevCorp" },
  { name: "StartupLab", logo: "/placeholder.svg?height=40&width=120&text=StartupLab" },
  { name: "CodeBase", logo: "/placeholder.svg?height=40&width=120&text=CodeBase" },
  { name: "InnovateTech", logo: "/placeholder.svg?height=40&width=120&text=InnovateTech" },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Early Feedback</h2>
          <p className="text-xl text-muted-foreground">What recruiters and advisors are saying about Kredible</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 relative">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-blue-600 opacity-50" />
                </div>

                <p className="text-muted-foreground italic text-lg leading-relaxed">"{testimonial.quote}"</p>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {testimonial.type}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8">Trusted by teams at</p>
          <div className="flex justify-center items-center space-x-12 opacity-60 flex-wrap gap-4">
            {companyLogos.map((company, index) => (
              <img
                key={index}
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
