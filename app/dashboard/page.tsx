"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { 
  Github, 
  Linkedin, 
  MessageSquare, 
  Users, 
  Clock, 
  CheckCircle,
  ExternalLink,
  Mail,
  Plus,
  Filter,
  Search,
  AlertCircle,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

// Real data interfaces
interface RecruiterRequest {
  requestId: string
  token: string
  recruiterInfo: {
    firstName: string
    lastName: string
    email: string
    company: string
    jobTitle: string
  }
  candidateInfo: {
    name: string
    email: string
    positionTitle: string
  }
  additionalNotes?: string
  createdAt: string
  expiresAt: string
  status: 'pending' | 'completed' | 'expired'
  candidateData?: any
}

interface CompletedProfile {
  token: string
  requestId: string
  recruiterInfo: {
    firstName: string
    lastName: string
    company: string
  }
  candidateInfo: {
    name: string
    email: string
    positionTitle: string
  }
  profile: {
    fullName?: string
    githubUsername?: string
    linkedinUrl?: string
    stackoverflowUrl?: string
    portfolioUrl?: string
    additionalProfiles: string[]
    additionalInfo?: string
    submittedAt: string
  }
}

interface DashboardStats {
  totalRequests: number
  completedProfiles: number
  pendingRequests: number
  completionRate: number
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<RecruiterRequest[]>([])
  const [profiles, setProfiles] = useState<CompletedProfile[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    completedProfiles: 0,
    pendingRequests: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch real data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch requests and profiles in parallel
      const [requestsResponse, profilesResponse] = await Promise.all([
        fetch('/api/dashboard/requests'),
        fetch('/api/dashboard/profiles')
      ])

      if (!requestsResponse.ok || !profilesResponse.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const requestsData = await requestsResponse.json()
      const profilesData = await profilesResponse.json()

      setRequests(requestsData.requests || [])
      setProfiles(profilesData.profiles || [])

      // Calculate stats
      const totalRequests = requestsData.requests?.length || 0
      const completedProfiles = profilesData.profiles?.length || 0
      const pendingRequests = totalRequests - completedProfiles
      const completionRate = totalRequests > 0 ? Math.round((completedProfiles / totalRequests) * 100) : 0

      setStats({
        totalRequests,
        completedProfiles,
        pendingRequests,
        completionRate
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Filter requests based on search and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === "" || 
      request.candidateInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.candidateInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.recruiterInfo.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.candidateInfo.positionTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchDashboardData}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-600">Monitor candidate submissions and manage recruitment requests</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-muted-foreground">All recruitment requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Profiles</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedProfiles}</div>
              <p className="text-xs text-muted-foreground">Profiles submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting submission</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">Profile completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by candidate name, email, company, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </CardContent>
        </Card>
        {/* Recruitment Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recruitment Requests ({filteredRequests.length})
            </CardTitle>
            <CardDescription>
              Track all recruitment requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
                <p className="text-gray-600 mb-4">
                  {requests.length === 0 
                    ? "No recruitment requests have been created yet." 
                    : "No requests match your current search criteria."
                  }
                </p>
                <Link href="/recruiter-signup">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.requestId} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{request.candidateInfo.name}</h3>
                          <p className="text-gray-600">{request.candidateInfo.email}</p>
                          <p className="text-sm text-gray-500">{request.candidateInfo.positionTitle} at {request.recruiterInfo.company}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(request.status)}
                          <p className="text-sm text-gray-500 mt-1">
                            Created: {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Recruiter:</strong> {request.recruiterInfo.firstName} {request.recruiterInfo.lastName}</p>
                          <p><strong>Email:</strong> {request.recruiterInfo.email}</p>
                          <p><strong>Job Title:</strong> {request.recruiterInfo.jobTitle}</p>
                        </div>
                        <div>
                          <p><strong>Expires:</strong> {formatDate(request.expiresAt)}</p>
                          <p><strong>Request ID:</strong> {request.requestId.slice(0, 8)}...</p>
                          {request.additionalNotes && (
                            <p><strong>Notes:</strong> {request.additionalNotes}</p>
                          )}
                        </div>
                      </div>

                      {request.status === 'completed' && request.candidateData && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">Profile Submitted</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {request.candidateData.fullName && (
                              <p><strong>Full Name:</strong> {request.candidateData.fullName}</p>
                            )}
                            {request.candidateData.githubUsername && (
                              <div className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                <a 
                                  href={`https://github.com/${request.candidateData.githubUsername}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {request.candidateData.githubUsername}
                                </a>
                              </div>
                            )}
                            {request.candidateData.linkedinUrl && (
                              <div className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4" />
                                <a 
                                  href={request.candidateData.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  LinkedIn Profile
                                </a>
                              </div>
                            )}
                            {request.candidateData.portfolioUrl && (
                              <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                <a 
                                  href={request.candidateData.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Portfolio
                                </a>
                              </div>
                            )}
                            {request.candidateData.additionalProfiles && request.candidateData.additionalProfiles.length > 0 && (
                              <div className="col-span-full">
                                <strong>Additional Profiles:</strong>
                                <ul className="list-disc list-inside ml-4">
                                  {request.candidateData.additionalProfiles.map((profile: string, index: number) => (
                                    <li key={index}>
                                      <a 
                                        href={profile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        {profile}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          {request.candidateData.additionalInfo && (
                            <div className="mt-2">
                              <strong>Additional Information:</strong>
                              <p className="text-gray-700">{request.candidateData.additionalInfo}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center">
          <Link href="/recruiter-signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-5 w-5 mr-2" />
              Create New Recruitment Request
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
