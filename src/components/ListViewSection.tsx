import { useState } from 'react';
import { Task, ListSection } from '@/contexts/TaskContext';
import { ListViewTaskItem } from '@/components/ListViewTaskItem';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ListViewSectionProps {
  title: string;
  section: ListSection;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, section: ListSection) => void;
  draggedTaskId: string | null;
}

export const ListViewSection = ({
  title,
  section,
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  onDragOver,
  onDrop,
  draggedTaskId,
}: ListViewSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    onDragOver(e);
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, section);
    setIsDragOver(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-[100px] p-2 rounded-md transition-all duration-200 ${
            isDragOver ? 'bg-accent/50 ring-2 ring-accent-foreground/20' : ''
          }`}
        >
          {tasks.length === 0 && !isDragOver && (
            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
              No tasks in this section
            </div>
          )}
          {tasks.map((task) => (
            <ListViewTaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onDragStart={onDragStart}
              isDragging={draggedTaskId === task.id}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
