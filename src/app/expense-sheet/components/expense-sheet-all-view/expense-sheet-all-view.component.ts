import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';

@Component({
  selector: 'amgr-expense-sheet-all-view',
  templateUrl: './expense-sheet-all-view.component.html',
  styleUrls: ['./expense-sheet-all-view.component.scss']
})
export class ExpenseSheetAllViewComponent implements OnInit {

  expenseSheetsSummary$: any[] = [];
  filter = new FormControl('');
  loading: boolean = false;

  constructor(
    private expenseSheetService: ExpenseSheetService,
    private readonly toastr: ToastrService,
    pipe: DecimalPipe) {
  }

  ngOnInit(): void {
    this.getExpenseSheetSummary("chamalwr");
    console.log(this.expenseSheetsSummary$);
  }

  getExpenseSheetSummary(userId: string){
    const data = this.expenseSheetService.getAllExpenseSheetsSummary(userId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.expenseSheets && result.data.expenseSheets[0]['__typename'] === 'ExpenseSheet'){
            this.expenseSheetsSummary$ = result.data.expenseSheets;
            this.loading = false;
          }else if(result.data.expenseSheets && result.data.expenseSheets[0]['__typename'] === 'ExpenseSheetResultError'){
            const errorModel = result.data.expenseSheets[0];
            this.toastr.warning(errorModel.reason, errorModel.message);
            this.loading = false;
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot fetch all Expense Sheets`, 'Error')
          }
        }

      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot fetch all Expense Sheets`, 'Error')
      }
    })
  }

  search(text: string, pipe: PipeTransform) {
  }

}
