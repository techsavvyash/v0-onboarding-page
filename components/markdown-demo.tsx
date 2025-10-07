"use client"

import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sampleMarkdownContent = `## About
* **Identity:** Brand Manager at Liquid Death, based in Brooklyn. 
* **Style:** Enthusiastic, appreciative, team-oriented. 
* **Preferences:** Values company culture and growth. 
* **Engagement:** Shares company achievements and hiring opportunities. 
* **Goals:** Contribute to Liquid Death's brand success, build connections. 
* **Traits:** Loyal (5 years at Liquid Death), adventurous (stand-up comedy). 
* **Pain Points:** Previously experienced a layoff (Amazon). 
* **Opportunities:** Expanding Liquid Death's brand partnerships. 
* **Values:** Sustainability (posts about #deathtoplastic).`

export function MarkdownDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Markdown Renderer Demo</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Raw Markdown Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
              {sampleMarkdownContent}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendered Output</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer content={sampleMarkdownContent} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
