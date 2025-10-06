import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Settings as SettingsIcon, Bell, Shield, Database, Palette, Globe } from 'lucide-react'

const SettingsTab = () => {
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