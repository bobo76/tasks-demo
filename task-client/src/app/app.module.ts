import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddNewTaskComponent } from './components/add-new-task/add-new-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksBoardComponent } from './components/tasks-board/tasks-board.component';
import { TasksService } from './common/services/tasks.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({ declarations: [
        AppComponent,
        NavbarComponent,
        AddNewTaskComponent,
        TasksBoardComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule], providers: [TasksService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
