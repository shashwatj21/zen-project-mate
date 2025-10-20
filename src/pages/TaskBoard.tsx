import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import { useTasks, Task, TaskStatus, ListSection } from '@/contexts/TaskContext';
import { TaskColumn } from '@/components/TaskColumn';
import { TaskDialog } from '@/components/TaskDialog';
import { ListViewSection } from '@/components/ListViewSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, LayoutGrid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STATUS_COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in-progress' },
  { title: 'Done', status: 'done' },
];

const LIST_SECTIONS: { title: string; section: ListSection }[] = [
  { title: 'Today', section: 'today' },
  { title: 'Tomorrow', section: 'tomorrow' },
  { title: 'Later', section: 'later' },
];

const TaskBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { getTasksByProject, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const project = projects.find(p => p.id === projectId);
  const tasks = projectId ? getTasksByProject(projectId) : [];

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground mb-4">Project not found</h2>
          <Button onClick={() => navigate('/')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  const handleSave = (data: { title: string; description: string; status: TaskStatus; priority?: 'high' | 'low'; color?: string }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      toast({ title: 'Task updated', description: 'Your task has been updated successfully.' });
    } else {
      addTask({ ...data, projectId: projectId! });
      toast({ title: 'Task created', description: 'Your new task has been created successfully.' });
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast({ title: 'Task deleted', description: 'The task has been removed.' });
  };

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      moveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  const handleListDrop = (e: React.DragEvent, section: ListSection) => {
    e.preventDefault();
    if (draggedTaskId) {
      updateTask(draggedTaskId, { listSection: section });
      setDraggedTaskId(null);
    }
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newCompleted = !task.completed && task.status !== 'done';
      const newStatus = newCompleted ? 'done' : 'todo';
      updateTask(id, { 
        completed: newCompleted,
        status: newStatus
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-light text-foreground mb-1">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
            <Button onClick={() => handleAddTask('todo')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:overflow-x-auto pb-4">
            {STATUS_COLUMNS.map(({ title, status }) => (
              <TaskColumn
                key={status}
                title={title}
                status={status}
                tasks={tasks.filter(t => t.status === status)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onAddTask={handleAddTask}
                draggedTaskId={draggedTaskId}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-3xl">
            {LIST_SECTIONS.map(({ title, section }) => (
              <ListViewSection
                key={section}
                title={title}
                section={section}
                tasks={tasks.filter(t => (t.listSection || 'today') === section)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleListDrop}
                draggedTaskId={draggedTaskId}
              />
            ))}
          </div>
        )}

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={editingTask}
          defaultStatus={defaultStatus}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
