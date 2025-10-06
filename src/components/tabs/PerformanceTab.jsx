import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const PerformanceTab = ({ stats, formatCurrency }) => {
  const performanceMetrics = [
    {
      title: "Portfolio Performance",
      value: "+12.5%",
      change: "+2.3%",
      trend: "up",
      description: "YTD Returns"
    },
    {
      title: "Risk Score",
      value: "7.2/10",
      change: "-0.5",
      trend: "down",
      description: "Risk Assessment"
    },
    {
      title: "Sharpe Ratio",
      value: "1.45",
      change: "+0.12",
      trend: "up",
      description: "Risk-adjusted returns"
    },
    {
      title: "Max Drawdown",
      value: "-8.3%",
      change: "+1.2%",
      trend: "up",
      description: "Peak to trough"
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Track portfolio performance and risk metrics</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <Activity className="h-3 w-3 text-blue-500" />
                )}
                {metric.change} {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Portfolio risk analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Market Risk</span>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Low
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Credit Risk</span>
                <Badge variant="outline" className="gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  Medium
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Liquidity Risk</span>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Low
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Health</CardTitle>
            <CardDescription>Overall portfolio status and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Diversification</p>
                  <p className="text-xs text-gray-600">Portfolio is well diversified across asset classes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Cash Allocation</p>
                  <p className="text-xs text-gray-600">Higher than optimal cash allocation detected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Performance</p>
                  <p className="text-xs text-gray-600">Outperforming benchmark by 3.2%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
          <CardDescription>Detailed analysis of portfolio components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalAUM)}</div>
              <p className="text-sm text-gray-600">Total AUM</p>
              <p className="text-xs text-green-600 mt-1">+8.5% from last quarter</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalNetAddition)}</div>
              <p className="text-sm text-gray-600">Net Additions</p>
              <p className="text-xs text-blue-600 mt-1">Consistent inflow</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.avgCashPercent.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Avg Cash %</p>
              <p className="text-xs text-gray-600 mt-1">Above optimal range</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PerformanceTab