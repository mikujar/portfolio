export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  date: string;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  images: string[];
  date: string;
}

export type Page = 'home' | 'videos' | 'photos' | 'quotes' | 'tasks' | 'expenses';

export interface Quote {
  id: string;
  content: string;
  author?: string;
  source?: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'inbox' | 'sorted' | 'completed';
  position: number;
  completedAt?: string;
}

export interface TasksData {
  inbox: Task[];
  sorted: Task[];
  completed: Task[];
}

export type Currency = 'CNY' | 'USD' | 'AUD';

export const currencySymbols: Record<Currency, string> = {
  CNY: '¥',
  AUD: 'A$',
  USD: '$',
};

export const currencyNames: Record<Currency, string> = {
  CNY: '人民币',
  AUD: '澳币',
  USD: '美元',
};

export const defaultExchangeRates: Record<Currency, Record<Currency, number>> = {
  CNY: { CNY: 1, AUD: 0.21, USD: 0.14 },
  AUD: { CNY: 4.76, AUD: 1, USD: 0.65 },
  USD: { CNY: 7.25, AUD: 1.54, USD: 1 },
};

export interface Expense {
  id: string;
  date: string;
  item: string;
  description?: string;
  amount: number;
  currency: Currency;
  createdAt: string;
}
