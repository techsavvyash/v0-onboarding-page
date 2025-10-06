"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2, AlertCircle } from "lucide-react"

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
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyInsight | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Call backend API
      const response = await fetch("http://localhost:3001/api/company/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch company data")
      }

      const data: CompanyInsight = await response.json()
      setCompanyData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch company information. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (companyData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 mb-4 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">{companyData.companyName}</span>
            <span className="text-sm text-muted-foreground/60">•</span>
            <span className="text-sm">{companyData.industry}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
            Company Insights: {companyData.companyName}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty mb-4">
            Valuation: {companyData.valuation} • Revenue: {companyData.revenue}
          </p>
        </div>

        {/* Insights Cards */}
        <div className="space-y-6 mb-8">
          {/* Products */}
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
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
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
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
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
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
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
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

        {/* CTA */}
        <div
          className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "450ms" }}
        >
          <Button size="lg" className="px-8" onClick={() => setCompanyData(null)}>
            Analyze Another Company
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-xl">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl font-bold tracking-tight mb-4 text-balance">
          Get personalized insights for your company
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Enter your work email to receive tailored research priorities based on your company's profile.
        </p>
      </div>

      <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "150ms" }}>
        <CardHeader>
          <CardTitle>Start your journey</CardTitle>
          <CardDescription>We'll analyze your company domain to provide customized recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Work Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@liquiddeath.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing your company...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
