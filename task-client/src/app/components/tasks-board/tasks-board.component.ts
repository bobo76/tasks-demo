import { Component, OnInit, inject, signal } from '@angular/core';
import { ICreateTask } from 'src/app/common/models/task-manager.model';
import { TasksService } from 'src/app/common/services/tasks.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule]
})
export class TasksBoardComponent implements OnInit {

  private tasksService = inject(TasksService);

  newTasks = signal<ICreateTask[]>([]);
  inProgressTasks = signal<ICreateTask[]>([]);
  doneTasks = signal<ICreateTask[]>([]);

  ngOnInit(): void {
    this.fetchAllTasks();
  }


  fetchAllTasks() {
    this.fetchNewTasks();
    this.fetchInProgressTasks();
    this.fetchDoneTasks();
  }

  fetchNewTasks() {
    this.tasksService.allNewTasks()
      .subscribe((result: any) => this.newTasks.set(result));
  }

  fetchInProgressTasks() {
    this.tasksService.allInProgress()
      .subscribe((result: any) => this.inProgressTasks.set(result));
  }

  fetchDoneTasks() {
    this.tasksService.allDone()
      .subscribe((result: any) => this.doneTasks.set(result));
  }

  deleteNewTask(newTaskId: string) {
    this.tasksService.deleteNewTask(newTaskId)
      .subscribe(() => this.fetchNewTasks());
  }

  drop(event: CdkDragDrop<ICreateTask[]>) {
    if (event.previousContainer === event.container) {
      const updatedList = [...event.container.data];
      moveItemInArray(updatedList, event.previousIndex, event.currentIndex);
      this.updateSignalFromContainer(event.container.id, updatedList);
    } else {
      const sourceList = [...event.previousContainer.data];
      const targetList = [...event.container.data];
      transferArrayItem(sourceList, targetList, event.previousIndex, event.currentIndex);

      this.updateSignalFromContainer(event.previousContainer.id, sourceList);
      this.updateSignalFromContainer(event.container.id, targetList);
    }
  }

  private updateSignalFromContainer(containerId: string, data: ICreateTask[]) {
    if (containerId.includes('newTasks')) {
      this.newTasks.set(data);
    } else if (containerId.includes('inProgress')) {
      this.inProgressTasks.set(data);
    } else if (containerId.includes('done')) {
      this.doneTasks.set(data);
    }
  }
}
