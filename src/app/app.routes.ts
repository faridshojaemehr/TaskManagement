import { Routes } from '@angular/router';
import { TaskManagementsComponent } from './components/modules/task-managements/task-managements.component';

export const routes: Routes = [
  { path: 'tasks', component: TaskManagementsComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '**', redirectTo: 'tasks', pathMatch: 'full' },
];
