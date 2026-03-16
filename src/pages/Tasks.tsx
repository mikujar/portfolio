import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { DroppableContainer } from '../components/tasks/DroppableContainer';
import { TaskCard } from '../components/tasks/TaskCard';
import { AddTaskForm } from '../components/tasks/AddTaskForm';
import { TaskTimeline } from '../components/tasks/TaskTimeline';
import { tasksApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Task, TasksData } from '../types';

type ContainerId = 'inbox' | 'sorted';

export function Tasks() {
  const { isAdmin } = useAuth();
  const [inboxTasks, setInboxTasks] = useState<Task[]>([]);
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksApi.getAll().then(data => {
      setInboxTasks(data.inbox);
      setSortedTasks(data.sorted);
      setCompletedTasks(data.completed);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const saveToServer = async (newData: TasksData) => {
    try {
      await tasksApi.updateAll(newData);
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string): ContainerId | null => {
    if (inboxTasks.find((t) => t.id === id)) return 'inbox';
    if (sortedTasks.find((t) => t.id === id)) return 'sorted';
    if (id === 'inbox' || id === 'sorted') return id as ContainerId;
    return null;
  };

  const findTask = (id: string): Task | null => {
    return (
      inboxTasks.find((t) => t.id === id) ||
      sortedTasks.find((t) => t.id === id) ||
      null
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!isAdmin) return;
    const task = findTask(event.active.id as string);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!isAdmin) return;
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const task = findTask(activeId);
    if (!task) return;

    if (activeContainer === 'inbox') {
      setInboxTasks((tasks) => tasks.filter((t) => t.id !== activeId));
      setSortedTasks((tasks) => {
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : tasks.length;
        return [...tasks.slice(0, insertIndex), task, ...tasks.slice(insertIndex)];
      });
    } else {
      setSortedTasks((tasks) => tasks.filter((t) => t.id !== activeId));
      setInboxTasks((tasks) => {
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : tasks.length;
        return [...tasks.slice(0, insertIndex), task, ...tasks.slice(insertIndex)];
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isAdmin) return;
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    let newInbox = inboxTasks;
    let newSorted = sortedTasks;

    if (activeContainer === overContainer) {
      if (activeContainer === 'inbox') {
        const oldIndex = inboxTasks.findIndex((t) => t.id === activeId);
        const newIndex = inboxTasks.findIndex((t) => t.id === overId);
        newInbox = arrayMove(inboxTasks, oldIndex, newIndex);
        setInboxTasks(newInbox);
      } else {
        const oldIndex = sortedTasks.findIndex((t) => t.id === activeId);
        const newIndex = sortedTasks.findIndex((t) => t.id === overId);
        newSorted = arrayMove(sortedTasks, oldIndex, newIndex);
        setSortedTasks(newSorted);
      }
    }

    saveToServer({ inbox: newInbox, sorted: newSorted, completed: completedTasks });
  };

  const handleAddTask = async (title: string, description?: string) => {
    try {
      const newTask = await tasksApi.create({ title, description, status: 'inbox' });
      setInboxTasks((tasks) => [...tasks, newTask]);
    } catch (error) {
      alert('添加任务失败');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await tasksApi.delete(id);
      setInboxTasks((tasks) => tasks.filter((t) => t.id !== id));
      setSortedTasks((tasks) => tasks.filter((t) => t.id !== id));
      setCompletedTasks((tasks) => tasks.filter((t) => t.id !== id));
    } catch (error) {
      alert('删除任务失败');
    }
  };

  const handleCompleteTask = async (id: string) => {
    const task = findTask(id);
    if (!task) return;

    const completedTask: Task = {
      ...task,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    const newInbox = inboxTasks.filter((t) => t.id !== id);
    const newSorted = sortedTasks.filter((t) => t.id !== id);
    const newCompleted = [completedTask, ...completedTasks];

    setInboxTasks(newInbox);
    setSortedTasks(newSorted);
    setCompletedTasks(newCompleted);

    saveToServer({ inbox: newInbox, sorted: newSorted, completed: newCompleted });
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="page-header">
          <h1 className="page-title">任务排序</h1>
          <p className="page-subtitle">拖拽任务，按优先级排序</p>
        </div>
        <div className="empty-state">加载中...</div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="page-title">任务排序</h1>
        <p className="page-subtitle">拖拽任务，按优先级排序</p>
      </div>

      {isAdmin && <AddTaskForm onAdd={handleAddTask} />}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="tasks-board">
          <DroppableContainer
            id="inbox"
            title="收件箱"
            tasks={inboxTasks}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
            isAdmin={isAdmin}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 8L5.5 4H18.5L21 8M3 8V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V8M3 8H21M10 12H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <DroppableContainer
            id="sorted"
            title="已排序"
            tasks={sortedTasks}
            showArrows
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
            isAdmin={isAdmin}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6H21M3 12H15M3 18H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
          <TaskTimeline tasks={completedTasks} onDelete={handleDeleteTask} isAdmin={isAdmin} />
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging showActions={false} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
