import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts'
import pdfReportService from '../../services/pdfReportService.js'

const AnalyticsTab = ({ 
  familyData, 
  rmData, 
  topClients, 
  cashVsInvestedData, 
  formatCurrency 
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

  const handleDownloadAnalyticsReport = async () => {
    try {
      const doc = await pdfReportService.generateAnalyticsReport(familyData, rmData, topClients, cashVsInvestedData, {})
      pdfReportService.save('Analytics_Report.pdf')
    } catch (error) {
      console.error('Error generating analytics report:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Deep insights into portfolio performance and trends</p>
        </div>
        <Button 
          onClick={handleDownloadAnalyticsReport}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Analytics Report
        </Button>
      </div>

      {/* Family Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Family Group Analysis</CardTitle>
            <CardDescription>AUM distribution across family groups</CardDescription>
          </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={familyData} id="family-analysis-chart">
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
              <CardTitle>RM Performance Analytics</CardTitle>
              <CardDescription>Client count vs Net additions by RM</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={rmData} id="rm-performance-detailed-chart">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="netAddition" fill="#8884d8" name="Net Addition" />
                  <Line yAxisId="right" type="monotone" dataKey="clients" stroke="#ff7300" name="Client Count" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      {/* Top Performers */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Top 10 Clients by AUM</CardTitle>
          <CardDescription>Highest value client portfolios with performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topClients} layout="vertical" id="top-clients-chart">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="aum" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cash vs Investment Analysis */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Cash vs Investment Allocation</CardTitle>
          <CardDescription>Portfolio allocation analysis for top clients</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={cashVsInvestedData} id="cash-vs-invested-chart">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="cash" stackId="stack" fill="#ffc658" name="Cash" />
              <Bar yAxisId="left" dataKey="invested" stackId="stack" fill="#8884d8" name="Invested" />
              <Line yAxisId="right" type="monotone" dataKey="cashPercent" stroke="#ff7300" name="Cash %" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {familyData.length}
            </div>
            <p className="text-sm text-gray-600">Family Groups</p>
            <div className="mt-2">
              <div className="text-sm text-gray-500">
                Avg clients per family: {(rmData.reduce((sum, rm) => sum + rm.clients, 0) / familyData.length || 0).toFixed(1)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">RM Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(rmData.reduce((sum, rm) => sum + rm.aum, 0) / rmData.length || 0)}
            </div>
            <p className="text-sm text-gray-600">Avg AUM per RM</p>
            <div className="mt-2">
              <div className="text-sm text-gray-500">
                Best performer: {rmData.sort((a, b) => b.aum - a.aum)[0]?.name || 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {((rmData.reduce((sum, rm) => sum + rm.netAddition, 0) / rmData.reduce((sum, rm) => sum + rm.aum, 0)) * 100 || 0).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Net Addition Rate</p>
            <div className="mt-2">
              <div className="text-sm text-gray-500">
                Positive flow clients: {topClients.filter(c => c.netAddition > 0).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsTab