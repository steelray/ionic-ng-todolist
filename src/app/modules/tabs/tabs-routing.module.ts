import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletedTasksComponent } from './completed-tasks/completed-tasks.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { CurrentTasksComponent } from './current-tasks/current-tasks.component';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'current',
        component: CurrentTasksComponent
      },
      {
        path: 'completed',
        component: CompletedTasksComponent
      },
      {
        path: 'create',
        component: CreateTaskComponent
      },
      {
        path: '',
        redirectTo: '/tabs/current',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/current',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
