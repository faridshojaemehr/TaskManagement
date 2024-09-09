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

  onDelete() {
    this._tasksService
      .deleteTask(this.data.id, this.data.status)
      .pipe(takeUntil(this._notifier$))
      .subscribe({
        next: (response) => {
          this._dialogRef.close(response);
        },
      });
  }

  onCancel() {
    this._dialogRef.close();
  }

  ngOnDestroy(): void {
    this._notifier$.next(null);
    this._notifier$.complete();
  }
}
