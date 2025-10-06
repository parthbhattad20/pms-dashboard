import { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Search, Download, TrendingUp, Users, DollarSign, Briefcase, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon, BarChart3, X, Calendar, Mail, Phone, Building2, Wallet, TrendingDown, Activity } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
function AppComponent() {
    
  const [clients, setClients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    // Load Excel data
    fetch('/250911BWCClientDashboard.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // Parse data starting from row 4 (index 3) where actual data begins
        const headers = data[3]
        const clientData = data.slice(4).filter(row => row[0] && typeof row[0] === 'string' && row[0].length > 0 && !row[0].includes('<')) // Filter out empty rows and instruction rows
        
        const parsedClients = clientData.map(row => ({
          name: row[0] || '',
          email: row[1] || '',
          mobile: row[2] || '',
          accountType: row[3] || '',
          country: row[4] || '',
          occupation: row[5] || '',
          activationDate: row[6] || '',
          aum: parseFloat(row[7]) || 0,
          netAddition: parseFloat(row[8]) || 0,
          netInvestmentValue: parseFloat(row[9]) || 0,
          cashAllocation: parseFloat(row[10]) || 0,
          cashPercent: parseFloat(row[11]) || 0,
          rm: row[12] || '',
          family: row[13] || '',
          notes: row[14] || '',
          sip: row[15] || ''
        }))
        
        setClients(parsedClients)
      })
      .catch(err => console.error('Error loading Excel file:', err))
  }, [])

  // Filter and search logic
  const filteredClients = useMemo(() => {
    let filtered = clients

    // Apply account type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(client => 
        client.accountType.toLowerCase() === filterType.toLowerCase()
      )
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.rm.toLowerCase().includes(query) ||
        client.family.toLowerCase().includes(query) ||
        client.accountType.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [clients, searchQuery, filterType])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAUM = clients.reduce((sum, client) => sum + client.aum, 0)
    const totalNetAddition = clients.reduce((sum, client) => sum + client.netAddition, 0)
    const totalCash = clients.reduce((sum, client) => sum + client.cashAllocation, 0)
    const avgAUM = clients.length > 0 ? totalAUM / clients.length : 0
    const totalInvested = clients.reduce((sum, client) => sum + client.netInvestmentValue, 0)
    const avgCashPercent = clients.length > 0 ? (totalCash / totalAUM) * 100 : 0

    return {
      totalClients: clients.length,
      totalAUM,
      totalNetAddition,
      totalCash,
      avgAUM,
      totalInvested,
      avgCashPercent
    }
  }, [clients])

  // Chart data
  const accountTypeData = useMemo(() => {
    const types = {}
    clients.forEach(client => {
      const type = client.accountType || 'Unknown'
      types[type] = (types[type] || 0) + 1
    })
    return Object.entries(types).map(([name, value]) => ({ name, value, aum: clients.filter(c => c.accountType === name).reduce((sum, c) => sum + c.aum, 0) }))
  }, [clients])

  const rmData = useMemo(() => {
    const rms = {}
    clients.forEach(client => {
      const rm = client.rm || 'Unassigned'
      if (!rms[rm]) {
        rms[rm] = { aum: 0, clients: 0, netAddition: 0 }
      }
      rms[rm].aum += client.aum
      rms[rm].clients += 1
      rms[rm].netAddition += client.netAddition
    })
    return Object.entries(rms).map(([name, data]) => ({ name, ...data }))
  }, [clients])

  const topClients = useMemo(() => {
    return [...clients]
      .sort((a, b) => b.aum - a.aum)
      .slice(0, 10)
      .map(client => ({ name: client.name, aum: client.aum, netAddition: client.netAddition }))
  }, [clients])

  const familyData = useMemo(() => {
    const families = {}
    clients.forEach(client => {
      if (client.family) {
        if (!families[client.family]) {
          families[client.family] = { aum: 0, clients: 0 }
        }
        families[client.family].aum += client.aum
        families[client.family].clients += 1
      }
    })
    return Object.entries(families).map(([name, data]) => ({ name, ...data }))
  }, [clients])

  const cashVsInvestedData = useMemo(() => {
    return clients.map(client => ({
      name: client.name,
      cash: client.cashAllocation,
      invested: client.netInvestmentValue,
      cashPercent: client.cashPercent
    })).slice(0, 10)
  }, [clients])

  // Client-specific calculations
  const getClientInsights = (client) => {
    if (!client) return null

    const allClientsAvgAUM = stats.avgAUM
    const aumPercentile = ((clients.filter(c => c.aum < client.aum).length / clients.length) * 100).toFixed(0)
    const investmentRate = client.aum > 0 ? ((client.netInvestmentValue / client.aum) * 100).toFixed(2) : 0
    const cashRate = client.aum > 0 ? ((client.cashAllocation / client.aum) * 100).toFixed(2) : 0
    const returnOnInvestment = client.netInvestmentValue > 0 ? (((client.aum - client.netInvestmentValue) / client.netInvestmentValue) * 100).toFixed(2) : 0
    
    // Get family members if applicable
    const familyMembers = client.family ? clients.filter(c => c.family === client.family && c.name !== client.name) : []
    const familyTotalAUM = client.family ? clients.filter(c => c.family === client.family).reduce((sum, c) => sum + c.aum, 0) : client.aum
    
    // RM performance
    const rmClients = clients.filter(c => c.rm === client.rm)
    const rmTotalAUM = rmClients.reduce((sum, c) => sum + c.aum, 0)
    const rmAvgAUM = rmTotalAUM / rmClients.length

    return {
      aumPercentile,
      investmentRate,
      cashRate,
      returnOnInvestment,
      comparisonToAvg: ((client.aum / allClientsAvgAUM) * 100).toFixed(0),
      familyMembers,
      familyTotalAUM,
      rmClients: rmClients.length,
      rmTotalAUM,
      rmAvgAUM,
      accountAge: client.activationDate ? calculateAccountAge(client.activationDate) : 'N/A'
    }
  }

  const calculateAccountAge = (activationDate) => {
    if (!activationDate) return 'N/A'
    try {
      const date = new Date(activationDate)
      const now = new Date()
      const years = now.getFullYear() - date.getFullYear()
      const months = now.getMonth() - date.getMonth()
      const totalMonths = years * 12 + months
      
      if (totalMonths < 12) return `${totalMonths} months`
      return `${years} years ${months} months`
    } catch {
      return 'N/A'
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B9D', '#C084FC']

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`
    }
    return `₹${value.toLocaleString()}`
  }

  const downloadReport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredClients)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Clients')
    XLSX.writeFile(wb, 'BWC_Client_Report.xlsx')
  }

  const ClientDetailModal = ({ client, onClose }) => {
    if (!client) return null
    
    const insights = getClientInsights(client)
    
    // Data for client-specific charts
    const clientFinancialBreakdown = [
      { name: 'AUM', value: client.aum, fill: '#0088FE' },
      { name: 'Net Investment', value: client.netInvestmentValue, fill: '#00C49F' },
      { name: 'Cash', value: client.cashAllocation, fill: '#FFBB28' },
      { name: 'Net Addition', value: client.netAddition, fill: '#FF8042' }
    ].filter(item => item.value > 0)

    const clientPerformanceData = [
      { metric: 'AUM Percentile', value: parseFloat(insights.aumPercentile), fullMark: 100 },
      { metric: 'Investment Rate', value: parseFloat(insights.investmentRate), fullMark: 100 },
      { metric: 'Cash Rate', value: parseFloat(insights.cashRate), fullMark: 100 },
      { metric: 'ROI', value: Math.min(parseFloat(insights.returnOnInvestment), 100), fullMark: 100 }
    ]

    const comparisonData = [
      { category: 'This Client', aum: client.aum },
      { category: 'RM Average', aum: insights.rmAvgAUM },
      { category: 'Overall Average', aum: stats.avgAUM }
    ]

    return (
      <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-lg shadow-2xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">{client.name}</h2>
                <p className="text-blue-100 mt-1">{client.email}</p>
                <div className="flex gap-2 mt-3">
                  <Badge className="bg-white/20 text-white border-white/30">{client.accountType}</Badge>
                  {client.sip && <Badge className="bg-green-500/20 text-white border-green-300/30">SIP Active</Badge>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financial">Financial Details</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="family">Family & RM</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total AUM</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(client.aum)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insights.comparisonToAvg}% of average
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Net Addition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${client.netAddition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(client.netAddition)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {client.netAddition >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        Inflows/Outflows
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Cash Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(client.cashAllocation)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insights.cashRate}% of portfolio
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{client.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Mobile</p>
                          <p className="text-sm text-muted-foreground">{client.mobile || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Country</p>
                          <p className="text-sm text-muted-foreground">{client.country || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Occupation</p>
                          <p className="text-sm text-muted-foreground">{client.occupation || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Activation Date</p>
                          <p className="text-sm text-muted-foreground">{client.activationDate || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Account Age</p>
                          <p className="text-sm text-muted-foreground">{insights.accountAge}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {client.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{client.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Financial Details Tab */}
              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Breakdown</CardTitle>
                      <CardDescription>Distribution of client's portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={clientFinancialBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {clientFinancialBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Client performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={clientPerformanceData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Performance" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Financial Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Investment Rate</span>
                          <span className="text-sm font-bold">{insights.investmentRate}%</span>
                        </div>
                        <Progress value={parseFloat(insights.investmentRate)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Cash Allocation Rate</span>
                          <span className="text-sm font-bold">{insights.cashRate}%</span>
                        </div>
                        <Progress value={parseFloat(insights.cashRate)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Return on Investment</span>
                          <span className={`text-sm font-bold ${parseFloat(insights.returnOnInvestment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {insights.returnOnInvestment}%
                          </span>
                        </div>
                        <Progress value={Math.min(Math.abs(parseFloat(insights.returnOnInvestment)), 100)} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Net Investment Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{formatCurrency(client.netInvestmentValue)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Cash %</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{client.cashPercent.toFixed(2)}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Total Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{formatCurrency(client.aum - client.netInvestmentValue)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">AUM Rank</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">Top {insights.aumPercentile}%</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Comparative Analysis</CardTitle>
                    <CardDescription>How this client compares to others</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="aum" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium">Portfolio Ranking</p>
                          <p className="text-sm text-muted-foreground">
                            This client is in the top {insights.aumPercentile}% of all clients by AUM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                          <Wallet className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                          <p className="font-medium">Investment Strategy</p>
                          <p className="text-sm text-muted-foreground">
                            {parseFloat(insights.cashRate) > 20 
                              ? 'High cash allocation - conservative approach' 
                              : 'Low cash allocation - aggressive investment strategy'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
                          <Activity className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <p className="font-medium">Performance</p>
                          <p className="text-sm text-muted-foreground">
                            {parseFloat(insights.returnOnInvestment) >= 0 
                              ? `Positive ROI of ${insights.returnOnInvestment}%` 
                              : `Negative ROI of ${insights.returnOnInvestment}%`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {parseFloat(insights.cashRate) > 30 && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">High Cash Holdings</p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            Consider discussing investment opportunities to optimize returns
                          </p>
                        </div>
                      )}
                      {client.netAddition < 0 && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">Net Withdrawals</p>
                          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                            Client has made net withdrawals - follow up to understand needs
                          </p>
                        </div>
                      )}
                      {!client.sip && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">SIP Opportunity</p>
                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Client doesn't have an active SIP - consider proposing systematic investment
                          </p>
                        </div>
                      )}
                      {parseFloat(insights.returnOnInvestment) > 20 && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">Strong Performance</p>
                          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            Excellent returns - good opportunity to discuss portfolio expansion
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Family & RM Tab */}
              <TabsContent value="family" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Relationship Manager</CardTitle>
                      <CardDescription>{client.rm || 'Unassigned'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Clients Managed</p>
                        <p className="text-2xl font-bold">{insights.rmClients}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total AUM Managed</p>
                        <p className="text-2xl font-bold">{formatCurrency(insights.rmTotalAUM)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Client AUM</p>
                        <p className="text-2xl font-bold">{formatCurrency(insights.rmAvgAUM)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Family Group</CardTitle>
                      <CardDescription>{client.family || 'No family group'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {client.family ? (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Family Members</p>
                            <p className="text-2xl font-bold">{insights.familyMembers.length + 1}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Family AUM</p>
                            <p className="text-2xl font-bold">{formatCurrency(insights.familyTotalAUM)}</p>
                          </div>
                          {insights.familyMembers.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Other Members</p>
                              <div className="space-y-1">
                                {insights.familyMembers.map((member, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span>{member.name}</span>
                                    <span className="font-medium">{formatCurrency(member.aum)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">This client is not part of a family group</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => {
              const ws = XLSX.utils.json_to_sheet([client])
              const wb = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb, ws, 'Client')
              XLSX.writeFile(wb, `${client.name}_Report.xlsx`)
            }}>
              <Download className="h-4 w-4 mr-2" />
              Export Client Data
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">PMS Client Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Comprehensive portfolio management & insights</p>
            </div>
            <Button onClick={downloadReport} className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalAUM)}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                Assets under management
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Addition</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalNetAddition)}</div>
              <p className="text-xs text-muted-foreground mt-1">Total inflows</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average AUM</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgAUM)}</div>
              <p className="text-xs text-muted-foreground mt-1">Per client</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Account Type Distribution</CardTitle>
              <CardDescription>Client distribution by account type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accountTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accountTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>AUM by Relationship Manager</CardTitle>
              <CardDescription>Total assets managed by each RM</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rmData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="aum" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Family Group Analysis</CardTitle>
              <CardDescription>AUM by family groups</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={familyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="aum" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>RM Performance</CardTitle>
              <CardDescription>Clients and net additions by RM</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={rmData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="netAddition" fill="#8884d8" name="Net Addition" />
                  <Line yAxisId="right" type="monotone" dataKey="clients" stroke="#ff7300" name="Clients" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Top 10 Clients by AUM</CardTitle>
            <CardDescription>Highest value client portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topClients} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="aum" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Client Search & Filter</CardTitle>
            <CardDescription>Search by name, email, RM, family, or account type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'nri' ? 'default' : 'outline'}
                  onClick={() => setFilterType('nri')}
                >
                  NRI
                </Button>
                <Button
                  variant={filterType === 'pool account' ? 'default' : 'outline'}
                  onClick={() => setFilterType('pool account')}
                >
                  Pool Account
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredClients.length} of {clients.length} clients
            </p>
          </CardContent>
        </Card>

        {/* Client Table */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Client Portfolio</CardTitle>
            <CardDescription>Complete list of all clients and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead className="text-right">AUM</TableHead>
                    <TableHead className="text-right">Net Addition</TableHead>
                    <TableHead>RM</TableHead>
                    <TableHead>Family</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => (
                    <TableRow 
                      key={index}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => setSelectedClient(client)}
                    >
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                      <TableCell>
                        <Badge variant={client.accountType === 'NRI' ? 'default' : 'secondary'}>
                          {client.accountType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(client.aum)}</TableCell>
                      <TableCell className="text-right">
                        <span className={client.netAddition >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(client.netAddition)}
                        </span>
                      </TableCell>
                      <TableCell>{client.rm}</TableCell>
                      <TableCell>{client.family}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{client.notes}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedClient(client)
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 PMS Client Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AppComponent
