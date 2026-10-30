# Expense Tracker

A modern, full-stack expense tracking application built with React, Vite, and Firebase. Track your income and expenses, visualize your financial data with interactive charts, and export reports for offline use.

## Features

- **User Authentication**: Secure sign up and login with Firebase Authentication
- **Transaction Management**: Add, view, and delete income and expense transactions
- **Financial Dashboard**: Real-time overview of total balance, income, and expenses
- **Interactive Charts**: Visualize income vs expenses with customizable time periods (monthly, quarterly, yearly)
- **Category Tracking**: Organize transactions by categories (Food, Housing, Transportation, etc.)
- **Data Export**: Export transaction data to CSV or PDF formats
- **User Profile**: Manage user profile and account information
- **Responsive Design**: Dark-themed UI with smooth animations and transitions
- **Real-time Sync**: Firebase Realtime Database for instant data synchronization

## Tech Stack

- **Frontend**: React 19.2.8, Vite 8.2.2
- **Routing**: React Router DOM 7.18.3
- **Styling**: Custom CSS with CSS variables for theming
- **Icons**: Lucide React
- **Charts**: Chart.js 4.5.1, react-chartjs-2 5.3.1
- **Date Handling**: date-fns 4.4.0
- **PDF Generation**: jsPDF 4.2.1
- **Backend**: Firebase (Authentication, Realtime Database)
- **Linting**: Oxlint 1.79.0

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (for backend services)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd intern-pro-1
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Create a web app and copy the Firebase configuration
   - Replace the firebaseConfig object in `src/services/firebase.js` with your credentials

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication
- **Sign Up**: Create a new account with your email, name, and password
- **Login**: Sign in with your registered credentials
- **Logout**: Securely sign out from your account

### Dashboard
- View your total balance, income, and expenses at a glance
- Navigate to different sections using the header navigation

### Adding Transactions
1. Click on the "Add Transaction" card
2. Select transaction type (Income or Expense)
3. Enter the amount, date, category, and description
4. Click the submit button to save

### Viewing Charts
- Use the time period dropdown to switch between Monthly, Quarterly, and Yearly views
- Filter by specific years using the year dropdown
- View income, expenses, and net profit trends

### Exporting Data
- **CSV Export**: Download transactions as a CSV file for spreadsheet applications
- **PDF Export**: Generate a PDF report with transaction summary and recent transactions

### Profile Management
- Click on your profile icon or the "Profile" button
- View and manage your account information

## Project Structure

```
intern-pro-1/
├── src/
│   ├── components/
│   │   ├── BudgetCharts.jsx      # Interactive income/expense charts
│   │   ├── Dashboard.jsx         # Main dashboard with summary cards
│   │   ├── ExportPanel.jsx       # CSV and PDF export functionality
│   │   ├── LoginPage.jsx         # Authentication page (login/signup)
│   │   ├── ProfilePage.jsx       # User profile management
│   │   ├── ProtectedRoute.jsx    # Route protection for authenticated users
│   │   ├── TransactionForm.jsx   # Form to add new transactions
│   │   └── TransactionList.jsx   # List of all transactions
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state management
│   │   └── TransactionContext.jsx # Transaction state management
│   ├── services/
│   │   └── firebase.js           # Firebase configuration and API calls
│   ├── assets/                   # Static assets (images, icons)
│   ├── App.jsx                   # Main app component with routing
│   ├── App.css                   # Global styles
│   ├── index.css                 # CSS variables and theme
│   └── main.jsx                  # React entry point
├── public/                       # Public assets
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run Oxlint to check code quality

## Firebase Configuration

The app uses Firebase for authentication and data storage. The configuration is located in `src/services/firebase.js`. Make sure to:

1. Enable Email/Password authentication in Firebase Console
2. Set up Realtime Database rules (currently set to public for development)
3. Configure your Firebase project with the appropriate security rules for production

## Environment Variables

For enhanced security, consider moving sensitive Firebase configuration to environment variables:

1. Create a `.env` file in the root directory
2. Add your Firebase configuration as environment variables
3. Update `src/services/firebase.js` to use these variables

Example `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

## Future Enhancements

- [ ] Budget setting and tracking
- [ ] Transaction categories with custom icons
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Transaction search and filtering
- [ ] Dark/Light theme toggle
- [ ] Data backup and restore
- [ ] Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository or contact the development team.
