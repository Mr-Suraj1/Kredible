"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { ArrowRight, CheckCircle, Mail, Shield, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { kredibleAPI, validateEmail } from "@/lib/api"

export default function RecruiterSignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    companySize: "",
    candidateEmail: "",
    candidateName: "",
    positionTitle: "",
    additionalNotes: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCandidateForm, setShowCandidateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.jobTitle) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }
    
    try {
      setShowCandidateForm(true)
    } catch (error) {
      console.error("Error submitting recruiter form:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCandidateInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    // Validate candidate fields
    if (!formData.candidateName || !formData.candidateEmail || !formData.positionTitle) {
      setError("Please fill in all required candidate fields")
      setIsSubmitting(false)
      return
    }

    // Validate candidate email format
    if (!validateEmail(formData.candidateEmail)) {
      setError("Please enter a valid candidate email address")
      setIsSubmitting(false)
      return
    }
    
    try {
      const response = await kredibleAPI.submitRecruiterRequest(formData)
      
      if (response.success) {
        setGeneratedToken(response.data?.token || null)
        setIsSuccess(true)
      } else {
        setError(response.error || "Failed to send invitation. Please try again.")
      }
    } catch (error) {
      console.error("Error sending candidate invite:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    console.log("Google authentication triggered")
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={false} userRole="recruiter" notifications={0} />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="max-w-lg mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Request Sent Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                We've sent an email to <strong>{formData.candidateEmail}</strong> with instructions to complete their profile verification.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Candidate will receive a secure link to complete their profile</p>
                <p>✓ You'll be notified when the profile is ready</p>
                <p>✓ The verification typically takes 2-5 minutes</p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button asChild className="flex-1">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Send Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={false} userRole="recruiter" notifications={0} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {showCandidateForm ? "Invite Candidate" : "Start Candidate Verification"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {showCandidateForm 
                ? "Send a secure verification link to your candidate"
                : "Get comprehensive social proof data for your candidates in minutes"
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !showCandidateForm ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {!showCandidateForm ? '1' : <CheckCircle className="h-5 w-5" />}
                </div>
                <span className="ml-2 text-sm">Recruiter Info</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  showCandidateForm ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm">Candidate Invite</span>
              </div>
            </div>
          </div>

          {!showCandidateForm ? (
            /* Recruiter Form */
            <Card>
              <CardHeader>
                <CardTitle>Recruiter Information</CardTitle>
                <CardDescription>
                  Tell us about yourself and get started with candidate verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecruiterSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Google Auth Button */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleAuth}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Continue with Google (Recommended)
                    </Button>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue manually
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john.smith@company.com"
                    />
                  </div>

                  {/* Company Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        required
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        required
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        placeholder="Senior Recruiter"
                      />
                    </div>
                  </div>

                  {/* Company Size */}
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select onValueChange={(value) => handleInputChange("companySize", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Continue to Candidate Invite"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Candidate Invite Form */
            <Card>
              <CardHeader>
                <CardTitle>Invite Candidate</CardTitle>
                <CardDescription>
                  Send a secure verification link to your candidate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCandidateInvite} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Candidate Info */}
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">Candidate Name *</Label>
                    <Input
                      id="candidateName"
                      required
                      value={formData.candidateName}
                      onChange={(e) => handleInputChange("candidateName", e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidateEmail">Candidate Email *</Label>
                    <Input
                      id="candidateEmail"
                      type="email"
                      required
                      value={formData.candidateEmail}
                      onChange={(e) => handleInputChange("candidateEmail", e.target.value)}
                      placeholder="jane.doe@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="positionTitle">Position Title *</Label>
                    <Input
                      id="positionTitle"
                      required
                      value={formData.positionTitle}
                      onChange={(e) => handleInputChange("positionTitle", e.target.value)}
                      placeholder="Senior Frontend Developer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      placeholder="Any specific requirements or notes for the candidate..."
                      rows={3}
                    />
                  </div>

                  {/* Preview Box */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Preview
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>To:</strong> {formData.candidateEmail || "candidate@email.com"}</p>
                      <p><strong>Subject:</strong> Profile Verification Request from {formData.company}</p>
                      <p><strong>Message:</strong> Hi {formData.candidateName || "Jane"}, {formData.firstName} from {formData.company} has requested to verify your professional profile for the {formData.positionTitle || "position"} role...</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCandidateForm(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending Invite..." : "Send Verification Invite"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                All candidate data is encrypted and only accessible to authorized users
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Candidate-Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Simple 2-minute process for candidates to share their profiles
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get comprehensive social proof data in minutes, not hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
