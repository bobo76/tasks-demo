import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICreateTask, TaskStatus } from 'src/app/common/models/task-manager.model';
import { TasksService } from 'src/app/common/services/tasks.service';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

@Component({
  selector: 'add-new-task',
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.scss']
})
export class AddNewTaskComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public addNewTaskForm!: FormGroup;
  disabled = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tasksService: TasksService
  ) { }

  ngOnInit(): void {
    this.addNewTaskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTask(): void {
    if (this.addNewTaskForm.valid) {
      const task: ICreateTask = this.addNewTaskForm.value;
      this.createTask(task);
    }
  }

  private createTask(task: ICreateTask): void {
    this.disabled = true;
    this.tasksService.createTask(task, TaskStatus.NEW)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error creating task:', error);
          this.disabled = false;
          throw error;
        })
      )
      .subscribe({
        next: () => {
          this.disabled = false;
          this.backToDashboard();
        },
        error: (error) => {
          console.error('Failed to create task:', error);
          this.disabled = false;
        }
      });
  }

  backToDashboard(): void {
    this.router.navigate(['']);
  }
}

