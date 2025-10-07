import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { TrendingUp, Users, DollarSign, Briefcase, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import pdfReportService from '../../services/pdfReportService.js'

const OverviewTab = ({ stats, accountTypeData, rmData, formatCurrency }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const handleDownloadOverviewReport = async () => {
    try {
      // Prepare comprehensive chart data for PDF
      const chartData = { 
        accountTypeData: accountTypeData || [], 
        rmData: rmData || [],
        totalClients: stats.totalClients,
        totalAUM: stats.totalAUM,
        totalNetAddition: stats.totalNetAddition,
        avgCashPercent: stats.avgCashPercent
      }
      
      // Generate a comprehensive portfolio report with all client data
      const doc = await pdfReportService.generatePortfolioReport(
        [], // clients data - will need to be passed from parent
        {
          totalClients: stats.totalClients,
          totalAUM: stats.totalAUM,
          totalNetAddition: stats.totalNetAddition,
          totalCash: stats.totalCash,
          avgCashPercent: stats.avgCashPercent
        },
        chartData
      )
      pdfReportService.save('Portfolio_Overview_Report.pdf')
    } catch (error) {
      console.error('Error generating overview report:', error)
      alert('Error generating report. Please check the console for details.')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Get a quick overview of your portfolio management</p>
        </div>
        <Button onClick={handleDownloadOverviewReport} className="gap-2">
          <Download className="h-4 w-4" />
          Download Overview Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalNetAddition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.totalNetAddition)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {stats.totalNetAddition >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              Portfolio flow
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Allocation</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCash)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.avgCashPercent.toFixed(1)}% of total AUM
            </p>
            <Progress value={stats.avgCashPercent} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Account Type Distribution</CardTitle>
            <CardDescription>Client distribution by account type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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
          {/* Hidden chart for PDF generation */}
          <div id="account-type-chart" style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px', height: '400px' }}>
            <ResponsiveContainer width={800} height={400}>
              <PieChart>
                <Pie
                  data={accountTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
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
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>AUM by Relationship Manager</CardTitle>
            <CardDescription>Total assets managed by each RM</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="aum" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          {/* Hidden chart for PDF generation */}
          <div id="rm-performance-chart" style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px', height: '400px' }}>
            <ResponsiveContainer width={800} height={400}>
              <BarChart data={rmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="aum" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OverviewTab