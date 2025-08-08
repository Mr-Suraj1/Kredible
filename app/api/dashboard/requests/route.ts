import { NextResponse } from 'next/server'
import { getAllRequests, debugStorage } from '../../../../lib/storage'

export async function GET() {
  try {
    console.log('📊 Dashboard API: Fetching recruiter requests')
    debugStorage()

    // Get all requests from storage
    const requestsArray = getAllRequests()
    
    // Convert to dashboard format
    const dashboardData = requestsArray.map(request => ({
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

    console.log(`📊 Dashboard API: Found ${dashboardData.length} recruiter requests`)

    return NextResponse.json({
      success: true,
      requests: dashboardData
    })
  } catch (error) {
    console.error('Error fetching requests for dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}
