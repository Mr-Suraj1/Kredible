import { NextRequest, NextResponse } from 'next/server'
import { recruiterRequests } from '../../recruiter-request/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the request by token
    let foundRequest = null
    for (const [id, request] of recruiterRequests.entries()) {
      if (request.token === token) {
        foundRequest = request
        break
      }
    }

    if (!foundRequest) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (foundRequest.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 410 }
      )
    }

    // Return request data (without sensitive information)
    return NextResponse.json({
      success: true,
      data: {
        recruiterName: `${foundRequest.firstName} ${foundRequest.lastName}`,
        recruiterCompany: foundRequest.company,
        positionTitle: foundRequest.positionTitle,
        candidateName: foundRequest.candidateName,
        candidateEmail: foundRequest.candidateEmail,
        additionalNotes: foundRequest.additionalNotes,
        status: foundRequest.status
      }
    })
  } catch (error) {
    console.error('Error validating token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    const body = await request.json()
    const {
      githubUsername,
      linkedinUrl,
      stackoverflowUrl,
      additionalInfo
    } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the request by token
    let foundRequest = null
    let requestId = null
    for (const [id, request] of recruiterRequests.entries()) {
      if (request.token === token) {
        foundRequest = request
        requestId = id
        break
      }
    }

    if (!foundRequest) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (foundRequest.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 410 }
      )
    }

    // Check if already completed
    if (foundRequest.status === 'completed') {
      return NextResponse.json(
        { error: 'This verification has already been completed' },
        { status: 409 }
      )
    }

    // Validate at least one profile is provided
    if (!githubUsername && !linkedinUrl) {
      return NextResponse.json(
        { error: 'Please provide at least your GitHub username or LinkedIn profile' },
        { status: 400 }
      )
    }

    // Process the candidate data and generate profile
    const profileData = await generateCandidateProfile({
      githubUsername,
      linkedinUrl,
      stackoverflowUrl,
      additionalInfo,
      candidateName: foundRequest.candidateName,
      candidateEmail: foundRequest.candidateEmail
    })

    // Update request status
    foundRequest.status = 'completed'
    recruiterRequests.set(requestId!, foundRequest)

    // Notify recruiter
    await notifyRecruiter({
      recruiterEmail: foundRequest.email,
      recruiterName: `${foundRequest.firstName} ${foundRequest.lastName}`,
      candidateName: foundRequest.candidateName,
      positionTitle: foundRequest.positionTitle,
      profileData
    })

    return NextResponse.json({
      success: true,
      message: 'Profile verification completed successfully',
      profileData
    })
  } catch (error) {
    console.error('Error processing candidate form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateCandidateProfile({
  githubUsername,
  linkedinUrl,
  stackoverflowUrl,
  additionalInfo,
  candidateName,
  candidateEmail
}: {
  githubUsername?: string
  linkedinUrl?: string
  stackoverflowUrl?: string
  additionalInfo?: string
  candidateName: string
  candidateEmail: string
}) {
  // TODO: Implement actual API calls to fetch data from GitHub, LinkedIn, Stack Overflow
  // This is a mock implementation
  
  const profileData: any = {
    candidate: {
      name: candidateName,
      email: candidateEmail
    },
    social: {},
    generatedAt: new Date().toISOString()
  }

  // Mock GitHub data
  if (githubUsername) {
    // TODO: Call GitHub API
    profileData.social.github = {
      username: githubUsername,
      repositories: Math.floor(Math.random() * 100) + 10,
      followers: Math.floor(Math.random() * 500) + 50,
      following: Math.floor(Math.random() * 200) + 20,
      publicGists: Math.floor(Math.random() * 50) + 5,
      topLanguages: ['JavaScript', 'TypeScript', 'Python', 'Go'],
      recentActivity: 'Active in the last week'
    }
  }

  // Mock LinkedIn data
  if (linkedinUrl) {
    // TODO: Call LinkedIn API (requires LinkedIn partnership or scraping with proper permissions)
    profileData.social.linkedin = {
      url: linkedinUrl,
      headline: 'Senior Software Engineer | Full Stack Developer',
      connections: '500+',
      currentPosition: 'Senior Software Engineer at TechCorp',
      location: 'San Francisco, CA'
    }
  }

  // Mock Stack Overflow data
  if (stackoverflowUrl) {
    // TODO: Call Stack Overflow API
    profileData.social.stackoverflow = {
      url: stackoverflowUrl,
      reputation: Math.floor(Math.random() * 10000) + 1000,
      questions: Math.floor(Math.random() * 50) + 10,
      answers: Math.floor(Math.random() * 100) + 20,
      topTags: ['javascript', 'react', 'node.js', 'typescript']
    }
  }

  if (additionalInfo) {
    profileData.additionalInfo = additionalInfo
  }

  return profileData
}

