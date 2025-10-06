import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

class PDFReportService {
  constructor() {
    this.doc = null
    this.pageHeight = 297 // A4 height in mm
    this.pageWidth = 210 // A4 width in mm
    this.margin = 20
    this.currentY = this.margin
    this.colors = {
      primary: [59, 130, 246],
      secondary: [16, 185, 129],
      accent: [251, 191, 36],
      text: [55, 65, 81],
      lightGray: [249, 250, 251]
    }
  }

  initDocument() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.currentY = this.margin
    this.addHeader()
  }

  addHeader() {
    // Company header with logo space
    this.doc.setFillColor(...this.colors.primary)
    this.doc.rect(0, 0, this.pageWidth, 25, 'F')
    
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Portfolio Management System', this.margin, 15)
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Professional Portfolio Analysis & Reporting', this.margin, 20)
    
    this.currentY = 35
    this.doc.setTextColor(...this.colors.text)
  }

  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      
      // Footer line
      this.doc.setDrawColor(...this.colors.primary)
      this.doc.setLineWidth(0.5)
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15)
      
      // Footer text
      this.doc.setFontSize(8)
      this.doc.setTextColor(128, 128, 128)
      this.doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, this.margin, this.pageHeight - 8)
      
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin - 20, this.pageHeight - 8)
      
      // Confidential notice
      this.doc.text('CONFIDENTIAL - For Internal Use Only', this.pageWidth / 2 - 30, this.pageHeight - 8)
    }
  }

  addPage() {
    this.doc.addPage()
    this.currentY = this.margin
    this.addHeader()
  }

  checkPageBreak(height) {
    if (this.currentY + height > this.pageHeight - 30) {
      this.addPage()
      return true
    }
    return false
  }

  addTitle(title, fontSize = 20, color = null) {
    this.checkPageBreak(25)
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', 'bold')
    if (color) this.doc.setTextColor(...color)
    else this.doc.setTextColor(...this.colors.text)
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += fontSize * 0.6
  }

  addSubtitle(subtitle, fontSize = 14, color = null) {
    this.checkPageBreak(20)
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', 'bold')
    if (color) this.doc.setTextColor(...color)
    else this.doc.setTextColor(...this.colors.primary)
    this.doc.text(subtitle, this.margin, this.currentY)
    this.currentY += fontSize * 0.6
  }

  addText(text, fontSize = 10, style = 'normal') {
    this.checkPageBreak(15)
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', style)
    this.doc.setTextColor(...this.colors.text)
    
    // Handle multi-line text
    const lines = this.doc.splitTextToSize(text, this.pageWidth - (this.margin * 2))
    lines.forEach(line => {
      this.checkPageBreak(fontSize * 0.5)
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += fontSize * 0.5
    })
  }

  addSpacer(height = 10) {
    this.currentY += height
  }

  addSectionDivider() {
    this.addSpacer(5)
    this.doc.setDrawColor(...this.colors.primary)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.addSpacer(10)
  }

  addKeyValuePair(key, value, keyWidth = 60) {
    this.checkPageBreak(15)
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.colors.text)
    this.doc.text(`${key}:`, this.margin, this.currentY)
    
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(value, this.margin + keyWidth, this.currentY)
    this.currentY += 6
  }

  addHighlightBox(title, value, subtitle = '', color = null) {
    const boxColor = color || this.colors.primary
    this.checkPageBreak(35)
    
    // Box background
    this.doc.setFillColor(...boxColor)
    this.doc.setDrawColor(...boxColor)
    this.doc.roundedRect(this.margin, this.currentY, 80, 25, 3, 3, 'FD')
    
    // Title
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(title, this.margin + 3, this.currentY + 6)
    
    // Value
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(value, this.margin + 3, this.currentY + 15)
    
    // Subtitle
    if (subtitle) {
      this.doc.setFontSize(7)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(subtitle, this.margin + 3, this.currentY + 22)
    }
    
    this.currentY += 30
  }

  async addChart(chartElementId, title, height = 60) {
    try {
      const chartElement = document.getElementById(chartElementId)
      if (!chartElement) {
        console.warn(`Chart element with ID ${chartElementId} not found`)
        return
      }

      this.checkPageBreak(height + 20)
      
      if (title) {
        this.addSubtitle(title)
        this.addSpacer(5)
      }

      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 15000
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      const imgWidth = this.pageWidth - (this.margin * 2)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      this.checkPageBreak(imgHeight)
      
      // Add border around chart
      this.doc.setDrawColor(200, 200, 200)
      this.doc.setLineWidth(0.2)
      this.doc.rect(this.margin, this.currentY, imgWidth, imgHeight)
      
      this.doc.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight)
      this.currentY += imgHeight + 10
    } catch (error) {
      console.error('Error adding chart to PDF:', error)
      this.addText(`Chart: ${title} (Error loading chart)`, 10, 'italic')
    }
  }

  addTable(headers, data, title, options = {}) {
    this.checkPageBreak(50)
    
    if (title) {
      this.addSubtitle(title)
      this.addSpacer(5)
    }

    const defaultOptions = {
      head: [headers],
      body: data,
      startY: this.currentY,
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        halign: 'left',
        textColor: this.colors.text
      },
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: this.colors.lightGray
      },
      columnStyles: {
        0: { cellWidth: 'auto' }
      },
      didDrawPage: (data) => {
        // Add table borders
        this.doc.setDrawColor(...this.colors.primary)
        this.doc.setLineWidth(0.1)
      }
    }

    this.doc.autoTable({...defaultOptions, ...options})
    this.currentY = this.doc.lastAutoTable.finalY + 10
  }

  formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) return '₹0'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  formatPercentage(value, decimals = 1) {
    if (typeof value !== 'number' || isNaN(value)) return '0%'
    return `${value.toFixed(decimals)}%`
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Generate comprehensive portfolio report with charts
  async generatePortfolioReport(clients, stats, chartData) {
    this.initDocument()

    // Executive Summary Page
    this.addTitle('PORTFOLIO MANAGEMENT REPORT', 24, this.colors.primary)
    this.addSpacer(10)
    
    // Report metadata
    this.addKeyValuePair('Report Date', new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
    this.addKeyValuePair('Report Type', 'Comprehensive Portfolio Analysis')
    this.addKeyValuePair('Reporting Period', 'As of Current Date')
    this.addSpacer(15)

    // Executive Summary Section
    this.addSubtitle('EXECUTIVE SUMMARY')
    this.addSectionDivider()

    // Key metrics in highlight boxes
    const boxY = this.currentY
    this.addHighlightBox('TOTAL CLIENTS', stats.totalClients.toString(), 'Active Portfolios', this.colors.primary)
    
    this.currentY = boxY
    this.currentY += 110 // Move to second column
    this.addHighlightBox('TOTAL AUM', this.formatCurrency(stats.totalAUM), 'Assets Under Management', this.colors.secondary)
    
    this.currentY = boxY + 35
    this.addHighlightBox('NET ADDITION', this.formatCurrency(stats.totalNetAddition), 
      stats.totalNetAddition >= 0 ? 'Positive Flow' : 'Negative Flow', 
      stats.totalNetAddition >= 0 ? this.colors.secondary : [239, 68, 68])
    
    this.currentY = boxY + 35 + 110
    this.addHighlightBox('CASH ALLOCATION', this.formatCurrency(stats.totalCash), 
      `${this.formatPercentage(stats.avgCashPercent)} Avg`, this.colors.accent)

    this.addSpacer(20)

    // Portfolio composition insights
    this.addText(`This report provides a comprehensive analysis of ${stats.totalClients} client portfolios with a combined ` +
      `AUM of ${this.formatCurrency(stats.totalAUM)}. The portfolio demonstrates ${stats.totalNetAddition >= 0 ? 'positive' : 'negative'} ` +
      `net flows of ${this.formatCurrency(Math.abs(stats.totalNetAddition))}, indicating ` +
      `${stats.totalNetAddition >= 0 ? 'growing client confidence and capital inflows' : 'capital outflows requiring attention'}.`)

    this.addSpacer(10)
    this.addText(`Cash allocation across portfolios averages ${this.formatPercentage(stats.avgCashPercent)}, ` +
      `${stats.avgCashPercent > 25 ? 'which may indicate conservative positioning or pending investment opportunities' : 
        stats.avgCashPercent < 10 ? 'showing aggressive investment positioning' : 'representing balanced liquidity management'}.`)

    // New page for charts
    this.addPage()
    this.addTitle('PORTFOLIO ANALYSIS & CHARTS', 18)
    this.addSectionDivider()

    // Account Type Distribution Chart
    if (chartData.accountTypeData && chartData.accountTypeData.length > 0) {
      await this.addChart('account-type-chart', 'Client Distribution by Account Type', 70)
      
      // Account type analysis table
      const accountHeaders = ['Account Type', 'Client Count', 'Percentage', 'Market Share']
      const totalClients = chartData.accountTypeData.reduce((sum, item) => sum + item.value, 0)
      const accountData = chartData.accountTypeData.map(item => [
        item.name,
        item.value.toString(),
        this.formatPercentage((item.value / totalClients) * 100),
        item.value > totalClients * 0.4 ? 'Dominant' : item.value > totalClients * 0.2 ? 'Significant' : 'Moderate'
      ])
      
      this.addTable(accountHeaders, accountData, 'Account Type Analysis', {
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' }
        }
      })
    }

    // RM Performance Chart
    if (chartData.rmData && chartData.rmData.length > 0) {
      await this.addChart('rm-performance-chart', 'Assets Under Management by Relationship Manager', 70)
      
      const rmHeaders = ['Relationship Manager', 'Total AUM', 'Client Count', 'Avg AUM per Client', 'Performance Rating']
      const rmData = chartData.rmData.map(rm => {
        const avgAum = rm.clients ? rm.aum / rm.clients : 0
        const rating = avgAum > 10000000 ? 'Excellent' : avgAum > 5000000 ? 'Good' : 'Developing'
        return [
          rm.name,
          this.formatCurrency(rm.aum),
          rm.clients?.toString() || 'N/A',
          this.formatCurrency(avgAum),
          rating
        ]
      })
      
      this.addTable(rmHeaders, rmData, 'Relationship Manager Performance Analysis', {
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'center' }
        }
      })
    }

    // Client Portfolio Details
    this.addPage()
    this.addTitle('CLIENT PORTFOLIO OVERVIEW', 18)
    this.addSectionDivider()

    // Enhanced client table with risk assessment
    const clientHeaders = ['Client Name', 'Account Type', 'AUM', 'Net Addition', 'Cash %', 'Risk Level', 'RM']
    const clientData = clients.slice(0, 20).map(client => {
      const riskLevel = client.cashPercent > 30 ? 'Conservative' : 
                      client.cashPercent < 10 ? 'Aggressive' : 'Moderate'
      return [
        client.name || 'N/A',
        client.accountType || 'N/A',
        this.formatCurrency(client.aum),
        this.formatCurrency(client.netAddition),
        this.formatPercentage(client.cashPercent || 0),
        riskLevel,
        client.rm || 'N/A'
      ]
    })

    this.addTable(clientHeaders, clientData, 'Top 20 Clients by AUM', {
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'center' },
        5: { halign: 'center' }
      }
    })

    // Risk Analysis Summary
    this.addSpacer(15)
    this.addSubtitle('RISK ANALYSIS SUMMARY')
    this.addSectionDivider()

    const conservativeCount = clients.filter(c => (c.cashPercent || 0) > 30).length
    const aggressiveCount = clients.filter(c => (c.cashPercent || 0) < 10).length
    const moderateCount = clients.length - conservativeCount - aggressiveCount

    this.addText(`Portfolio Risk Distribution: ${conservativeCount} Conservative (${this.formatPercentage((conservativeCount/clients.length)*100)}), ` +
      `${moderateCount} Moderate (${this.formatPercentage((moderateCount/clients.length)*100)}), ` +
      `${aggressiveCount} Aggressive (${this.formatPercentage((aggressiveCount/clients.length)*100)})`)

    this.addSpacer(10)
    this.addText('Risk Assessment: ' + 
      (conservativeCount > clients.length * 0.5 ? 'Portfolio demonstrates conservative bias with high cash allocation. Consider investment opportunities.' :
       aggressiveCount > clients.length * 0.4 ? 'Portfolio shows aggressive positioning. Monitor for risk management.' :
       'Portfolio shows balanced risk distribution across client base.'))

    // Performance Attribution
    this.addSpacer(15)
    this.addSubtitle('PERFORMANCE ATTRIBUTION')
    this.addSectionDivider()

    const positiveFlowClients = clients.filter(c => (c.netAddition || 0) > 0).length
    const negativeFlowClients = clients.filter(c => (c.netAddition || 0) < 0).length

    this.addText(`Net Flow Analysis: ${positiveFlowClients} clients with positive flows (${this.formatPercentage((positiveFlowClients/clients.length)*100)}), ` +
      `${negativeFlowClients} clients with negative flows (${this.formatPercentage((negativeFlowClients/clients.length)*100)})`)

    this.addSpacer(10)
    this.addText('Flow Recommendation: ' + 
      (positiveFlowClients > negativeFlowClients ? 'Strong client confidence indicated by net positive flows. Focus on retention strategies.' :
       'Monitor client satisfaction and investment performance to address flow concerns.'))

    this.addFooter()
    return this.doc
  }

  // Generate comprehensive individual client report
  async generateClientReport(client, insights, clientNotes = '') {
    this.initDocument()

    // Client Report Header
    this.addTitle(`CLIENT PORTFOLIO REPORT`, 22, this.colors.primary)
    this.addSpacer(5)
    this.addTitle(`${client.name}`, 18, this.colors.text)
    this.addSpacer(15)

    // Report metadata
    this.addKeyValuePair('Report Date', new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
    this.addKeyValuePair('Client ID', client.clientId || 'N/A')
    this.addKeyValuePair('Report Type', 'Individual Client Analysis')
    this.addSpacer(15)

    // Client Profile Section
    this.addSubtitle('CLIENT PROFILE')
    this.addSectionDivider()

    // Personal Information in two columns
    const startY = this.currentY
    this.addKeyValuePair('Full Name', client.name || 'N/A')
    this.addKeyValuePair('Email Address', client.email || 'N/A')
    this.addKeyValuePair('Mobile Number', client.mobile || 'N/A')
    this.addKeyValuePair('Account Type', client.accountType || 'N/A')
    
    // Second column
    const midY = this.currentY
    this.currentY = startY
    const leftMargin = this.margin + 90
    
    this.doc.text('Country:', leftMargin, this.currentY)
    this.doc.text(client.country || 'N/A', leftMargin + 30, this.currentY)
    this.currentY += 6
    
    this.doc.text('Occupation:', leftMargin, this.currentY)
    this.doc.text(client.occupation || 'N/A', leftMargin + 30, this.currentY)
    this.currentY += 6
    
    this.doc.text('Activation Date:', leftMargin, this.currentY)
    this.doc.text(this.formatDate(client.activationDate), leftMargin + 30, this.currentY)
    this.currentY += 6
    
    this.doc.text('Family Group:', leftMargin, this.currentY)
    this.doc.text(client.family || 'Individual', leftMargin + 30, this.currentY)
    this.currentY += 6
    
    this.doc.text('Relationship Manager:', leftMargin, this.currentY)
    this.doc.text(client.rm || 'Unassigned', leftMargin + 30, this.currentY)
    this.currentY += 6

    this.currentY = Math.max(this.currentY, midY)
    this.addSpacer(15)

    // Portfolio Summary Section
    this.addSubtitle('PORTFOLIO SUMMARY')
    this.addSectionDivider()

    // Financial metrics in highlight boxes
    const boxY = this.currentY
    this.addHighlightBox('TOTAL AUM', this.formatCurrency(client.aum), 'Assets Under Management', this.colors.primary)
    
    this.currentY = boxY
    this.currentY += 110
    this.addHighlightBox('NET INVESTMENT', this.formatCurrency(client.netInvestmentValue), 'Invested Amount', this.colors.secondary)
    
    this.currentY = boxY + 35
    this.addHighlightBox('CASH ALLOCATION', this.formatCurrency(client.cashAllocation), 
      `${this.formatPercentage(client.cashPercent || 0)} of portfolio`, this.colors.accent)
    
    this.currentY = boxY + 35 + 110
    this.addHighlightBox('NET ADDITION', this.formatCurrency(client.netAddition), 
      client.netAddition >= 0 ? 'Inflow' : 'Outflow', 
      client.netAddition >= 0 ? this.colors.secondary : [239, 68, 68])

    this.addSpacer(25)

    // Portfolio Allocation Chart (if available)
    await this.addChart('client-portfolio-chart', 'Portfolio Allocation Breakdown', 60)

    // Risk Assessment Section
    this.addSubtitle('RISK ASSESSMENT & INSIGHTS')
    this.addSectionDivider()

    if (insights) {
      this.addKeyValuePair('Risk Profile', insights.riskLevel || 'N/A', 50)
      this.addKeyValuePair('Portfolio Health', insights.portfolioHealth || 'N/A', 50)
      this.addKeyValuePair('Cash Status', insights.cashStatus || 'N/A', 50)
      this.addKeyValuePair('Performance Status', insights.performanceStatus || 'N/A', 50)
      this.addKeyValuePair('Account Age', insights.accountAge || 'N/A', 50)
      this.addSpacer(10)

      // Risk Analysis
      const cashPercent = client.cashPercent || 0
      let riskAnalysis = ''
      
      if (cashPercent > 30) {
        riskAnalysis = 'Conservative positioning with high cash allocation. Consider gradual investment opportunities to optimize returns while maintaining risk tolerance.'
      } else if (cashPercent < 10) {
        riskAnalysis = 'Aggressive investment stance with minimal cash buffer. Monitor market volatility and ensure adequate liquidity for opportunistic investments.'
      } else {
        riskAnalysis = 'Balanced approach with moderate cash allocation. Well-positioned for both stability and growth opportunities.'
      }
      
      this.addText('Risk Analysis: ' + riskAnalysis)
      this.addSpacer(10)

      // Performance insights
      let performanceInsight = ''
      if (client.netAddition > 0) {
        performanceInsight = `Positive net addition of ${this.formatCurrency(client.netAddition)} indicates growing confidence and capital deployment. `
      } else if (client.netAddition < 0) {
        performanceInsight = `Net outflow of ${this.formatCurrency(Math.abs(client.netAddition))} may indicate rebalancing or liquidity needs. `
      } else {
        performanceInsight = 'Stable portfolio with minimal net flows. '
      }
      
      performanceInsight += `Current AUM of ${this.formatCurrency(client.aum)} represents ${client.aum > 10000000 ? 'high-value' : client.aum > 1000000 ? 'significant' : 'developing'} portfolio size.`
      
      this.addText('Performance Insight: ' + performanceInsight)
    }

    // Recommendations Section
    this.addSpacer(15)
    this.addSubtitle('STRATEGIC RECOMMENDATIONS')
    this.addSectionDivider()

    if (insights && insights.recommendations && insights.recommendations.length > 0) {
      insights.recommendations.forEach((rec, index) => {
        this.addText(`${index + 1}. ${rec}`)
        this.addSpacer(3)
      })
    } else {
      // Generate dynamic recommendations based on client profile
      const recommendations = []
      
      if ((client.cashPercent || 0) > 25) {
        recommendations.push('Consider systematic investment plans (SIP) to deploy excess cash gradually while managing market timing risk.')
      }
      
      if (client.netAddition < 0) {
        recommendations.push('Review investment performance and client satisfaction to address potential concerns driving outflows.')
      }
      
      if (client.aum < 1000000) {
        recommendations.push('Focus on portfolio growth strategies and regular savings plans to build wealth systematically.')
      }
      
      if (!client.family || client.family === 'Individual') {
        recommendations.push('Explore family financial planning opportunities to optimize tax efficiency and estate planning.')
      }
      
      recommendations.push('Schedule quarterly portfolio review to ensure alignment with financial goals and risk tolerance.')

      recommendations.forEach((rec, index) => {
        this.addText(`${index + 1}. ${rec}`)
        this.addSpacer(3)
      })
    }

    // Client Notes Section (if provided)
    if (clientNotes && clientNotes.trim()) {
      this.addSpacer(15)
      this.addSubtitle('CLIENT NOTES & OBSERVATIONS')
      this.addSectionDivider()
      this.addText(clientNotes)
    }

    // Detailed Holdings Analysis (if on new page)
    this.addPage()
    this.addTitle('DETAILED PORTFOLIO ANALYSIS', 18)
    this.addSectionDivider()

    // Create detailed analysis table
    const analysisHeaders = ['Metric', 'Value', 'Benchmark', 'Assessment']
    const analysisData = [
      ['Total AUM', this.formatCurrency(client.aum), 'Client Specific', client.aum > 5000000 ? 'Above Average' : 'Developing'],
      ['Cash Allocation', this.formatPercentage(client.cashPercent || 0), '15-25%', 
        (client.cashPercent || 0) > 25 ? 'High' : (client.cashPercent || 0) < 15 ? 'Low' : 'Optimal'],
      ['Investment Ratio', this.formatPercentage(100 - (client.cashPercent || 0)), '75-85%', 
        (client.cashPercent || 0) < 25 ? 'High' : 'Conservative'],
      ['Net Flow', this.formatCurrency(client.netAddition), 'Positive Growth', 
        client.netAddition > 0 ? 'Positive' : client.netAddition < 0 ? 'Negative' : 'Stable'],
      ['Account Tenure', insights?.accountAge || 'N/A', '2+ Years', 
        insights?.accountAge?.includes('year') ? 'Established' : 'New']
    ]

    this.addTable(analysisHeaders, analysisData, 'Portfolio Metrics Analysis', {
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'center' }
      }
    })

    // Future Planning Section
    this.addSpacer(15)
    this.addSubtitle('FUTURE PLANNING CONSIDERATIONS')
    this.addSectionDivider()

    this.addText('Investment Strategy: Based on current portfolio composition and risk profile, consider the following strategic initiatives:')
    this.addSpacer(5)

    const planningPoints = [
      'Asset allocation optimization to align with long-term financial goals',
      'Tax-efficient investment strategies to maximize after-tax returns',
      'Diversification across asset classes and geographic regions',
      'Regular rebalancing schedule to maintain target allocations',
      'Emergency fund maintenance separate from investment portfolio'
    ]

    planningPoints.forEach(point => {
      this.addText(`• ${point}`)
      this.addSpacer(3)
    })

    this.addFooter()
    return this.doc
  }

  // Generate comprehensive analytics report
  async generateAnalyticsReport(familyData, rmData, topClients, cashVsInvestedData, stats) {
    this.initDocument()

    this.addTitle('ADVANCED ANALYTICS REPORT', 22, this.colors.primary)
    this.addSpacer(5)
    this.addTitle('Portfolio Performance & Market Intelligence', 16, this.colors.text)
    this.addSpacer(15)

    // Report metadata
    this.addKeyValuePair('Analysis Date', new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
    this.addKeyValuePair('Report Type', 'Advanced Portfolio Analytics')
    this.addKeyValuePair('Data Scope', 'Complete Portfolio Universe')
    this.addSpacer(15)

    // Executive Analytics Summary
    this.addSubtitle('ANALYTICS EXECUTIVE SUMMARY')
    this.addSectionDivider()

    if (topClients && topClients.length > 0) {
      const totalAUM = topClients.reduce((sum, client) => sum + (client.aum || 0), 0)
      const totalNetAddition = topClients.reduce((sum, client) => sum + (client.netAddition || 0), 0)
      const avgCashPercent = topClients.reduce((sum, client) => sum + (client.cashPercent || 0), 0) / topClients.length

      // Key analytics metrics
      const boxY = this.currentY
      this.addHighlightBox('PORTFOLIO COUNT', topClients.length.toString(), 'Active Clients', this.colors.primary)
      
      this.currentY = boxY
      this.currentY += 110
      this.addHighlightBox('TOTAL AUM', this.formatCurrency(totalAUM), 'Under Analysis', this.colors.secondary)
      
      this.currentY = boxY + 35
      this.addHighlightBox('NET FLOWS', this.formatCurrency(totalNetAddition), 
        totalNetAddition >= 0 ? 'Positive Trend' : 'Outflow Alert', 
        totalNetAddition >= 0 ? this.colors.secondary : [239, 68, 68])
      
      this.currentY = boxY + 35 + 110
      this.addHighlightBox('AVG CASH %', this.formatPercentage(avgCashPercent), 'Portfolio Liquidity', this.colors.accent)

      this.addSpacer(25)
    }

    // Top Performers Analysis
    if (topClients && topClients.length > 0) {
      this.addSubtitle('TOP PERFORMERS ANALYSIS')
      this.addSectionDivider()

      const topClientHeaders = ['Rank', 'Client Name', 'AUM', 'Net Addition', 'Cash %', 'Performance Score']
      const topClientData = topClients.slice(0, 10).map((client, index) => {
        const performanceScore = client.aum > 10000000 ? 'A+' : 
                               client.aum > 5000000 ? 'A' : 
                               client.aum > 1000000 ? 'B+' : 'B'
        return [
          (index + 1).toString(),
          client.name || 'N/A',
          this.formatCurrency(client.aum),
          this.formatCurrency(client.netAddition),
          this.formatPercentage(client.cashPercent || 0),
          performanceScore
        ]
      })
      
      this.addTable(topClientHeaders, topClientData, 'Top 10 Clients by Assets Under Management', {
        columnStyles: {
          0: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'center' },
          5: { halign: 'center' }
        }
      })

      // Performance distribution analysis
      this.addSpacer(10)
      const highPerformers = topClients.filter(c => c.aum > 5000000).length
      const mediumPerformers = topClients.filter(c => c.aum >= 1000000 && c.aum <= 5000000).length
      const developingClients = topClients.filter(c => c.aum < 1000000).length

      this.addText(`Performance Distribution: ${highPerformers} High-Value Clients (${this.formatPercentage((highPerformers/topClients.length)*100)}), ` +
        `${mediumPerformers} Medium-Value Clients (${this.formatPercentage((mediumPerformers/topClients.length)*100)}), ` +
        `${developingClients} Developing Clients (${this.formatPercentage((developingClients/topClients.length)*100)})`)
    }

    // Family Group Analysis
    if (familyData && familyData.length > 0) {
      this.addSpacer(15)
      await this.addChart('family-analysis-chart', 'Family Group AUM Distribution', 70)
      
      const familyHeaders = ['Family Group', 'Total AUM', 'Member Count', 'Avg AUM per Member', 'Growth Potential']
      const familyTableData = familyData.map(family => {
        const avgAUM = family.members ? family.aum / family.members : family.aum
        const growthPotential = avgAUM > 5000000 ? 'High' : avgAUM > 1000000 ? 'Medium' : 'Developing'
        return [
          family.name,
          this.formatCurrency(family.aum),
          family.members?.toString() || '1',
          this.formatCurrency(avgAUM),
          growthPotential
        ]
      })
      
      this.addTable(familyHeaders, familyTableData, 'Family Group Performance Analysis', {
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'center' }
        }
      })
    }

    // RM Performance Analysis
    if (rmData && rmData.length > 0) {
      this.addPage()
      this.addTitle('RELATIONSHIP MANAGER ANALYSIS', 18)
      this.addSectionDivider()

      await this.addChart('rm-performance-detailed-chart', 'Relationship Manager Performance Matrix', 70)

      const rmHeaders = ['Relationship Manager', 'Total AUM', 'Client Count', 'Avg AUM/Client', 'Efficiency Rating', 'Growth Rate']
      const rmTableData = rmData.map(rm => {
        const avgAUMPerClient = rm.clients ? rm.aum / rm.clients : 0
        const efficiencyRating = avgAUMPerClient > 5000000 ? 'Excellent' : 
                               avgAUMPerClient > 2000000 ? 'Good' : 
                               avgAUMPerClient > 500000 ? 'Average' : 'Developing'
        const growthRate = rm.netAddition > 0 ? '+' + this.formatPercentage((rm.netAddition / rm.aum) * 100) : 
                          this.formatPercentage((rm.netAddition / rm.aum) * 100)
        
        return [
          rm.name,
          this.formatCurrency(rm.aum),
          rm.clients?.toString() || 'N/A',
          this.formatCurrency(avgAUMPerClient),
          efficiencyRating,
          growthRate
        ]
      })
      
      this.addTable(rmHeaders, rmTableData, 'Relationship Manager Performance Scorecard', {
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'center' },
          5: { halign: 'center' }
        }
      })

      // RM insights
      const topRM = rmData.sort((a, b) => b.aum - a.aum)[0]
      if (topRM) {
        this.addSpacer(10)
        this.addText(`Top Performing RM: ${topRM.name} manages ${this.formatCurrency(topRM.aum)} across ${topRM.clients || 'N/A'} clients, ` +
          `demonstrating ${topRM.aum > 50000000 ? 'exceptional' : topRM.aum > 20000000 ? 'strong' : 'solid'} portfolio management capabilities.`)
      }
    }

    // Portfolio Allocation Analysis
    if (cashVsInvestedData && cashVsInvestedData.length > 0) {
      this.addSpacer(15)
      await this.addChart('cash-vs-invested-chart', 'Portfolio Allocation Analysis', 60)

      const cashHeaders = ['Allocation Type', 'Amount', 'Percentage', 'Market Trend', 'Recommendation']
      const totalAmount = cashVsInvestedData.reduce((sum, item) => sum + item.value, 0)
      const cashTableData = cashVsInvestedData.map(item => {
        const percentage = (item.value / totalAmount) * 100
        const marketTrend = item.name.toLowerCase().includes('cash') ? 
          (percentage > 25 ? 'High Liquidity' : 'Balanced') : 'Invested'
        const recommendation = item.name.toLowerCase().includes('cash') ? 
          (percentage > 30 ? 'Consider Investment' : 'Maintain Level') : 'Monitor Performance'
        
        return [
          item.name,
          this.formatCurrency(item.value),
          this.formatPercentage(percentage),
          marketTrend,
          recommendation
        ]
      })
      
      this.addTable(cashHeaders, cashTableData, 'Portfolio Allocation Breakdown', {
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        }
      })
    }

    // Market Intelligence Section
    this.addSpacer(15)
    this.addSubtitle('MARKET INTELLIGENCE & TRENDS')
    this.addSectionDivider()

    this.addText('Portfolio Concentration Analysis: The current portfolio distribution provides insights into client behavior and market positioning:')
    this.addSpacer(5)

    if (topClients && topClients.length > 0) {
      const top5AUM = topClients.slice(0, 5).reduce((sum, client) => sum + client.aum, 0)
      const totalAUM = topClients.reduce((sum, client) => sum + client.aum, 0)
      const concentration = (top5AUM / totalAUM) * 100

      this.addText(`• Top 5 client concentration: ${this.formatPercentage(concentration)} ${concentration > 60 ? '(High Risk)' : concentration > 40 ? '(Moderate Risk)' : '(Diversified)'}`)
      
      const positiveFlowClients = topClients.filter(c => c.netAddition > 0).length
      this.addText(`• Client sentiment: ${this.formatPercentage((positiveFlowClients/topClients.length)*100)} showing positive flows`)
      
      const avgCashLevel = topClients.reduce((sum, c) => sum + (c.cashPercent || 0), 0) / topClients.length
      this.addText(`• Market positioning: ${this.formatPercentage(avgCashLevel)} average cash allocation ${avgCashLevel > 25 ? '(Defensive)' : avgCashLevel < 15 ? '(Aggressive)' : '(Balanced)'}`)
    }

    // Strategic Recommendations
    this.addSpacer(15)
    this.addSubtitle('STRATEGIC RECOMMENDATIONS')
    this.addSectionDivider()

    const recommendations = [
      'Implement systematic rebalancing protocols to maintain target allocations across client portfolios',
      'Develop client segmentation strategies based on AUM and risk tolerance for personalized service delivery',
      'Monitor cash allocation trends to identify investment opportunities and optimize portfolio efficiency',
      'Establish performance benchmarks for relationship managers to drive consistent service excellence',
      'Create family office services for high-value client groups to capture generational wealth management'
    ]

    recommendations.forEach((rec, index) => {
      this.addText(`${index + 1}. ${rec}`)
      this.addSpacer(3)
    })

    this.addFooter()
    return this.doc
  }

  // Save PDF with timestamp
  save(filename) {
    if (this.doc) {
      const timestamp = new Date().toISOString().slice(0, 10)
      const finalFilename = filename.replace('.pdf', `_${timestamp}.pdf`)
      this.doc.save(finalFilename)
    }
  }
}

export default new PDFReportService()