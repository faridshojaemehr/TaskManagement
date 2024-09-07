import { Component } from '@angular/core';
import { TasksBoradComponent } from './components/tasks-borad/tasks-borad.component';
import { TaskComponent } from './components/task/task.component';

@Component({
  selector: 'app-task-managements',
  standalone: true,
  imports: [TasksBoradComponent, TaskComponent],
  templateUrl: './task-managements.component.html',
  styleUrl: './task-managements.component.scss',
})
export class TaskManagementsComponent {}
