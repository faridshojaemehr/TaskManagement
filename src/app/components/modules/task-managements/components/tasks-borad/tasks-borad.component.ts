import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject } from 'rxjs';
import { TaskManagementService } from '../../../../../domain/services/task-managements/task-management.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IBoard } from '../../../../../domain/types/task-managements/board.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskComponent } from '../task/task.component';
import { ITask } from '../../../../../domain/types/task-managements/task.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
  templateUrl: './tasks-borad.component.html',
  styleUrl: './tasks-borad.component.scss',
})
export class TasksBoradComponent implements OnInit {
  private _taskManagementService = inject(TaskManagementService);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  public todoTasks$ = new BehaviorSubject<ITask[]>([]);
  public inProgressTasks$ = new BehaviorSubject<ITask[]>([]);
  public doneTasks$ = new BehaviorSubject<ITask[]>([]);
  public STATUS_LOADING = {
    LOADING: 1,
    SUCCESS: 2,
    ERROR: 3,
  };
  public TASK_TYPE = {
    TODO: 'todo',
    IN_PROGRESS: 'inprogress',
    DONE: 'done',
  };
  boards: IBoard[] = [
    { value: 'kanban-0', viewValue: 'Kanban' },
    { value: 'scrum-1', viewValue: 'Scrum' },
  ];
  public status$ = new BehaviorSubject<number>(this.STATUS_LOADING.LOADING);
  public isLoading$ = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoading$.set(true);
    setTimeout(() => {
      this.initService();
    }, 1000);
  }

  drop(event: CdkDragDrop<string[]>) {
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
      next: (response: ITask[] | null) => {
        if (response) {
          const todoTasks: ITask[] = [];
          const inProgressTasks: ITask[] = [];
          const doneTasks: ITask[] = [];

          response.forEach((item) => {
            switch (item.status) {
              case this.TASK_TYPE.TODO:
                todoTasks.push(item);
                break;
              case this.TASK_TYPE.IN_PROGRESS:
                inProgressTasks.push(item);
                break;
              case this.TASK_TYPE.DONE:
                doneTasks.push(item);
                break;
              default:
                break;
            }
          });

          this.todoTasks$.next(todoTasks);
          this.inProgressTasks$.next(inProgressTasks);
          this.doneTasks$.next(doneTasks);
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
  onCreateTask() {
    const dialog = this._dialog.open(TaskComponent);
    dialog.afterClosed().subscribe((value) => {
      console.log(value);
    });
  }

  copy(taskId: number) {
    console.log(taskId);
    this._snackBar.open('Task number Copied !', 'Done');
  }
  onEditTask() {}
  onDeleteTask(taskItem: any) {
    console.log(taskItem);
  }
}
