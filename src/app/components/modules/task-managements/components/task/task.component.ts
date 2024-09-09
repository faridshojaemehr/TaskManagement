import { Component, Inject, OnDestroy, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuillEditorComponent } from 'ngx-quill';
import { Subject, takeUntil } from 'rxjs';
import { TaskManagementService } from '../../../../../domain/services/task-managements/task-management.service';
import {
  IBoard,
  IPriority,
  IStatus,
  IUser,
} from '../../../../../domain/types/task-managements/board.interface';
import { _id } from '../../../../../shared/utils/idGenerator';
import { removeUndefinedValuesFromObject } from '../../../../../shared/utils/removeUndefined';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    QuillEditorComponent,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [provideNativeDateAdapter(), TaskManagementService],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnDestroy {
  private _dialogRef = inject(MatDialogRef<TaskComponent>);
  private _tasksService = inject(TaskManagementService);
  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;

  public taskForm = new FormGroup({
    id: new FormControl(),
    title: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    desc: new FormControl(null, Validators.required),
    assignedTo: new FormControl(null, Validators.required),
    priority: new FormControl(null, Validators.required),
    dueDate: new FormControl({ value: null, disabled: false }),
    startDate: new FormControl({ value: null, disabled: false }),
  });

  public projects: IBoard[] = [
    { value: 'project-0', viewValue: 'project 1' },
    { value: 'project-1', viewValue: 'project 2' },
  ];
  public users: IUser[] = [
    { value: 'farid', viewValue: 'Farid' },
    { value: 'saba', viewValue: 'Saba' },
    { value: 'alvaro', viewValue: 'Alvaro' },
  ];
  public priorities: IPriority[] = [
    { value: 'low', viewValue: 'Low ' },
    {
      value: 'medium',
      viewValue: 'Medium  ',
    },
    { value: 'high', viewValue: 'High' },
  ];
  public status: IStatus[] = [
    { value: 'todo', viewValue: 'ToDo' },
    { value: 'inprogress', viewValue: 'InProgress' },
    { value: 'done', viewValue: 'Done' },
  ];
  private notifier$ = new Subject();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onSubmit() {
    this.taskForm.get('id')?.setValue(_id());
    const formValues = removeUndefinedValuesFromObject(this.taskForm.value);
    this._tasksService
      .createTask(formValues)
      .pipe(takeUntil(this.notifier$))
      .subscribe({
        next: (value) => {
          this._dialogRef.close(value);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
}
