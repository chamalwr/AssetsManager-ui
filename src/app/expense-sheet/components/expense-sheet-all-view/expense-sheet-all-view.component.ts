import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
  closeResult = "";

  constructor(
    private expenseSheetService: ExpenseSheetService,
    private readonly toastr: ToastrService,
    pipe: DecimalPipe,
    private modalService: NgbModal,
    public modal: NgbActiveModal) {
  }
    
  ngOnInit(): void {
    this.getExpenseSheetSummary("chamalwr");
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

  deleteExpenseSheetConfirmation(id: string, content: any){
    console.log(id);
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(`Clicked Ok! - Closed with: ${result}`);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
      console.log('by pressing ESC');
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log('by clicking on a backdrop')
    } else {
      console.log(`with: ${reason}`);
    }
  }

  deleteExpenseSheet(id: string){
  }

  search(text: string, pipe: PipeTransform) {
  }

}
