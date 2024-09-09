import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
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
export class TaskComponent implements OnInit, OnDestroy {
  private _dialogRef = inject(MatDialogRef<TaskComponent>);
  private _tasksService = inject(TaskManagementService);
  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;

  public taskForm: FormGroup;

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
  public isEditMode$ = signal<boolean>(false);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (this.data) {
      this.initForm(this.data);
      this.isEditMode$.set(true);
    } else {
      this.initForm(null);
      this.isEditMode$.set(false);
    }
  }

  /**
   * Initializes the task form with default values and validation rules.
   * If `formValue` is provided (e.g., when editing an existing task),
   * it pre-populates the form with the provided data.
   *
   * @param formValue - An object containing the existing task data to populate the form, or `null` for a new task.
   */
  private initForm(formValue) {
    this.taskForm = new FormGroup({
      id: new FormControl(_id() || formValue.id),
      title: new FormControl('' || formValue?.title, Validators.required),
      status: new FormControl('' || formValue?.status, Validators.required),
      desc: new FormControl('' || formValue?.desc, Validators.required),
      assignedTo: new FormControl(
        '' || formValue?.assignedTo,
        Validators.required
      ),
      priority: new FormControl('' || formValue?.priority, Validators.required),
      projectname: new FormControl(''),
    });
  }

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

  onUpadte() {
    const formValue = this.taskForm.value;
    const newTask = {
      id: this.data?.id,
      assignedTo: formValue.assignedTo,
      desc: formValue.desc,
      priority: formValue.priority,
      title: formValue.title,
      status: formValue.status,
    } as ITask;

    this._tasksService
      .updateTask(newTask)
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

  // Cleanup logic on component destruction
  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
}
