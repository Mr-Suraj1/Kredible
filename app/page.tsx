import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  MessageSquare,
  Users,
  Zap,
  Share2,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { FAQSection } from "@/components/faq-section"
import { TeamSection } from "@/components/team-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import KredibleDemo from "@/components/kredible-demo"
import { HowItWorksSection } from "@/components/how-it-works-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar isLoggedIn={false} userRole="recruiter" notifications={0} />

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Automate Your Candidate Due Diligence
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Collect and display key social-proof stats (GitHub, Stack Overflow, LinkedIn) in one click.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  See Example Card
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>

            {/* Candidate Card Mockup */}
            <div className="relative">
              <Card className="max-w-md mx-auto shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Sarah Chen</h3>
                      <p className="text-muted-foreground">Senior Full Stack Developer</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Github className="h-5 w-5 text-foreground" />
                        <span className="text-sm">GitHub Repos</span>
                      </div>
                      <Badge variant="secondary">47</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-orange-500" />
                        <span className="text-sm">Stack Overflow</span>
                      </div>
                      <Badge variant="secondary">2.1k rep</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <Badge variant="secondary">500+ connections</Badge>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-transparent" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Stop Wasting Hours on Manual Research
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Recruiters spend hours manually visiting profiles across GitHub, Stack Overflow, and LinkedIn to verify
              candidate credentials. This tedious process slows down hiring and creates inconsistent evaluation
              standards.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* See Kredible in Action */}
      <section id="demo" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">See Kredible in Action</h2>
            <p className="text-xl text-muted-foreground">Watch how our platform transforms candidate verification</p>
          </div>

          <KredibleDemo />
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to make informed hiring decisions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Github className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">GitHub Repository Count</h3>
                <p className="text-muted-foreground">Track public repositories, contributions, and coding activity.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Stack Overflow Reputation</h3>
                <p className="text-muted-foreground">Measure community engagement and technical expertise.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Linkedin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">LinkedIn Headline</h3>
                <p className="text-muted-foreground">Professional summary and connection network insights.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
                <p className="text-muted-foreground">Automatically sync the latest profile information.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">One-click Share</h3>
                <p className="text-muted-foreground">Easily share candidate profiles with your hiring team.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instant Generation</h3>
                <p className="text-muted-foreground">Generate comprehensive profiles in seconds, not hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Transform Your Hiring Process?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the waitlist and be among the first to experience automated candidate due diligence.
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white border-white text-gray-900 placeholder-gray-500"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8">Get Early Access</Button>
              </div>
              <p className="text-sm text-blue-200 mt-4">No spam, unsubscribe at any time. We respect your privacy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/images/kredible-logo.png" alt="Kredible Logo" className="w-8 h-8 invert" />
                <span className="text-xl font-bold">Kredible</span>
              </div>
              <p className="text-gray-400">
                Automate your candidate due diligence with comprehensive social proof aggregation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Team Section in Footer */}
            <TeamSection />
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Kredible. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
