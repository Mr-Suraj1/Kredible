// Google OAuth configuration for recruiter authentication
// To implement Google OAuth, you'll need to:
// 1. Install next-auth: npm install next-auth
// 2. Set up Google OAuth credentials in Google Cloud Console
// 3. Add environment variables

export interface GoogleOAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

export const getGoogleOAuthUrl = (state?: string) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  })

  if (state) {
    params.append('state', state)
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export const exchangeCodeForTokens = async (code: string) => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens')
  }

  return response.json()
}

export const getUserInfo = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  return response.json()
}

// Environment variables needed:
// GOOGLE_CLIENT_ID=your_google_client_id
// GOOGLE_CLIENT_SECRET=your_google_client_secret
// NEXTAUTH_URL=http://localhost:3000 (or your production URL)
// NEXTAUTH_SECRET=your_random_secret_key
// ALLOWED_EMAIL_DOMAINS=company1.com,company2.com (optional - restrict to specific domains)
