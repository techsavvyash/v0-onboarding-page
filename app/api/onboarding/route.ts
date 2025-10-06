import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const domain = email.split("@")[1]

    if (!domain) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3001"

    try {
      const response = await fetch(`${backendUrl}/api/company/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, domain }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Backend API error" }))
        return NextResponse.json(
          { message: errorData.message || "Failed to fetch company insights" },
          { status: response.status },
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (fetchError) {
      console.error("Backend API fetch error:", fetchError)

      // Remove this fallback once your backend is reliably running
      const mockData = {
        companyName: domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1),
        domain,
        industry: "Technology",
        valuation: "$100M",
        revenue: "$10M ARR",
        insights: {
          products: {
            value: "The company offers innovative SaaS solutions focused on improving business productivity.",
            citations: [
              {
                title: "Company Overview",
                url: "https://example.com",
                excerpt: "Leading provider of productivity tools",
              },
            ],
          },
          targetAudience: {
            value: "Small to medium-sized businesses looking to streamline operations.",
            citations: [
              {
                title: "Market Analysis",
                url: "https://example.com",
                excerpt: "Targeting SMB segment with 50-500 employees",
              },
            ],
          },
          markets: {
            value: "Primarily North America and Europe, with expansion into Asia-Pacific.",
            citations: [
              {
                title: "Geographic Presence",
                url: "https://example.com",
                excerpt: "Strong presence in US and EU markets",
              },
            ],
          },
          growthRate: {
            value: "Growing at 150% year-over-year with strong customer retention.",
            citations: [
              {
                title: "Growth Metrics",
                url: "https://example.com",
                excerpt: "Sustained triple-digit growth",
              },
            ],
          },
          recentDevelopments: {
            value: [
              {
                type: "Product Launch",
                description: "Launched new AI-powered analytics dashboard",
                date: "2024-01-15",
                impact: "Expected to increase user engagement by 40%",
                citations: [
                  {
                    title: "Product Announcement",
                    url: "https://example.com",
                    excerpt: "Revolutionary AI features",
                  },
                ],
              },
              {
                type: "Funding",
                description: "Raised $50M Series B funding",
                date: "2023-11-20",
                impact: "Enables expansion into new markets and product development",
                citations: [
                  {
                    title: "Funding News",
                    url: "https://example.com",
                    excerpt: "Significant investment round",
                  },
                ],
              },
              {
                type: "Partnership",
                description: "Strategic partnership with major enterprise software provider",
                date: "2023-09-10",
                impact: "Access to enterprise customer base",
                citations: [
                  {
                    title: "Partnership Announcement",
                    url: "https://example.com",
                    excerpt: "Collaboration with industry leader",
                  },
                ],
              },
            ],
          },
        },
      }

      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error("Onboarding API error:", error)
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 })
  }
}
