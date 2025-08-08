import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log('🧪 Testing email delivery to:', email)
    console.log('🔑 API Key configured:', !!process.env.SENDGRID_API_KEY)
    console.log('📧 From email:', process.env.FROM_EMAIL)

    const msg = {
      to: email,
      from: {
        email: process.env.FROM_EMAIL || 'dev.craft12@gmail.com',
        name: 'Kredible Test'
      },
      subject: 'Kredible Email Test - Please Check',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Email Test Successful! ✅</h2>
          <p>If you're seeing this email, then your Kredible email service is working correctly.</p>
          <p><strong>Time sent:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${process.env.FROM_EMAIL}</p>
          <p><strong>To:</strong> ${email}</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Next steps:</strong></p>
            <ul>
              <li>Check if this email landed in your inbox or spam folder</li>
              <li>If in spam, mark as "Not Spam" to improve delivery</li>
              <li>Try the recruiter invitation process again</li>
            </ul>
          </div>
          <p>Best regards,<br>Kredible Team</p>
        </div>
      `,
      text: `
Email Test Successful!

If you're seeing this email, then your Kredible email service is working correctly.

Time sent: ${new Date().toISOString()}
From: ${process.env.FROM_EMAIL}
To: ${email}

Next steps:
- Check if this email landed in your inbox or spam folder
- If in spam, mark as "Not Spam" to improve delivery  
- Try the recruiter invitation process again

Best regards,
Kredible Team
      `
    }

    const response = await sgMail.send(msg)
    console.log('✅ Test email sent successfully')
    console.log('📊 Response status:', response[0].statusCode)
    console.log('📊 Message ID:', response[0].headers['x-message-id'])

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      statusCode: response[0].statusCode,
      messageId: response[0].headers['x-message-id']
    })

  } catch (error: any) {
    console.error('❌ Test email failed:', error)
    
    let errorMessage = 'Unknown error'
    let statusCode = 500
    
    if (error?.response) {
      errorMessage = error.response.body?.errors?.[0]?.message || error.message
      statusCode = error.response.status
      
      console.error('📊 SendGrid Error Details:')
      console.error('- Status:', error.response.status)
      console.error('- Body:', error.response.body)
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      statusCode,
      details: error.message
    }, { status: statusCode })
  }
}
