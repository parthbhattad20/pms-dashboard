# NewAppComponent Calculations Documentation

**File Location**: `src/pages/NewAppComponent.jsx`  
**Primary Role**: Main data processing hub, Excel parsing, and state management

## Overview

The NewAppComponent serves as the central data processing engine for the PMS Dashboard. It handles Excel file parsing, data transformation, client analytics, and state management for all dashboard components.

## Data Processing Pipeline

### 1. Excel File Loading and Parsing

```javascript
// File reading and workbook creation
const handleFileLoad = (data) => {
  const workbook = XLSX.read(data, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const jsonData = XLSX.utils.sheet_to_json(worksheet)
}
```

**Process Flow**:
1. Read binary Excel data
2. Parse workbook structure
3. Extract first worksheet
4. Convert to JSON format

### 2. Data Cleaning and Normalization

```javascript
// Data transformation and validation
const cleanedData = jsonData.map(row => ({
  name: row['Client Name'] || '',
  email: (row['Email'] || '').trim(),
  mobile: row['Mobile'] || '',
  aum: parseFloat(row['AUM']) || 0,
  netInvestmentValue: parseFloat(row['Net Investment Value']) || 0,
  netAddition: parseFloat(row['Net Addition']) || 0,
  cashAllocation: parseFloat(row['Cash Allocation']) || 0,
  accountType: row['Account Type'] || '',
  rm: row['RM'] || '',
  family: row['Family'] || '',
  openingDate: row['Opening Date'] || ''
}))
```

**Data Validation Rules**:
- **String Fields**: Trimmed and defaulted to empty string if null
- **Numeric Fields**: Parsed with `parseFloat()`, defaulted to 0 if invalid
- **Required Fields**: Client Name, AUM are essential for calculations

## Core Calculations

### 1. Cash Percentage Calculation

```javascript
// Calculate cash percentage for portfolio allocation
const calculateCashPercent = (client) => {
  if (client.aum <= 0) return 0
  return (client.cashAllocation / client.aum) * 100
}
```

**Formula**: `Cash % = (Cash Allocation / Total AUM) × 100`

**Edge Cases**:
- Zero AUM: Returns 0%
- Negative AUM: Returns 0% (defensive programming)
- Missing cash allocation: Treated as 0

### 2. Summary Statistics Calculations

```javascript
// Total AUM across all clients
const totalAUM = clientData.reduce((sum, client) => sum + client.aum, 0)

// Total client count
const totalClients = clientData.length

// Average AUM per client
const avgAUM = totalClients > 0 ? totalAUM / totalClients : 0

// Total net additions (inflows/outflows)
const totalNetAddition = clientData.reduce((sum, client) => sum + client.netAddition, 0)
```

**Summary Metrics**:
- **Total AUM**: Σ(client.aum)
- **Client Count**: Array length
- **Average AUM**: Total AUM ÷ Client Count
- **Net Flow**: Σ(client.netAddition)

### 3. Family Group Analysis

```javascript
// Group clients by family and calculate aggregated metrics
const familyAnalysis = useMemo(() => {
  const familyGroups = {}
  
  clientData.forEach(client => {
    const familyName = client.family || 'Individual'
    
    if (!familyGroups[familyName]) {
      familyGroups[familyName] = {
        name: familyName,
        aum: 0,
        members: 0,
        clients: []
      }
    }
    
    familyGroups[familyName].aum += client.aum
    familyGroups[familyName].members += 1
    familyGroups[familyName].clients.push(client.name)
  })
  
  return Object.values(familyGroups).sort((a, b) => b.aum - a.aum)
}, [clientData])
```

**Family Metrics**:
- **Family AUM**: Sum of all family member AUMs
- **Member Count**: Number of clients in family
- **Average per Member**: Family AUM ÷ Member Count

### 4. Relationship Manager Performance

```javascript
// Calculate RM performance metrics
const rmAnalysis = useMemo(() => {
  const rmGroups = {}
  
  clientData.forEach(client => {
    const rmName = client.rm || 'Unassigned'
    
    if (!rmGroups[rmName]) {
      rmGroups[rmName] = {
        name: rmName,
        aum: 0,
        clients: 0,
        netAddition: 0
      }
    }
    
    rmGroups[rmName].aum += client.aum
    rmGroups[rmName].clients += 1
    rmGroups[rmName].netAddition += client.netAddition
  })
  
  return Object.values(rmGroups).sort((a, b) => b.aum - a.aum)
}, [clientData])
```

