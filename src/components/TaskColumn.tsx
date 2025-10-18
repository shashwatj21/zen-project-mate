import { Task, TaskStatus } from '@/contexts/TaskContext';
import { TaskCard } from '@/components/TaskCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

export const TaskColumn = ({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onAddTask,
}: TaskColumnProps) => {
  return (
    <div className="flex-1 min-w-[280px] bg-muted/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground font-mono">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
        className="space-y-0 min-h-[200px]"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};
