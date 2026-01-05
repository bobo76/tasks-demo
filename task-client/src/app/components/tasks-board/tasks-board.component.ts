import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ICreateTask } from 'src/app/common/models/task-manager.model';
import { TasksService } from 'src/app/common/services/tasks.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { concatMap, startWith, Subject } from 'rxjs';

@Component({
  selector: 'tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss']
})
export class TasksBoardComponent implements OnInit, AfterViewInit {

  columns: any = [];
  column: any;

  tasks: any = [];
  task: any;

  newTasks: ICreateTask[] = [];
  inProgressTasks: ICreateTask[] = [];
  doneTasks: ICreateTask[] = [];

  newTask !: Task;
  constructor(private tasksService: TasksService) {
    this.fetchAllTasks();
    this.fetchNewTasks();
  }

  ngOnInit(): void {
    this.fetchAllTasks()
    this.fetchNewTasks();

  }

  ngAfterViewInit(): void {
    this.fetchNewTasks();
  }

  private readonly addTask$ = new Subject();

  newTasks$ = this.addTask$.pipe(
    startWith(''),
    concatMap(() => {
      return this.tasksService.allNewTasks();
    })
  )


  async fetchAllTasks() {
    this.fetchNewTasks();
    this.fetchInProgressTasks();
    this.fetchDoneTasks();

  }

  async fetchNewTasks() {
    this.tasksService.allNewTasks()
      .subscribe((result: any) => this.newTasks = result);
  }

  async fetchInProgressTasks() {
    this.tasksService.allInProgress()
      .subscribe((result: any) => this.inProgressTasks = result);
  }

  async fetchDoneTasks() {
    this.tasksService.allDone()
      .subscribe((result: any) => this.doneTasks = result);
  }


  async deleteNewTask(newTaskId: string) {

    this.tasksService.deleteNewTask(newTaskId)
      .subscribe((result: any) => this.fetchNewTasks());

    console.log("DELETE TASK", newTaskId)
  }

  updateNewTasks() {

  }

  updateInProgressTasks() {

  }

  updateDoneTasks() {

  }

  drop(event: CdkDragDrop<ICreateTask[]>) {
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
        event.currentIndex,
      );
    }

    // this.addTask$;

  }

  // createTask(task: ICreateTask) {
  //   this.tasksService.createNewTask(this.task)
  //     .subscribe(result => this.fetchAllTasks());
  // }
}
