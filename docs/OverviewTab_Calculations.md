# OverviewTab Calculations Documentation

**File Location**: `src/components/tabs/OverviewTab.jsx`  
**Primary Role**: Dashboard summary statistics and key performance indicators

## Overview

The OverviewTab component provides high-level portfolio metrics and summary statistics. It displays aggregated data from all clients, showing total AUM, client counts, growth trends, and key performance indicators.

## Key Performance Indicators (KPIs)

### 1. Total Assets Under Management (AUM)

```javascript
// Aggregate all client AUM values
const totalAUM = clientData.reduce((sum, client) => sum + (client.aum || 0), 0)
```

**Formula**: `Total AUM = Σ(client.aum)`

**Purpose**: 
- Primary metric for portfolio size
- Business performance indicator
- Growth tracking baseline

**Display Format**: Currency with appropriate scaling (K, M, B)

### 2. Total Client Count

```javascript
// Count of all active clients
const totalClients = clientData.length
```

**Formula**: `Client Count = Array.length`

**Purpose**:
- Business scale indicator
- Resource allocation planning
- Growth tracking metric

### 3. Average AUM per Client

```javascript
// Calculate mean AUM across all clients
const avgAUM = totalClients > 0 ? totalAUM / totalClients : 0
```

**Formula**: `Average AUM = Total AUM ÷ Total Clients`

**Edge Cases**:
- Zero clients: Returns 0
- Handles division by zero gracefully

**Purpose**:
- Client quality metric
- Portfolio concentration analysis
- Benchmarking tool

### 4. Net Addition Summary

```javascript
// Aggregate net inflows and outflows
const totalNetAddition = clientData.reduce((sum, client) => sum + (client.netAddition || 0), 0)

// Separate positive and negative flows
const positiveFlows = clientData
  .filter(client => client.netAddition > 0)
  .reduce((sum, client) => sum + client.netAddition, 0)

const negativeFlows = clientData
  .filter(client => client.netAddition < 0)
  .reduce((sum, client) => sum + Math.abs(client.netAddition), 0)
```

**Formulas**:
- `Total Net Addition = Σ(client.netAddition)`
- `Positive Flows = Σ(client.netAddition where netAddition > 0)`
- `Negative Flows = Σ(|client.netAddition| where netAddition < 0)`

**Purpose**:
- Cash flow analysis
- Business growth indicator
- Client satisfaction metric

## Performance Metrics

### 1. Growth Rate Calculation

```javascript
// Calculate period-over-period growth
const calculateGrowthRate = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}
```

**Formula**: `Growth Rate = ((Current - Previous) ÷ Previous) × 100`

**Edge Cases**:
- Previous value is zero: Returns 100% if current > 0, else 0%
- Negative growth: Properly handled with negative percentages

### 2. Client Acquisition Rate

```javascript
// Calculate new client acquisition
const newClientsThisMonth = clientData.filter(client => {
  const openingDate = new Date(client.openingDate)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return openingDate.getMonth() === currentMonth && 
         openingDate.getFullYear() === currentYear
}).length

const acquisitionRate = (newClientsThisMonth / totalClients) * 100
```

**Formula**: `Acquisition Rate = (New Clients ÷ Total Clients) × 100`

## Statistical Analysis

### 1. Portfolio Distribution

```javascript
// Calculate portfolio size distribution
const portfolioDistribution = {
  large: clientData.filter(client => client.aum >= 10000000).length,
  medium: clientData.filter(client => client.aum >= 1000000 && client.aum < 10000000).length,
  small: clientData.filter(client => client.aum < 1000000).length
}

const distributionPercentages = {
  large: (portfolioDistribution.large / totalClients) * 100,
  medium: (portfolioDistribution.medium / totalClients) * 100,
  small: (portfolioDistribution.small / totalClients) * 100
}
```

**Size Categories**:
- **Large**: AUM ≥ $10M
- **Medium**: $1M ≤ AUM < $10M
- **Small**: AUM < $1M

### 2. Cash Allocation Analysis

```javascript
// Aggregate cash holdings across all clients
const totalCashAllocation = clientData.reduce((sum, client) => sum + (client.cashAllocation || 0), 0)

// Calculate overall cash percentage
const overallCashPercent = totalAUM > 0 ? (totalCashAllocation / totalAUM) * 100 : 0

// Cash allocation distribution
const cashDistribution = {
  high: clientData.filter(client => {
    const cashPercent = client.aum > 0 ? (client.cashAllocation / client.aum) * 100 : 0
    return cashPercent > 30
  }).length,
  medium: clientData.filter(client => {
    const cashPercent = client.aum > 0 ? (client.cashAllocation / client.aum) * 100 : 0
    return cashPercent >= 15 && cashPercent <= 30
  }).length,
  low: clientData.filter(client => {
    const cashPercent = client.aum > 0 ? (client.cashAllocation / client.aum) * 100 : 0
    return cashPercent < 15
  }).length
}
```

**Cash Categories**:
- **High Cash**: >30% in cash
- **Medium Cash**: 15-30% in cash
- **Low Cash**: <15% in cash

## Risk Metrics

### 1. Concentration Risk

