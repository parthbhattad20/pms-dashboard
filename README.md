# PMS Client Dashboard

An advanced, interactive Portfolio Management System (PMS) dashboard built with React, featuring comprehensive client insights, advanced visualizations, and real-time analytics.

## Features

### 📊 Advanced Visualizations
- **Account Type Distribution**: Pie chart showing client distribution by account types
- **AUM by Relationship Manager**: Bar chart displaying assets managed by each RM
- **Family Group Analysis**: Visual breakdown of AUM by family groups
- **RM Performance**: Combined chart showing clients and net additions by RM
- **Top 10 Clients**: Horizontal bar chart of highest-value portfolios

### 🔍 Comprehensive Client Insights
When clicking on any client, you get access to:

#### Overview Tab
- Total AUM with comparison to average
- Net additions/withdrawals with trend indicators
- Cash allocation and percentage
- Complete contact information (email, mobile, country, occupation)
- Account age calculation
- Important notes and reminders

#### Financial Details Tab
- **Financial Breakdown**: Pie chart showing AUM, Net Investment, Cash, and Net Addition distribution
- **Performance Metrics**: Radar chart displaying:
  - AUM Percentile
  - Investment Rate
  - Cash Rate
  - Return on Investment (ROI)
- **Detailed Metrics**: Progress bars for investment rate, cash allocation, and ROI
- Quick stats: Net Investment Value, Cash %, Total Returns, AUM Rank

#### Insights Tab
- **Comparative Analysis**: Bar chart comparing client's AUM with RM average and overall average
- **Key Insights**:
  - Portfolio ranking among all clients
  - Investment strategy assessment (conservative vs aggressive)
  - Performance evaluation (positive/negative ROI)
- **Smart Recommendations**:
  - High cash holdings alert
  - Net withdrawal warnings
  - SIP opportunity suggestions
  - Strong performance recognition

#### Family & RM Tab
- **Relationship Manager Details**:
  - Total clients managed
  - Total AUM managed
  - Average client AUM
- **Family Group Information**:
  - Family member count
  - Total family AUM
  - List of other family members with their AUM

### 🎯 Key Calculations & Metrics
- **AUM Percentile**: Client's ranking among all clients
- **Investment Rate**: Percentage of portfolio actively invested
- **Cash Rate**: Percentage held in cash
- **Return on Investment**: Calculated returns based on net investment
- **Account Age**: Automatically calculated from activation date
- **Comparison to Average**: How client compares to portfolio averages

### 🔎 Search & Filter
- Real-time search across:
  - Client names
  - Email addresses
  - Relationship managers
  - Family names
  - Account types
- Quick filters for account types (All, NRI, Pool Account)
- Dynamic client count display

### 📥 Export Capabilities
- **Full Report Download**: Export all filtered clients to Excel
- **Individual Client Export**: Download specific client data from detail view
- Formatted currency values in Indian notation (Crores/Lakhs)

## Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Processing**: XLSX (SheetJS)
- **Animations**: Framer Motion

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pms-dashboard.git

# Navigate to project directory
cd pms-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## Usage

1. The dashboard automatically loads client data from the Excel file
2. Browse through the main dashboard to see overall statistics and charts
3. Use the search bar to find specific clients
4. Click on any client row to open detailed insights
5. Navigate through tabs (Overview, Financial Details, Insights, Family & RM) for comprehensive information
6. Download reports using the "Download Report" button or export individual client data

## Data Structure

The dashboard expects an Excel file with the following columns:
- Client Name
- Email
- Mobile
- Account Type
- Country of Residence
- Occupation
- Activation Date
- AUM (Assets Under Management)
- Net Addition/Withdrawal
- Net Investment Value
- Cash Allocation
- Cash as % of Market Value
- RM (Relationship Manager)
- Family
- Notes
- SIP (Systematic Investment Plan)

## Features Highlights

### Smart Insights
The dashboard automatically generates insights based on:
- Portfolio size relative to peers
- Cash allocation patterns
- Investment performance
- Family group relationships
- RM performance metrics

### Responsive Design
- Fully responsive layout
- Mobile-friendly interface
- Adaptive charts and tables
- Touch-optimized interactions

### Professional UI/UX
- Smooth animations and transitions
- Hover effects and micro-interactions
- Color-coded financial indicators (green for positive, red for negative)
- Gradient headers and modern card designs
- Dark mode support

## License

MIT License - feel free to use this project for your portfolio management needs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.
