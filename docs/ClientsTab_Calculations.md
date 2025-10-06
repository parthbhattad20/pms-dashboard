# ClientsTab Calculations Documentation

**File Location**: `src/components/tabs/ClientsTab.jsx`  
**Primary Role**: Individual client portfolio analysis and detailed client metrics

## Overview

The ClientsTab component focuses on individual client analysis, providing detailed portfolio metrics, cash allocation analysis, and client-specific performance indicators. It displays client data in both tabular and visual formats.

## Core Client Calculations

### 1. Cash Percentage per Client

```javascript
// Calculate individual client cash allocation percentage
const calculateCashPercent = (client) => {
  if (!client || client.aum <= 0) return 0
  return (client.cashAllocation / client.aum) * 100
}
```

**Formula**: `Cash % = (Cash Allocation ÷ Total AUM) × 100`

**Edge Cases**:
- Zero or negative AUM: Returns 0%
- Missing cash allocation: Treated as 0
- Cash > AUM: Returns >100% (indicates data issue)

**Usage**: 
- Portfolio allocation analysis
- Risk assessment
- Investment opportunity identification

### 2. Investment Percentage per Client

```javascript
// Calculate invested amount percentage
const calculateInvestmentPercent = (client) => {
  if (!client || client.aum <= 0) return 0
  return (client.netInvestmentValue / client.aum) * 100
}
```

**Formula**: `Investment % = (Net Investment Value ÷ Total AUM) × 100`

**Purpose**:
- Shows portfolio deployment efficiency
- Identifies underinvested accounts
- Asset allocation analysis

### 3. Net Addition Impact

```javascript
// Calculate net addition as percentage of AUM
const calculateNetAdditionPercent = (client) => {
  if (!client || client.aum <= 0) return 0
  return (client.netAddition / client.aum) * 100
}
```

**Formula**: `Net Addition % = (Net Addition ÷ Total AUM) × 100`

**Interpretation**:
- Positive: Client is adding funds
- Negative: Client is withdrawing funds
- Large positive: Growing relationship
- Large negative: Potential attrition risk

## Client Performance Metrics

### 1. Portfolio Efficiency Score

```javascript
// Calculate portfolio efficiency based on allocation
const calculatePortfolioEfficiency = (client) => {
  const cashPercent = calculateCashPercent(client)
  const investmentPercent = calculateInvestmentPercent(client)
  
  // Ideal allocation: 85-95% invested, 5-15% cash
  let score = 100
  
  if (cashPercent > 30) score -= (cashPercent - 30) * 2 // Penalty for excess cash
  if (cashPercent < 5) score -= (5 - cashPercent) * 1.5 // Penalty for too little cash
  if (investmentPercent < 70) score -= (70 - investmentPercent) * 1.5
  
  return Math.max(0, Math.min(100, score))
}
```

**Scoring Criteria**:
- **Optimal Range**: 5-15% cash, 85-95% invested
- **Penalties**: Applied for deviations from optimal range
- **Scale**: 0-100 points

### 2. Client Risk Category

```javascript
// Categorize client risk based on multiple factors
const getClientRiskCategory = (client) => {
  const cashPercent = calculateCashPercent(client)
  const aumSize = client.aum
  const netAdditionPercent = calculateNetAdditionPercent(client)
  
  let riskScore = 0
  
  // Cash risk
  if (cashPercent > 50) riskScore += 3
  else if (cashPercent > 30) riskScore += 2
  else if (cashPercent < 5) riskScore += 1
  
  // Size risk
  if (aumSize < 100000) riskScore += 2
  else if (aumSize > 10000000) riskScore -= 1
  
  // Flow risk
  if (netAdditionPercent < -20) riskScore += 3
  else if (netAdditionPercent < -10) riskScore += 2
  
  if (riskScore >= 5) return 'High Risk'
  if (riskScore >= 3) return 'Medium Risk'
  return 'Low Risk'
}
```

**Risk Factors**:
- **Cash Allocation**: Extreme cash levels indicate risk
- **Portfolio Size**: Very small portfolios are riskier
- **Cash Flow**: Large outflows indicate potential attrition

### 3. Growth Potential Assessment

