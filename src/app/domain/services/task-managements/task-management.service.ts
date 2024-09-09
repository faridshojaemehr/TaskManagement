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
   * Fetches tasks from a local JSON file.
   *
   * This method retrieves the tasks data from a specified JSON file (`./assets/moke.json`).
   * The data includes various task columns and their associated tasks.
   * The status of each task is updated based on the column it belongs to.
   *
   * @returns An observable containing the tasks data with updated status information for each task.
   */
  getTasks(): Observable<ITasks> {
    const url = './assets/moke.json';
    return this._http.get<ITasks>(url).pipe();
  }

  /**
   * Creates a new task (not yet implemented).
   *
   * This method is intended to send a request to create a new task and update the task data accordingly.
   * Currently, it retrieves the tasks data from a local JSON file (`./assets/moke.json`) but does not actually
   * perform a creation operation.
   *
   * @param newTask - The task object containing details of the new task to be created.
   * @returns An observable containing the tasks data (as if the new task were created).
   */
  createTask(newTask: ITask): Observable<ITasks> {
    const url = './assets/moke.json';
    return this._http.get<ITasks>(url);
  }

  /**
   * Updates an existing task (not yet implemented).
   *
   * This method is intended to send a request to update an existing task with new data.
   * Currently, it retrieves the tasks data from a local JSON file (`./assets/moke.json`) but does not actually
   * perform an update operation.
   *
   * @param newTask - The task object containing updated details for the existing task.
   * @returns An observable containing the tasks data (as if the task were updated).
   */
  updateTask(newTask: ITask): Observable<ITasks> {
    const url = './assets/moke.json';
    return this._http.get<ITasks>(url);
  }

  /**
   * Deletes a task from the specified column.
   *
   * This method retrieves the tasks data from a local JSON file (`./assets/moke.json`) and then updates the data
   * by removing the task with the given `id` from the column with the specified `status`.
   * It maps over the tasks columns to ensure that each task has the correct status and then filters out the task
   * with the matching `id` from the identified column.
   *
   * @param id - The ID of the task to be deleted.
   * @param status - The status of the column from which the task should be removed.
   * @returns An observable containing the updated tasks data with the specified task removed.
   */
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
