import { Injectable, inject } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { ITask } from '../../types/task-managements/task.interface';

@Injectable()
export class TaskManagementService {
  private _http = inject(HttpService);

  getTasks() {
    return this._http.get('tasks');
  }
  createTask(params: any) {
    return this._http.post('tasks', params);
  }
}
