import { useState } from 'react';
import type { Currency } from '../../types';
import { currencyNames } from '../../types';

interface ExpenseFormProps {
  onAdd: (expense: {
    date: string;
    item: string;
    description?: string;
    amount: number;
    currency: Currency;
  }) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('CNY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.trim() && amount) {
      onAdd({
        date,
        item: item.trim(),
        description: description.trim() || undefined,
        amount: parseFloat(amount),
        currency,
      });
      setItem('');
      setDescription('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="form-input date-input"
      />
      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        placeholder="消费项目"
        className="form-input item-input"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="描述（可选）"
        className="form-input desc-input"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="金额"
        step="0.01"
        min="0"
        className="form-input amount-input"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="form-input currency-select"
      >
        <option value="CNY">{currencyNames.CNY}</option>
        <option value="AUD">{currencyNames.AUD}</option>
        <option value="USD">{currencyNames.USD}</option>
      </select>
      <button type="submit" className="add-button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4V16M4 10H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        记录
      </button>
    </form>
  );
}