**RM Metrics**:
- **Total AUM Managed**: Sum of all client AUMs
- **Client Count**: Number of clients assigned
- **Net Addition**: Total inflows/outflows
- **AUM per Client**: Total AUM ÷ Client Count

### 5. Top Performers Analysis

```javascript
// Identify and rank top performing clients
const topClients = useMemo(() => {
  return clientData
    .map(client => ({
      ...client,
      cashPercent: client.aum > 0 ? (client.cashAllocation / client.aum) * 100 : 0
    }))
    .sort((a, b) => b.aum - a.aum)
    .slice(0, 20)
}, [clientData])
```

**Ranking Criteria**:
- **Primary**: Total AUM (descending)
- **Secondary**: Net Addition (for tie-breaking)
- **Limit**: Top 20 clients displayed

### 6. Cash vs Investment Analysis

```javascript
// Portfolio allocation analysis
const cashVsInvestedData = useMemo(() => {
  if (!clientData.length) return []
  
  const totalCash = clientData.reduce((sum, client) => sum + client.cashAllocation, 0)
  const totalInvested = clientData.reduce((sum, client) => sum + client.netInvestmentValue, 0)
  
  return [
    { name: 'Cash', value: totalCash },
    { name: 'Invested', value: totalInvested }
  ]
}, [clientData])
```

**Allocation Metrics**:
- **Total Cash**: Σ(client.cashAllocation)
- **Total Invested**: Σ(client.netInvestmentValue)
- **Cash Ratio**: Total Cash ÷ (Total Cash + Total Invested)

## Performance Optimizations

### 1. Memoization Strategy

```javascript
// Use React.useMemo for expensive calculations
const expensiveCalculation = useMemo(() => {
  // Complex data processing
  return processedData
}, [dependencyArray])
```

**Memoized Calculations**:
- Family group analysis
- RM performance metrics
- Top clients ranking
- Cash vs investment data

### 2. Data Processing Efficiency

```javascript
// Single-pass aggregation for multiple metrics
const aggregatedMetrics = clientData.reduce((acc, client) => {
  acc.totalAUM += client.aum
  acc.totalCash += client.cashAllocation
  acc.totalInvested += client.netInvestmentValue
  acc.totalNetAddition += client.netAddition
  return acc
}, { totalAUM: 0, totalCash: 0, totalInvested: 0, totalNetAddition: 0 })
```

## Error Handling

### 1. Data Validation

```javascript
// Robust numeric parsing
const safeParseFloat = (value) => {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}
```

### 2. Null/Undefined Handling

```javascript
// Safe property access
const safeName = client?.name || 'Unknown Client'
const safeAUM = client?.aum || 0
```

## Calculation Accuracy

### Precision Standards
- **Currency**: Rounded to 2 decimal places for display
- **Percentages**: Calculated to full precision, displayed to 1 decimal
- **Large Numbers**: Formatted with K/M/B suffixes

### Data Integrity
- All calculations preserve original data
- No mutations to source data
- Defensive programming for edge cases

## Usage Examples

### Adding New Calculations

```javascript
// Example: Calculate client acquisition rate
const acquisitionAnalysis = useMemo(() => {
  const currentYear = new Date().getFullYear()
  const newClients = clientData.filter(client => {
    const openingYear = new Date(client.openingDate).getFullYear()
    return openingYear === currentYear
  })
  
  return {
    newClientsCount: newClients.length,
    newClientAUM: newClients.reduce((sum, client) => sum + client.aum, 0),
    acquisitionRate: (newClients.length / clientData.length) * 100
  }
}, [clientData])
```

## Dependencies

- **xlsx**: Excel file parsing
- **React**: State management and memoization
- **Lodash** (optional): Data manipulation utilities

## Testing Considerations

### Test Cases
1. Empty dataset handling
2. Invalid numeric values
3. Missing required fields
4. Large dataset performance
5. Edge case calculations (zero/negative values)

---

**Last Updated**: October 2025  
**Component Version**: 1.0  
**Maintainer**: PMS Dashboard Team