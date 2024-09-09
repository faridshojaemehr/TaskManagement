import { Injectable, inject } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { ITask } from '../../types/task-managements/task.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TaskManagementService {
  // private _http = inject(HttpService);
  private _http = inject(HttpClient);

  getTasks() {
    // return this._http.get('tasks');
    return this._http.get('./assets/moke.json');
  }
  createTask(params: any) {
    return this._http.post('tasks', params);
  }
}