```javascript
// Assess client growth potential
const assessGrowthPotential = (client) => {
  const accountAge = calculateAccountAge(client.openingDate)
  const aumSize = client.aum
  const cashPercent = calculateCashPercent(client)
  const netAdditionPercent = calculateNetAdditionPercent(client)
  
  let growthScore = 0
  
  // Age factor
  if (accountAge < 2) growthScore += 2 // New clients have growth potential
  
  // Size factor
  if (aumSize >= 1000000 && aumSize < 10000000) growthScore += 3
  else if (aumSize >= 10000000) growthScore += 1
  
  // Cash factor
  if (cashPercent > 25) growthScore += 2 // Cash to deploy
  
  // Flow factor
  if (netAdditionPercent > 10) growthScore += 3
  else if (netAdditionPercent > 0) growthScore += 1
  
  if (growthScore >= 6) return 'High Potential'
  if (growthScore >= 3) return 'Medium Potential'
  return 'Low Potential'
}
```

## Table Display Calculations

### 1. Sortable Metrics

```javascript
// Prepare sortable client data with calculated fields
const prepareClientTableData = (clients) => {
  return clients.map(client => ({
    ...client,
    cashPercent: calculateCashPercent(client),
    investmentPercent: calculateInvestmentPercent(client),
    netAdditionPercent: calculateNetAdditionPercent(client),
    portfolioEfficiency: calculatePortfolioEfficiency(client),
    riskCategory: getClientRiskCategory(client),
    growthPotential: assessGrowthPotential(client),
    accountAge: calculateAccountAge(client.openingDate)
  }))
}
```

### 2. Filtering Logic

```javascript
// Filter clients based on various criteria
const filterClients = (clients, filters) => {
  return clients.filter(client => {
    // AUM range filter
    if (filters.aumMin && client.aum < filters.aumMin) return false
    if (filters.aumMax && client.aum > filters.aumMax) return false
    
    // Cash percentage filter
    const cashPercent = calculateCashPercent(client)
    if (filters.cashMin && cashPercent < filters.cashMin) return false
    if (filters.cashMax && cashPercent > filters.cashMax) return false
    
    // Risk category filter
    if (filters.riskCategory && getClientRiskCategory(client) !== filters.riskCategory) return false
    
    // RM filter
    if (filters.rm && client.rm !== filters.rm) return false
    
    return true
  })
}
```

### 3. Search Functionality

```javascript
// Search clients by multiple fields
const searchClients = (clients, searchTerm) => {
  if (!searchTerm) return clients
  
  const lowerSearchTerm = searchTerm.toLowerCase()
  
  return clients.filter(client => 
    client.name.toLowerCase().includes(lowerSearchTerm) ||
    client.email.toLowerCase().includes(lowerSearchTerm) ||
    client.rm.toLowerCase().includes(lowerSearchTerm) ||
    client.accountType.toLowerCase().includes(lowerSearchTerm)
  )
}
```

## Aggregation Calculations

### 1. Filtered Data Summary

```javascript
// Calculate summary statistics for filtered data
const calculateFilteredSummary = (filteredClients) => {
  if (filteredClients.length === 0) {
    return {
      totalClients: 0,
      totalAUM: 0,
      avgAUM: 0,
      totalCash: 0,
      avgCashPercent: 0
    }
  }
  
  const totalAUM = filteredClients.reduce((sum, client) => sum + client.aum, 0)
  const totalCash = filteredClients.reduce((sum, client) => sum + client.cashAllocation, 0)
  const avgCashPercent = filteredClients.reduce((sum, client) => sum + calculateCashPercent(client), 0) / filteredClients.length
  
  return {
    totalClients: filteredClients.length,
    totalAUM,
    avgAUM: totalAUM / filteredClients.length,
    totalCash,
    avgCashPercent
  }
}
```

### 2. Risk Distribution Analysis

```javascript
// Analyze risk distribution across filtered clients
const analyzeRiskDistribution = (filteredClients) => {
  const distribution = {
    'High Risk': 0,
    'Medium Risk': 0,
    'Low Risk': 0
  }
  
  filteredClients.forEach(client => {
    const risk = getClientRiskCategory(client)
    distribution[risk]++
  })
  
  const total = filteredClients.length
  
  return {
    counts: distribution,
    percentages: {
      'High Risk': total > 0 ? (distribution['High Risk'] / total) * 100 : 0,
      'Medium Risk': total > 0 ? (distribution['Medium Risk'] / total) * 100 : 0,
      'Low Risk': total > 0 ? (distribution['Low Risk'] / total) * 100 : 0
    }
  }
}
```

## Visual Analytics Support

### 1. Cash Allocation Histogram

