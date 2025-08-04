"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Mail, Database, Share2 } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-blue-50">
      {" "}
      {/* Changed background color */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Complete Candidate Verification Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From email input to verified profile - Kredible guides you through every step
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Step 1: Email & Signup */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Email & Invitation</h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Enter candidate email and send secure verification link. No complex forms or lengthy registration
                  process.
                </p>

                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">One-click email invitation</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-xl bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <img src="/images/kredible-logo.png" alt="Kredible" className="w-6 h-6" />
                      <span className="font-semibold">Start Verification with Kredible</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Email</label>
                      <Input type="email" placeholder="sarah.chen@example.com" className="w-full" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 2: Smart Dashboard */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Smart Verification</h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Candidate submits profile URLs and watch real-time status updates as our AI gathers comprehensive data
                  and insights.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Real-time progress tracking</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Live status updates</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:order-1 relative">
              <Card className="shadow-xl bg-white">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Database className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold text-lg">Verification: "Sarah Chen"</span>
                      <span className="text-sm text-green-600 font-medium">Analyzing...</span>
                    </div>

                    <div className="space-y-4">
                      <Progress value={75} className="w-full h-3" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">GitHub Profile</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Stack Overflow</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">LinkedIn Profile</span>
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 3: Profile Ready */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Profile Ready</h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Complete candidate profile with actionable insights ready to share with your hiring team in seconds.
                </p>

                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Instant profile generation</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-xl bg-white">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold">Generated Profile Preview</h4>
                    <p className="text-sm text-gray-600">Complete verification ready</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">GitHub Repositories</span>
                      <span className="text-sm font-bold text-blue-600">47 repos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Stack Overflow Rep</span>
                      <span className="text-sm font-bold text-orange-600">2.1k points</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">LinkedIn Network</span>
                      <span className="text-sm font-bold text-blue-600">500+ connections</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Copy Profile
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Download
                    </Button>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
