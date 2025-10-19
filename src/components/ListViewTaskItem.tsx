import { Task } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit, GripVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ListViewTaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  isDragging?: boolean;
}

export const ListViewTaskItem = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  onDragStart, 
  isDragging 
}: ListViewTaskItemProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`group bg-card border border-border rounded-lg p-3 mb-2 cursor-move transition-all duration-300 hover:border-foreground/20 hover:shadow-sm animate-fade-in ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1 opacity-0 group-hover:opacity-40 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <Checkbox
          checked={task.completed || false}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium text-foreground mb-1 break-words ${
            task.completed ? 'line-through opacity-60' : ''
          }`}>
            {task.title}
          </h4>
          {task.description && (
            <p className={`text-xs text-muted-foreground line-clamp-2 break-words ${
              task.completed ? 'line-through opacity-50' : ''
            }`}>
              {task.description}
            </p>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
