"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-foreground mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-foreground mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-foreground mb-1">{children}</h3>
          ),
          // Customize paragraph styles
          p: ({ children }) => (
            <p className="text-sm text-muted-foreground mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          // Customize list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-sm text-muted-foreground mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-sm text-muted-foreground mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-muted-foreground">{children}</li>
          ),
          // Customize strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          // Customize emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-muted-foreground">{children}</em>
          ),
          // Customize code blocks
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
                  {children}
                </code>
              )
            }
            return (
              <code className="block bg-muted p-3 rounded text-xs font-mono text-foreground overflow-x-auto">
                {children}
              </code>
            )
          },
          // Customize blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/20 pl-4 italic text-sm text-muted-foreground mb-2">
              {children}
            </blockquote>
          ),
          // Customize links
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
