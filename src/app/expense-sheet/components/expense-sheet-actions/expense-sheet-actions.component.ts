import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';

@Component({
  selector: 'amgr-expense-sheet-actions',
  templateUrl: './expense-sheet-actions.component.html',
  styleUrls: ['./expense-sheet-actions.component.scss']
})
export class ExpenseSheetActionsComponent implements OnInit, OnChanges {

  @Input() isDeleteCurrentSheetDisabled: boolean = false;
  @Input() currentExpenseSheet!: any;
  currentExpenseSheetId!: string;
  loading: boolean = false;
  closeResult: string = '';

  constructor(
    private expenseSheetService: ExpenseSheetService,
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
  ) { }
  

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Change detected on current expense sheet details
    if(changes['currentExpenseSheet']){
      const changedValues = changes['currentExpenseSheet'].currentValue;
      if(changedValues?.expenseSheetId){
        this.currentExpenseSheetId = changedValues.expenseSheetId;
      }
    }
  }

  addNew(){

  }

  removeCurrentSheet(content: any){
    if(this.currentExpenseSheetId){
      this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.confirmDeletion(this.currentExpenseSheetId);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }else{
      this.toastr.warning(`Something went wrong, failed to delete expense sheet`, 'Expense Sheet Deletion Error');
    }
  }

  private confirmDeletion(id: string){
    const data = this.expenseSheetService.deleteExpenseSheet(id);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else{
          if(result.data.removeExpenseSheet && result.data.removeExpenseSheet['__typename'] === 'ExpenseSheet'){
            const deletedExpenseSheet = result.data.removeExpenseSheet;
            this.loading = false;
            window.location.reload();
            this.toastr.success(`Expense Sheet for ${deletedExpenseSheet.month} - ${deletedExpenseSheet.year} is deleted!`, `Expense Sheet Deletion`);
          }else if(result.data.removeExpenseSheet && result.data.removeExpenseSheet['__typename'] === 'ExpenseSheetResultError'){
            const errorModel = result.data.removeExpenseSheet;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else{
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot delete Expense Sheet for selected month and year`, 'Expense Sheet Deletion Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot delete Expense Sheet for selected month and year`, 'Expense Sheet Deletion Error')
      }
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
}
