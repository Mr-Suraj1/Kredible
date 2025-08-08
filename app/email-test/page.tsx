"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react"

export default function EmailTestPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const sendTestEmail = async () => {
    if (!email) {
      setResult({ success: false, error: "Please enter an email address" })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ 
        success: false, 
        error: "Failed to send test email. Check console for details." 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Delivery Test
              </CardTitle>
              <CardDescription>
                Test if emails are being delivered properly from the Kredible platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Test Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button 
                onClick={sendTestEmail} 
                disabled={loading || !email}
                className="w-full"
              >
                {loading ? "Sending..." : "Send Test Email"}
              </Button>

              {result && (
                <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {result.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                    {result.success ? (
                      <div>
                        <p className="font-medium">Test email sent successfully!</p>
                        <p className="text-sm mt-1">Message ID: {result.messageId}</p>
                        <p className="text-sm">Status Code: {result.statusCode}</p>
                        <p className="text-sm mt-2">
                          <strong>Next steps:</strong> Check your inbox and spam folder. 
                          If found in spam, mark as "Not Spam" to improve future delivery.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Failed to send test email</p>
                        <p className="text-sm mt-1">Error: {result.error}</p>
                        {result.statusCode && (
                          <p className="text-sm">Status Code: {result.statusCode}</p>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Common Issues & Solutions:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Email in Spam:</strong> Check spam/junk folder and mark as "Not Spam"</li>
                  <li>• <strong>SendGrid Not Verified:</strong> Verify your SendGrid sender identity</li>
                  <li>• <strong>Domain Issues:</strong> Use a verified domain email address</li>
                  <li>• <strong>Rate Limits:</strong> Wait a few minutes between test emails</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
