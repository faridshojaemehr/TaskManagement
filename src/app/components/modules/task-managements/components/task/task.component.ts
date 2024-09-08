import { Component, Inject, OnDestroy, ViewChild, inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuillEditorComponent, QuillViewHTMLComponent } from 'ngx-quill';
import {
  IBoard,
  IPriority,
  IStatus,
  IUser,
} from '../../../../../domain/types/task-managements/board.interface';
import { TaskManagementService } from '../../../../../domain/services/task-managements/task-management.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { removeUndefinedValuesFromObject } from '../../../../../shared/utils/removeUndefined';
import { _id } from '../../../../../shared/utils/idGenerator';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    QuillViewHTMLComponent,
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
    id: new FormControl<number | unknown>(null),
    title: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    desc: new FormControl(null, Validators.required),
    assign: new FormControl({ value: null, disabled: true }),
    priority: new FormControl(null, Validators.required),
    dueDate: new FormControl({ value: null, disabled: true }),
    startDate: new FormControl({ value: null, disabled: true }),
  });

  public projects: IBoard[] = [
    { value: 'project-0', viewValue: 'project 1' },
    { value: 'project-1', viewValue: 'project 2' },
  ];
  public users: IUser[] = [
    { value: 'farid', viewValue: 'Farid SH ' },
    { value: 'saba', viewValue: 'Saba SH ' },
    { value: 'alvaro', viewValue: 'Alvaro ' },
  ];
  public priorities: IPriority[] = [
    { value: 'low', viewValue: 'Low 🕛' },
    { value: 'medium', viewValue: 'Medium 🫱🏼‍🫲🏽' },
    { value: 'height', viewValue: 'High 🚄' },
  ];
  public status: IStatus[] = [
    { value: 'todo', viewValue: 'To Do 📅' },
    { value: 'inprogress', viewValue: 'In Progress ⏳' },
    { value: 'done', viewValue: 'Done ✅' },
  ];
  private notifier$ = new Subject();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onSubmit() {
    const formValues = removeUndefinedValuesFromObject(this.taskForm.value);
    formValues['id'] = _id();
    this._tasksService
      .createTask(formValues)
      .pipe(takeUntil(this.notifier$))
      .subscribe({
        next: (value) => {
          console.log(value);
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
