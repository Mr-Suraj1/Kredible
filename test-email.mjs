// Test script to verify SendGrid configuration
import sgMail from '@sendgrid/mail'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = resolve('.env.local')
    const envContent = readFileSync(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        const value = valueParts.join('=')
        if (key && value) {
          process.env[key.trim()] = value.trim()
        }
      }
    })
    console.log('✅ Environment variables loaded from .env.local')
  } catch (error) {
    console.error('❌ Failed to load .env.local:', error.message)
  }
}

// Load environment variables
loadEnvFile()

console.log('🔍 Testing SendGrid Configuration...')
console.log('API Key configured:', !!process.env.SENDGRID_API_KEY)
console.log('API Key length:', process.env.SENDGRID_API_KEY?.length || 0)
console.log('From Email:', process.env.FROM_EMAIL)
console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL)

// Set API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log('✅ SendGrid API key set successfully')
} else {
  console.log('❌ No SendGrid API key found')
}

// Test sending a simple email
async function testEmail() {
  try {
    const msg = {
      to: 'rayv9864@gmail.com', // Your test email
      from: {
        email: process.env.FROM_EMAIL || 'dev.craft12@gmail.com',
        name: 'Kredible Test'
      },
      subject: 'Test Email from Kredible',
      text: 'This is a test email to verify SendGrid configuration.',
      html: '<p>This is a test email to verify SendGrid configuration.</p>'
    }

    console.log('📤 Sending test email...')
    const response = await sgMail.send(msg)
    console.log('✅ Test email sent successfully!')
    console.log('Response status:', response[0].statusCode)
    console.log('Response headers:', response[0].headers)
  } catch (error) {
    console.error('❌ Test email failed:')
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Body:', error.response.body)
    }
  }
}

// Run the test
testEmail()
