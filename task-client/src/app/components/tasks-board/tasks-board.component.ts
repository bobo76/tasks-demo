import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITask, TaskStatus } from 'src/app/common/models/task-manager.model';
import { TasksService } from 'src/app/common/services/tasks.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

@Component({
  selector: 'tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss']
})
export class TasksBoardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  newTasks: ITask[] = [];
  inProgressTasks: ITask[] = [];
  doneTasks: ITask[] = [];

  readonly TaskStatus = TaskStatus;

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.fetchAllTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchAllTasks(): void {
    forkJoin({
      newTasks: this.tasksService.getAllTasksByStatus(TaskStatus.NEW),
      inProgressTasks: this.tasksService.getAllTasksByStatus(TaskStatus.IN_PROGRESS),
      doneTasks: this.tasksService.getAllTasksByStatus(TaskStatus.DONE)
    }).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        throw error;
      })
    ).subscribe({
      next: (result) => {
        this.newTasks = result.newTasks;
        this.inProgressTasks = result.inProgressTasks;
        this.doneTasks = result.doneTasks;
      },
      error: (error) => {
        console.error('Failed to load tasks:', error);
      }
    });
  }

  deleteTask(taskId: string, status: TaskStatus): void {
    this.tasksService.deleteTask(taskId, status)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error deleting task:', error);
          throw error;
        })
      )
      .subscribe({
        next: () => this.fetchAllTasks(),
        error: (error) => console.error('Failed to delete task:', error)
      });
  }

  drop(event: CdkDragDrop<ITask[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const fromStatus = this.getStatusFromContainer(event.previousContainer.id);
      const toStatus = this.getStatusFromContainer(event.container.id);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (fromStatus && toStatus) {
        this.tasksService.moveTask(task, fromStatus, toStatus)
          .pipe(
            takeUntil(this.destroy$),
            catchError(error => {
              console.error('Error moving task:', error);
              this.fetchAllTasks();
              throw error;
            })
          )
          .subscribe({
            error: (error) => console.error('Failed to move task:', error)
          });
      }
    }
  }

  private getStatusFromContainer(containerId: string): TaskStatus | null {
    if (containerId.includes('new')) return TaskStatus.NEW;
    if (containerId.includes('inProgress')) return TaskStatus.IN_PROGRESS;
    if (containerId.includes('done')) return TaskStatus.DONE;
    return null;
  }
}
