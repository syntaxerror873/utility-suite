import { useState } from 'react';
import { Plus, Download, Trash2, Calendar, Flag, FileText, FileImage } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  createdAt: Date;
}

const TodoGenerator = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    toast.success('Task added successfully!');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted');
  };

  const clearAllTasks = () => {
    setTasks([]);
    toast.info('All tasks cleared');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-500 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    const className = "h-3 w-3";
    switch (priority) {
      case 'high': return <Flag className={`${className} text-red-500`} />;
      case 'medium': return <Flag className={`${className} text-yellow-500`} />;
      case 'low': return <Flag className={`${className} text-green-500`} />;
      default: return <Flag className={`${className} text-gray-500`} />;
    }
  };

  const downloadAsPDF = () => {
    if (tasks.length === 0) {
      toast.error('No tasks to export');
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('To-Do List', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Tasks
    pdf.setFontSize(14);
    tasks.forEach((task, index) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = margin;
      }

      // Task number and title
      pdf.setFont('helvetica', 'bold');
      const checkbox = task.completed ? '☑' : '☐';
      const taskTitle = `${checkbox} ${index + 1}. ${task.title}`;
      pdf.text(taskTitle, margin, yPosition);
      yPosition += 8;

      // Description
      if (task.description) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const splitDescription = pdf.splitTextToSize(task.description, pageWidth - 2 * margin - 20);
        pdf.text(splitDescription, margin + 15, yPosition);
        yPosition += splitDescription.length * 4;
      }

      // Priority and due date
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      let metadata = `Priority: ${task.priority.toUpperCase()}`;
      if (task.dueDate) {
        metadata += ` | Due: ${new Date(task.dueDate).toLocaleDateString()}`;
      }
      pdf.text(metadata, margin + 15, yPosition);
      yPosition += 15;
    });

    // Statistics
    yPosition += 10;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary:', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    const stats = [
      `Total tasks: ${tasks.length}`,
      `Completed: ${completed}`,
      `Pending: ${pending}`,
      `Completion rate: ${tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}%`
    ];

    stats.forEach(stat => {
      pdf.text(stat, margin, yPosition);
      yPosition += 5;
    });

    pdf.save(`todo-list-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  const downloadAsTXT = () => {
    if (tasks.length === 0) {
      toast.error('No tasks to export');
      return;
    }

    let content = 'TO-DO LIST\n';
    content += '==========\n\n';
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    tasks.forEach((task, index) => {
      const checkbox = task.completed ? '[✓]' : '[ ]';
      content += `${checkbox} ${index + 1}. ${task.title}\n`;
      
      if (task.description) {
        content += `   Description: ${task.description}\n`;
      }
      
      content += `   Priority: ${task.priority.toUpperCase()}`;
      if (task.dueDate) {
        content += ` | Due: ${new Date(task.dueDate).toLocaleDateString()}`;
      }
      content += '\n\n';
    });

    // Statistics
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    
    content += 'SUMMARY\n';
    content += '=======\n';
    content += `Total tasks: ${tasks.length}\n`;
    content += `Completed: ${completed}\n`;
    content += `Pending: ${pending}\n`;
    content += `Completion rate: ${tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}%\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-list-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('TXT file downloaded successfully!');
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">To-Do List Generator</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Create and organize tasks with priorities and due dates
            </p>
          </div>

          {/* Add Task Form */}
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
              </div>
              
              <div className="lg:col-span-2">
                <Input
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={addTask} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Statistics */}
          {tasks.length > 0 && (
            <div className="glass-card p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-glow">{taskStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{taskStats.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{taskStats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{taskStats.high}</div>
                  <div className="text-sm text-muted-foreground">High</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{taskStats.medium}</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{taskStats.low}</div>
                  <div className="text-sm text-muted-foreground">Low</div>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          {tasks.length > 0 && (
            <div className="glass-card p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Export Options</h3>
              <div className="flex flex-wrap gap-4">
                <Button onClick={downloadAsPDF} className="btn-primary">
                  <FileImage className="h-4 w-4 mr-2" />
                  Download as PDF
                </Button>
                <Button onClick={downloadAsTXT} className="btn-glass">
                  <FileText className="h-4 w-4 mr-2" />
                  Download as TXT
                </Button>
                <Button onClick={clearAllTasks} className="btn-glass">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Tasks List */}
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="glass-card p-6 hover-lift">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1">{task.priority}</span>
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm mb-2 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div>
                          Created: {task.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => deleteTask(task.id)}
                      className="btn-glass p-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground">
                Add your first task to start organizing your work
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TodoGenerator;