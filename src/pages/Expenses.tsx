import { useState, useEffect } from 'react';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseTimeline } from '../components/expenses/ExpenseTimeline';
import { SummaryCards } from '../components/expenses/SummaryCards';
import { expensesApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Expense, Currency } from '../types';
import { defaultExchangeRates } from '../types';

export function Expenses() {
  const { isAdmin } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, Record<Currency, number>>>(defaultExchangeRates);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  const fetchExchangeRates = async () => {
    setRatesLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      const usdToCny = data.rates.CNY;
      const usdToAud = data.rates.AUD;
      
      const newRates: Record<Currency, Record<Currency, number>> = {
        USD: { 
          USD: 1, 
          CNY: usdToCny, 
          AUD: usdToAud 
        },
        CNY: { 
          CNY: 1, 
          USD: 1 / usdToCny, 
          AUD: usdToAud / usdToCny 
        },
        AUD: { 
          AUD: 1, 
          USD: 1 / usdToAud, 
          CNY: usdToCny / usdToAud 
        },
      };
      
      setExchangeRates(newRates);
      setRatesUpdatedAt(new Date().toLocaleString('zh-CN'));
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    expensesApi.getAll().then(data => {
      setExpenses(data);
      setLoading(false);
    }).catch(() => setLoading(false));

    fetchExchangeRates();
  }, []);

  const handleAddExpense = async (expense: {
    date: string;
    item: string;
    description?: string;
    amount: number;
    currency: Currency;
  }) => {
    try {
      const newExpense = await expensesApi.create(expense);
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (error) {
      alert('添加消费记录失败');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expensesApi.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      alert('删除失败');
    }
  };

  if (loading) {
    return (
      <div className="expenses-page">
        <div className="page-header">
          <h1 className="page-title">记账本</h1>
          <p className="page-subtitle">记录每一笔消费，掌握财务状况</p>
        </div>
        <div className="empty-state">加载中...</div>
      </div>
    );
  }

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1 className="page-title">记账本</h1>
        <p className="page-subtitle">记录每一笔消费，掌握财务状况</p>
      </div>

      {isAdmin && <ExpenseForm onAdd={handleAddExpense} />}

      <div className="expenses-board">
        <ExpenseTimeline expenses={expenses} onDelete={handleDeleteExpense} isAdmin={isAdmin} />
        <SummaryCards expenses={expenses} exchangeRates={exchangeRates} />
      </div>

      <div className="rate-info">
        <span>
          汇率：1 USD = {exchangeRates.USD.CNY.toFixed(4)} CNY = {exchangeRates.USD.AUD.toFixed(4)} AUD
        </span>
        {ratesUpdatedAt && <span className="rate-time">更新于 {ratesUpdatedAt}</span>}
        <button 
          className="refresh-button" 
          onClick={fetchExchangeRates}
          disabled={ratesLoading}
        >
          {ratesLoading ? '更新中...' : '刷新汇率'}
        </button>
      </div>
    </div>
  );
}
