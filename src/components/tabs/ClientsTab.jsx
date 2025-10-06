import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, Download, Filter, Eye } from 'lucide-react'

const ClientsTab = ({ 
  filteredClients, 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType, 
  setSelectedClient, 
  formatCurrency,
  downloadReport 
}) => {
  const accountTypes = ['all', 'NRI', 'Resident', 'Corporate']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Portfolio</h1>
          <p className="text-gray-600 mt-1">Manage and view all client accounts</p>
        </div>
        <Button onClick={downloadReport} className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients by name, email, RM, or family..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
              >
                {accountTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Account Types' : type}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{filteredClients.length}</div>
            <p className="text-sm text-gray-600">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {filteredClients.filter(c => c.accountType === 'NRI').length}
            </div>
            <p className="text-sm text-gray-600">NRI Accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {formatCurrency(filteredClients.reduce((sum, c) => sum + c.aum, 0))}
            </div>
            <p className="text-sm text-gray-600">Total AUM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {filteredClients.filter(c => c.netAddition > 0).length}
            </div>
            <p className="text-sm text-gray-600">Positive Flow</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Client Portfolio</CardTitle>
          <CardDescription>
            Complete list of all clients and their details
          </CardDescription>
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
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {client.email?.trim()}
                    </TableCell>
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
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {client.notes}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedClient(client)
                        }}
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
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
    </div>
  )
}

export default ClientsTab