```javascript
// Prepare data for cash allocation distribution chart
const prepareCashAllocationHistogram = (clients) => {
  const bins = [
    { range: '0-5%', min: 0, max: 5, count: 0 },
    { range: '5-15%', min: 5, max: 15, count: 0 },
    { range: '15-30%', min: 15, max: 30, count: 0 },
    { range: '30-50%', min: 30, max: 50, count: 0 },
    { range: '50%+', min: 50, max: 100, count: 0 }
  ]
  
  clients.forEach(client => {
    const cashPercent = calculateCashPercent(client)
    const bin = bins.find(b => cashPercent >= b.min && cashPercent < b.max) || bins[bins.length - 1]
    bin.count++
  })
  
  return bins
}
```

### 2. Client Performance Scatter Plot

```javascript
// Prepare data for AUM vs Cash% scatter plot
const preparePerformanceScatterData = (clients) => {
  return clients.map(client => ({
    x: client.aum,
    y: calculateCashPercent(client),
    name: client.name,
    rm: client.rm,
    risk: getClientRiskCategory(client),
    netAddition: client.netAddition
  }))
}
```

## Account Age Calculations

### 1. Age in Years

```javascript
// Calculate account age in years
const calculateAccountAge = (openingDate) => {
  if (!openingDate) return 0
  
  const opening = new Date(openingDate)
  const now = new Date()
  
  if (isNaN(opening.getTime())) return 0
  
  const diffTime = Math.abs(now - opening)
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
  
  return Math.round(diffYears * 10) / 10 // Round to 1 decimal place
}
```

### 2. Client Tenure Categories

```javascript
// Categorize clients by tenure
const getClientTenureCategory = (openingDate) => {
  const age = calculateAccountAge(openingDate)
  
  if (age < 1) return 'New Client (<1 year)'
  if (age < 3) return 'Growing (1-3 years)'
  if (age < 7) return 'Established (3-7 years)'
  return 'Long-term (7+ years)'
}
```

## Performance Optimization

### 1. Memoized Calculations

```javascript
// Use React.useMemo for expensive calculations
const clientMetrics = useMemo(() => {
  return clients.map(client => ({
    id: client.id,
    cashPercent: calculateCashPercent(client),
    portfolioEfficiency: calculatePortfolioEfficiency(client),
    riskCategory: getClientRiskCategory(client),
    growthPotential: assessGrowthPotential(client)
  }))
}, [clients])
```

### 2. Efficient Filtering

```javascript
// Combine multiple filters into single pass
const applyAllFilters = (clients, filters, searchTerm) => {
  return clients.filter(client => {
    // Search filter
    if (searchTerm && !matchesSearchTerm(client, searchTerm)) return false
    
    // All other filters in one pass
    return matchesFilters(client, filters)
  })
}
```

## Data Validation

### 1. Input Validation

```javascript
// Validate client data before calculations
const validateClientData = (client) => {
  const errors = []
  
  if (!client.name) errors.push('Missing client name')
  if (typeof client.aum !== 'number' || client.aum < 0) errors.push('Invalid AUM value')
  if (typeof client.cashAllocation !== 'number' || client.cashAllocation < 0) errors.push('Invalid cash allocation')
  if (client.cashAllocation > client.aum) errors.push('Cash allocation exceeds AUM')
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

### 2. Calculation Bounds

```javascript
// Ensure calculated values are within reasonable bounds
const boundCalculation = (value, min = 0, max = 100) => {
  return Math.max(min, Math.min(max, value))
}
```

## Usage Examples

### Custom Client Scoring

```javascript
// Example: Create custom client priority score
const calculateClientPriorityScore = (client) => {
  let score = 0
  
  // AUM weight (40%)
  score += (client.aum / 10000000) * 40
  
  // Growth potential (30%)
  const growthPotential = assessGrowthPotential(client)
  if (growthPotential === 'High Potential') score += 30
  else if (growthPotential === 'Medium Potential') score += 20
  
  // Relationship strength (20%)
  const netAdditionPercent = calculateNetAdditionPercent(client)
  if (netAdditionPercent > 0) score += 20
  
  // Account age (10%)
  const age = calculateAccountAge(client.openingDate)
  if (age >= 3) score += 10
  
  return Math.min(100, score)
}
```

## Error Handling

### Edge Cases
1. Missing or null client data
2. Invalid date formats
3. Negative AUM values
4. Cash allocation exceeding AUM
5. Division by zero scenarios

### Recovery Strategies
1. Default to safe values (0, empty string)
2. Log warnings for data inconsistencies
3. Graceful degradation for display
4. User feedback for data issues

---

**Last Updated**: October 2025  
**Component Version**: 1.0  
**Dependencies**: NewAppComponent data, React hooks  
**Maintainer**: PMS Dashboard Team