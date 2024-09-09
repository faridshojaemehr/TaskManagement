import { Injectable, inject } from '@angular/core';
import { ITask } from '../../types/task-managements/task.interface';
import { HttpService } from '../http-service/http.service';
@Injectable()
export class TaskManagementService {
  private _http = inject(HttpService);

  getTasks() {
    return this._http.get('tasks');
  }
  createTask(newTask: ITask) {
    return this._http.post('task', newTask);
  }
}
