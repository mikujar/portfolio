import type { Expense } from '../../types';
import { currencySymbols } from '../../types';

interface ExpenseTimelineProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const expenseDate = new Date(dateString);
  expenseDate.setHours(0, 0, 0, 0);

  if (expenseDate.getTime() === today.getTime()) {
    return '今天';
  } else if (expenseDate.getTime() === yesterday.getTime()) {
    return '昨天';
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  }
}

function groupByDate(expenses: Expense[]): Record<string, Expense[]> {
  const groups: Record<string, Expense[]> = {};
  expenses.forEach((expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
  });
  return groups;
}

export function ExpenseTimeline({ expenses, onDelete, isAdmin }: ExpenseTimelineProps) {
  const sortedExpenses = [...expenses].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const groupedExpenses = groupByDate(sortedExpenses);
  const dates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="expense-timeline-container">
      <div className="expense-container-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <h2>消费记录</h2>
        <span className="expense-item-count">{expenses.length}</span>
      </div>
      <div className="expense-timeline-list">
        {expenses.length === 0 ? (
          <div className="empty-state">记录消费后会显示在这里</div>
        ) : (
          <div className="expense-timeline">
            {dates.map((date) => (
              <div key={date} className="expense-timeline-group">
                <div className="expense-timeline-date">{formatDate(date)}</div>
                {groupedExpenses[date].map((expense) => (
                  <div key={expense.id} className="expense-timeline-item">
                    <div className="expense-timeline-dot"></div>
                    <div className="expense-timeline-content">
                      <div className="expense-timeline-expense">
                        <div className="expense-info">
                          <h3 className="expense-item-name">{expense.item}</h3>
                          {expense.description && (
                            <p className="expense-description">{expense.description}</p>
                          )}
                        </div>
                        <div className="expense-amount">
                          {currencySymbols[expense.currency]}{expense.amount.toFixed(2)}
                        </div>
                        {isAdmin && (
                          <button
                            className="delete-button"
                            onClick={() => onDelete(expense.id)}
                            title="删除记录"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M4 4L12 12M12 4L4 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
