import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { UpdateIncomeRecordDto } from 'src/app/assests-manager-common/dto/update-income-record.dto';
import { IncomeCategory } from 'src/app/assests-manager-common/entity/income-category.entity';
import { IncomeRecord } from 'src/app/assests-manager-common/entity/income-record.entity';
import { IncomeRecordService } from 'src/app/assests-manager-common/service/income-record.service';
import { IncomeSheetService } from 'src/app/assests-manager-common/service/income-sheet.service';
import { environment } from 'src/environments/environment';
import { TemporyIncomeRecordUpdateDto } from '../../dto/tempory-income-record-update.dto';
import { IncomeSheetSummary } from '../../entity/income-sheet-summary.entity';

type IncomeRecordType = {id: number, name: string};

@Component({
  selector: 'amgr-income-sheet-selected-view',
  templateUrl: './income-sheet-selected-view.component.html',
  styleUrls: ['./income-sheet-selected-view.component.scss']
})
export class IncomeSheetSelectedViewComponent implements OnInit, OnChanges {

  @Input() selectedMonthAndYear: any;
  @Output() isDeleteSheetButtonDisabled = new EventEmitter<boolean>();
  @Output() currentIncomeSheetInfo = new EventEmitter<object>();
  @Input() userIncomeCategories: IncomeCategory[] = [];

  incomeSheet: IncomeSheetSummary = {
    _id: '',
    month: 'N/A',
    year: 'N/A',
    totalAmount: '0.00',
    totalIncome: '0.00'
  };

  currentIncomeRecord: IncomeRecord = {
    incomeRecordId: '',
    date: 0,
    notes: '',
    amount: 0.00,
    incomeCategory: new IncomeCategory,
  };

  incomeRecords: IncomeRecord[] = [];
  loading: boolean = false;
  userId: string = environment.userId;
  currentSelectedMonth: number = DateTime.now().month;
  currentSelectedYear: number = DateTime.now().year;
  allowedMinDateRange!: NgbDateStruct;
  allowedMaxDateRange!: NgbDateStruct;
  
  public model!: IncomeRecordType;
  formatter = (state: IncomeRecordType) => state.name;
  filter = new FormControl('');
  closeResult: string = "";
  
  editIncomeRecordForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    note: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    incomeCategory: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  });
  constructor(
    private readonly incomeSheetService: IncomeSheetService,
    private readonly incomeRecordService: IncomeRecordService,
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    currencyPipe: CurrencyPipe,
    decimalPipe: DecimalPipe,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
      //Load current month and years exense sheet
      if(this.selectedMonthAndYear){
        this.getIncomeSheetForSelectedPeriod(this.userId, this.selectedMonthAndYear.month, this.selectedMonthAndYear.year, true);
      }else {
        this.getIncomeSheetForSelectedPeriod(this.userId, DateTime.now().month, DateTime.now().year, true);
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
       //Change detected on Month and Year change
       if(changes['selectedMonthAndYear']){
        const changedValues = changes['selectedMonthAndYear'].currentValue;
        if(changedValues.month !== this.currentSelectedMonth || changedValues.year !== this.currentSelectedYear){
          this.getIncomeSheetForSelectedPeriod(this.userId, changedValues.month, changedValues.year, false);
        }
      }
  }

  getIncomeSheetForSelectedPeriod(userId: string, month: number, year: number, isFirstTime?: boolean){
    const data = this.incomeSheetService.getIncomeSheetsByMonthAndYear(userId, month, year);
    data.subscribe({
      next:(result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.incomeSheetByMonthAndYear && result.data.incomeSheetByMonthAndYear['__typename'] === 'IncomeSheet'){
            this.incomeSheet = result.data.incomeSheetByMonthAndYear;
            //Setting income sheet data to the binding property
            this.incomeSheet = {
              _id: this.incomeSheet._id,
              month: this.incomeSheet.month,
              year: this.incomeSheet.year,
              totalAmount: this.incomeSheet.totalAmount,
              totalIncome: '0.00'
            }
            this.incomeRecords = result.data.incomeSheetByMonthAndYear.incomeRecords;
            this.currentSelectedMonth = result.data.incomeSheetByMonthAndYear.month;
            this.currentSelectedYear = result.data.incomeSheetByMonthAndYear.year;
            this.loading = false;
            this.currentIncomeSheetInfo.emit(this.incomeSheet);
          }else if(result.data.incomeSheetByMonthAndYear && result.data.incomeSheetByMonthAndYear['__typename'] === 'IncomeSheetResultError'){
            if(isFirstTime){
              const errorModel = result.data.incomeSheetByMonthAndYear;
              this.loading = false;
              this.isDeleteSheetButtonDisabled.emit(true);
              this.toastr.warning(`Currently you don't have income sheet created for this month`, errorModel.message);
            }else {
              const errorModel = result.data.incomeSheetByMonthAndYear;
              this.loading = false;
              this.isDeleteSheetButtonDisabled.emit(true);
              this.toastr.warning(errorModel.reason, errorModel.message);
            }
            //Reseting values
            this.incomeRecords = [];
            this.incomeSheet = {
              _id: '',
              month: 'N/A',
              year: 'N/A',
              totalAmount: '0.00',
              totalIncome: '0.00'
            };
            this.currentSelectedMonth = month;
            this.currentSelectedYear = year;
          }else{
             //Reseting values
            this.incomeRecords = [];
            this.incomeSheet = {
              _id: '',
              month: 'N/A',
              year: 'N/A',
              totalAmount: '0.00',
              totalIncome: '0.00'
            };
            this.currentSelectedMonth = month;
            this.currentSelectedYear = year;
            this.isDeleteSheetButtonDisabled.emit(true);
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot fetch Income Sheet for selected month and year`, 'Error');
          }
        }
      },
      error: (e) => {
         //Reseting values
        this.incomeRecords = [];
        this.incomeSheet = {
          _id: '',
          month: 'N/A',
          year: 'N/A',
          totalAmount: '0.00',
          totalIncome: '0.00'
        };
        this.currentSelectedMonth = month;
        this.currentSelectedYear = year;
        this.isDeleteSheetButtonDisabled.emit(false);
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot fetch Income Sheet for selected month and year`, 'Error');
      }
    });
  }

  openDeleteIncomeRecord(content: any, incomeSheetId: string, incomeRecordId: string){
    this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
        this.confirmIncomeRecordDeletion(incomeSheetId, incomeRecordId);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditIncomeRecord(content: any, incomeSheetId: string, incomeRecordId: string, incomeRecord: IncomeRecord) {
    const lastDayOfSelectedMonth = DateTime.local(Number(this.currentSelectedYear), Number(this.currentSelectedMonth)).daysInMonth;
    this.allowedMinDateRange = { year: Number(this.currentSelectedYear), month: Number(this.currentSelectedMonth), day: 1 };
    this.allowedMaxDateRange = { year: Number(this.currentSelectedYear), month: Number(this.currentSelectedMonth), day: lastDayOfSelectedMonth }
  
    this.editIncomeRecordForm.setValue({
      date: { year: this.currentSelectedYear, month: this.currentSelectedMonth, day: incomeRecord.date },
      note: incomeRecord.notes,
      IncomeCategory: incomeRecord.incomeCategory,
      amount: incomeRecord.amount
    });

    this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
        if(result.status === 'VALID'){
          const updatedRecord: TemporyIncomeRecordUpdateDto = {
            incomeSheetId: incomeSheetId,
            incomeRecordId: incomeRecordId,
            date: result.value.date,
            note: result.value.note,
            incomeCategory: result.value.incomeCategory,
            amount: result.value.amount
          }
          this.confirmIncomeRecordUpdate(updatedRecord);
        }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private confirmIncomeRecordDeletion(incomeSheetId: string, incomeRecordId: string){
    const data = this.incomeRecordService.removeIncomeRecord(incomeSheetId, incomeRecordId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.removeIncomeRecord && result.data.removeIncomeRecord['__typename'] === 'IncomeSheet' || result.data.removeIncomeRecord['__typename'] === 'IncomeRecord'){
            this.loading = false;
            this.toastr.success(`Income record deleted`, 'Income Record Deletion Success');
          }else if(result.data.removeIncomeRecord && result.data.removeIncomeRecord['__typename'] === 'IncomeSheetResultError' ){
            const errorModel = result.data.removeIncomeRecord;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.warning('Cannot delete selected income record', 'Income Record Deletion Failed');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.warning('Cannot delete selected income record', 'Income Record Deletion Failed')
      }
    })
  }

  private confirmIncomeRecordUpdate(updatedIncomeRecord: TemporyIncomeRecordUpdateDto){
    const { incomeSheetId, incomeRecordId } = updatedIncomeRecord;
    const updateIncomeRecordInput: UpdateIncomeRecordDto = {
      date: updatedIncomeRecord.date.day,
      amount: updatedIncomeRecord.amount,
      notes: updatedIncomeRecord.note,
      incomeCategory: updatedIncomeRecord.incomeCategory._id
    }
    const data = this.incomeRecordService.updateIncomeRecord(incomeSheetId, incomeRecordId, updateIncomeRecordInput);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.updateIncomeRecord && result.data.updateIncomeRecord['__typename'] === 'IncomeSheet' || result.data.updateIncomeRecord['__typename'] === 'IncomeRecord') {
            this.loading = false;
            this.toastr.success(`Income Record updated!`, `Income Record Update Complete`);
            window.location.reload();
          }else if(result.data.updateIncomeRecord && result.data.updateIncomeRecord['__typename'] === 'IncomeSheetResultError') {
            const errorModel = result.data.updateIncomeRecord;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong, Cannot update Selected Income Record`, `Income Record Update Failed`);
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong, Cannot update Selected Income Record`, `Income Record Update Failed`);
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
    map(term => this.userIncomeCategories.filter(category => new RegExp(term, 'mi').test(category.name)).slice(0, 10))
  )
}
