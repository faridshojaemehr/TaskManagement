import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DATA } from '../../../../assets/moke';
import { IUser } from '../../types/task-managements/board.interface';
import { ITask, ITasks } from '../../types/task-managements/task.interface';
@Injectable()
export class TaskManagementService {
  private _http = inject(HttpClient);
  private _data = DATA;
  public TASK_TYPE = {
    TODO: '1',
    IN_PROGRESS: '2',
    DONE: '3',
  };

  updateData(updatedData: ITasks) {
    this._data = updatedData;
  }

  getEmployees() {
    const employees: IUser[] = [];
    this._data.tasksColumns.forEach((item, index) => {
      item.tasks.map((task) => {
        employees.push({ value: task.assignedTo, viewValue: task.assignedTo });
      });
    });
    return employees;
  }
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
    const data = this._data;
    return of(data);
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
    this.addTaskToColumn(newTask);
    return this.getTasks();
  }

  /**
   * Adds the provided task to the correct column on the project board
   * based on its status.
   *
   * The method uses a mapping between task statuses and column IDs
   * to identify the correct column to which the task should be added.
   * It then locates the column in the `tasksColumns` array and pushes
   * the task into the column's `tasks` array.
   *
   * @param {ITask} task - The task to be added to the board.
   * @private
   */
  private addTaskToColumn(task: ITask) {
    const columnMap = {
      [this.TASK_TYPE.TODO]: '1',
      [this.TASK_TYPE.IN_PROGRESS]: '2',
      [this.TASK_TYPE.DONE]: '3',
    };

    const columnId = columnMap[task.status!];

    if (columnId) {
      const column = this._data.tasksColumns.find(
        (item) => item.id === columnId
      );
      if (column) {
        column.tasks.unshift(task);
      } else {
        console.error('No matching column found for task status:', task.status);
      }
    } else {
      console.error('Invalid task status:', task.status);
    }
  }

  /**
   * Updates an existing task (not yet implemented).
   *
   * This method is intended to send a request to update an existing task with new data.
   * Currently, it retrieves the tasks data from a local JSON file (`./assets/moke.json`) but does not actually
   * perform an update operation.
   *
   * @param updateTask - The task object containing updated details for the existing task.
   * @returns An observable containing the tasks data (as if the task were updated).
   */
  updateTask(updateTask: ITask): Observable<ITasks> {
    this.updateTaskInColumn(updateTask);
    return this.getTasks();
  }

  /**
   * Updates an existing task in the correct column on the project board.
   *
   * This method retrieves the current tasks data from the server and updates
   * the specified task in the corresponding column based on its status. It handles
   * any errors if the task or column is not found.
   *
   * @param updatedTask - The task object containing updated details to be applied.
   * @returns An observable that completes once the task update operation is finished.
   * @private
   */
  private updateTaskInColumn(updatedTask: any) {
    const column = this._data.tasksColumns.find(
      (col) => col.id === updatedTask.status
    );

    if (!column) {
      throw new Error(`Column with status '${updatedTask.status}' not found.`);
    }
    const taskIndex = column.tasks.findIndex(
      (task) => task.id === updatedTask.id
    );

    if (taskIndex === -1) {
      throw new Error(
        `Task with ID '${updatedTask.id}' not found in column '${updatedTask.status}'.`
      );
    }

    column.tasks[taskIndex] = updatedTask;
    return;
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
  deleteTask(id: number, status: string) {
    const column = this._data.tasksColumns.find((col) => col.id === status);

    if (!column) {
      throw new Error(`Column with status '${status}' not found.`);
    }
    column.tasks = column.tasks.filter((task) => task.id !== id);
    return this.getTasks();
  }
}
