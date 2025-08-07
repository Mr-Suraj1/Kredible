// Client-side API utilities for Kredible

export interface RecruiterFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  companySize?: string
  candidateEmail: string
  candidateName: string
  positionTitle: string
  additionalNotes?: string
}

export interface CandidateFormData {
  fullName?: string
  githubUsername?: string
  linkedinUrl?: string
  stackoverflowUrl?: string
  portfolioUrl?: string
  additionalProfiles?: string[]
  additionalInfo?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class KredibleAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
  }

  async submitRecruiterRequest(data: RecruiterFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/recruiter-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit request')
      }

      return result
    } catch (error) {
      console.error('Error submitting recruiter request:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async validateCandidateToken(token: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/candidate-submit?token=${token}`, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Invalid token')
      }

      return result
    } catch (error) {
      console.error('Error validating token:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async submitCandidateForm(token: string, data: CandidateFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/candidate-submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, ...data }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      return result
    } catch (error) {
      console.error('Error submitting candidate form:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async getRecruiterDashboard(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/recruiter/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch dashboard data')
      }

      return result
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

// Export singleton instance
export const kredibleAPI = new KredibleAPI()

// Utility functions for form validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateLinkedInUrl = (url: string): boolean => {
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
  return linkedinRegex.test(url)
}

export const validateStackOverflowUrl = (url: string): boolean => {
  const soRegex = /^https?:\/\/(www\.)?stackoverflow\.com\/users\/\d+\/[a-zA-Z0-9-]*\/?$/
  return soRegex.test(url)
}

export const validateGitHubUsername = (username: string): boolean => {
  const githubRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|-)*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/
  return githubRegex.test(username) && username.length <= 39
}

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_LINKEDIN: 'Please enter a valid LinkedIn profile URL',
  INVALID_STACKOVERFLOW: 'Please enter a valid Stack Overflow profile URL',
  INVALID_GITHUB: 'Please enter a valid GitHub username',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
}
