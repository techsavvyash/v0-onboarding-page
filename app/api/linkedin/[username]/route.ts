import { NextRequest, NextResponse } from "next/server";
import { LinkedInApiResponse } from "../../../../types/linkedin";

// Configure maximum duration for this API route (in seconds)
export const maxDuration = 70;

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const baseUrl = "https://dev.api.truthseek.in";
    
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // 65 seconds timeout
    
    let response;
    try {
      response = await fetch(
        `${baseUrl}/api/linkedin/${username}/top-voice`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - API took longer than 65 seconds');
      }
      throw error;
    }

    if (!response.ok) {
      throw new Error(
        `LinkedIn API error: ${response.status} - ${response.statusText}`
      );
    }

    const data: LinkedInApiResponse = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("LinkedIn API error:", error);
    
    // Handle different types of errors
    if (error.message?.includes('timeout')) {
      return NextResponse.json(
        { message: "Request timeout - The LinkedIn API is taking longer than expected. Please try again." },
        { status: 408 }
      );
    }
    
    if (error.message?.includes('404')) {
      return NextResponse.json(
        { message: "LinkedIn profile not found. Please check the username and try again." },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to fetch LinkedIn profile. Please try again later." },
      { status: 500 }
    );
  }
}
