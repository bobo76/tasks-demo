import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewTaskComponent } from './components/add-new-task/add-new-task.component';
import { TasksBoardComponent } from './components/tasks-board/tasks-board.component';

const routes: Routes = [
  { path: '', component: TasksBoardComponent },
  { path: 'add-new-task', component: AddNewTaskComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
