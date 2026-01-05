import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  model1 = 'new-tasks';
  model2 = 'in-progress';
  model3 = 'done';

  constructor(private http: HttpClient) { }


  allNewTasks() {
    return this.http.get(this.getNewTasks());
  }

  allInProgress() {
    return this.http.get(this.getInProgress());
  }

  allDone() {
    return this.http.get(this.getDone());
  }



  find(id: any) {
    return this.http.get(this.getNewTasksWithID(id));
  }

  createNewTask(task: any) {
    return this.http.post(this.getNewTasks(), task);
  }



  update(task: { id: any }) {
    return this.http.put(this.getNewTasksWithID(task.id), task);
  }

  deleteNewTask(id: any) {
    return this.http.delete(this.getNewTasksWithID(id))
  }



  private getNewTasks() {
    return `${BASE_URL}/${this.model1}`
  }

  private getInProgress() {
    return `${BASE_URL}/${this.model2}`
  }

  private getDone() {
    return `${BASE_URL}/${this.model3}`
  }



  private getNewTasksWithID(id: any) {
    return `${BASE_URL}/${this.model1}/${id}`
  }
}
