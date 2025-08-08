import { NextRequest, NextResponse } from 'next/server'
import { 
  RecruiterRequest,
  findRequestByToken,
  getKredibleStorage,
  saveRequest,
  debugStorage
} from '../../../lib/storage'

interface CandidateFormData {
  fullName?: string
  githubUsername?: string
  linkedinUrl?: string
  stackoverflowUrl?: string
  portfolioUrl?: string
  additionalProfiles?: string[]
  additionalInfo?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, ...formData }: { token: string } & CandidateFormData = body

    console.log('📝 Received candidate form submission for token:', token)
    debugStorage()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the recruiter request by token
    const foundRequest = findRequestByToken(token)

    if (!foundRequest) {
      console.log('❌ Token not found:', token)
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (new Date() > foundRequest.expiresAt) {
      const storage = getKredibleStorage()
      storage.delete(foundRequest.id)
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
    const updatedRequest: RecruiterRequest = {
      ...foundRequest,
      candidateData: {
        ...formData,
        additionalProfiles: formData.additionalProfiles?.filter(url => url.trim()) || [],
        submittedAt: new Date()
      },
      status: 'completed'
    }

    // Save the updated request
    saveRequest(updatedRequest)

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
        submittedAt: updatedRequest.candidateData?.submittedAt
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
    debugStorage()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find request by token
    const foundRequest = findRequestByToken(token)

    if (!foundRequest) {
      console.log('❌ Token not found:', token)
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (new Date() > foundRequest.expiresAt) {
      const storage = getKredibleStorage()
      storage.delete(foundRequest.id)
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
