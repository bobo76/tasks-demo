import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ITask, ICreateTask, TaskStatus } from '../models/task-manager.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient) { }

  getAllTasksByStatus(status: TaskStatus): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${BASE_URL}/${status}`);
  }

  getTaskById(id: string, status: TaskStatus): Observable<ITask> {
    return this.http.get<ITask>(`${BASE_URL}/${status}/${id}`);
  }

  createTask(task: ICreateTask, status: TaskStatus = TaskStatus.NEW): Observable<ITask> {
    return this.http.post<ITask>(`${BASE_URL}/${status}`, task);
  }

  updateTask(task: ITask, status: TaskStatus): Observable<ITask> {
    return this.http.put<ITask>(`${BASE_URL}/${status}/${task.id}`, task);
  }

  deleteTask(id: string, status: TaskStatus): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${status}/${id}`);
  }

  moveTask(task: ITask, fromStatus: TaskStatus, toStatus: TaskStatus): Observable<ITask> {
    return this.http.delete<void>(`${BASE_URL}/${fromStatus}/${task.id}`)
      .pipe(
        switchMap(() => this.http.post<ITask>(`${BASE_URL}/${toStatus}`, {
          title: task.title,
          description: task.description
        }))
      );
  }
}
