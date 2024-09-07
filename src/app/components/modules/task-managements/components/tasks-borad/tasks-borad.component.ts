import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-tasks-borad',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './tasks-borad.component.html',
  styleUrl: './tasks-borad.component.scss',
})
export class TasksBoradComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  inProgress = ['Get to work', 'Pick up groceries'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);

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

  onDeleteTask(taskItem: any) {
    console.log(taskItem);
  }
}
