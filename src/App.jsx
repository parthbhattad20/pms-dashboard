import { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, Download, TrendingUp, Users, DollarSign, Briefcase, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [clients, setClients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    // Load Excel data
    fetch('/src/assets/250911BWCClientDashboard.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // Parse data starting from row 4 (index 3) where actual data begins
        const headers = data[3]
        const clientData = data.slice(4).filter(row => row[0]) // Filter out empty rows
        
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

    return {
      totalClients: clients.length,
      totalAUM,
      totalNetAddition,
      totalCash,
      avgAUM
    }
  }, [clients])

  // Chart data
  const accountTypeData = useMemo(() => {
    const types = {}
    clients.forEach(client => {
      const type = client.accountType || 'Unknown'
      types[type] = (types[type] || 0) + 1
    })
    return Object.entries(types).map(([name, value]) => ({ name, value }))
  }, [clients])

  const rmData = useMemo(() => {
    const rms = {}
    clients.forEach(client => {
      const rm = client.rm || 'Unassigned'
      rms[rm] = (rms[rm] || 0) + client.aum
    })
    return Object.entries(rms).map(([name, aum]) => ({ name, aum }))
  }, [clients])

  const topClients = useMemo(() => {
    return [...clients]
      .sort((a, b) => b.aum - a.aum)
      .slice(0, 10)
      .map(client => ({ name: client.name, aum: client.aum }))
  }, [clients])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BWC Client Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Comprehensive client portfolio management</p>
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
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedClient(null)}
          >
            <Card 
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{selectedClient.name}</CardTitle>
                <CardDescription>{selectedClient.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                    <Badge className="mt-1">{selectedClient.accountType}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Activation Date</p>
                    <p className="mt-1">{selectedClient.activationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                    <p className="mt-1">{selectedClient.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                    <p className="mt-1">{selectedClient.country || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                    <p className="mt-1">{selectedClient.occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Relationship Manager</p>
                    <p className="mt-1">{selectedClient.rm}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Family</p>
                    <p className="mt-1">{selectedClient.family || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SIP</p>
                    <p className="mt-1">{selectedClient.sip || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Financial Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">AUM</p>
                      <p className="text-xl font-bold mt-1">{formatCurrency(selectedClient.aum)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Net Addition/Withdrawal</p>
                      <p className={`text-xl font-bold mt-1 ${selectedClient.netAddition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedClient.netAddition)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cash Allocation</p>
                      <p className="text-xl font-bold mt-1">{formatCurrency(selectedClient.cashAllocation)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cash %</p>
                      <p className="text-xl font-bold mt-1">{selectedClient.cashPercent.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedClient.notes}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedClient(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 BWC Client Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
