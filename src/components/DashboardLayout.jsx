import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../Context/AuthContext"
import {
  BarChart3,
  Users,
  DollarSign,
  PieChart,
  Settings,
  LogOut,
  Home,
  UserCheck,
  TrendingUp,
  FileText,
  Activity,
  Calendar,
  Bell,
  HelpCircle
} from "lucide-react"

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth()

  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Home, 
      available: true 
    },
    { 
      id: 'clients', 
      label: 'Client Portfolio', 
      icon: Users, 
      available: true 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      available: true 
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: TrendingUp, 
      available: true 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText, 
      available: true 
    },
    { 
      id: 'risk', 
      label: 'Risk Analysis', 
      icon: Activity, 
      available: true 
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar, 
      available: true 
    }
  ]

  const handleItemClick = (id) => {
    onTabChange(id)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">PMS Dashboard</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => handleItemClick(item.id)}
                        isActive={activeTab === item.id}
                        className={`w-full justify-start ${
                          activeTab === item.id 
                            ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onTabChange('settings')}
                      isActive={activeTab === 'settings'}
                      className={`w-full justify-start ${
                        activeTab === 'settings' 
                          ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onTabChange('notifications')}
                      isActive={activeTab === 'notifications'}
                      className={`w-full justify-start ${
                        activeTab === 'notifications' 
                          ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onTabChange('help')}
                      isActive={activeTab === 'help'}
                      className={`w-full justify-start ${
                        activeTab === 'help' 
                          ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="space-y-3">
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <Button 
                onClick={logout} 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout