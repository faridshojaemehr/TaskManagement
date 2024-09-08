import { Component, Inject, ViewChild, inject } from '@angular/core';
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
import { IBoard } from '../../../../../domain/types/task-managements/board.interface';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    QuillViewHTMLComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  private _dialogRef = inject(MatDialogRef<TaskComponent>);
  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;
  desc: any = '';
  public projects: IBoard[] = [
    { value: 'project-0', viewValue: 'project 1' },
    { value: 'project-1', viewValue: 'project 2' },
  ];
  public users: IBoard[] = [
    { value: 'farid', viewValue: 'Farid SH' },
    { value: 'saba', viewValue: 'Saba SH' },
    { value: 'alvaro', viewValue: 'Alvaro ' },
  ];
  public priorities: IBoard[] = [
    { value: 'medium', viewValue: 'Medium' },
    { value: 'height', viewValue: 'Height ' },
  ];
  public status = [
    { value: 'todo', viewValue: 'To Do' },
    { value: 'inprogress', viewValue: 'In Progress ' },
    { value: 'done', viewValue: 'Done ' },
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
