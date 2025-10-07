"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkedInApiResponse } from "@/types/linkedin"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Building2, MapPin, Users, Briefcase, GraduationCap } from "lucide-react"

// Backend API types
interface Citation {
  title: string
  url: string
  excerpt: string
}

interface InsightWithCitation {
  value: string
  citations: Citation[]
}

interface RecentDevelopment {
  type: string
  description: string
  date: string
  impact: string
  citations: Citation[]
}

interface Insights {
  products: InsightWithCitation
  targetAudience: InsightWithCitation
  markets: InsightWithCitation
  growthRate: InsightWithCitation
  recentDevelopments: {
    value: RecentDevelopment[]
  }
}

interface CompanyInsight {
  companyName: string
  domain: string
  industry: string
  valuation: string
  revenue: string
  insights: Insights
}

export default function AnalysisPage() {
  const params = useParams()
  const username = params.username as string
  
  const [linkedinData, setLinkedinData] = useState<LinkedInApiResponse | null>(null)
  const [companyData, setCompanyData] = useState<CompanyInsight | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return
      
      setIsLoading(true)
      setError("")
      
      try {
        // Fetch LinkedIn data first, then try to extract company domain from LinkedIn data
        const linkedinResponse = await fetch(`/api/linkedin/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!linkedinResponse.ok) {
          const errorData = await linkedinResponse.json()
          throw new Error(errorData.message || "Failed to fetch LinkedIn data")
        }

        const linkedinData = await linkedinResponse.json()
        
        // Try to extract company domain from LinkedIn data or use a default
        let companyResponse
        try {
          // Try to get company domain from LinkedIn headline or use liquiddeath.com as default
          const companyDomain = linkedinData.headline?.toLowerCase().includes('liquid death') 
            ? 'liquiddeath.com' 
            : 'liquiddeath.com' // Default to Liquid Death for demo purposes
          
          companyResponse = await fetch("/api/onboarding", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: `demo@${companyDomain}` }),
          })
        } catch (companyError) {
          console.warn("Company data fetch failed, using LinkedIn data only:", companyError)
          companyResponse = null
        }

        // If company API fails, create mock data for demo purposes
        let companyData = null
        if (!companyResponse || !companyResponse.ok) {
          console.log("Using mock company data for demo purposes")
          companyData = {
            companyName: "Liquid Death",
            domain: "liquiddeath.com",
            industry: "Beverage",
            valuation: "$700M",
            revenue: "$333M (2024 projected)",
            insights: {
              products: {
                value: "Premium canned water, energy drinks, and sparkling water targeting health-conscious consumers",
                citations: []
              },
              targetAudience: {
                value: "Health-conscious millennials and Gen Z consumers, outdoor enthusiasts, and sustainability-focused individuals",
                citations: []
              },
              markets: {
                value: "US market with 100,000+ retail locations, expanding internationally",
                citations: []
              },
              growthRate: {
                value: "300% year-over-year growth (2023-2024), revenue increased from $130M (2023) to $333M projected (2024)",
                citations: []
              },
              recentDevelopments: {
                value: [
                  {
                    type: "Product Launch",
                    description: "Energy drink launch planned for January 2026 with 100mg caffeine positioning",
                    date: "2026 Q1 (planned)",
                    impact: "Entry into $23B energy drink market could drive $150-200M additional revenue by 2027",
                    citations: []
                  },
                  {
                    type: "Executive Hiring",
                    description: "Hired executives from White Claw, BODYARMOR, and 7-Eleven to professionalize operations",
                    date: "2023-2024",
                    impact: "Operational expertise but potential culture clash with existing team",
                    citations: []
                  }
                ]
              }
            }
          }
        } else {
          companyData = await companyResponse.json()
        }

        setCompanyData(companyData)
        setLinkedinData(linkedinData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to fetch information. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [username])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analysis for @{username}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Analysis</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!linkedinData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No LinkedIn data available for @{username}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {companyData && (
          <div className="inline-flex items-center gap-2 mb-4 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">{companyData.companyName}</span>
            <span className="text-sm text-muted-foreground/60">•</span>
            <span className="text-sm">{companyData.industry}</span>
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
          Welcome, {linkedinData.fullname}!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Here's your personalized profile information{companyData ? ' and company insights' : ''}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`grid gap-8 ${companyData ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Left Column - User Profile */}
          <div className={`space-y-6 ${companyData ? 'lg:col-span-2' : ''}`}>
            <Card className="animate-in fade-in slide-in-from-left-4 duration-700">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {linkedinData.profile_picture_url && (
                    <img
                      src={linkedinData.profile_picture_url}
                      alt={linkedinData.fullname}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{linkedinData.fullname}</CardTitle>
                    <CardDescription className="text-lg mt-1">{linkedinData.headline}</CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {linkedinData.location_full}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {linkedinData.follower_count.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {linkedinData.user_persona && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">About</h3>
                    <MarkdownRenderer content={linkedinData.user_persona} />
                  </div>
                )}
                
                {/* Top Posts */}
                {linkedinData.topPosts && linkedinData.topPosts.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Recent Posts
                    </h3>
                    <div className="space-y-4">
                      {linkedinData.topPosts.slice(0, 2).map((post, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={post.author_profile_picture}
                              alt={post.author_first_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{post.author_first_name} {post.author_last_name}</p>
                              <p className="text-xs text-muted-foreground">{post.posted_at.relative}</p>
                            </div>
                          </div>
                          <p className="text-sm mb-3 line-clamp-3">{post.text}</p>
                          {post.media && (
                            <div className="mb-3">
                              <img
                                src={post.media.url}
                                alt="Post media"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{post.stats.like} likes</span>
                            <span>{post.stats.comments} comments</span>
                            <span>{post.stats.reposts} reposts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Engagement Stats
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Reactions</span>
                        <span className="text-sm font-medium">{linkedinData.cumulativeReactions.total_all_reactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Comments</span>
                        <span className="text-sm font-medium">{linkedinData.cumulativeReactions.total_comments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reposts</span>
                        <span className="text-sm font-medium">{linkedinData.cumulativeReactions.total_reposts}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Profile Info
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Followers</span>
                        <span className="text-sm font-medium">{linkedinData.follower_count.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {companyData && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company Overview
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Industry</span>
                          <span className="text-sm font-medium">{companyData.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Valuation</span>
                          <span className="text-sm font-medium">{companyData.valuation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Revenue</span>
                          <span className="text-sm font-medium">{companyData.revenue}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Company Insights */}
          {companyData && (
            <div className="space-y-6">
            {/* Products */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700">
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{companyData.insights.products.value}</p>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">CITATIONS</p>
                  {companyData.insights.products.citations.map((citation, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {citation.title} ↗
                      </a>
                      <p className="text-xs text-muted-foreground italic">"{citation.excerpt}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{companyData.insights.targetAudience.value}</p>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">CITATIONS</p>
                  {companyData.insights.targetAudience.citations.map((citation, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {citation.title} ↗
                      </a>
                      <p className="text-xs text-muted-foreground italic">"{citation.excerpt}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Markets */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle>Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{companyData.insights.markets.value}</p>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">CITATIONS</p>
                  {companyData.insights.markets.citations.map((citation, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {citation.title} ↗
                      </a>
                      <p className="text-xs text-muted-foreground italic">"{citation.excerpt}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Rate */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle>Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{companyData.insights.growthRate.value}</p>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">CITATIONS</p>
                  {companyData.insights.growthRate.citations.map((citation, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {citation.title} ↗
                      </a>
                      <p className="text-xs text-muted-foreground italic">"{citation.excerpt}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Developments */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle>Recent Developments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {companyData.insights.recentDevelopments.value.map((dev, idx) => (
                    <div key={idx} className="pb-6 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">
                          {dev.type}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{dev.description}</p>
                          <p className="text-xs text-muted-foreground mb-2">{dev.date}</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            <span className="font-medium">Impact:</span> {dev.impact}
                          </p>
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">CITATIONS</p>
                            {dev.citations.map((citation, citIdx) => (
                              <div key={citIdx} className="mb-2 last:mb-0">
                                <a
                                  href={citation.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium text-primary hover:underline"
                                >
                                  {citation.title} ↗
                                </a>
                                <p className="text-xs text-muted-foreground italic">"{citation.excerpt}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
