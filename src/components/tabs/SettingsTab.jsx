import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Settings as SettingsIcon, Bell, Shield, Database, Palette, Globe, FileText, TestTube } from 'lucide-react'
import { testBasicPDF, testClientReportWithoutCharts } from '../../services/testPDFService.js'

const SettingsTab = () => {
  const handleTestBasicPDF = async () => {
    try {
      const result = await testBasicPDF()
      if (result) {
        alert('Basic PDF test completed successfully! Check your downloads.')
      } else {
        alert('Basic PDF test failed. Check console for details.')
      }
    } catch (error) {
      console.error('PDF test error:', error)
      alert('PDF test encountered an error. Check console for details.')
    }
  }

  const handleTestClientReport = async () => {
    try {
      const result = await testClientReportWithoutCharts()
      if (result) {
        alert('Client report test completed successfully! Check your downloads.')
      } else {
        alert('Client report test failed. Check console for details.')
      }
    } catch (error) {
      console.error('Client report test error:', error)
      alert('Client report test encountered an error. Check console for details.')
    }
  }
  const settings = [
    {
      category: "Dashboard Preferences",
      icon: Palette,
      items: [
        { id: "theme", label: "Dark Mode", description: "Switch between light and dark themes", type: "toggle" },
        { id: "autoRefresh", label: "Auto Refresh", description: "Automatically refresh dashboard data", type: "toggle" },
        { id: "compactView", label: "Compact View", description: "Use compact layout for tables", type: "toggle" }
      ]
    },
    {
      category: "Notifications",
      icon: Bell,
      items: [
        { id: "emailAlerts", label: "Email Alerts", description: "Receive email notifications for important updates", type: "toggle" },
        { id: "portfolioAlerts", label: "Portfolio Alerts", description: "Alerts for significant portfolio changes", type: "toggle" },
        { id: "clientUpdates", label: "Client Updates", description: "Notifications when client data changes", type: "toggle" }
      ]
    },
    {
      category: "Data & Privacy",
      icon: Shield,
      items: [
        { id: "dataRetention", label: "Data Retention", description: "How long to keep historical data", type: "select" },
        { id: "exportFormat", label: "Export Format", description: "Default format for data exports", type: "select" },
        { id: "shareAnalytics", label: "Share Analytics", description: "Help improve the platform", type: "toggle" }
      ]
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Customize your dashboard experience</p>
      </div>

      {/* Settings Categories */}
      {settings.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <category.icon className="h-5 w-5" />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.label}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <div className="ml-4">
                    {item.type === 'toggle' ? (
                      <Switch defaultChecked={itemIndex % 2 === 0} />
                    ) : (
                      <select className="px-2 py-1 text-sm border border-gray-300 rounded">
                        <option>Default</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* PDF Testing & Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            PDF Report Testing
          </CardTitle>
          <CardDescription>
            Test PDF generation functionality to diagnose issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleTestBasicPDF}
              variant="outline" 
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Test Basic PDF Generation
            </Button>
            <Button 
              onClick={handleTestClientReport}
              variant="outline" 
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Test Client Report (No Charts)
            </Button>
            <div className="text-xs text-gray-500 mt-2">
              <p>• Basic PDF Test: Tests core PDF functionality and table generation</p>
              <p>• Client Report Test: Tests comprehensive client reporting without charts</p>
              <p>• Check your Downloads folder for generated test PDFs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="h-4 w-4 mr-2" />
              Language & Region
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              <Shield className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsTab