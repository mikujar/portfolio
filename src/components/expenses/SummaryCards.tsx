import { useState } from 'react';
import type { Expense, Currency } from '../../types';
import { currencySymbols, currencyNames } from '../../types';

interface SummaryCardsProps {
  expenses: Expense[];
  exchangeRates: Record<Currency, Record<Currency, number>>;
}

function convertAmount(amount: number, from: Currency, to: Currency, rates: Record<Currency, Record<Currency, number>>): number {
  return amount * rates[from][to];
}

function calculateTotal(expenses: Expense[], targetCurrency: Currency, rates: Record<Currency, Record<Currency, number>>): number {
  return expenses.reduce((sum, expense) => {
    return sum + convertAmount(expense.amount, expense.currency, targetCurrency, rates);
  }, 0);
}

function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getStartOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getStartOfYear(date: Date): Date {
  const d = new Date(date);
  d.setMonth(0);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfYear(date: Date): Date {
  const d = new Date(date);
  d.setMonth(11);
  d.setDate(31);
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatDateRange(start: Date, end: Date, type: 'day' | 'week' | 'month' | 'year'): string {
  const today = new Date();
  const startOfToday = getStartOfDay(today);
  
  if (type === 'day') {
    if (start.getTime() === startOfToday.getTime()) {
      return '今日';
    }
    return start.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
  
  if (type === 'week') {
    const thisWeekStart = getStartOfWeek(today);
    if (start.getTime() === thisWeekStart.getTime()) {
      return '本周';
    }
    return `${start.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`;
  }
  
  if (type === 'month') {
    const thisMonthStart = getStartOfMonth(today);
    if (start.getTime() === thisMonthStart.getTime()) {
      return '本月';
    }
    return start.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
  }
  
  if (type === 'year') {
    const thisYearStart = getStartOfYear(today);
    if (start.getTime() === thisYearStart.getTime()) {
      return '本年';
    }
    return start.getFullYear().toString() + '年';
  }
  
  return '';
}

export function SummaryCards({ expenses, exchangeRates }: SummaryCardsProps) {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('CNY');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const startOfDay = getStartOfDay(selectedDate);
  const endOfDay = getEndOfDay(selectedDate);
  const startOfWeek = getStartOfWeek(selectedDate);
  const endOfWeek = getEndOfWeek(selectedDate);
  const startOfMonth = getStartOfMonth(selectedDate);
  const endOfMonth = getEndOfMonth(selectedDate);
  const startOfYear = getStartOfYear(selectedDate);
  const endOfYear = getEndOfYear(selectedDate);

  const dayExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return expenseDate >= startOfDay && expenseDate <= endOfDay;
  });

  const weekExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
  });

  const monthExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
  });

  const yearExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return expenseDate >= startOfYear && expenseDate <= endOfYear;
  });

  const dayTotal = calculateTotal(dayExpenses, displayCurrency, exchangeRates);
  const weekTotal = calculateTotal(weekExpenses, displayCurrency, exchangeRates);
  const monthTotal = calculateTotal(monthExpenses, displayCurrency, exchangeRates);
  const yearTotal = calculateTotal(yearExpenses, displayCurrency, exchangeRates);

  const symbol = currencySymbols[displayCurrency];

  const goToPrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = getStartOfDay(selectedDate).getTime() === getStartOfDay(new Date()).getTime();

  return (
    <div className="expense-summary-container">
      <div className="expense-container-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V9C20 7.89543 19.1046 7 18 7H15M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7M9 7H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <h2>消费统计</h2>
        <select
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value as Currency)}
          className="currency-switch"
        >
          <option value="CNY">{currencyNames.CNY}</option>
          <option value="AUD">{currencyNames.AUD}</option>
          <option value="USD">{currencyNames.USD}</option>
        </select>
      </div>
      
      <div className="date-navigator">
        <button className="nav-button" onClick={goToPrevDay}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="current-date">
          {selectedDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <button className="nav-button" onClick={goToNextDay}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {!isToday && (
          <button className="today-button" onClick={goToToday}>
            今天
          </button>
        )}
      </div>

      <div className="expense-summary-cards">
        <div className="expense-summary-card">
          <div className="card-label">{formatDateRange(startOfDay, endOfDay, 'day')}消费</div>
          <div className="card-amount">
            <span className="currency-symbol">{symbol}</span>
            <span className="amount-value">{dayTotal.toFixed(2)}</span>
          </div>
          <div className="card-count">{dayExpenses.length} 笔</div>
        </div>
        <div className="expense-summary-card">
          <div className="card-label">{formatDateRange(startOfWeek, endOfWeek, 'week')}消费</div>
          <div className="card-amount">
            <span className="currency-symbol">{symbol}</span>
            <span className="amount-value">{weekTotal.toFixed(2)}</span>
          </div>
          <div className="card-count">{weekExpenses.length} 笔</div>
        </div>
        <div className="expense-summary-card">
          <div className="card-label">{formatDateRange(startOfMonth, endOfMonth, 'month')}消费</div>
          <div className="card-amount">
            <span className="currency-symbol">{symbol}</span>
            <span className="amount-value">{monthTotal.toFixed(2)}</span>
          </div>
          <div className="card-count">{monthExpenses.length} 笔</div>
        </div>
        <div className="expense-summary-card">
          <div className="card-label">{formatDateRange(startOfYear, endOfYear, 'year')}消费</div>
          <div className="card-amount">
            <span className="currency-symbol">{symbol}</span>
            <span className="amount-value">{yearTotal.toFixed(2)}</span>
          </div>
          <div className="card-count">{yearExpenses.length} 笔</div>
        </div>
      </div>
    </div>
  );
}
