import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Clipboard } from '@angular/cdk/clipboard';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillViewHTMLComponent } from 'ngx-quill';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TaskManagementService } from '../../../../../domain/services/task-managements/task-management.service';
import { IBoard } from '../../../../../domain/types/task-managements/board.interface';
import { TaskComponent } from '../task/task.component';
import {
  ITask,
  ITasks,
} from '../../../../../domain/types/task-managements/task.interface';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';

@Component({
  selector: 'app-tasks-borad',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    QuillViewHTMLComponent,
  ],
  templateUrl: './tasks-borad.component.html',
  styleUrl: './tasks-borad.component.scss',
})
export class TasksBoradComponent implements OnInit {
  private _taskManagementService = inject(TaskManagementService);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private clipboard = inject(Clipboard);

  public STATUS_LOADING = {
    LOADING: 1,
    SUCCESS: 2,
    ERROR: 3,
  };
  public TASK_TYPE = {
    TODO: '1',
    IN_PROGRESS: '2',
    DONE: '3',
  };
  boards: IBoard[] = [
    { value: 'kanban-0', viewValue: 'Kanban' },
    { value: 'scrum-1', viewValue: 'Scrum' },
  ];
  public status$ = new BehaviorSubject<number>(this.STATUS_LOADING.LOADING);
  public isLoading$ = signal<boolean>(false);
  public board: ITasks = {} as ITasks;

  ngOnInit(): void {
    this.isLoading$.set(true);
    setTimeout(() => {
      this.initService();
    }, 1000);
  }

  public dropGrid(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.board.tasksColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  public drop(event: CdkDragDrop<any>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  /**
   * Initializes the task management service by retrieving tasks from the server.
   *
   * This method subscribes to the `getTasks` observable, processes the retrieved tasks
   * based on their status, and updates the corresponding task lists (`todoTasks$`,
   * `inProgressTasks$`, and `doneTasks$`). It also updates the loading status and handles
   * any errors that occur during the retrieval process.
   *
   * - TODO tasks are pushed to `todoTasks$`.
   * - In-progress tasks are pushed to `inProgressTasks$`.
   * - Done tasks are pushed to `doneTasks$`.
   *
   * The method ensures that the component's loading state is properly managed
   * and that any errors during the API call are logged and handled.
   */
  private initService() {
    this._taskManagementService.getTasks().subscribe({
      next: (response: any) => {
        if (response) {
          // Loop through each task column and each task to add the 'name' property
          response.tasksColumns.forEach((column) => {
            column.tasks.forEach((task, index) => {
              task.status = column.id;
            });
          });
          this.board = response;
        }
        this.status$.next(this.STATUS_LOADING.SUCCESS);
        this.isLoading$.set(false);
      },
      error: (err) => {
        console.error('Failed to load tasks:', err);
        this.status$.next(this.STATUS_LOADING.ERROR);
        this.isLoading$.set(false);
      },
    });
  }

  /**
   * Opens a dialog to create a new task and assigns it to the appropriate column
   * on the project board based on its status (To Do, In Progress, Done).
   *
   * The dialog is displayed for the user to enter task details. After the dialog
   * is closed, the task is added to the corresponding column on the board:
   * - Tasks with status 'TODO' are added to the "To Do" column.
   * - Tasks with status 'IN_PROGRESS' are added to the "In Progress" column.
   * - Tasks with status 'DONE' are added to the "Done" column.
   *
   * A loading indicator is displayed while the task is being processed.
   * Once the task is added, the loading state is reset.
   *
   * @method onCreateTask
   */
  onCreateTask() {
    const dialog = this._dialog.open(TaskComponent);
    dialog.afterClosed().subscribe((task) => {
      if (task && task.status !== null && task.status !== undefined) {
        this.isLoading$.set(true);

        setTimeout(() => {
          this.addTaskToColumn(task);
          this.isLoading$.set(false);
        }, 1000);
      } else {
        console.error('Task status is null or undefined. Task not added.');
      }
    });
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
      const column = this.board.tasksColumns.find(
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
  onDelete(task: ITask) {
    const dialog = this._dialog.open(DeleteTaskComponent, {
      data: task,
    });
    dialog.afterClosed().subscribe((response) => {
      this.board = response;
    });
  }

  copy(taskId: number) {
    this.clipboard.copy(String(taskId));
    this._snackBar.open('Task number Copied !', 'Done');
  }

  onEditTask(task: ITask) {
    const dialog = this._dialog.open(TaskComponent, {
      data: task,
    });

    dialog.afterClosed().subscribe((updatedTask) => {
      if (updatedTask && updatedTask.status) {
        this.isLoading$.set(true);

        this.updateTaskInColumn(updatedTask).subscribe({
          next: () => {
            this.isLoading$.set(false);
            this._snackBar.open('Task updated successfully.', 'Done');

            console.log('Task updated successfully.');
          },
          error: (err) => {
            this.isLoading$.set(false);
            this._snackBar.open('Failed to update task.', 'Sorry');

            console.error('Failed to update task:', err);
          },
        });
      } else {
        console.error('Updated task status is invalid. Task not updated.');
      }
    });
  }

  private updateTaskInColumn(updatedTask: any): Observable<void> {
    return this._taskManagementService.getTasks().pipe(
      map((response) => {
        const column = response.tasksColumns.find(
          (col) => col.id === updatedTask.status
        );

        if (!column) {
          throw new Error(
            `Column with status '${updatedTask.status}' not found.`
          );
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
        this.board = response;
        return;
      })
    );
  }

  onDeleteTask(taskItem: any) {
    console.log(taskItem);
  }
}
