import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TasksBoardComponent } from './tasks-board.component';
import { TasksService } from 'src/app/common/services/tasks.service';

describe('TasksBoardComponent', () => {
  let component: TasksBoardComponent;
  let fixture: ComponentFixture<TasksBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksBoardComponent],
      imports: [HttpClientTestingModule, DragDropModule],
      providers: [TasksService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
