import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ICreateTask } from 'src/app/common/models/task-manager.model';
import { TasksService } from 'src/app/common/services/tasks.service';

const emptyTask: ICreateTask = {
  id: '',
  title: '',
  description: '',
  status: 'new'
}

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

  task: ICreateTask = emptyTask;
  public addNewTask !: FormGroup;

  ngOnInit(): void {
    this.addNewTask = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    })
  }


  fetchNewTasks() {
    this.tasksService.allNewTasks()
      .subscribe((result: any) => this.newTasks = result)
  }

  addTask(task: ICreateTask) {
    // console.log(this.addNewTask.value)
    this.task = this.addNewTask.value;
    this.createTask(task);
    console.log(task, 'task added');
    this.backToDashboard();
    // this.addNewTask.reset();
  }

  createTask(task: ICreateTask) {
    this.tasksService.createNewTask(this.task)
      .subscribe((result: any) => this.fetchNewTasks());
  }

  backToDashboard() {
    this.router.navigate(['']);
  }

}

