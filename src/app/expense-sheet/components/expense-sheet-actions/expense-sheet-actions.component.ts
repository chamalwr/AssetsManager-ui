import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, filter, map, Observable, OperatorFunction } from 'rxjs';
import { ExpenseCategory } from 'src/app/assests-manager-common/entity/expense-category.entity';
import { ExpenseRecordsService } from 'src/app/assests-manager-common/service/expense-records.service';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';

type ExpenseRecordType = {id: number, name: string};

@Component({
  selector: 'amgr-expense-sheet-actions',
  templateUrl: './expense-sheet-actions.component.html',
  styleUrls: ['./expense-sheet-actions.component.scss']
})
export class ExpenseSheetActionsComponent implements OnInit, OnChanges {

  @Input() isDeleteCurrentSheetDisabled: boolean = false;
  @Input() currentExpenseSheet!: any;
  @Input() userExpenseCategories: ExpenseCategory[] = [];
  currentExpenseSheetId!: string;
  allowedMinDateRange!: NgbDateStruct;
  allowedMaxDateRange!: NgbDateStruct;

  loading: boolean = false;
  public model!: ExpenseRecordType;
  addExpenseRecordForm!: FormGroup;

  formatter = (state: ExpenseRecordType) => state.name;
  filter = new FormControl('');
  closeResult: string = '';

  expenseRecordCreateForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    note: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    expenseCategory: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  });

  constructor(
    private readonly expenseSheetService: ExpenseSheetService,
    private readonly expenseRecordService: ExpenseRecordsService,
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
      if(changedValues?._id){
        this.currentExpenseSheetId = changedValues._id;
        const lastDayOfSelectedMonth = DateTime.local(Number(changedValues.year), Number(changedValues.month)).daysInMonth;
        this.allowedMinDateRange = { year: Number(changedValues.year), month: Number(changedValues.month), day: 1}
        this.allowedMaxDateRange = { year: Number(changedValues.year), month: Number(changedValues.month), day: lastDayOfSelectedMonth};
      }
    }
  }

  addNewExpenseRecord(content: any){
    if(this.currentExpenseSheetId){
      this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'})
      .result.then((result) => {
        if(result.status === 'VALID'){
          //Selected month and year is in range of expense sheets month and year
          if(result.value.date.month === this.currentExpenseSheet.month && result.value.date.year === this.currentExpenseSheet.year){
            const newExpenseRecordDto = {
              date: result.value.date.day,
              notes: result.value.note,
              amount: Number(result.value.amount),
              expenseCategory: result.value.expenseCategory._id,
            }
           this.confirmAddingNewExpenseRecord(this.currentExpenseSheetId, newExpenseRecordDto);
          }
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
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

  private confirmAddingNewExpenseRecord(expenseSheetId: string, expenseRecordDto: any){
    const data = this.expenseRecordService.createExpenseRecord(expenseSheetId, expenseRecordDto);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.createExpenseRecord && result.data.createExpenseRecord['__typename'] === 'ExpenseRecord') {
            const createdExpenseRecord = result.data.createExpenseRecord;
            this.loading = false;
            this.toastr.success(`Expense record for ${createdExpenseRecord.notes} is created`, `Expense Record Created`);
            setInterval(() => {
              window.location.reload();
            }, 2000);
          }else if(result.data.createExpenseRecord && result.data.createExpenseRecord['__typename'] === 'ExpenseRecord' ) {
            const errorModel = result.data.createExpenseRecord;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong. Cannot create expense record`, `Expense Record Creation Failed`);
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong. Cannot create expense record`, `Expense Record Creation Failed`);
      }
    })
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
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    } else {
    }
  }

  search: OperatorFunction<string, readonly {_id: string, name: string}[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.userExpenseCategories.filter(category => new RegExp(term, 'mi').test(category.name)).slice(0, 10))
  )
}
