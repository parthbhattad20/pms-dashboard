# Portfolio Management System - Calculations Documentation

This document provides comprehensive documentation for all calculations, formulas, and data processing logic used throughout the PMS Dashboard application.

## Table of Contents

1. [Overview](#overview)
2. [Core Data Processing](#core-data-processing)
3. [Component-Specific Calculations](#component-specific-calculations)
4. [PDF Report Calculations](#pdf-report-calculations)
5. [Risk Assessment Formulas](#risk-assessment-formulas)
6. [Performance Metrics](#performance-metrics)
7. [Data Sources](#data-sources)

## Overview

The PMS Dashboard processes Excel data to provide comprehensive portfolio management insights. All calculations are performed client-side using React.js and are designed to handle real-time data updates.

### Key Calculation Categories
- **Portfolio Metrics**: AUM, net additions, cash allocations
- **Performance Analysis**: Returns, growth rates, risk metrics
- **Client Analytics**: Family groupings, RM performance, top performers
- **Risk Assessment**: Portfolio concentration, allocation analysis
- **Reporting**: Professional PDF generation with industry-standard formatting

## Core Data Processing

### Data Source
- **Input Format**: Excel files (.xlsx)
- **Processing Library**: `xlsx` (SheetJS)
- **File Location**: `public/250911BWCClientDashboard.xlsx`

### Primary Data Fields
```javascript
// Core client data structure
{
  name: string,           // Client name
  email: string,          // Contact email
  mobile: string,         // Phone number
  aum: number,           // Assets Under Management
  netInvestmentValue: number,  // Total invested amount
  netAddition: number,    // Net inflows/outflows
  cashAllocation: number, // Cash holdings
  accountType: string,    // Account classification
  rm: string,            // Relationship Manager
  family: string,        // Family group identifier
  openingDate: string    // Account opening date
}
```

## Component-Specific Calculations

### 1. NewAppComponent.jsx (Main Data Processing)

**File Location**: `src/pages/NewAppComponent.jsx`

#### Excel Data Processing
```javascript
// Sheet parsing and data extraction
const workbook = XLSX.read(data, { type: 'array' })
const worksheet = workbook.Sheets[workbook.SheetNames[0]]
const jsonData = XLSX.utils.sheet_to_json(worksheet)

// Data cleaning and normalization
const cleanedData = jsonData.map(row => ({
  name: row['Client Name'] || '',
  email: row['Email'] || '',
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

#### Cash Percentage Calculation
```javascript
// Calculate cash percentage for each client
cashPercent: client.aum > 0 ? (client.cashAllocation / client.aum) * 100 : 0
```

**Documentation**: [NewAppComponent Calculations](./docs/NewAppComponent_Calculations.md)

### 2. OverviewTab.jsx

**File Location**: `src/components/tabs/OverviewTab.jsx`

#### Summary Statistics
- **Total AUM**: Sum of all client AUM values
- **Total Clients**: Count of unique clients
- **Average AUM per Client**: Total AUM / Total Clients
- **Net Addition Summary**: Sum of positive and negative net additions

**Documentation**: [OverviewTab Calculations](./docs/OverviewTab_Calculations.md)

### 3. ClientsTab.jsx

**File Location**: `src/components/tabs/ClientsTab.jsx`

#### Client Performance Metrics
- **Portfolio Value**: Direct AUM value
- **Cash Allocation**: Percentage and absolute values
- **Performance Indicators**: Growth rates and trends

**Documentation**: [ClientsTab Calculations](./docs/ClientsTab_Calculations.md)

### 4. AnalyticsTab.jsx

**File Location**: `src/components/tabs/AnalyticsTab.jsx`

#### Advanced Analytics
- **Family Group Analysis**: Aggregated AUM by family
- **RM Performance**: Client count and AUM per relationship manager
- **Top Performers**: Ranked client analysis

**Documentation**: [AnalyticsTab Calculations](./docs/AnalyticsTab_Calculations.md)

### 5. ClientInsightsModal.jsx

**File Location**: `src/components/ClientInsightsModal.jsx`

#### Risk Assessment Calculations
- **Portfolio Concentration**: Allocation analysis
- **Risk Metrics**: Volatility and exposure calculations
- **Performance Attribution**: Return decomposition

**Documentation**: [ClientInsights Calculations](./docs/ClientInsights_Calculations.md)

## PDF Report Calculations

**File Location**: `src/services/pdfReportService.js`

### Industry-Standard Metrics
- **Performance Attribution**: Multi-factor analysis
- **Risk-Adjusted Returns**: Sharpe ratio, alpha, beta calculations
- **Portfolio Allocation**: Sector and asset class breakdown

**Documentation**: [PDF Report Calculations](./docs/PDFReport_Calculations.md)

## Risk Assessment Formulas

### Portfolio Risk Metrics
```javascript
// Concentration Risk
concentrationRisk = (top5ClientsAUM / totalAUM) * 100

// Cash Allocation Risk
cashRisk = clientCashPercent > 30 ? 'High' : 
           clientCashPercent > 15 ? 'Medium' : 'Low'

// Volatility Assessment
volatility = standardDeviation(monthlyReturns)
```

## Performance Metrics

### Return Calculations
```javascript
// Simple Return
simpleReturn = (endValue - startValue) / startValue * 100

// Annualized Return
annualizedReturn = Math.pow((1 + totalReturn), (365 / days)) - 1

// Risk-Adjusted Return
sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioVolatility
```

## Data Sources

### Excel File Structure
- **Sheet Name**: First sheet in workbook
- **Header Row**: Row 1 contains column names
- **Data Rows**: Starting from row 2
- **Required Columns**: Client Name, AUM, Net Investment Value, etc.

### Data Validation
- Numeric fields are parsed with `parseFloat()`
- Missing values default to 0 or empty string
- Date fields are processed as strings

## Calculation Accuracy

### Precision Standards
- **Currency Values**: Rounded to 2 decimal places
- **Percentages**: Displayed to 1 decimal place
- **Large Numbers**: Formatted with appropriate suffixes (K, M, B)

### Error Handling
- Invalid numeric values default to 0
- Missing data is clearly indicated in UI
- Calculation errors are logged to console

## Performance Considerations

### Optimization Strategies
- Data processing occurs once on file load
- Calculations are memoized where possible
- Large datasets are handled efficiently

### Memory Management
- Excel data is processed and cleaned immediately
- Unnecessary data references are cleared
- Component state is optimized for performance

---

For detailed calculations specific to each component, refer to the individual documentation files in the `docs/` directory.

**Last Updated**: October 2025  
**Version**: 1.0  
**Maintainer**: PMS Dashboard Team