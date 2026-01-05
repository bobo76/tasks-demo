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
    this.tasksService.deleteNewTask(Number(newTaskId))
      .subscribe(() => this.fetchNewTasks());
  }

  drop(event: CdkDragDrop<ICreateTask[]>) {
    if (event.previousContainer === event.container) {
      // Reordering within same column - just update UI
      const updatedList = [...event.container.data];
      moveItemInArray(updatedList, event.previousIndex, event.currentIndex);
      this.updateSignalFromContainer(event.container.id, updatedList);
    } else {
      // Moving to different column - update status on backend
      const sourceList = [...event.previousContainer.data];
      const targetList = [...event.container.data];
      const movedTask = sourceList[event.previousIndex];

      transferArrayItem(sourceList, targetList, event.previousIndex, event.currentIndex);

      // Update UI immediately
      this.updateSignalFromContainer(event.previousContainer.id, sourceList);
      this.updateSignalFromContainer(event.container.id, targetList);

      // Determine new status based on target container
      const newStatus = this.getStatusFromContainerId(event.container.id);

      // Update task status on backend
      const updatedTask = { ...movedTask, status: newStatus };
      this.tasksService.update(Number(movedTask.id), updatedTask).subscribe({
        next: () => {
          // Successfully updated on backend
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          // Revert changes on error
          this.fetchAllTasks();
        }
      });
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

  private getStatusFromContainerId(containerId: string): string {
    if (containerId.includes('newTasks')) {
      return 'new';
    } else if (containerId.includes('inProgress')) {
      return 'in-progress';
    } else if (containerId.includes('done')) {
      return 'done';
    }
    return 'new'; // default
  }
}
