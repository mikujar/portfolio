import type { Task } from '../../types';

interface TaskTimelineProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export function TaskTimeline({ tasks, onDelete, isAdmin }: TaskTimelineProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (isToday) {
      return `今天 ${timeStr}`;
    } else if (isYesterday) {
      return `昨天 ${timeStr}`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime();
  });

  return (
    <div className="task-timeline-container">
      <div className="task-container-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <h2>已完成</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-timeline-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            完成任务后会显示在这里
          </div>
        ) : (
          <div className="task-timeline">
            {sortedTasks.map((task) => (
              <div key={task.id} className="task-timeline-item">
                <div className="task-timeline-dot"></div>
                <div className="task-timeline-content">
                  <div className="task-timeline-task">
                    <div className="task-timeline-task-info">
                      <h3 className="task-title">{task.title}</h3>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <button 
                        className="delete-button" 
                        onClick={() => onDelete(task.id)}
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
                  <span className="task-timeline-time">{formatDate(task.completedAt!)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
