import { Component, Inject, OnDestroy, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TaskManagementService } from '../../../../../domain/services/task-managements/task-management.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.scss',
  providers: [TaskManagementService],
})
export class DeleteTaskComponent implements OnDestroy {
  private _dialogRef = inject(MatDialogRef<DeleteTaskComponent>);
  private _tasksService = inject(TaskManagementService);
  private _notifier$ = new Subject();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  /**
   * Deletes the current task.
   *
   * This method sends a request to the server to delete the task identified by `this.data.id` and `this.data.status`.
   * Upon successful deletion, it closes the dialog and returns the response from the server.
   *
   * The method ensures that any ongoing subscriptions are properly cleaned up by using `takeUntil(this._notifier$)`.
   */
  onDelete() {
    this._tasksService
      .deleteTask(this.data.id, this.data.status)
      .pipe(takeUntil(this._notifier$))
      .subscribe({
        next: () => {
          this._dialogRef.close();
        },
      });
  }

  /**
   * Cancels the current operation and closes the dialog.
   *
   * This method is used to close the dialog without performing any further actions, effectively canceling the operation.
   */
  onCancel() {
    this._dialogRef.close();
  }

  /**
   * Cleanup logic when the component is destroyed.
   *
   * This method completes the notifier subject to prevent memory leaks and ensure that any ongoing subscriptions are properly cleaned up.
   */
  ngOnDestroy(): void {
    this._notifier$.next(null);
    this._notifier$.complete();
  }
}
