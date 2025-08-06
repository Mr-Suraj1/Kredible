import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface EmailData {
  recruiterName: string
  recruiterEmail: string
  recruiterCompany: string
  candidateName: string
  candidateEmail: string
  positionTitle: string
  additionalNotes?: string
  verificationLink: string
}

export class EmailService {
  private static fromEmail = process.env.FROM_EMAIL || 'dev.craft12@gmail.com'

  static async sendCandidateInvitation(data: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔧 Email service debug info:')
      console.log('- API Key configured:', !!process.env.SENDGRID_API_KEY)
      console.log('- From email:', this.fromEmail)
      console.log('- To email:', data.candidateEmail)
      console.log('- Subject:', `Verification Request from ${data.recruiterName} at ${data.recruiterCompany}`)

      const htmlContent = this.generateCandidateEmailHTML(data)
      const textContent = this.generateCandidateEmailText(data)

      const msg = {
        to: data.candidateEmail,
        from: {
          email: this.fromEmail,
          name: 'Kredible Platform'
        },
        subject: `Verification Request from ${data.recruiterName} at ${data.recruiterCompany}`,
        text: textContent,
        html: htmlContent,
        // Add tracking and analytics
        trackingSettings: {
          clickTracking: {
            enable: true,
            enableText: false
          },
          openTracking: {
            enable: true
          }
        }
      }

      console.log('📤 Attempting to send email via SendGrid...')
      const response = await sgMail.send(msg)
      console.log('📧 SendGrid response status:', response[0].statusCode)
      console.log('📧 SendGrid headers:', response[0].headers)
      console.log(`✅ Candidate invitation sent successfully to ${data.candidateEmail}`)
      
      return { success: true }
    } catch (error: any) {
      console.error('❌ SendGrid email error details:')
      console.error('- Error type:', error?.constructor?.name || 'Unknown')
      console.error('- Error message:', error?.message || 'Unknown error')
      
      if (error?.response) {
        console.error('- Response status:', error.response.status)
        console.error('- Response body:', error.response.body)
      }
      
      return { 
        success: false, 
        error: error?.message || 'Failed to send email' 
      }
    }
  }

  private static generateCandidateEmailHTML(data: EmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Credential Verification Request</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #6b7280;
                font-size: 16px;
            }
            .content {
                margin-bottom: 30px;
            }
            .highlight {
                background-color: #f3f4f6;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #2563eb;
            }
            .cta-button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                font-size: 14px;
                color: #6b7280;
                text-align: center;
            }
            .security-note {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Kredible</div>
                <div class="subtitle">Professional Credential Verification</div>
            </div>
            
            <div class="content">
                <h2>Hello ${data.candidateName},</h2>
                
                <p>You've been invited by <strong>${data.recruiterName}</strong> from <strong>${data.recruiterCompany}</strong> to verify your professional credentials for the position of <strong>${data.positionTitle}</strong>.</p>
                
                <div class="highlight">
                    <h3>What This Involves:</h3>
                    <ul>
                        <li>Securely sharing your GitHub, LinkedIn, and Stack Overflow profiles</li>
                        <li>Automatic compilation of your social proof statistics</li>
                        <li>Creating a professional credential summary for the recruiter</li>
                    </ul>
                </div>
                
                ${data.additionalNotes ? `
                <div class="highlight">
                    <h3>Additional Message from ${data.recruiterName}:</h3>
                    <p style="font-style: italic;">"${data.additionalNotes}"</p>
                </div>
                ` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${data.verificationLink}" class="cta-button">
                        Complete Verification →
                    </a>
                </div>
                
                <div class="security-note">
                    <strong>🔒 Your Privacy Matters:</strong> Your information is handled securely and will only be shared with ${data.recruiterCompany} for this specific position evaluation. You can review our privacy policy before proceeding.
                </div>
                
                <p><strong>Time Requirement:</strong> This process typically takes 2-3 minutes to complete.</p>
                
                <p><strong>Link Expires:</strong> This verification link will expire in 7 days for security purposes.</p>
            </div>
            
            <div class="footer">
                <p>This email was sent by ${data.recruiterName} (${data.recruiterEmail}) through the Kredible platform.</p>
                <p>If you have any questions, please contact the recruiter directly or visit our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/support">support page</a>.</p>
                <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                    Kredible - Streamlining Professional Verification<br>
                    This link is unique and secure. Do not share it with others.
                </p>
            </div>
        </div>
    </body>
    </html>
    `
  }

  private static generateCandidateEmailText(data: EmailData): string {
    return `
Hello ${data.candidateName},

You've been invited by ${data.recruiterName} from ${data.recruiterCompany} to verify your professional credentials for the position of ${data.positionTitle}.

What This Involves:
- Securely sharing your GitHub, LinkedIn, and Stack Overflow profiles
- Automatic compilation of your social proof statistics  
- Creating a professional credential summary for the recruiter

${data.additionalNotes ? `Additional Message from ${data.recruiterName}: "${data.additionalNotes}"` : ''}

Complete your verification here: ${data.verificationLink}

🔒 Your Privacy Matters: Your information is handled securely and will only be shared with ${data.recruiterCompany} for this specific position evaluation.

Time Requirement: This process typically takes 2-3 minutes to complete.
Link Expires: This verification link will expire in 7 days for security purposes.

---
This email was sent by ${data.recruiterName} (${data.recruiterEmail}) through the Kredible platform.
If you have any questions, please contact the recruiter directly.

Kredible - Streamlining Professional Verification
This link is unique and secure. Do not share it with others.
    `
  }

  static async sendRecruiterConfirmation(data: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const msg = {
        to: data.recruiterEmail,
        from: {
          email: this.fromEmail,
          name: 'Kredible Platform'
        },
        subject: 'Candidate Invitation Sent Successfully',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Invitation Sent Successfully</h2>
          <p>Hello ${data.recruiterName},</p>
          <p>We've successfully sent a verification invitation to <strong>${data.candidateName}</strong> at ${data.candidateEmail} for the position of <strong>${data.positionTitle}</strong>.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Next Steps:</h3>
            <ul>
              <li>The candidate will receive an email with a secure verification link</li>
              <li>Once completed, you'll be notified and can view their compiled profile</li>
              <li>You can track the status in your <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard">Kredible dashboard</a></li>
            </ul>
          </div>
          
          <p>The verification link will expire in 7 days for security purposes.</p>
          
          <p>Best regards,<br>The Kredible Team</p>
        </div>
        `
      }

      await sgMail.send(msg)
      return { success: true }
    } catch (error) {
      console.error('Failed to send recruiter confirmation:', error)
      return { success: false, error: 'Failed to send confirmation email' }
    }
  }
}