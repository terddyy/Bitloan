"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Wallet,
  Bitcoin,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  Shield,
  Brain,
  Zap,
  Globe,
  Users,
  BarChart3,
  CheckCircle,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Watermark } from "@/components/watermark"
import { AIRiskAssessment } from "@/components/ai-risk-assessment"

// Mock data and types
interface Loan {
  id: string
  collateralAmount: number
  borrowedAmount: number
  borrowedToken: string
  collateralRatio: number
  liquidationThreshold: number
  interestRate: number
  dueDate: string
  status: "active" | "repaid" | "liquidated"
  riskScore?: number
}

interface WalletInfo {
  address: string
  balance: number
  connected: boolean
  type: "plug" | "stoic" | null
}

const mockTokens = [
  { symbol: "USDC", name: "USD Coin", rate: 1.0 },
  { symbol: "ICP", name: "Internet Computer", rate: 12.5 },
  { symbol: "ckUSDT", name: "Tether USD", rate: 1.0 },
]

export default function BitLoanApp() {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: "",
    balance: 0,
    connected: false,
    type: null,
  })

  const [loans, setLoans] = useState<Loan[]>([])
  const [depositAmount, setDepositAmount] = useState("")
  const [borrowAmount, setBorrowAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState("")
  const [repayAmount, setRepayAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentRiskAssessment, setCurrentRiskAssessment] = useState<any>(null)

  // Mock wallet connection
  const connectWallet = async (walletType: "plug" | "stoic") => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setWallet({
      address: `${walletType === "plug" ? "plug" : "stoic"}-wallet-${Math.random().toString(36).substr(2, 8)}`,
      balance: 2.5,
      connected: true,
      type: walletType,
    })
    setLoading(false)
  }

  const disconnectWallet = () => {
    setWallet({
      address: "",
      balance: 0,
      connected: false,
      type: null,
    })
    setLoans([])
    setCurrentRiskAssessment(null)
  }

  const depositCollateral = async () => {
    if (!depositAmount || !wallet.connected) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - Number.parseFloat(depositAmount),
    }))

    setDepositAmount("")
    setLoading(false)
  }

  const borrowTokens = async () => {
    if (!borrowAmount || !selectedToken || !wallet.connected) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      collateralAmount: Number.parseFloat(depositAmount) || 1.0,
      borrowedAmount: Number.parseFloat(borrowAmount),
      borrowedToken: selectedToken,
      collateralRatio: currentRiskAssessment?.personalizedCollateralRatio || 150,
      liquidationThreshold: 120,
      interestRate: currentRiskAssessment?.interestRate || 5.5,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
      riskScore: currentRiskAssessment?.riskScore,
    }

    setLoans((prev) => [...prev, newLoan])
    setBorrowAmount("")
    setSelectedToken("")
    setLoading(false)
  }

  const repayLoan = async (loanId: string) => {
    if (!repayAmount) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLoans((prev) => prev.map((loan) => (loan.id === loanId ? { ...loan, status: "repaid" as const } : loan)))

    setRepayAmount("")
    setLoading(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getCollateralRatioColor = (ratio: number, threshold: number) => {
    if (ratio <= threshold) return "text-red-500"
    if (ratio <= threshold + 20) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="bitloan-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bitcoin className="h-8 w-8 text-orange-500" />
                BitLoan
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                AI-Powered DeFi Lending on Internet Computer Protocol
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
              <ThemeToggle />
              {!wallet.connected ? (
                <>
                  <Button
                    onClick={() => connectWallet("plug")}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-2" />
                    )}
                    Connect Plug
                  </Button>
                  <Button onClick={() => connectWallet("stoic")} disabled={loading} variant="outline">
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-2" />
                    )}
                    Connect Stoic
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Wallet className="h-3 w-3 mr-1" />
                    {formatAddress(wallet.address)}
                  </Badge>
                  <Badge variant="outline">{wallet.balance.toFixed(4)} ckBTC</Badge>
                  <Button onClick={disconnectWallet} variant="ghost" size="sm">
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
          </div>

          {!wallet.connected ? (
            /* Enhanced Landing Page */
            <div className="space-y-16">
              {/* Hero Section */}
              <div className="text-center py-16">
                <div className="max-w-4xl mx-auto">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Bitcoin className="h-20 w-20 text-orange-500" />
                      <Brain className="h-8 w-8 text-purple-500 absolute -top-2 -right-2 bg-white dark:bg-gray-900 rounded-full p-1" />
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    The Future of{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      AI-Powered
                    </span>{" "}
                    DeFi Lending
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    BitLoan revolutionizes decentralized lending by combining cutting-edge AI risk assessment with the
                    security and transparency of the Internet Computer Protocol. Get personalized loan terms, real-time
                    risk monitoring, and competitive rates.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Wallet className="h-5 w-5 mr-2" />
                      Connect Wallet to Start
                    </Button>
                    <Button size="lg" variant="outline">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      View Analytics
                    </Button>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">$2.5M+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Value Locked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Active Loans</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">98.5%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">AI Accuracy Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">3.2%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Average Interest Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-2 border-blue-100 dark:border-blue-900">
                  <CardHeader>
                    <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <CardTitle className="text-xl text-center">AI-Powered Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Our advanced AI analyzes on-chain data, market conditions, and user behavior to provide
                      personalized risk assessments and loan terms in real-time.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Real-time risk scoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Personalized collateral ratios</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Dynamic interest rates</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-100 dark:border-green-900">
                  <CardHeader>
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <CardTitle className="text-xl text-center">Secure & Transparent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Built on Internet Computer Protocol with robust smart contracts, multi-signature security, and
                      complete transparency of all transactions and risk assessments.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>ICP blockchain security</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Audited smart contracts</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Full transparency</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-100 dark:border-orange-900">
                  <CardHeader>
                    <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <CardTitle className="text-xl text-center">Competitive Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      AI optimization ensures you get the best possible interest rates based on your risk profile,
                      market conditions, and collateral quality.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Starting from 2.5% APR</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>No hidden fees</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Flexible repayment terms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <CardTitle className="text-xl text-center">Instant Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Lightning-fast loan processing powered by ICP's high-performance blockchain. Get your funds in
                      minutes, not days.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Sub-second finality</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Automated processing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>24/7 availability</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-100 dark:border-indigo-900">
                  <CardHeader>
                    <Globe className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                    <CardTitle className="text-xl text-center">Global Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Access DeFi lending from anywhere in the world. No KYC required, just connect your wallet and
                      start borrowing or lending.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>No geographical restrictions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Multiple wallet support</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Cross-chain compatibility</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-teal-100 dark:border-teal-900">
                  <CardHeader>
                    <Users className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                    <CardTitle className="text-xl text-center">Community Driven</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Join a thriving community of DeFi enthusiasts. Participate in governance, earn rewards, and help
                      shape the future of decentralized lending.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Governance participation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Community rewards</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>24/7 support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* How It Works */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">How BitLoan Works</h2>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="font-semibold">Connect Wallet</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Connect your ICP wallet (Plug or Stoic) to get started
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-purple-600">2</span>
                    </div>
                    <h3 className="font-semibold">AI Risk Assessment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our AI analyzes your profile and provides personalized terms
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-green-600">3</span>
                    </div>
                    <h3 className="font-semibold">Deposit Collateral</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Deposit ckBTC as collateral to secure your loan
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-orange-600">4</span>
                    </div>
                    <h3 className="font-semibold">Borrow & Repay</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Borrow tokens instantly and repay on flexible terms
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Experience AI-Powered DeFi?</h2>
                <p className="text-xl mb-6 opacity-90">
                  Join thousands of users who trust BitLoan for their DeFi lending needs
                </p>
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet Now
                </Button>
              </div>
            </div>
          ) : (
            /* Main App - Enhanced with AI Risk Assessment */
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="borrow">Borrow</TabsTrigger>
                <TabsTrigger value="repay">Repay</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Collateral</CardTitle>
                      <Bitcoin className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {loans.reduce((sum, loan) => sum + loan.collateralAmount, 0).toFixed(4)} ckBTC
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ${(loans.reduce((sum, loan) => sum + loan.collateralAmount, 0) * 45000).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${loans.reduce((sum, loan) => sum + loan.borrowedAmount, 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Across {loans.length} active loans</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">AI Risk Score</CardTitle>
                      <Brain className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {loans.length > 0 && loans[0].riskScore ? `${loans[0].riskScore}/100` : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground">AI-powered assessment</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Loans */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Loans</CardTitle>
                    <CardDescription>Monitor your loan positions and AI risk assessments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loans.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          No active loans. Start by depositing collateral and borrowing tokens.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {loans.map((loan) => (
                          <div key={loan.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {loan.borrowedAmount.toLocaleString()} {loan.borrowedToken}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Collateral: {loan.collateralAmount.toFixed(4)} ckBTC
                                </p>
                                {loan.riskScore && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Brain className="h-3 w-3 text-purple-500" />
                                    <span className="text-xs text-purple-600">AI Risk Score: {loan.riskScore}/100</span>
                                  </div>
                                )}
                              </div>
                              <Badge variant={loan.status === "active" ? "default" : "secondary"}>{loan.status}</Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Collateral Ratio</span>
                                <span
                                  className={getCollateralRatioColor(loan.collateralRatio, loan.liquidationThreshold)}
                                >
                                  {loan.collateralRatio}%
                                </span>
                              </div>
                              <Progress value={Math.min((loan.collateralRatio / 200) * 100, 100)} className="h-2" />
                            </div>

                            {loan.collateralRatio <= loan.liquidationThreshold + 20 && (
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  Warning: Your position is approaching liquidation threshold (
                                  {loan.liquidationThreshold}
                                  %)
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                              <span>Interest Rate: {loan.interestRate}%</span>
                              <span>Due: {loan.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Deposit Tab */}
              <TabsContent value="deposit">
                <Card>
                  <CardHeader>
                    <CardTitle>Deposit Collateral</CardTitle>
                    <CardDescription>Deposit ckBTC as collateral to secure your loans</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Amount (ckBTC)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="0.0000"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        step="0.0001"
                        max={wallet.balance}
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Available: {wallet.balance.toFixed(4)} ckBTC
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Deposit Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Deposit Amount:</span>
                          <span>{depositAmount || "0.0000"} ckBTC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>USD Value:</span>
                          <span>${((Number.parseFloat(depositAmount) || 0) * 45000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Borrowable (75%):</span>
                          <span>${((Number.parseFloat(depositAmount) || 0) * 45000 * 0.75).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={depositCollateral}
                      disabled={!depositAmount || Number.parseFloat(depositAmount) > wallet.balance || loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Deposit Collateral"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Borrow Tab - Enhanced with AI Risk Assessment */}
              <TabsContent value="borrow" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Borrow Tokens</CardTitle>
                    <CardDescription>Borrow against your ckBTC collateral with AI-optimized terms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="borrow-token">Select Token</Label>
                      <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose token to borrow" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTokens.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              {token.name} ({token.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="borrow-amount">Amount (USD)</Label>
                      <Input
                        id="borrow-amount"
                        type="number"
                        placeholder="0.00"
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                      />
                    </div>

                    {selectedToken && borrowAmount && depositAmount && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Standard Loan Terms</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Borrow Amount:</span>
                            <span>
                              {borrowAmount} {selectedToken}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Standard Interest Rate:</span>
                            <span>5.5% APR</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Standard Collateral Ratio:</span>
                            <span>150%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Liquidation Threshold:</span>
                            <span>120%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={borrowTokens}
                      disabled={!selectedToken || !borrowAmount || loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Borrow Tokens"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Risk Assessment */}
                {selectedToken && borrowAmount && depositAmount && (
                  <AIRiskAssessment
                    walletAddress={wallet.address}
                    collateralAmount={Number.parseFloat(depositAmount)}
                    requestedAmount={Number.parseFloat(borrowAmount)}
                    onAssessmentComplete={setCurrentRiskAssessment}
                  />
                )}
              </TabsContent>

              {/* Repay Tab */}
              <TabsContent value="repay">
                <Card>
                  <CardHeader>
                    <CardTitle>Repay Loans</CardTitle>
                    <CardDescription>Repay your active loans to unlock collateral</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loans.filter((loan) => loan.status === "active").length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No active loans to repay.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {loans
                          .filter((loan) => loan.status === "active")
                          .map((loan) => (
                            <div key={loan.id} className="border rounded-lg p-4 space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">
                                    {loan.borrowedAmount.toLocaleString()} {loan.borrowedToken}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Collateral: {loan.collateralAmount.toFixed(4)} ckBTC
                                  </p>
                                  {loan.riskScore && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Brain className="h-3 w-3 text-purple-500" />
                                      <span className="text-xs text-purple-600">
                                        AI Risk Score: {loan.riskScore}/100
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <Badge>Active</Badge>
                              </div>

                              <div className="space-y-2">
                                <Label>Repayment Amount</Label>
                                <Input
                                  type="number"
                                  placeholder={`Max: ${loan.borrowedAmount}`}
                                  value={repayAmount}
                                  onChange={(e) => setRepayAmount(e.target.value)}
                                />
                              </div>

                              <Button
                                onClick={() => repayLoan(loan.id)}
                                disabled={!repayAmount || loading}
                                className="w-full"
                              >
                                {loading ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    Processing...
                                  </>
                                ) : (
                                  "Repay Loan"
                                )}
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
        <Watermark />
      </div>
    </ThemeProvider>
  )
}
