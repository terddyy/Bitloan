"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, TrendingUp, Shield, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface RiskAssessment {
  riskScore: number
  riskLevel: "low" | "medium" | "high"
  personalizedCollateralRatio: number
  maxLoanAmount: number
  interestRate: number
  recommendations: string[]
  factors: {
    name: string
    impact: "positive" | "negative" | "neutral"
    score: number
    description: string
  }[]
}

interface AIRiskAssessmentProps {
  walletAddress: string
  collateralAmount: number
  requestedAmount: number
  onAssessmentComplete: (assessment: RiskAssessment) => void
}

export function AIRiskAssessment({
  walletAddress,
  collateralAmount,
  requestedAmount,
  onAssessmentComplete,
}: AIRiskAssessmentProps) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const analyzeRisk = async () => {
    setLoading(true)
    setAnalyzing(true)

    // Simulate AI analysis with progressive updates
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock AI-powered risk assessment based on various factors
    const mockAssessment: RiskAssessment = {
      riskScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
      riskLevel:
        collateralAmount > requestedAmount * 1.8 ? "low" : collateralAmount > requestedAmount * 1.5 ? "medium" : "high",
      personalizedCollateralRatio: Math.max(120, 200 - (collateralAmount / requestedAmount) * 50),
      maxLoanAmount: collateralAmount * 0.75,
      interestRate: Math.max(3.5, 8 - collateralAmount / requestedAmount),
      recommendations: [
        "Consider increasing collateral by 15% to improve loan terms",
        "Your transaction history shows consistent repayment patterns",
        "Current market volatility suggests conservative borrowing",
      ],
      factors: [
        {
          name: "Collateral Health",
          impact: collateralAmount > requestedAmount * 1.8 ? "positive" : "negative",
          score: Math.min(100, (collateralAmount / requestedAmount) * 50),
          description: "Based on current collateral-to-loan ratio",
        },
        {
          name: "Market Volatility",
          impact: "neutral",
          score: 75,
          description: "Current BTC volatility is within normal ranges",
        },
        {
          name: "Wallet History",
          impact: "positive",
          score: 85,
          description: "Strong transaction history and no liquidations",
        },
        {
          name: "Network Activity",
          impact: "positive",
          score: 90,
          description: "High network activity indicates healthy ecosystem",
        },
      ],
    }

    setAssessment(mockAssessment)
    setAnalyzing(false)
    setLoading(false)
    onAssessmentComplete(mockAssessment)
  }

  useEffect(() => {
    if (collateralAmount > 0 && requestedAmount > 0) {
      analyzeRisk()
    }
  }, [collateralAmount, requestedAmount])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  if (loading || analyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Risk Assessment
            <RefreshCw className="h-4 w-4 animate-spin" />
          </CardTitle>
          <CardDescription>Analyzing on-chain data and market conditions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing wallet history...</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Evaluating market conditions...</span>
              <span>92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calculating personalized terms...</span>
              <span>78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!assessment) return null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Risk Assessment
          </CardTitle>
          <CardDescription>Personalized analysis based on on-chain data and market conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Score Overview */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Risk Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Based on comprehensive analysis</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{assessment.riskScore}/100</div>
              <Badge className={getRiskColor(assessment.riskLevel)}>
                {getRiskIcon(assessment.riskLevel)}
                {assessment.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </div>

          <Progress value={assessment.riskScore} className="h-3" />

          {/* Personalized Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Collateral Ratio</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{assessment.personalizedCollateralRatio}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Personalized for your profile</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Max Loan</span>
              </div>
              <div className="text-2xl font-bold text-green-600">${assessment.maxLoanAmount.toLocaleString()}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Based on your collateral</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Interest Rate</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{assessment.interestRate.toFixed(1)}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI-optimized rate</p>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className="font-medium mb-3">Risk Factors Analysis</h3>
            <div className="space-y-3">
              {assessment.factors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{factor.name}</span>
                      <Badge
                        variant={
                          factor.impact === "positive"
                            ? "default"
                            : factor.impact === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {factor.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{factor.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{factor.score}/100</div>
                    <Progress value={factor.score} className="w-16 h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h3 className="font-medium mb-3">AI Recommendations</h3>
            <div className="space-y-2">
              {assessment.recommendations.map((rec, index) => (
                <Alert key={index}>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>{rec}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>

          <Button onClick={analyzeRisk} variant="outline" className="w-full bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-analyze Risk
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
