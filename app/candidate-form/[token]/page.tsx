"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { 
  Github, 
  Linkedin, 
  MessageSquare, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Info
} from "lucide-react"
import { kredibleAPI, validateGitHubUsername, validateLinkedInUrl, validateStackOverflowUrl } from "@/lib/api"

interface RequestData {
  recruiterName: string
  recruiterCompany: string
  positionTitle: string
  candidateName: string
  candidateEmail: string
  additionalNotes?: string
}

export default function CandidateFormPage() {
  const params = useParams()
  const token = params.token as string
  
  const [requestData, setRequestData] = useState<RequestData | null>(null)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    githubUsername: "",
    linkedinUrl: "",
    stackoverflowUrl: "",
    portfolioUrl: "",
    additionalProfiles: [""],
    additionalInfo: ""
  })

  useEffect(() => {
    // Validate token and fetch request data
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await kredibleAPI.validateCandidateToken(token)
        
        if (response.success && response.data) {
          setRequestData(response.data)
          setIsValidToken(true)
        } else {
          setIsValidToken(false)
        }
      } catch (error) {
        console.error("Error validating token:", error)
        setIsValidToken(false)
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [token])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAdditionalProfileChange = (index: number, value: string) => {
    setFormData(prev => {
      const newProfiles = [...prev.additionalProfiles]
      newProfiles[index] = value
      return { ...prev, additionalProfiles: newProfiles }
    })
  }

  const addAdditionalProfile = () => {
    setFormData(prev => ({
      ...prev,
      additionalProfiles: [...prev.additionalProfiles, ""]
    }))
  }

  const removeAdditionalProfile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalProfiles: prev.additionalProfiles.filter((_, i) => i !== index)
    }))
  }

  const validateUrl = (url: string): boolean => {
    if (!url) return true // Optional fields
    try {
      new URL(url)
      return /^https?:\/\/.+$/i.test(url)
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    // Validate at least one profile is provided
    if (!formData.githubUsername && !formData.linkedinUrl && !formData.portfolioUrl) {
      setError("Please provide at least your GitHub, LinkedIn, or Portfolio URL to continue")
      setIsSubmitting(false)
      return
    }

    // Validate GitHub username format
    if (formData.githubUsername && !validateGitHubUsername(formData.githubUsername)) {
      setError("Please enter a valid GitHub username")
      setIsSubmitting(false)
      return
    }

    // Validate LinkedIn URL format
    if (formData.linkedinUrl && !validateLinkedInUrl(formData.linkedinUrl)) {
      setError("Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/your-profile)")
      setIsSubmitting(false)
      return
    }

    // Validate Stack Overflow URL format
    if (formData.stackoverflowUrl && !validateStackOverflowUrl(formData.stackoverflowUrl)) {
      setError("Please enter a valid Stack Overflow profile URL")
      setIsSubmitting(false)
      return
    }

    // Validate portfolio URL
    if (formData.portfolioUrl && !validateUrl(formData.portfolioUrl)) {
      setError("Please enter a valid portfolio/website URL")
      setIsSubmitting(false)
      return
    }

    // Validate additional profile URLs
    const invalidProfileIndex = formData.additionalProfiles.findIndex(url => 
      url.trim() && !validateUrl(url.trim())
    )
    if (invalidProfileIndex !== -1) {
      setError(`Please enter a valid URL for additional profile #${invalidProfileIndex + 1}`)
      setIsSubmitting(false)
      return
    }
    
    try {
      // Filter out empty additional profiles
      const cleanedFormData = {
        ...formData,
        additionalProfiles: formData.additionalProfiles.filter(url => url.trim())
      }
      
      const response = await kredibleAPI.submitCandidateForm(token, cleanedFormData)
      
      if (response.success) {
        setIsSuccess(true)
      } else {
        setError(response.error || "Failed to submit profile. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting candidate form:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={false} userRole="candidate" notifications={0} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying your invitation...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={false} userRole="candidate" notifications={0} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
              <p className="text-muted-foreground mb-6">
                This verification link is either invalid or has expired. Please contact the recruiter who sent you this link.
              </p>
              <Button asChild>
                <a href="/">Go to Homepage</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={false} userRole="candidate" notifications={0} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="max-w-lg mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Profile Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for completing your profile verification. <strong>{requestData?.recruiterName}</strong> from <strong>{requestData?.recruiterCompany}</strong> will be notified and can now review your comprehensive profile.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <p>✓ Your profile data has been securely compiled</p>
                  <p>✓ The recruiter will receive a comprehensive overview</p>
                  <p>✓ Your information is only visible to this specific recruiter</p>
                  <p>✓ You may be contacted directly for next steps</p>
                </div>
              </div>
              <Button asChild>
                <a href="/">Return to Kredible</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={false} userRole="candidate" notifications={0} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Complete Your Profile Verification
            </h1>
            <p className="text-xl text-muted-foreground">
              Help {requestData?.recruiterName} from {requestData?.recruiterCompany} learn more about your professional background
            </p>
          </div>

          {/* Request Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Verification Request Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Recruiter</Label>
                  <p className="font-semibold">{requestData?.recruiterName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                  <p className="font-semibold">{requestData?.recruiterCompany}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Position</Label>
                  <p className="font-semibold">{requestData?.positionTitle}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Your Name</Label>
                  <p className="font-semibold">{requestData?.candidateName}</p>
                </div>
              </div>
              {requestData?.additionalNotes && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">{requestData.additionalNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Alert className="mb-8">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Your privacy is protected.</strong> The information you provide will only be shared with {requestData?.recruiterName} from {requestData?.recruiterCompany} for this specific role evaluation. We do not store your credentials or sell your data.
            </AlertDescription>
          </Alert>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Share Your Professional Profiles</CardTitle>
              <CardDescription>
                Help us compile your social proof data from various platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center">
                    Full Name
                    <Badge variant="outline" className="ml-2">Optional</Badge>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Your full name (controls anonymity level)"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can choose to remain anonymous by leaving this blank
                  </p>
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <Label htmlFor="githubUsername" className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Username
                    <Badge variant="secondary" className="ml-2">Recommended</Badge>
                  </Label>
                  <Input
                    id="githubUsername"
                    value={formData.githubUsername}
                    onChange={(e) => handleInputChange("githubUsername", e.target.value)}
                    placeholder="your-github-username"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll analyze your repositories, contributions, and coding activity
                  </p>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl" className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                    LinkedIn Profile URL
                    <Badge variant="secondary" className="ml-2">Recommended</Badge>
                  </Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll extract your headline, experience, and connection count
                  </p>
                </div>

                {/* Stack Overflow */}
                <div className="space-y-2">
                  <Label htmlFor="stackoverflowUrl" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-orange-500" />
                    Stack Overflow Profile URL
                    <Badge variant="outline" className="ml-2">Optional</Badge>
                  </Label>
                  <Input
                    id="stackoverflowUrl"
                    type="url"
                    value={formData.stackoverflowUrl}
                    onChange={(e) => handleInputChange("stackoverflowUrl", e.target.value)}
                    placeholder="https://stackoverflow.com/users/your-id"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll include your reputation score and community contributions
                  </p>
                </div>

                {/* Portfolio/Personal Website */}
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-purple-600" />
                    Portfolio/Personal Website
                    <Badge variant="outline" className="ml-2">Optional</Badge>
                  </Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                    placeholder="https://your-portfolio.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your personal website, portfolio, or professional blog
                  </p>
                </div>

                {/* Additional Profiles */}
                <div className="space-y-3">
                  <Label className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-600" />
                    Additional Professional Profiles
                    <Badge variant="outline" className="ml-2">Optional</Badge>
                  </Label>
                  
                  {formData.additionalProfiles.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => handleAdditionalProfileChange(index, e.target.value)}
                        placeholder={`Additional profile URL ${index + 1} (e.g., Twitter, Medium, etc.)`}
                        className="flex-1"
                      />
                      {formData.additionalProfiles.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAdditionalProfile(index)}
                          className="px-3"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAdditionalProfile}
                    className="w-full"
                  >
                    + Add Another Profile
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    Include any other relevant professional profiles (Twitter, Medium, Dribbble, etc.)
                  </p>
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <textarea
                    id="additionalInfo"
                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    placeholder="Any additional professional achievements, certifications, or portfolio links you'd like to share..."
                    rows={4}
                  />
                </div>

                {/* What we'll collect */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What we'll collect:</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <strong>GitHub:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Repository count</li>
                        <li>Recent activity</li>
                        <li>Top languages</li>
                      </ul>
                    </div>
                    <div>
                      <strong>LinkedIn:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Professional headline</li>
                        <li>Connection count</li>
                        <li>Current position</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Stack Overflow:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Reputation score</li>
                        <li>Question/Answer ratio</li>
                        <li>Top tags</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || (!formData.githubUsername && !formData.linkedinUrl && !formData.portfolioUrl)}
                >
                  {isSubmitting ? "Processing Your Profile..." : "Submit Profile Verification"}
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>

                {(!formData.githubUsername && !formData.linkedinUrl && !formData.portfolioUrl) && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please provide at least one professional profile (GitHub, LinkedIn, or Portfolio) to continue
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Having trouble? Contact us at{" "}
              <a href="mailto:support@kredible.com" className="text-blue-600 hover:underline">
                support@kredible.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
