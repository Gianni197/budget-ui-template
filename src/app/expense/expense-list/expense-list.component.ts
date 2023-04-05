import { Component, OnDestroy, OnInit } from '@angular/core';
import { addMonths, set } from 'date-fns';
import { ModalController } from '@ionic/angular';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { Expense } from '../../shared/domain';
import { save } from 'ionicons/icons';

  @Component({
  selector: 'app-expense-overview',
    templateUrl: './expense-list.component.html',
})
export class ExpenseListComponent {
  date = set(new Date(), { date: 1 });

constructor(private readonly modalCtrl: ModalController) {}

  addMonths = (number: number): void => {
  this.date = addMonths(this.date, number);
  };
    categories: any;
    expenseForm: any;

  async openModal(expense?: Expense): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ExpenseModalComponent,
      componentProps: { expense: expense ? { ...expense } : {} },
    });
    modal.present();
    const { role } = await modal.onWillDismiss();
    console.log('role', role);
  }

  cancel() {

  }

  save() {

  }
}


