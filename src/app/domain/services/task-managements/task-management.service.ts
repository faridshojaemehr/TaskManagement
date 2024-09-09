import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ITask, ITasks } from '../../types/task-managements/task.interface';
import { HttpService } from '../http-service/http.service';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class TaskManagementService {
  // private _http = inject(HttpService);
  private _http = inject(HttpClient);

  /**
   * Fetches tasks from the JSON file and updates the status of each task based on its column.
   *
   * @returns An observable containing the updated tasks data with status assigned to each task.
   */
  getTasks(): Observable<ITasks> {
    const url = './assets/moke.json';
    return this._http.get<ITasks>(url).pipe();
  }

  createTask(newTask: ITask): Observable<ITasks> {
    const url = './assets/moke.json';
    return this._http.get<ITasks>(url);
  }

  updateTask(newTask: ITask): Observable<ITasks> {
    const url = './assets/moke.json';
    return this._http.get<ITasks>(url);
  }

  deleteTask(id: number, status: string): Observable<any> {
    const url = './assets/moke.json';

    return this._http.get<any>(url).pipe(
      map((response) => {
        response.tasksColumns.forEach((column) => {
          column.tasks.forEach((task) => {
            task.status = column.id;
          });
        });
        const column = response.tasksColumns.find((col) => col.id === status);

        if (!column) {
          throw new Error(`Column with status '${status}' not found.`);
        }
        column.tasks = column.tasks.filter((task) => task.id !== id);
        return response;
      })
    );
  }
}
