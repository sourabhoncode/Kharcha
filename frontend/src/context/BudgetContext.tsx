import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from './UserContext';

export interface MonthlyBudget {
    year: number;
    month: number;
    amount: number;
}

interface BudgetContextType {
    budgets: MonthlyBudget[];
    setBudgetForMonth: (year: number, month: number, amount: number) => void;
    getBudgetForMonth: (year: number, month: number) => number | null;
    getCurrentMonthBudget: () => number | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);

    // Load budgets whenever user changes
    useEffect(() => {
        if (user?.email) {
            const budgetsKey = `budgets_${user.email}`;
            const savedBudgets = localStorage.getItem(budgetsKey);
            setBudgets(savedBudgets ? JSON.parse(savedBudgets) : []);
        } else {
            setBudgets([]);
        }
    }, [user?.email]);

    const getStorageKey = () => {
        return user?.email ? `budgets_${user.email}` : null;
    };

    const setBudgetForMonth = (year: number, month: number, amount: number) => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        const existingIndex = budgets.findIndex(b => b.year === year && b.month === month);
        let updatedBudgets;

        if (existingIndex >= 0) {
            updatedBudgets = [...budgets];
            updatedBudgets[existingIndex].amount = amount;
        } else {
            updatedBudgets = [...budgets, { year, month, amount }];
        }

        setBudgets(updatedBudgets);
        localStorage.setItem(storageKey, JSON.stringify(updatedBudgets));
    };

    const getBudgetForMonth = (year: number, month: number) => {
        const budget = budgets.find(b => b.year === year && b.month === month);
        return budget ? budget.amount : null;
    };

    const getCurrentMonthBudget = () => {
        const now = new Date();
        return getBudgetForMonth(now.getFullYear(), now.getMonth() + 1);
    };

    return (
        <BudgetContext.Provider value={{ budgets, setBudgetForMonth, getBudgetForMonth, getCurrentMonthBudget }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudget must be used within BudgetProvider');
    }
    return context;
};
