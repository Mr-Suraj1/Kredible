import { NextResponse } from 'next/server'

// Get the global recruiter requests storage to find completed profiles
function getRecruiterRequests() {
  if (typeof globalThis !== 'undefined' && (globalThis as any).__KREDIBLE_REQUESTS__) {
    return (globalThis as any).__KREDIBLE_REQUESTS__ as Map<string, any>
  }
  return new Map()
}

export async function GET() {
  try {
    const requests = getRecruiterRequests()
    
    // Extract only completed profiles (requests with candidateData)
    const completedProfiles = Array.from(requests.values())
      .filter(request => request.candidateData)
      .map(request => ({
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
          fullName: request.candidateData.fullName,
          githubUsername: request.candidateData.githubUsername,
          linkedinUrl: request.candidateData.linkedinUrl,
          stackoverflowUrl: request.candidateData.stackoverflowUrl,
          portfolioUrl: request.candidateData.portfolioUrl,
          additionalProfiles: request.candidateData.additionalProfiles || [],
          additionalInfo: request.candidateData.additionalInfo,
          submittedAt: request.candidateData.submittedAt.toISOString()
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
