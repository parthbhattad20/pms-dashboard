import { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Search, Download, TrendingUp, Users, DollarSign, Briefcase, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon, BarChart3, X, Calendar, Mail, Phone, Building2, Wallet, TrendingDown, Activity, LogOut } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '../Context/AuthContext.jsx'

// Import the new components
import DashboardLayout from '../components/DashboardLayout.jsx'
import OverviewTab from '../components/tabs/OverviewTab.jsx'
import ClientsTab from '../components/tabs/ClientsTab.jsx'
import AnalyticsTab from '../components/tabs/AnalyticsTab.jsx'
import PerformanceTab from '../components/tabs/PerformanceTab.jsx'
import SettingsTab from '../components/tabs/SettingsTab.jsx'
import ClientInsightsModal from '../components/ClientInsightsModal.jsx'
import pdfReportService from '../services/pdfReportService.js'

function AppComponent() {
    
  const [clients, setClients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [filterType, setFilterType] = useState('all')

  const [activeTab, setActiveTab] = useState('overview') // New state for sidebar navigation
  const { user, logout } = useAuth()

  // All features enabled for all users
  const premiumFeatures = {
    showNetAddition: true,
    showFamilyAnalysis: true,
    showAdvancedCharts: true,
    showEnterpriseAnalytics: true,
    showNotes: true,
    showFamilyColumn: true,
    maxClients: Infinity
  }

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

    // Apply premium tier limits
    const maxClients = premiumFeatures.maxClients
    if (filtered.length > maxClients) {
      filtered = filtered.slice(0, maxClients)
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

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`
    }
    return `₹${value.toLocaleString()}`
  }

  const downloadReport = async () => {
    try {
      const chartData = {
        accountTypeData,
        rmData,
        familyData,
        cashVsInvestedData
      }
      
      const doc = await pdfReportService.generatePortfolioReport(filteredClients, stats, chartData)
      pdfReportService.save('Portfolio_Report.pdf')
    } catch (error) {
      console.error('Error generating PDF report:', error)
    }
  }

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            stats={stats}
            accountTypeData={accountTypeData}
            rmData={rmData}
            premiumFeatures={premiumFeatures}
            formatCurrency={formatCurrency}
          />
        )
      case 'clients':
        return (
          <ClientsTab 
            filteredClients={filteredClients}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            setSelectedClient={setSelectedClient}
            premiumFeatures={premiumFeatures}
            formatCurrency={formatCurrency}
            downloadReport={downloadReport}
          />
        )
      case 'analytics':
        return (
          <AnalyticsTab 
            familyData={familyData}
            rmData={rmData}
            topClients={topClients}
            cashVsInvestedData={cashVsInvestedData}
            premiumFeatures={premiumFeatures}
            formatCurrency={formatCurrency}
          />
        )
      case 'performance':
        return (
          <PerformanceTab 
            premiumFeatures={premiumFeatures}
            stats={stats}
            formatCurrency={formatCurrency}
          />
        )
      case 'reports':
      case 'risk':
      case 'calendar':
        return (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <p className="text-gray-600 mb-4 max-w-md">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} features coming soon.
              </p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <SettingsTab />
        )
      case 'notifications':
        return (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Manage your notification preferences</p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No new notifications</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 'help':
        return (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
                <p className="text-gray-600 mt-1">Get help and support for your dashboard</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Learn how to use all dashboard features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">View Docs</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>Get help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Contact Us</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <OverviewTab 
            stats={stats}
            accountTypeData={accountTypeData}
            rmData={rmData}
            premiumFeatures={premiumFeatures}
            formatCurrency={formatCurrency}
          />
        )
    }
  }

  return (
    <DashboardLayout 
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTabContent()}
      
      {/* Client Insights Modal */}
      {selectedClient && (
        <ClientInsightsModal 
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          formatCurrency={formatCurrency}
          calculateAccountAge={calculateAccountAge}
          getClientInsights={getClientInsights}
        />
      )}
    </DashboardLayout>
  )
}

export default AppComponent