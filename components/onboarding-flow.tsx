"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2, Target, TrendingUp, Users } from "lucide-react"

interface CompanyData {
  companyName: string
  industry: string
  size: string
  priorities: Array<{
    title: string
    description: string
    impact: string
  }>
}

export default function OnboardingFlow() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Extract domain from email
    const domain = email.split("@")[1]

    if (!domain) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      // Call your backend API
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, domain }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch company data")
      }

      const data = await response.json()
      setCompanyData(data)
    } catch (err) {
      setError("Unable to fetch company information. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityIcon = (index: number) => {
    const icons = [Target, TrendingUp, Users]
    const Icon = icons[index] || Target
    return <Icon className="h-5 w-5" />
  }

  if (companyData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 mb-4 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">{companyData.companyName}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">Welcome to your personalized insights</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Based on {companyData.companyName}'s profile in the {companyData.industry} industry, here are your top
            priorities to focus on right now.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {companyData.priorities.map((priority, index) => (
            <Card
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700 hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">{getPriorityIcon(index)}</div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority {index + 1}
                  </span>
                </div>
                <CardTitle className="text-xl text-balance">{priority.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4 text-pretty">
                  {priority.description}
                </CardDescription>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground">Expected Impact</p>
                  <p className="text-sm text-muted-foreground mt-1">{priority.impact}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "450ms" }}
        >
          <Button size="lg" className="px-8">
            Get Started
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
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

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
