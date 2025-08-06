"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface CandidateProfile {
  id: string
  candidate: {
    name: string
    email: string
  }
  position: string
  company: string
  status: 'pending' | 'completed'
  submittedAt?: string
  social: {
    github?: {
      username: string
      repositories: number
      followers: number
      topLanguages: string[]
    }
    linkedin?: {
      headline: string
      connections: string
      currentPosition: string
    }
    stackoverflow?: {
      reputation: number
      questions: number
      answers: number
    }
  }
  additionalInfo?: string
}

export default function RecruiterDashboard() {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<CandidateProfile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call to fetch recruiter's candidate profiles
    const mockProfiles: CandidateProfile[] = [
      {
        id: "1",
        candidate: {
          name: "Sarah Chen",
          email: "sarah.chen@email.com"
        },
        position: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        status: "completed",
        submittedAt: "2024-01-15T10:30:00Z",
        social: {
          github: {
            username: "sarahchen",
            repositories: 47,
            followers: 234,
            topLanguages: ["JavaScript", "TypeScript", "React"]
          },
          linkedin: {
            headline: "Senior Frontend Developer | React Specialist",
            connections: "500+",
            currentPosition: "Senior Developer at TechStartup"
          },
          stackoverflow: {
            reputation: 2150,
            questions: 12,
            answers: 45
          }
        },
        additionalInfo: "5+ years experience with React ecosystem, TypeScript expert"
      },
      {
        id: "2",
        candidate: {
          name: "Michael Rodriguez",
          email: "michael.r@email.com"
        },
        position: "Backend Engineer",
        company: "TechCorp Inc.",
        status: "completed",
        submittedAt: "2024-01-14T14:20:00Z",
        social: {
          github: {
            username: "mrodriguez",
            repositories: 32,
            followers: 156,
            topLanguages: ["Python", "Go", "PostgreSQL"]
          },
          linkedin: {
            headline: "Backend Engineer | Python & Go Developer",
            connections: "300+",
            currentPosition: "Senior Backend Engineer at DataCorp"
          }
        }
      },
      {
        id: "3",
        candidate: {
          name: "Jessica Wong",
          email: "jessica.wong@email.com"
        },
        position: "Full Stack Developer",
        company: "TechCorp Inc.",
        status: "pending",
        submittedAt: undefined,
        social: {}
      }
    ]

    setTimeout(() => {
      setProfiles(mockProfiles)
      setFilteredProfiles(mockProfiles)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = profiles

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(profile => 
        profile.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(profile => profile.status === statusFilter)
    }

    setFilteredProfiles(filtered)
  }, [profiles, searchTerm, statusFilter])

  const completedProfiles = profiles.filter(p => p.status === 'completed').length
  const pendingProfiles = profiles.filter(p => p.status === 'pending').length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={true} userRole="recruiter" notifications={pendingProfiles} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={true} userRole="recruiter" notifications={pendingProfiles} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Candidate Profiles</h1>
            <p className="text-muted-foreground">
              Manage and review your candidate verification requests
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/recruiter-signup">
              <Plus className="h-4 w-4 mr-2" />
              New Verification Request
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedProfiles}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingProfiles}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profiles.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
              <p className="text-muted-foreground mb-6">
                {profiles.length === 0 
                  ? "Start by sending your first verification request to a candidate"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {profiles.length === 0 && (
                <Button asChild>
                  <Link href="/recruiter-signup">Send First Request</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{profile.candidate.name}</CardTitle>
                      <CardDescription>{profile.position}</CardDescription>
                    </div>
                    <Badge 
                      variant={profile.status === 'completed' ? 'default' : 'secondary'}
                      className={profile.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
                    >
                      {profile.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile.candidate.email}
                    </div>

                    {profile.status === 'completed' ? (
                      <>
                        {/* Social Stats */}
                        <div className="space-y-3">
                          {profile.social.github && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Github className="h-4 w-4 mr-2" />
                                <span className="text-sm">GitHub</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {profile.social.github.repositories} repos • {profile.social.github.followers} followers
                              </div>
                            </div>
                          )}

                          {profile.social.linkedin && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="text-sm">LinkedIn</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {profile.social.linkedin.connections} connections
                              </div>
                            </div>
                          )}

                          {profile.social.stackoverflow && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-2 text-orange-500" />
                                <span className="text-sm">Stack Overflow</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {profile.social.stackoverflow.reputation.toLocaleString()} rep
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Languages/Skills */}
                        {profile.social.github?.topLanguages && (
                          <div className="flex flex-wrap gap-2">
                            {profile.social.github.topLanguages.slice(0, 3).map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Additional Info */}
                        {profile.additionalInfo && (
                          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            {profile.additionalInfo}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-muted-foreground">
                            Completed {new Date(profile.submittedAt!).toLocaleDateString()}
                          </span>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Full Profile
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">
                          Waiting for candidate to complete verification
                        </p>
                        <Button size="sm" variant="outline">
                          Resend Invite
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
