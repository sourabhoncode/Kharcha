import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from './UserContext';

export interface Expense {
    id: string;
    description: string;
    category: string;
    date: string;
    amount: number;
    categoryBadge: 'food' | 'utilities' | 'transport' | 'entertainment' | 'other';
}

interface ExpensesContextType {
    expenses: Expense[];
    addExpense: (expense: Expense) => void;
    updateExpense: (id: string, updates: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    deleteMultiple: (ids: string[]) => void;
    clearExpenses: () => void;
    getTotalSpending: () => number;
    getMonthlyAverage: () => number;
    getBiggestCategory: () => string;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [expenses, setExpenses] = useState<Expense[]>([]);

    // Load expenses whenever user changes
    useEffect(() => {
        if (user?.email) {
            const userExpensesKey = `expenses_${user.email}`;
            const savedExpenses = localStorage.getItem(userExpensesKey);
            setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
        } else {
            setExpenses([]);
        }
    }, [user?.email]);

    const getStorageKey = () => {
        return user?.email ? `expenses_${user.email}` : null;
    };

    const addExpense = (expense: Expense) => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        const updatedExpenses = [...expenses, expense];
        setExpenses(updatedExpenses);
        localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));
    };

    const updateExpense = (id: string, updates: Partial<Expense>) => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        const updatedExpenses = expenses.map(exp =>
            exp.id === id ? { ...exp, ...updates } : exp
        );
        setExpenses(updatedExpenses);
        localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));
    };

    const deleteExpense = (id: string) => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        const updatedExpenses = expenses.filter(exp => exp.id !== id);
        setExpenses(updatedExpenses);
        localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));
    };

    const deleteMultiple = (ids: string[]) => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        const updatedExpenses = expenses.filter(exp => !ids.includes(exp.id));
        setExpenses(updatedExpenses);
        localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));
    };

    const clearExpenses = () => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        setExpenses([]);
        localStorage.removeItem(storageKey);
    };

    const getTotalSpending = () => {
        return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    };

    const getMonthlyAverage = () => {
        if (expenses.length === 0) return 0;
        return getTotalSpending() / Math.max(1, expenses.length);
    };

    const getBiggestCategory = () => {
        if (expenses.length === 0) return 'None';

        const categoryTotals: Record<string, number> = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });

        let biggestCategory = 'None';
        let maxAmount = 0;
        for (const [category, amount] of Object.entries(categoryTotals)) {
            if (amount > maxAmount) {
                maxAmount = amount;
                biggestCategory = category;
            }
        }

        return biggestCategory;
    };

    return (
        <ExpensesContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense, deleteMultiple, clearExpenses, getTotalSpending, getMonthlyAverage, getBiggestCategory }}>
            {children}
        </ExpensesContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpensesContext);
    if (!context) {
        throw new Error('useExpenses must be used within ExpensesProvider');
    }
    return context;
};
