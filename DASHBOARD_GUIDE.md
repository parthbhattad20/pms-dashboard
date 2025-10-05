# BWC Client Dashboard - User Guide

## Overview

The BWC Client Dashboard is a comprehensive, interactive web application designed for managing and visualizing client portfolio data. Built with modern web technologies including React, Tailwind CSS, and shadcn/ui components, it provides a professional and intuitive interface for tracking client information, assets under management (AUM), and relationship manager performance.

## Features

### 1. **Dashboard Overview**
- **Total Clients**: Displays the total number of active client accounts
- **Total AUM**: Shows the aggregate assets under management across all clients
- **Net Addition**: Tracks total inflows and withdrawals
- **Average AUM**: Calculates the average portfolio size per client

### 2. **Interactive Visualizations**

#### Account Type Distribution (Pie Chart)
- Visual breakdown of clients by account type (NRI, Pool Account, etc.)
- Percentage-based representation with color-coded segments
- Interactive tooltips showing exact values

#### AUM by Relationship Manager (Bar Chart)
- Displays total assets managed by each RM
- Helps identify top performers and workload distribution
- Formatted currency values for easy reading

#### Top 10 Clients by AUM (Horizontal Bar Chart)
- Highlights the highest-value client portfolios
- Quick identification of key accounts
- Sorted by portfolio value in descending order

### 3. **Search & Filter Functionality**

#### Search Bar
Search across multiple fields:
- Client name
- Email address
- Relationship Manager (RM)
- Family name
- Account type

#### Filter Buttons
Quick filters for account types:
- **All**: Shows all clients
- **NRI**: Filters to show only NRI accounts
- **Pool Account**: Filters to show only Pool accounts

The dashboard displays a count showing "X of Y clients" based on active filters.

### 4. **Client Portfolio Table**

Complete data table with the following columns:
- **Client Name**: Full name of the client
- **Email**: Contact email address
- **Account Type**: Type of account (NRI, Pool Account, etc.)
- **AUM**: Assets under management (formatted in Crores/Lakhs)
- **Net Addition/Withdrawal**: Inflows/outflows (color-coded: green for positive, red for negative)
- **RM**: Assigned Relationship Manager
- **Family**: Family group association
- **Notes**: Important notes and reminders
- **Action**: "View" button to see detailed client information

### 5. **Client Detail View**

Clicking on any client row or the "View" button opens a detailed modal showing:

#### Personal Information
- Full name and email
- Account type with badge
- Activation date
- Mobile number
- Country of residence
- Occupation
- Relationship Manager
- Family association
- SIP status

#### Financial Details
- **AUM**: Total assets under management
- **Net Addition/Withdrawal**: Inflows/outflows with color coding
- **Cash Allocation**: Cash holdings
- **Cash Percentage**: Cash as percentage of total portfolio

#### Notes Section
- Displays any important notes or reminders about the client
- Examples: "Call once a month", "Follow up for additional investments"

### 6. **Download Report**

The "Download Report" button (top-right corner) generates an Excel file containing:
- All client data from the current filtered view
- Complete financial information
- Contact details and notes
- File name: `BWC_Client_Report.xlsx`

## Technical Features

### Responsive Design
- Fully responsive layout that works on desktop, tablet, and mobile devices
- Grid-based layout that adapts to different screen sizes
- Mobile-friendly navigation and interactions

### Modern UI/UX
- **Hover Effects**: Cards and table rows have smooth hover transitions
- **Color Coding**: Visual indicators for positive/negative values
- **Badges**: Clear visual distinction for account types
- **Icons**: Lucide icons for better visual communication
- **Smooth Animations**: Transitions and micro-interactions throughout

### Data Formatting
- Currency values automatically formatted in Indian notation (Crores/Lakhs)
- Automatic conversion: ₹10,000,000 → ₹1.00Cr
- Color-coded financial indicators (green for gains, red for losses)

## How to Use

### Basic Navigation

1. **View Dashboard Statistics**: Scroll to the top to see the four key metric cards
2. **Analyze Charts**: Review the three visualization sections for insights
3. **Search for Clients**: Use the search bar to find specific clients by name, email, RM, or family
4. **Filter by Type**: Click the filter buttons to narrow down by account type
5. **View Client Details**: Click any row in the table or the "View" button to see full details
6. **Download Data**: Click "Download Report" to export filtered data to Excel

### Search Tips

- Search is case-insensitive
- Partial matches are supported (e.g., "stark" will find "Tony Stark")
- Search works across multiple fields simultaneously
- Combine search with filters for more precise results

### Filter Tips

- Filters can be combined with search
- The client count updates dynamically based on active filters
- Click "All" to reset account type filters

## Data Source

The dashboard loads data from the Excel file: `250911BWCClientDashboard.xlsx`

The data includes:
- 21 active client accounts
- Multiple account types (NRI, Pool Account)
- 4 Relationship Managers (Ranjit, Miten, Distributor 1, Distributor 2)
- Complete financial and contact information

## Browser Compatibility

The dashboard works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Fast loading times with optimized React components
- Efficient data filtering and searching
- Smooth animations and transitions
- Responsive charts that adapt to screen size

## Future Enhancements (Potential)

Based on the notes in the original data, potential future features could include:
- Direct links to portfolio reports in WealthSpectrum
- Integration with Salesforce for RM details
- Editable notes with edit history tracking
- Automatic calculation of Cash % of AUM
- Manual input fields for certain data points
- PDF report generation for individual clients

---

**Version**: 1.0  
**Last Updated**: October 2024  
**Technology Stack**: React 19, Vite, Tailwind CSS, shadcn/ui, Recharts, XLSX
