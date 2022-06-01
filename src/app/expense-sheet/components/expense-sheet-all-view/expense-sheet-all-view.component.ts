import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, PipeTransform, Type } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UpdateExpenseSheetDto } from 'src/app/assests-manager-common/dto/update-expense-sheet.dto';
import { ExpenseSheetSummary } from 'src/app/assests-manager-common/entity/expense-sheet-summary.entity';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'amgr-expense-sheet-all-view',
  templateUrl: './expense-sheet-all-view.component.html',
  styleUrls: ['./expense-sheet-all-view.component.scss']
})
export class ExpenseSheetAllViewComponent implements OnInit {

  @Output() selectedExpenseSheetForDetailedView = new EventEmitter<any>();
  expenseSheetsSummary$: ExpenseSheetSummary[] = [];
  filter = new FormControl('');
  loading: boolean = false;
  closeResult: string = "";

  editExpenseSheetForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    currency: new FormControl(null, [Validators.required]),
  });

  constructor(
    private expenseSheetService: ExpenseSheetService,
    private readonly toastr: ToastrService,
    pipe: DecimalPipe,
    private modalService: NgbModal,
    public modal: NgbActiveModal) {
  }
    
  ngOnInit(): void {
    this.getExpenseSheetSummary(environment.userId);
  }

  viewSelectedExpenseSheet(expenseSheetSummary: ExpenseSheetSummary){
    this.selectedExpenseSheetForDetailedView.emit(expenseSheetSummary);
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
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.deleteExpenseSheet(id);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editExpenseSheet(content: any, expenseSheet: ExpenseSheetSummary){
    this.editExpenseSheetForm.setValue({
      date: { year: expenseSheet.year, month: expenseSheet.month, day: 1 },
      currency: expenseSheet.currency,
    });
    this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result.status === 'VALID'){
        const updateExpenseSheetDto: UpdateExpenseSheetDto = {
          year: result.value.date.year,
          month: result.value.date.month,
          currency: result.value.currency
        }
        this.confirmUpdateExpenseSheet(expenseSheet._id, updateExpenseSheetDto);
      }
    }, (reason) => {
    });
  }

  private confirmUpdateExpenseSheet(expenseSheetId: string, updateExpenseSheetDto: UpdateExpenseSheetDto){
    const data = this.expenseSheetService.updateExpenseSheet(expenseSheetId, updateExpenseSheetDto);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true
        }else {
          if(result.data.updateExpenseSheet && result.data.updateExpenseSheet['__typename'] === 'ExpenseSheet'){
            this.loading = false;
            this.toastr.success('Expense Sheet Details Updated Complete', 'Expense Sheet Update');
          }else if(result.data.updateExpenseSheet && result.data.updateExpenseSheet['__typename'] === 'ExpenseSheetResultError') {
            const errorModel = result.data.updateExpenseSheet;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error('Something went wrong, Update Failed', 'Expense Sheet Update Failed');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Something went wrong, Update Failed', 'Expense Sheet Update Failed');
      }
    });
  }

  private deleteExpenseSheet(id: string){
    const deletedExpenseSheet = this.expenseSheetService.deleteExpenseSheet(id);
    deletedExpenseSheet.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.removeExpenseSheet && result.data.removeExpenseSheet['__typename'] === 'ExpenseSheet') {
            this.loading = false;
            window.location.reload();
            this.toastr.success(`Expense Sheet for ${result.data.removeExpenseSheet.month}-${result.data.removeExpenseSheet.year} deleted!`, `Expense Sheet Deletion Success`);
          }else if (result.data.removeExpenseSheet && result.data.removeExpenseSheet['__typename'] === 'ExpenseSheetResultError') {
            const errorModel = result.data.removeExpenseSheet;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot delete selected Expense sheet`, 'Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot delete selected Expense sheet`, 'Error');
      }
    })
  }

  search(text: string, pipe: PipeTransform) {
  }

  private getDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    } else {
    }
  }

}
