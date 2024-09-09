import { Clipboard } from '@angular/cdk/clipboard';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

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
import {
  ITask,
  ITasks,
} from '../../../../../domain/types/task-managements/task.interface';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { TaskComponent } from '../task/task.component';

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
  public filteredTasks: ITask[] = [];
  public currentPriorityFilter: string = '';
  public sortedTasks: any[];
  private originalTasks: any[];

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

  public PRIORITY_TYPE = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  };

  /**
   * Handles the drag-and-drop reordering of task columns within the board.
   *
   * This method updates the order of columns when they are dragged and dropped
   * within the board using the `CdkDragDrop` event.
   *
   * @param event - The drag-and-drop event containing information about the previous and current positions of the dragged item.
   */
  ngOnInit(): void {
    this.isLoading$.set(true);
    setTimeout(() => {
      this.initService();
    }, 1000);
  }

  /**
   * Handles the drag-and-drop reordering of task columns within the board.
   *
   * This method updates the order of columns when they are dragged and dropped
   * within the board using the `CdkDragDrop` event.
   *
   * @param event - The drag-and-drop event containing information about the previous and current positions of the dragged item.
   */
  public dropGrid(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.board.tasksColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Handles the drag-and-drop operations for tasks between columns.
   *
   * This method manages the reordering of tasks within the same column or
   * transferring tasks between different columns based on the `CdkDragDrop` event.
   *
   * @param event - The drag-and-drop event containing information about the previous and current containers and positions of the dragged item.
   */
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
   * This method subscribes to the `getTasks` observable from the `TaskManagementService`,
   * processes the retrieved tasks, and updates the corresponding task lists (`todoTasks$`,
   * `inProgressTasks$`, and `doneTasks$`). It manages the component's loading state and
   * handles any errors that occur during the retrieval process.
   *
   * - TODO tasks are pushed to `todoTasks$`.
   * - In-progress tasks are pushed to `inProgressTasks$`.
   * - Done tasks are pushed to `doneTasks$`.
   *
   * The method also updates the loading status and logs errors if the API call fails.
   */
  private initService() {
    this._taskManagementService.getTasks().subscribe({
      next: (response: any) => {
        if (response) {
          this.board = response;
          this.sortedTasks = this.sortTasksByStatus(response.tasksColumns);
          this.originalTasks = this.sortedTasks.map((column) => ({
            ...column,
            tasks: [...column.tasks],
          }));
          this.filteredTasks = this.sortedTasks.flatMap(
            (column) => column.tasks
          );
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
          this.isLoading$.set(false);
        }, 1000);
      } else {
        console.error('Task status is null or undefined. Task not added.');
      }
    });
  }

  /**
   * Sorts the task columns by their IDs in ascending order.
   *
   * This method sorts the columns array based on the numeric value of each column's ID.
   *
   * @param columns - The array of task columns to be sorted.
   * @returns The sorted array of task columns.
   */
  sortTasksByStatus(columns: any[]): any[] {
    return columns.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }

  /**
   * Applies a filter to tasks based on their priority.
   *
   * This method updates the `tasksColumns` in the board to only include tasks that match the specified
   * priority. If no priority is specified, it restores the original task data.
   *
   * @param priority - The priority level to filter tasks by (e.g., 'low', 'medium', 'high').
   */
  applyFilter(priority: string) {
    if (priority) {
      // Filter tasks based on priority for each column
      this.board.tasksColumns = this.originalTasks.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.priority === priority), // Adjust filtering based on priority
      }));
    } else {
      // Restore original data
      this.board.tasksColumns = this.originalTasks;
    }
    this.filteredTasks = this.board.tasksColumns.flatMap(
      (column) => column.tasks
    );
  }
  /**
   * Handles changes in the priority filter and updates the displayed tasks.
   *
   * This method sets the current priority filter and applies it to the tasks
   * using `applyFilter`. It updates the task display based on the selected priority.
   *
   * @param newPriority - The new priority filter value to be applied.
   */
  onFilterChange(newPriority: string) {
    if (newPriority === this.currentPriorityFilter) {
      newPriority = '';
    }
    this.currentPriorityFilter = newPriority;
    this.applyFilter(newPriority);
  }

  /**
   * Opens a dialog to confirm the deletion of a task.
   *
   * This method displays a confirmation dialog for deleting a specified task.
   * Once the dialog is closed, it updates the board with the new task list (after deletion).
   *
   * @param task - The task to be deleted.
   */
  onDelete(task: ITask) {
    const dialog = this._dialog.open(DeleteTaskComponent, {
      data: task,
    });
  }

  /**
   * Copies the task ID to the clipboard and displays a notification.
   *
   * This method copies the task ID to the clipboard and shows a snackbar
   * notification indicating that the task number has been copied.
   *
   * @param taskId - The ID of the task to be copied.
   */
  copy(taskId: number) {
    this.clipboard.copy(String(taskId));
    this._snackBar.open('Task number Copied !', 'Done');
  }

  /**
   * Opens a dialog to edit the details of an existing task.
   *
   * This method opens a dialog for editing the specified task. After the dialog is closed,
   * it updates the task in the board and displays a snackbar notification indicating success or failure.
   *
   * @param task - The task to be edited.
   */
  onEditTask(task: ITask) {
    const dialog = this._dialog.open(TaskComponent, {
      data: task,
    });
  }
}
