import { NextResponse } from 'next/server'
import { getCompletedProfiles, debugStorage } from '../../../../lib/storage'

export async function GET() {
  try {
    console.log('📊 Dashboard API: Fetching completed profiles')
    debugStorage()

    // Get completed profiles from storage
    const completedRequests = getCompletedProfiles()
    
    // Extract and format profile data
    const completedProfiles = completedRequests.map(request => ({
      token: request.token,
      requestId: request.id,
      recruiterInfo: {
        firstName: request.firstName,
        lastName: request.lastName,
        company: request.company
      },
      candidateInfo: {
        name: request.candidateName,
        email: request.candidateEmail,
        positionTitle: request.positionTitle
      },
      profile: {
        fullName: request.candidateData?.fullName,
        githubUsername: request.candidateData?.githubUsername,
        linkedinUrl: request.candidateData?.linkedinUrl,
        stackoverflowUrl: request.candidateData?.stackoverflowUrl,
        portfolioUrl: request.candidateData?.portfolioUrl,
        additionalProfiles: request.candidateData?.additionalProfiles || [],
        additionalInfo: request.candidateData?.additionalInfo,
        submittedAt: request.candidateData?.submittedAt?.toISOString()
      }
    }))

    console.log(`📊 Dashboard API: Found ${completedProfiles.length} completed profiles`)

    return NextResponse.json({
      success: true,
      profiles: completedProfiles
    })
  } catch (error) {
    console.error('Error fetching profiles for dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}
