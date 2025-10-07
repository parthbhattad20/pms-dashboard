import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Edit3,
  Save,
  X
} from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import pdfReportService from '../services/pdfReportService.js'

const ClientInsightsModal = ({ client, onClose, formatCurrency, calculateAccountAge, getClientInsights }) => {
  const [notes, setNotes] = useState(client?.notes || '')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState('')

  if (!client) return null

  const handleEditNotes = () => {
    setTempNotes(notes)
    setIsEditingNotes(true)
  }

  const handleSaveNotes = () => {
    setNotes(tempNotes)
    setIsEditingNotes(false)
    // Here you would typically save to backend/localStorage
    console.log('Notes saved for client:', client.name, tempNotes)
  }

  const handleCancelEdit = () => {
    setTempNotes('')
    setIsEditingNotes(false)
  }

  const insights = getClientInsights(client)
  const accountAge = calculateAccountAge(client.activationDate)

  // Portfolio allocation data for pie chart
  const portfolioData = [
    { 
      name: 'Invested', 
      value: client.netInvestmentValue || 0, 
      color: '#0088FE' 
    },
    { 
      name: 'Cash', 
      value: client.cashAllocation || 0, 
      color: '#00C49F' 
    }
  ]

  // Risk assessment data
  const riskMetrics = [
    {
      label: 'Cash Percentage',
      value: client.cashPercent || 0,
      benchmark: 20,
      status: (client.cashPercent || 0) > 25 ? 'high' : (client.cashPercent || 0) < 10 ? 'low' : 'optimal'
    },
    {
      label: 'Portfolio Concentration',
      value: 85,
      benchmark: 80,
      status: 'optimal'
    },
    {
      label: 'Net Addition Rate',
      value: client.netAddition > 0 ? 100 : client.netAddition < 0 ? 0 : 50,
      benchmark: 60,
      status: client.netAddition > 0 ? 'high' : client.netAddition < 0 ? 'low' : 'medium'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return 'text-green-600'
      case 'low': return 'text-red-600'
      case 'optimal': return 'text-blue-600'
      default: return 'text-yellow-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'high': 
      case 'optimal': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'low': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const handleDownloadReport = async () => {
    try {
      // Ensure charts are rendered before PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Enhanced insights with comprehensive data
      const enhancedInsights = {
        ...insights,
        accountAge: accountAge,
        portfolioData: portfolioData,
        riskMetrics: riskMetrics,
        totalPortfolioValue: (client.aum || 0),
        investmentRatio: ((client.netInvestmentValue || 0) / (client.aum || 1)) * 100,
        cashRatio: (client.cashPercent || 0),
        recommendations: insights.recommendations || [
          'Review portfolio allocation based on risk tolerance',
          'Consider systematic investment plans for cash deployment',
          'Schedule quarterly portfolio review meeting',
          'Evaluate tax-efficient investment strategies',
          'Monitor market conditions for rebalancing opportunities'
        ]
      }
      
      const doc = await pdfReportService.generateClientReport(client, enhancedInsights, notes)
      pdfReportService.save(`${client.name.replace(/\s+/g, '_')}_Detailed_Report.pdf`)
    } catch (error) {
      console.error('Error generating PDF report:', error)
      alert('Error generating client report. Please check the console for details.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Insights</h2>
            <p className="text-gray-600">{client.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-6">
          {/* Client Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Basic Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="font-semibold">{client.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-semibold">{client.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Mobile:</span>
                      <span className="font-semibold">{client.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Account Type:</span>
                      <Badge variant="outline">{client.accountType || 'N/A'}</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Country:</span>
                      <span className="font-semibold">{client.country || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Occupation:</span>
                      <span className="font-semibold">{client.occupation || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Activation:</span>
                      <span className="font-semibold">{client.activationDate || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Family:</span>
                      <span className="font-semibold">{client.family || 'Individual'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Age</p>
                    <p className="text-lg font-bold">{accountAge}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <Badge className={getStatusColor(insights.riskLevel)}>{insights.riskLevel}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Portfolio Health</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(insights.portfolioHealth)}
                      <span className="font-semibold">{insights.portfolioHealth}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relationship Manager</p>
                    <p className="font-semibold">{client.rm || 'Unassigned'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total AUM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(client.aum)}</div>
                <p className="text-xs text-muted-foreground mt-1">Assets Under Management</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Net Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(client.netInvestmentValue)}</div>
                <p className="text-xs text-muted-foreground mt-1">Invested Amount</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Cash Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(client.cashAllocation)}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {(client.cashPercent || 0).toFixed(1)}% of portfolio
                </p>
                <Progress value={client.cashPercent || 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {client.netAddition >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  Net Addition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${client.netAddition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(client.netAddition)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {client.netAddition >= 0 ? 'Inflow' : 'Outflow'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Portfolio Allocation Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Allocation
                </CardTitle>
                <CardDescription>Investment vs Cash Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
              {/* Hidden chart for PDF generation */}
              <div id="client-portfolio-chart" style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '600px', height: '400px' }}>
                <ResponsiveContainer width={600} height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Portfolio risk metrics analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className={`text-sm font-semibold ${getStatusColor(metric.status)}`}>
                          {metric.value.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={metric.value} className="flex-1" />
                        {getStatusIcon(metric.status)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Benchmark: {metric.benchmark}% | Status: {metric.status}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Cash Status</span>
                    <Badge variant="outline" className={getStatusColor(insights.cashStatus)}>
                      {insights.cashStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Performance Status</span>
                    <Badge variant="outline" className={getStatusColor(insights.performanceStatus)}>
                      {insights.performanceStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Portfolio Health</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(insights.portfolioHealth)}
                      <span className="text-sm font-semibold">{insights.portfolioHealth}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.recommendations && insights.recommendations.length > 0 ? (
                    insights.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No specific recommendations at this time.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Client Notes
                </CardTitle>
                {!isEditingNotes && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditNotes}
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    {notes ? 'Edit Notes' : 'Add Notes'}
                  </Button>
                )}
              </div>
              <CardDescription>
                Add or update notes about this client for future reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter notes about this client..."
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveNotes}
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Notes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      size="sm"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg">
                  {notes ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No notes added yet. Click "Add Notes" to get started.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ClientInsightsModal