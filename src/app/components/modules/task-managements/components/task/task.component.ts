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
import { ITask } from '../../../../../domain/types/task-managements/task.interface';

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
    id: new FormControl<number>(_id()),
    title: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('', Validators.required),
    desc: new FormControl<string>('', Validators.required),
    assignedTo: new FormControl<string>('', Validators.required),
    priority: new FormControl<string>('', Validators.required),
    projectname: new FormControl<string>(''),
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
    { value: '1', viewValue: 'To Do' },
    { value: '2', viewValue: 'In Progress' },
    { value: '3', viewValue: 'Done' },
  ];
  private notifier$ = new Subject();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onSubmit() {
    const formValue = this.taskForm.value;
    const newTask = {
      id: formValue.id,
      assignedTo: formValue.assignedTo,
      desc: formValue.desc,
      priority: formValue.priority,
      title: formValue.title,
      status: formValue.status,
    } as ITask;

    this._tasksService
      .createTask(newTask)
      .pipe(takeUntil(this.notifier$))
      .subscribe({
        next: (value) => {
          this._dialogRef.close(newTask);
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
