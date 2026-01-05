import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateTask } from '../models/task-manager.model';

const BASE_URL = 'http://localhost:8090/api';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) { }

  // Get all tasks
  getAllTasks(): Observable<ICreateTask[]> {
    return this.http.get<ICreateTask[]>(`${BASE_URL}/tasks`);
  }

  // Get tasks by status
  getTasksByStatus(status: string): Observable<ICreateTask[]> {
    return this.http.get<ICreateTask[]>(`${BASE_URL}/tasks?status=${status}`);
  }

  // Get tasks for "New Tasks" column
  allNewTasks(): Observable<ICreateTask[]> {
    return this.getTasksByStatus('new');
  }

  // Get tasks for "In Progress" column
  allInProgress(): Observable<ICreateTask[]> {
    return this.getTasksByStatus('in-progress');
  }

  // Get tasks for "Done" column
  allDone(): Observable<ICreateTask[]> {
    return this.getTasksByStatus('done');
  }

  // Get task by ID
  find(id: number): Observable<ICreateTask> {
    return this.http.get<ICreateTask>(`${BASE_URL}/tasks/${id}`);
  }

  // Create new task
  createNewTask(task: ICreateTask): Observable<ICreateTask> {
    return this.http.post<ICreateTask>(`${BASE_URL}/tasks`, task);
  }

  // Update task
  update(id: number, task: ICreateTask): Observable<ICreateTask> {
    return this.http.put<ICreateTask>(`${BASE_URL}/tasks/${id}`, task);
  }

  // Delete task
  deleteNewTask(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/tasks/${id}`);
  }
}
