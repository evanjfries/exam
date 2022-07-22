import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Survey} from 'survey-angular';

@Component({
  selector: 'app-withdraw-dialog[activeModal]',
  templateUrl: './withdraw-dialog.component.html'
})
export class WithdrawDialogComponent {

  @Input() survey?: Survey;
  @Input() activeModal!: NgbActiveModal;

  constructor() {
  }

  withdraw(): void {
    this.survey?.setValue('has_withdrawn', 'true');
    this.survey?.doComplete();
    this.activeModal.close();
  }

}
