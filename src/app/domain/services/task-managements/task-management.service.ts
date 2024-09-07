import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { ITask } from '../../types/task-managements/task.interface';

@Injectable()
export class TaskManagementService extends HttpService {
  // private _http = inject(HttpClient);
  constructor() {
    super();
  }

  getTasks() {
    return this.get('tasks');
  }
}