async function notifyRecruiter({
  recruiterEmail,
  recruiterName,
  candidateName,
  positionTitle,
  profileData
}: {
  recruiterEmail: string
  recruiterName: string
  candidateName: string
  positionTitle: string
  profileData: any
}) {
  // TODO: Implement email notification to recruiter with profile data
  
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Candidate Profile Ready - ${candidateName}</title>
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .profile-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .stat { display: inline-block; margin: 10px 15px 10px 0; }
        .button { 
          display: inline-block; 
          background: #2563eb; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Candidate Profile Ready</h1>
        </div>
        <div class="content">
          <p>Hi ${recruiterName},</p>
          
          <p><strong>${candidateName}</strong> has completed their profile verification for the <strong>${positionTitle}</strong> position. Here's their comprehensive social proof summary:</p>
          
          <div class="profile-card">
            <h3>${candidateName} - Professional Summary</h3>
            
            ${profileData.social.github ? `
            <h4>🐙 GitHub Profile</h4>
            <div class="stat"><strong>Repositories:</strong> ${profileData.social.github.repositories}</div>
            <div class="stat"><strong>Followers:</strong> ${profileData.social.github.followers}</div>
            <div class="stat"><strong>Top Languages:</strong> ${profileData.social.github.topLanguages.join(', ')}</div>
            ` : ''}
            
            ${profileData.social.linkedin ? `
            <h4>💼 LinkedIn Profile</h4>
            <div class="stat"><strong>Headline:</strong> ${profileData.social.linkedin.headline}</div>
            <div class="stat"><strong>Connections:</strong> ${profileData.social.linkedin.connections}</div>
            <div class="stat"><strong>Current Role:</strong> ${profileData.social.linkedin.currentPosition}</div>
            ` : ''}
            
            ${profileData.social.stackoverflow ? `
            <h4>📚 Stack Overflow</h4>
            <div class="stat"><strong>Reputation:</strong> ${profileData.social.stackoverflow.reputation.toLocaleString()}</div>
            <div class="stat"><strong>Questions:</strong> ${profileData.social.stackoverflow.questions}</div>
            <div class="stat"><strong>Answers:</strong> ${profileData.social.stackoverflow.answers}</div>
            ` : ''}
            
            ${profileData.additionalInfo ? `
            <h4>📋 Additional Information</h4>
            <p>${profileData.additionalInfo}</p>
            ` : ''}
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" class="button">View Full Profile Dashboard</a>
          </p>
          
          <p>This profile verification was completed on ${new Date().toLocaleDateString()} and is ready for your review.</p>
          
          <p>Best regards,<br>The Kredible Team</p>
        </div>
      </div>
    </body>
    </html>
  `

  // Log email for development (replace with actual email service)
  console.log('📧 Recruiter notification email would be sent to:', recruiterEmail)
  console.log('📧 Profile data:', JSON.stringify(profileData, null, 2))
  console.log('📧 Email HTML:', emailHTML)
}
