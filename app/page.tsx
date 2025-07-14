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
import { Wallet, Bitcoin, TrendingUp, AlertTriangle, RefreshCw, DollarSign, Shield, Activity } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Watermark } from "@/components/watermark"

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

  // Mock wallet connection
  const connectWallet = async (walletType: "plug" | "stoic") => {
    setLoading(true)
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setWallet({
      address: `${walletType === "plug" ? "plug" : "stoic"}-wallet-${Math.random().toString(36).substr(2, 8)}`,
      balance: 2.5, // Mock ckBTC balance
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
  }

  // Mock deposit collateral
  const depositCollateral = async () => {
    if (!depositAmount || !wallet.connected) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update wallet balance
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - Number.parseFloat(depositAmount),
    }))

    setDepositAmount("")
    setLoading(false)
  }

  // Mock borrow tokens
  const borrowTokens = async () => {
    if (!borrowAmount || !selectedToken || !wallet.connected) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      collateralAmount: Number.parseFloat(depositAmount) || 1.0,
      borrowedAmount: Number.parseFloat(borrowAmount),
      borrowedToken: selectedToken,
      collateralRatio: 150, // Mock ratio
      liquidationThreshold: 120,
      interestRate: 5.5,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
    }

    setLoans((prev) => [...prev, newLoan])
    setBorrowAmount("")
    setSelectedToken("")
    setLoading(false)
  }

  // Mock repay loan
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
              <p className="text-gray-600 dark:text-gray-300 mt-1">DeFi Lending on Internet Computer Protocol</p>
            </div>

            {/* Wallet Connection and Theme Toggle */}
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

          {/* Rest of the app content remains the same */}
          {!wallet.connected ? (
            /* Welcome Screen */
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <Bitcoin className="h-16 w-16 text-orange-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to BitLoan</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Connect your ICP wallet to start lending and borrowing with ckBTC collateral
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <Card>
                    <CardHeader>
                      <Shield className="h-8 w-8 text-blue-500 mx-auto" />
                      <CardTitle className="text-lg">Secure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Built on Internet Computer Protocol with robust smart contracts
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto" />
                      <CardTitle className="text-lg">Competitive Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Enjoy competitive interest rates on your crypto loans
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Activity className="h-8 w-8 text-purple-500 mx-auto" />
                      <CardTitle className="text-lg">Real-time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Monitor your positions with real-time collateral tracking
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Main App - all the existing tabs content remains exactly the same */
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
                      <CardTitle className="text-sm font-medium">Avg. Collateral Ratio</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {loans.length > 0
                          ? (loans.reduce((sum, loan) => sum + loan.collateralRatio, 0) / loans.length).toFixed(0)
                          : 0}
                        %
                      </div>
                      <p className="text-xs text-muted-foreground">Liquidation at 120%</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Loans */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Loans</CardTitle>
                    <CardDescription>Monitor your loan positions and collateral ratios</CardDescription>
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

              {/* Borrow Tab */}
              <TabsContent value="borrow">
                <Card>
                  <CardHeader>
                    <CardTitle>Borrow Tokens</CardTitle>
                    <CardDescription>Borrow against your ckBTC collateral</CardDescription>
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

                    {selectedToken && borrowAmount && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Loan Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Borrow Amount:</span>
                            <span>
                              {borrowAmount} {selectedToken}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Interest Rate:</span>
                            <span>5.5% APR</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Collateral Ratio:</span>
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
