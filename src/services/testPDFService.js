// Test file to verify PDF service functionality
import pdfReportService from './pdfReportService.js'

// Simple test function to verify basic PDF generation works
export const testBasicPDF = async () => {
  try {
    console.log('Testing basic PDF generation...')
    
    // Initialize document
    pdfReportService.initDocument()
    
    // Add basic content
    pdfReportService.addTitle('TEST REPORT', 20)
    pdfReportService.addText('This is a test report to verify PDF functionality.')
    
    // Test table functionality
    const headers = ['Column 1', 'Column 2', 'Column 3']
    const data = [
      ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
      ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
    ]
    
    pdfReportService.addTable(headers, data, 'Test Table')
    
    // Add footer
    pdfReportService.addFooter()
    
    // Save test PDF
    pdfReportService.save('Test_PDF_Report.pdf')
    
    console.log('Basic PDF test completed successfully!')
    return true
  } catch (error) {
    console.error('Basic PDF test failed:', error)
    return false
  }
}

// Test client report generation without charts
export const testClientReportWithoutCharts = async () => {
  try {
    console.log('Testing client report without charts...')
    
    const testClient = {
      name: 'Test Client',
      email: 'test@example.com',
      mobile: '+91 9876543210',
      accountType: 'Premium',
      country: 'India',
      occupation: 'Software Engineer',
      activationDate: '2024-01-15',
      family: 'Individual',
      rm: 'Test RM',
      aum: 5000000,
      netInvestmentValue: 4500000,
      cashAllocation: 500000,
      cashPercent: 10,
      netAddition: 250000,
      clientId: 'TEST001'
    }
    
    const testInsights = {
      riskLevel: 'Moderate',
      portfolioHealth: 'Good',
      cashStatus: 'Optimal',
      performanceStatus: 'Positive',
      accountAge: '9 months',
      recommendations: [
        'Consider diversifying portfolio across asset classes',
        'Review quarterly performance against benchmarks',
        'Maintain current cash allocation for liquidity'
      ]
    }
    
    const doc = await pdfReportService.generateClientReport(testClient, testInsights, 'Test client notes for PDF generation.')
    pdfReportService.save('Test_Client_Report.pdf')
    
    console.log('Client report test completed successfully!')
    return true
  } catch (error) {
    console.error('Client report test failed:', error)
    return false
  }
}

export default { testBasicPDF, testClientReportWithoutCharts }
