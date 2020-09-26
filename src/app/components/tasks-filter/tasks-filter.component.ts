import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tasks-filter',
  templateUrl: './tasks-filter.component.html',
  styleUrls: ['./tasks-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksFilterComponent {
  @Input() form: FormGroup;

  constructor(
    private modalController: ModalController
  ) { }


  get controls() {
    return this.form.controls;
  }

  dismiss(apply = false) {
    this.modalController.dismiss(apply);
  }

  resetFilter() {

    for (const key of Object.keys(this.controls)) {
      if (key !== 'title') {
        this.controls[key].reset();
      }
    }
    this.dismiss(true);
  }

}
