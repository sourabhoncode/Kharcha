import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserContext';
import { ExpensesProvider } from './context/ExpensesContext';
import { BudgetProvider } from './context/BudgetContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AddExpensePage from './pages/AddExpensePage';
import EditProfilePage from './pages/EditProfilePage';
import ExpensesPage from './pages/ExpensesPage';
import TripsPage from './pages/TripsPage';
import SettingsPage from './pages/SettingsPage';
import ReportPage from './pages/ReportPage';
import ReceiptPhotoPage from './pages/ReceiptPhotoPage';

const App: React.FC = () => {

    return (
        <UserProvider>
            <ExpensesProvider>
                <BudgetProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/add-expense" element={<AddExpensePage />} />
                            <Route path="/edit-profile" element={<EditProfilePage />} />
                            <Route path="/expenses" element={<ExpensesPage />} />
                            <Route path="/report" element={<ReportPage />} />
                            <Route path="/receipt" element={<ReceiptPhotoPage />} />
                            <Route path="/trips" element={<TripsPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </Router>
                </BudgetProvider>
            </ExpensesProvider>
        </UserProvider>
    );
};

export default App;
