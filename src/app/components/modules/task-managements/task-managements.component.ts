import { Component } from '@angular/core';
import { TasksBoradComponent } from './components/tasks-borad/tasks-borad.component';
import { TaskComponent } from './components/task/task.component';
import { TaskManagementService } from '../../../domain/services/task-managements/task-management.service';

@Component({
  selector: 'app-task-managements',
  standalone: true,
  imports: [TasksBoradComponent, TaskComponent],
  providers: [TaskManagementService],
  templateUrl: './task-managements.component.html',
  styleUrl: './task-managements.component.scss',
})
export class TaskManagementsComponent {}
