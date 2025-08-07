import { NextRequest, NextResponse } from 'next/server'

interface CandidateFormData {
  fullName?: string
  githubUsername?: string
  linkedinUrl?: string
  stackoverflowUrl?: string
  portfolioUrl?: string
  additionalProfiles?: string[]
  additionalInfo?: string
}

interface RecruiterRequest {
  id: string
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
  token: string
  status: 'pending' | 'completed' | 'expired'
  createdAt: Date
  expiresAt: Date
  candidateData?: CandidateFormData & { submittedAt: Date }
}

// Import the recruiter requests from the global module
const getRecruiterRequests = () => {
  // Try to get the global variable that should be set by the recruiter-request route
  if (typeof globalThis !== 'undefined' && (globalThis as any).__KREDIBLE_REQUESTS__) {
    return (globalThis as any).__KREDIBLE_REQUESTS__ as Map<string, RecruiterRequest>
  }
  // Fallback: create a new map (this will be empty but prevents crashes)
  return new Map<string, RecruiterRequest>()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, ...formData }: { token: string } & CandidateFormData = body

    console.log('📝 Received candidate form submission for token:', token)

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get recruiter requests
    const requests = getRecruiterRequests()

    // Find the recruiter request by token
    let foundRequest = null
    for (const request of requests.values()) {
      if (request.token === token) {
        foundRequest = request
        break
      }
    }

    if (!foundRequest) {
      console.log('❌ Token not found:', token)
      console.log('Available requests:', Array.from(requests.keys()))
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (new Date() > foundRequest.expiresAt) {
      requests.delete(foundRequest.id)
      return NextResponse.json(
        { success: false, error: 'Token has expired' },
        { status: 410 }
      )
    }

    // Validate that at least one profile is provided
    if (!formData.githubUsername && !formData.linkedinUrl && !formData.portfolioUrl) {
      return NextResponse.json(
        { success: false, error: 'At least one professional profile is required' },
        { status: 400 }
      )
    }

    // Validate URL formats
    const validateUrl = (url: string): boolean => {
      if (!url) return true
      try {
        new URL(url)
        return /^https?:\/\/.+$/i.test(url)
      } catch {
        return false
      }
    }

    if (formData.linkedinUrl && !validateUrl(formData.linkedinUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid LinkedIn URL format' },
        { status: 400 }
      )
    }

    if (formData.stackoverflowUrl && !validateUrl(formData.stackoverflowUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Stack Overflow URL format' },
        { status: 400 }
      )
    }

    if (formData.portfolioUrl && !validateUrl(formData.portfolioUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid portfolio URL format' },
        { status: 400 }
      )
    }

    // Validate additional profile URLs
    if (formData.additionalProfiles) {
      for (const url of formData.additionalProfiles) {
        if (url.trim() && !validateUrl(url.trim())) {
          return NextResponse.json(
            { success: false, error: 'Invalid additional profile URL format' },
            { status: 400 }
          )
        }
      }
    }

    // Update the request with candidate data
    const updatedRequest = {
      ...foundRequest,
      candidateData: {
        ...formData,
        additionalProfiles: formData.additionalProfiles?.filter(url => url.trim()) || [],
        submittedAt: new Date()
      },
      status: 'completed' as const
    }

    requests.set(foundRequest.id, updatedRequest)

    console.log('✅ Candidate form submitted successfully for request:', foundRequest.id)

    // TODO: Send notification email to recruiter
    // await EmailService.sendCandidateSubmissionNotification({
    //   recruiterEmail: foundRequest.email,
    //   recruiterName: `${foundRequest.firstName} ${foundRequest.lastName}`,
    //   candidateName: foundRequest.candidateName,
    //   positionTitle: foundRequest.positionTitle
    // })

    return NextResponse.json({
      success: true,
      message: 'Profile submitted successfully',
      data: {
        requestId: foundRequest.id,
        candidateName: foundRequest.candidateName,
        submittedAt: updatedRequest.candidateData.submittedAt
      }
    })

  } catch (error) {
    console.error('❌ Error processing candidate form submission:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    console.log('🔍 Validating token:', token)

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get recruiter requests
    const requests = getRecruiterRequests()

    console.log('📊 Available requests:', requests.size)
    console.log('📊 Available tokens:', Array.from(requests.values()).map(r => r.token))

    // Find request by token
    let foundRequest = null
    for (const request of requests.values()) {
      if (request.token === token) {
        foundRequest = request
        break
      }
    }

    if (!foundRequest) {
      console.log('❌ Token not found:', token)
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (new Date() > foundRequest.expiresAt) {
      requests.delete(foundRequest.id)
      return NextResponse.json(
        { success: false, error: 'Token has expired' },
        { status: 410 }
      )
    }

    console.log('✅ Token validated successfully')

    return NextResponse.json({
      success: true,
      data: {
        recruiterName: `${foundRequest.firstName} ${foundRequest.lastName}`,
        recruiterEmail: foundRequest.email,
        recruiterCompany: foundRequest.company,
        candidateName: foundRequest.candidateName,
        candidateEmail: foundRequest.candidateEmail,
        positionTitle: foundRequest.positionTitle,
        additionalNotes: foundRequest.additionalNotes,
        createdAt: foundRequest.createdAt,
        expiresAt: foundRequest.expiresAt
      }
    })

  } catch (error) {
    console.error('Error fetching request data:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
