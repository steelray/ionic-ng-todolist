import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { CurrentTasksComponent } from './current-tasks/current-tasks.component';
import { CompletedTasksComponent } from './completed-tasks/completed-tasks.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    InfiniteScrollModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  declarations: [
    TabsPage,
    CurrentTasksComponent,
    CompletedTasksComponent,
    CreateTaskComponent
  ]
})
export class TabsPageModule { }
