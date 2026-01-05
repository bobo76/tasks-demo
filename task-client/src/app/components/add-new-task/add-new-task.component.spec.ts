import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AddNewTaskComponent } from './add-new-task.component';
import { TasksService } from 'src/app/common/services/tasks.service';

describe('AddNewTaskComponent', () => {
  let component: AddNewTaskComponent;
  let fixture: ComponentFixture<AddNewTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTaskComponent ],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      providers: [TasksService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