```javascript
// Calculate portfolio concentration using Herfindahl Index
const calculateConcentrationRisk = (clientData) => {
  if (clientData.length === 0) return 0
  
  const totalAUM = clientData.reduce((sum, client) => sum + client.aum, 0)
  
  if (totalAUM === 0) return 0
  
  const herfindahlIndex = clientData.reduce((sum, client) => {
    const marketShare = client.aum / totalAUM
    return sum + (marketShare * marketShare)
  }, 0)
  
  return herfindahlIndex * 10000 // Convert to basis points
}
```

**Formula**: `HHI = Σ((client.aum ÷ totalAUM)²) × 10,000`

**Risk Levels**:
- **Low Risk**: HHI < 1500
- **Medium Risk**: 1500 ≤ HHI < 2500
- **High Risk**: HHI ≥ 2500

### 2. Top Client Dependency

```javascript
// Calculate dependency on top clients
const top5ClientsAUM = clientData
  .sort((a, b) => b.aum - a.aum)
  .slice(0, 5)
  .reduce((sum, client) => sum + client.aum, 0)

const top5Concentration = totalAUM > 0 ? (top5ClientsAUM / totalAUM) * 100 : 0
```

**Formula**: `Top 5 Concentration = (Top 5 AUM ÷ Total AUM) × 100`

## Trend Analysis

### 1. Month-over-Month Growth

```javascript
// Calculate monthly growth trends
const calculateMonthlyTrends = (clientData) => {
  const monthlyData = {}
  
  clientData.forEach(client => {
    const month = new Date(client.openingDate).toISOString().slice(0, 7) // YYYY-MM format
    
    if (!monthlyData[month]) {
      monthlyData[month] = { aum: 0, clients: 0, netAddition: 0 }
    }
    
    monthlyData[month].aum += client.aum
    monthlyData[month].clients += 1
    monthlyData[month].netAddition += client.netAddition
  })
  
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }))
}
```

### 2. Performance Attribution

```javascript
// Attribute performance to different factors
const performanceAttribution = {
  newClients: newClientsThisMonth * avgAUM,
  organicGrowth: totalNetAddition,
  marketGrowth: 0 // Would require market data
}

const totalGrowth = Object.values(performanceAttribution).reduce((sum, value) => sum + value, 0)
```

## Data Visualization Support

### 1. Chart Data Preparation

```javascript
// Prepare data for various chart components
const chartData = {
  aumTrend: monthlyTrends.map(item => ({
    month: item.month,
    aum: item.aum,
    clients: item.clients
  })),
  
  cashAllocation: [
    { name: 'Cash', value: totalCashAllocation },
    { name: 'Invested', value: totalAUM - totalCashAllocation }
  ],
  
  clientDistribution: [
    { name: 'Large (>$10M)', value: portfolioDistribution.large },
    { name: 'Medium ($1M-$10M)', value: portfolioDistribution.medium },
    { name: 'Small (<$1M)', value: portfolioDistribution.small }
  ]
}
```

## Error Handling and Validation

### 1. Data Validation

```javascript
// Validate and clean data before calculations
const validateClientData = (clientData) => {
  return clientData.filter(client => {
    return client && 
           typeof client.aum === 'number' && 
           !isNaN(client.aum) && 
           client.aum >= 0
  })
}
```

### 2. Calculation Safety

```javascript
// Safe division with zero handling
const safeDivide = (numerator, denominator) => {
  return denominator === 0 ? 0 : numerator / denominator
}

// Safe percentage calculation
const safePercentage = (part, total) => {
  return total === 0 ? 0 : (part / total) * 100
}
```

## Performance Considerations

### 1. Calculation Optimization

```javascript
// Use single-pass calculations where possible
const aggregatedStats = clientData.reduce((acc, client) => {
  acc.totalAUM += client.aum || 0
  acc.totalCash += client.cashAllocation || 0
  acc.totalNetAddition += client.netAddition || 0
  acc.clientCount += 1
  
  if (client.aum >= 10000000) acc.largeClients += 1
  else if (client.aum >= 1000000) acc.mediumClients += 1
  else acc.smallClients += 1
  
  return acc
}, {
  totalAUM: 0,
  totalCash: 0,
  totalNetAddition: 0,
  clientCount: 0,
  largeClients: 0,
  mediumClients: 0,
  smallClients: 0
})
```

## Usage Examples

### Custom Metric Addition

```javascript
// Example: Add client retention rate calculation
const calculateRetentionRate = (clientData) => {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  
  const oldClients = clientData.filter(client => 
    new Date(client.openingDate) <= oneYearAgo
  )
  
  const retainedClients = oldClients.filter(client => 
    client.netAddition >= 0 // Assuming positive flow indicates retention
  )
  
  return oldClients.length > 0 ? (retainedClients.length / oldClients.length) * 100 : 0
}
```

## Testing Scenarios

### Edge Cases
1. Empty client data array
2. All zero AUM values
3. All negative net additions
4. Single client portfolio
5. Identical AUM values across clients

### Performance Tests
1. Large dataset (10,000+ clients)
2. Real-time data updates
3. Concurrent calculations
4. Memory usage optimization

---

**Last Updated**: October 2025  
**Component Version**: 1.0  
**Dependencies**: NewAppComponent data processing  
**Maintainer**: PMS Dashboard Team