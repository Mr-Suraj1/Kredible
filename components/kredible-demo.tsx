"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Mail,
  Database,
  CheckCircle,
  Pause,
  Play,
  Github,
  Linkedin,
  MessageSquare,
  Loader2,
  Send,
  Share2,
} from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Enter Email",
    description: "Recruiter enters candidate email",
    icon: Mail,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Gathering Data",
    description: "AI collects profile information",
    icon: Database,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 3,
    title: "Profile Ready",
    description: "Complete candidate profile generated",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 4,
    title: "Share Profile",
    description: "Ready to share with hiring team",
    icon: Share2, // Changed to Share2 for consistency
    color: "bg-purple-100 text-purple-600",
  },
]

export default function KredibleDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [email, setEmail] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [candidateData, setCandidateData] = useState({
    name: "",
    title: "",
    github: 0,
    stackoverflow: 0,
    linkedin: "",
    isLoading: false,
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetDemo = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setCurrentStep(0)
    setProgress(0)
    setIsCompleted(false)
    setEmail("")
    setIsTyping(false)
    setCandidateData({
      name: "",
      title: "",
      github: 0,
      stackoverflow: 0,
      linkedin: "",
      isLoading: false,
    })
  }

  useEffect(() => {
    if (!isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    const runStep = (stepIndex: number) => {
      setCurrentStep(stepIndex)
      setProgress(((stepIndex + 1) / steps.length) * 100)

      if (stepIndex === 0) {
        // Step 0: Recruiter enters email (typing animation)
        setEmail("") // Clear email for re-typing
        setIsTyping(true)
        const emailText = "sarah.chen@example.com"
        let currentText = ""
        let charIndex = 0

        const typeEmail = () => {
          if (charIndex < emailText.length) {
            currentText += emailText[charIndex]
            setEmail(currentText)
            charIndex++
            timeoutRef.current = setTimeout(typeEmail, 80) // Typing speed
          } else {
            setIsTyping(false)
            timeoutRef.current = setTimeout(() => runStep(1), 1500) // Wait after typing
          }
        }
        timeoutRef.current = setTimeout(typeEmail, 500) // Start typing after a short delay
      } else if (stepIndex === 1) {
        // Step 1: Candidate portal / Data aggregation (simulated)
        setCandidateData((prev) => ({ ...prev, isLoading: true }))
        timeoutRef.current = setTimeout(() => {
          setCandidateData((prev) => ({ ...prev, github: 47 }))
          timeoutRef.current = setTimeout(() => {
            setCandidateData((prev) => ({ ...prev, stackoverflow: 2100 }))
            timeoutRef.current = setTimeout(() => {
              setCandidateData((prev) => ({
                ...prev,
                linkedin: "500+ connections",
                isLoading: false,
                name: "Sarah Chen", // Ensure name is set for the final card
                title: "Senior Full Stack Developer", // Ensure title is set for the final card
              }))
              timeoutRef.current = setTimeout(() => runStep(2), 1500) // Move to next step
            }, 1000) // LinkedIn data load
          }, 1000) // Stack Overflow data load
        }, 1000) // GitHub data load
      } else if (stepIndex === 2) {
        // Step 2: Profile Ready (display final card)
        setIsCompleted(true)
        timeoutRef.current = setTimeout(() => runStep(3), 3000) // Display final card for 3 seconds
      } else if (stepIndex === 3) {
        // Step 3: Share Profile (final step, then loop)
        setIsCompleted(true) // Keep completed state
        timeoutRef.current = setTimeout(() => {
          resetDemo() // Reset all states
          runStep(0) // Restart the demo
        }, 3000) // Hold final state before looping
      }
    }

    // Initial start or restart
    if (isPlaying) {
      resetDemo() // Ensure a clean start
      runStep(0)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying]) // Only re-run when isPlaying changes

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="transition-all duration-500 ease-in-out opacity-100 scale-100">
            <Card className="max-w-md mx-auto shadow-xl">
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Email</label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter candidate email..."
                      value={email}
                      readOnly
                      className="w-full pr-8"
                    />
                    {isTyping && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-0.5 h-4 bg-blue-600 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  className={`w-full transition-all duration-300 ${email ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"}`}
                  disabled={!email}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Verification Request
                </Button>
                {email && !isTyping && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm animate-fade-in">
                    <CheckCircle className="h-4 w-4" />
                    <span>Verification request sent!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 1:
        return (
          <div className="transition-all duration-500 ease-in-out opacity-100 scale-100">
            <Card className="max-w-md mx-auto shadow-xl">
              <CardContent className="space-y-4 p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Data Aggregation</h3>
                  <p className="text-sm text-gray-600">Analyzing profiles and extracting key metrics...</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between animate-fade-in">
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-gray-700" />
                      <span className="text-sm">Fetching GitHub data</span>
                    </div>
                    {candidateData.github > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {candidateData.github}
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>

                  <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Analyzing Stack Overflow</span>
                    </div>
                    {candidateData.stackoverflow > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {candidateData.stackoverflow.toLocaleString()}
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>

                  <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Processing LinkedIn</span>
                    </div>
                    {candidateData.linkedin ? (
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {candidateData.linkedin}
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Processing...</span>
                    <span>
                      {candidateData.linkedin
                        ? "100%"
                        : candidateData.stackoverflow > 0
                          ? "75%"
                          : candidateData.github > 0
                            ? "50%"
                            : "25%"}
                    </span>
                  </div>
                  <Progress
                    value={
                      candidateData.linkedin
                        ? 100
                        : candidateData.stackoverflow > 0
                          ? 75
                          : candidateData.github > 0
                            ? 50
                            : 25
                    }
                    className="w-full h-2 transition-all duration-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
      case 3: // Both steps 2 and 3 will show the final card
        return (
          <div className="transition-all duration-500 ease-in-out opacity-100 scale-100">
            <Card className="max-w-md mx-auto shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Generated Profile Preview</h3>
                  <p className="text-sm text-gray-600">Complete verification ready</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GitHub Repos</span>
                    <Badge variant="secondary">47</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stack Overflow Rep</span>
                    <Badge variant="secondary">2.1k</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LinkedIn Connections</span>
                    <Badge variant="secondary">500+</Badge>
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
                    Share Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Control Button */}
      <div className="text-center mb-12">
        <Button onClick={togglePlayPause} variant="outline" className="bg-white border-gray-300 hover:bg-gray-50">
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause Demo
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Play Demo
            </>
          )}
        </Button>
      </div>

      {/* Steps Flow */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200 rounded-full mx-8">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" // Changed to bg-blue-500
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index <= currentStep
            const isCurrent = index === currentStep

            return (
              <div key={step.id} className="text-center">
                {/* Icon Circle */}
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? isCurrent && step.id === 3 // Highlight step 3 (Profile Ready) as the "Insights Ready" equivalent
                        ? "bg-blue-500 text-white scale-110 shadow-lg" // Changed highlight color to blue
                        : step.color
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                {/* Step Info */}
                <div className="space-y-2">
                  <h3
                    className={`font-semibold text-lg transition-colors ${
                      isActive ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className={`text-sm transition-colors ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Completion Message */}
        {isCompleted && (
          <div className="text-center mt-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Verification completed!</span>
            </div>
            <div className="mt-4">
              <Progress value={100} className="w-64 mx-auto h-2" />
            </div>
          </div>
        )}
      </div>

      {/* Demo Content Display */}
      <div className="min-h-[300px] flex items-center justify-center relative overflow-hidden mt-16">
        {renderStepContent()}
      </div>
    </div>
  )
}
