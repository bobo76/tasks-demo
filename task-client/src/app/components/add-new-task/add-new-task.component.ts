import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ICreateTask } from 'src/app/common/models/task-manager.model';
import { TasksService } from 'src/app/common/services/tasks.service';

@Component({
  selector: 'add-new-task',
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink]
})
export class AddNewTaskComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tasksService = inject(TasksService);

  public addNewTask !: FormGroup;

  ngOnInit(): void {
    this.addNewTask = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    })
  }

  addTask() {
    if (this.addNewTask.valid) {
      const newTask: ICreateTask = {
        id: '', // Backend will auto-generate
        title: this.addNewTask.value.title,
        description: this.addNewTask.value.description || '',
        status: 'new'
      };

      this.tasksService.createNewTask(newTask).subscribe({
        next: (result) => {
          console.log('Task created successfully:', result);
          this.addNewTask.reset();
          this.backToDashboard();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  backToDashboard() {
    this.router.navigate(['']);
  }

}

