import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './task-list/task-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { TasksFilterComponent } from './tasks-filter/tasks-filter.component';
import { ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [
  LogoutButtonComponent,
  TaskListComponent,
  TasksFilterComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    MatButtonModule,
    IonicModule,
    MatMenuModule,
    ReactiveFormsModule
  ],
  exports: COMPONENTS
})
export class ComponentsModule { }
