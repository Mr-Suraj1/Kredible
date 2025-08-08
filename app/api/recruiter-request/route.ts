import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { EmailService } from '../../../lib/email'
import { 
  RecruiterRequest, 
  getKredibleStorage, 
  saveRequest, 
  findRequestByToken,
  debugStorage 
} from '../../../lib/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      companySize,
      candidateEmail,
      candidateName,
      positionTitle,
      additionalNotes
    } = body

    console.log('📝 Received recruiter request:', { firstName, lastName, email, company, candidateEmail })

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !jobTitle || !candidateEmail || !candidateName || !positionTitle) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = nanoid(32)
    const requestId = nanoid(16)

    console.log('🔧 Generated token:', token)

    // Create recruiter request
    const recruiterRequest: RecruiterRequest = {
      id: requestId,
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      companySize,
      candidateEmail,
      candidateName,
      positionTitle,
      additionalNotes,
      token,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }

    // Store in persistent storage
    saveRequest(recruiterRequest)

    // Debug storage state
    debugStorage()

    // Create verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/candidate-form/${token}`

    console.log('📧 Sending email to candidate...')
    console.log('🔗 Verification link:', verificationLink)

    // Send email to candidate using SendGrid
    const emailResult = await EmailService.sendCandidateInvitation({
      recruiterName: `${firstName} ${lastName}`,
      recruiterEmail: email,
      recruiterCompany: company,
      candidateName,
      candidateEmail,
      positionTitle,
      additionalNotes,
      verificationLink
    })

    if (!emailResult.success) {
      console.error('❌ Failed to send candidate email:', emailResult.error)
      return NextResponse.json(
        { success: false, error: `Failed to send invitation email: ${emailResult.error}` },
        { status: 500 }
      )
    }

    console.log('✅ Candidate email sent successfully')

    // Send confirmation email to recruiter
    try {
      const confirmationResult = await EmailService.sendRecruiterConfirmation({
        recruiterName: `${firstName} ${lastName}`,
        recruiterEmail: email,
        recruiterCompany: company,
        candidateName,
        candidateEmail,
        positionTitle,
        additionalNotes,
        verificationLink
      })

      if (!confirmationResult.success) {
        console.log('⚠️  Warning: Failed to send recruiter confirmation email:', confirmationResult.error)
      } else {
        console.log('✅ Recruiter confirmation email sent')
      }
    } catch (confirmationError) {
      console.log('⚠️  Warning: Error sending recruiter confirmation:', confirmationError)
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate invitation sent successfully',
      data: {
        requestId,
        token,
        candidateEmail,
        expiresAt: recruiterRequest.expiresAt.toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error creating recruiter request:', error)
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

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Looking for token:', token)
    debugStorage()

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

    console.log('✅ Token found and valid')

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
