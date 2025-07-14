"use client"

import { ExternalLink } from "lucide-react"

export function Watermark() {
  const handleClick = () => {
    window.open("https://terdinocentes.vercel.app", "_blank", "noopener,noreferrer")
  }

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick()
        }
      }}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group-hover:-translate-y-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="whitespace-nowrap">developed by Terd Imogen Inocentes 2025</span>
          <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Bubble tail */}
        <div className="absolute -bottom-1 right-6 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 transform rotate-45"></div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 opacity-20 blur-md -z-10 group-hover:opacity-30 transition-opacity"></div>
      </div>
    </div>
  )
}
