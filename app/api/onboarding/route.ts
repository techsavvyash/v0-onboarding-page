import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const domain = email.split("@")[1]

    if (!domain) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_API_URL || "https://crawl-central-production.up.railway.app"

    try {
      const response = await fetch(`${backendUrl}/api/company/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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
      return NextResponse.json(
        { message: "Unable to connect to backend service. Please try again later." },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Onboarding API error:", error)
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 })
  }
}
