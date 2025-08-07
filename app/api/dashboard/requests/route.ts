import { NextResponse } from 'next/server'

// Get the global recruiter requests storage
function getRecruiterRequests() {
  if (typeof globalThis !== 'undefined' && (globalThis as any).__KREDIBLE_REQUESTS__) {
    return (globalThis as any).__KREDIBLE_REQUESTS__ as Map<string, any>
  }
  return new Map()
}

export async function GET() {
  try {
    const requests = getRecruiterRequests()
    
    // Convert Map to Array and format for dashboard
    const requestsArray = Array.from(requests.values()).map(request => ({
      requestId: request.id,
      token: request.token,
      recruiterInfo: {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        company: request.company,
        jobTitle: request.jobTitle
      },
      candidateInfo: {
        name: request.candidateName,
        email: request.candidateEmail,
        positionTitle: request.positionTitle
      },
      additionalNotes: request.additionalNotes,
      createdAt: request.createdAt.toISOString(),
      expiresAt: request.expiresAt.toISOString(),
      status: request.status,
      candidateData: request.candidateData || null
    }))

    console.log(`📊 Dashboard API: Found ${requestsArray.length} recruiter requests`)

    return NextResponse.json({
      success: true,
      requests: requestsArray
    })
  } catch (error) {
    console.error('Error fetching requests for dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}
