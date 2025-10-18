import { useState } from 'react';
import { useProjects, Project } from '@/contexts/ProjectContext';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectDialog } from '@/components/ProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const handleSave = (data: { name: string; description: string }) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      toast({
        title: 'Project updated',
        description: 'Your project has been updated successfully.',
      });
    } else {
      addProject(data);
      toast({
        title: 'Project created',
        description: 'Your new project has been created successfully.',
      });
    }
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    toast({
      title: 'Project deleted',
      description: 'The project has been removed.',
    });
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-light text-foreground mb-2">Projects</h1>
            <p className="text-sm text-muted-foreground">
              Manage your projects and track your progress
            </p>
          </div>
          <Button onClick={handleNewProject} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-medium text-foreground mb-2">No projects yet</h2>
              <p className="text-sm text-muted-foreground mb-8">
                Create your first project to get started with organizing your tasks
              </p>
              <Button onClick={handleNewProject} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          project={editingProject}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Index;
