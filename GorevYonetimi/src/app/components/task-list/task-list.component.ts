import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  editingTaskId: number | null = null;
  editTitle: string = '';
  editDescription: string = '';
  progress: number = 0;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next:(data)=> {this.tasks=data,this.updateProgress();},
      error:(err)=> console.error('Görevler alınırken hata oluştu', err)
    });
}

  updateProgress(): void {
    if (this.tasks.length === 0) {
      this.progress = 0;
      return;
    }

    const completed = this.tasks.filter(t => t.isCompleted).length;
    this.progress = Math.round((completed / this.tasks.length) * 100);
  }

  addTask():void{
    if(!this.newTaskTitle) return;

    const task: Task={
      title:this.newTaskTitle,
      description:this.newTaskDescription
    };

    this.taskService.addTask(task).subscribe({
      next:()=> {
        this.loadTasks();
        this.newTaskTitle='';
        this.newTaskDescription='';
      },
      error:(err)=> console.error('Görev eklenirken hata oluştu', err)
    });
  }

  deleteTask(id?:number):void{
    if(!id) return;
    this.taskService.deleteTask(id).subscribe({
      next:()=> this.loadTasks(),
      error:(err)=> console.error('Görev silinirken hata oluştu', err)
    });
  }

  toggleComplete(task: Task): void {
      if (!task.id) return;

      this.taskService.updateTask(task.id, { ...task, isCompleted: !task.isCompleted }).subscribe({
        next: () => {this.loadTasks(),this.updateProgress();},
        error: (err) => console.error('Görev güncellenirken hata oluştu', err),
      });
    }

  startEditing(task: Task): void {
    this.editingTaskId = task.id || null;
    this.editTitle = task.title;
    this.editDescription = task.description || '';
  }

  saveEdit(task: Task): void {
    if (!task.id) return;

    const updatedTask = {
      ...task,
      title: this.editTitle,
      description: this.editDescription,
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.editingTaskId = null;
        this.loadTasks();
      },
      error: (err) => console.error('Görev düzenlenirken hata oluştu', err),
    });
  }

  cancelEdit(): void {
    this.editingTaskId = null;
  }
}