"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2, AlertCircle, User, MapPin, Briefcase, GraduationCap, Users, ExternalLink } from "lucide-react"
import { LinkedInApiResponse } from "@/types/linkedin"
import { MarkdownRenderer } from "@/components/markdown-renderer"

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

export default function OnboardingFlow() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyInsight | null>(null)
  const [linkedinData, setLinkedinData] = useState<LinkedInApiResponse | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Fetch both company data and LinkedIn data in parallel
      const [companyResponse, linkedinResponse] = await Promise.all([
        fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }),
        fetch("/api/linkedin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ])

      if (!companyResponse.ok) {
        const errorData = await companyResponse.json()
        throw new Error(errorData.message || "Failed to fetch company data")
      }

      if (!linkedinResponse.ok) {
        const errorData = await linkedinResponse.json()
        throw new Error(errorData.message || "Failed to fetch LinkedIn data")
      }

      const [companyData, linkedinData] = await Promise.all([
        companyResponse.json(),
        linkedinResponse.json()
      ])

      setCompanyData(companyData)
      setLinkedinData(linkedinData)
      
      // Extract username from LinkedIn data and redirect to analysis page
      const username = linkedinData.topPosts?.[0]?.author_username || linkedinData.topPosts?.[0]?.username || 'jeanne-irwin'
      router.push(`/analysis/${username}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch information. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (companyData && linkedinData) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 mb-4 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">{companyData.companyName}</span>
            <span className="text-sm text-muted-foreground/60">•</span>
            <span className="text-sm">{companyData.industry}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
            Welcome, {linkedinData.fullname}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Here's your personalized company insights and profile information
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - User Profile */}
            <div className="lg:col-span-2 space-y-6">
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Company Insights */}
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Logo in top left corner */}
      <div className="absolute top-6 left-6 z-10">
        <img 
          src="/Truthseek_cropped_transparent.png" 
          alt="Logo" 
          className="h-8 w-auto"
        />
      </div>
      
      {/* Centered signup form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-4">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching insights...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <a href="https://truthseek.in/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="https://truthseek.in/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
