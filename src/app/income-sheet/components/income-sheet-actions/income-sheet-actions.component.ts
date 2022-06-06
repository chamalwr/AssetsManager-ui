import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { CreateIncomeRecordDto } from 'src/app/assests-manager-common/dto/create-income-record.dto';
import { IncomeCategory } from 'src/app/assests-manager-common/entity/income-category.entity';
import { IncomeRecordService } from 'src/app/assests-manager-common/service/income-record.service';
import { IncomeSheetService } from 'src/app/assests-manager-common/service/income-sheet.service';

type IncomeRecordType = {id: number, name: string};

@Component({
  selector: 'amgr-income-sheet-actions',
  templateUrl: './income-sheet-actions.component.html',
  styleUrls: ['./income-sheet-actions.component.scss']
})
export class IncomeSheetActionsComponent implements OnInit, OnChanges {

  @Input() isDeleteCurrentSheetDisabled: boolean = false;
  @Input() currentIncomeSheet!: any;
  @Input() userIncomeCategories: IncomeCategory[] = [];
  currentIncomeSheetId!: string;
  allowedMinDateRange!: NgbDateStruct;
  allowedMaxDateRange!: NgbDateStruct;

  loading: boolean = false;
  public model!: IncomeRecordType;
  addIncomeRecordForm!: FormGroup;

  formatter = (state: IncomeRecordType) => state.name;
  filter = new FormControl('');
  closeResult: string = '';

  incomeRecordCreateForm = new FormGroup({
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
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Change detected on current income sheet details
    if(changes['currentIncomeSheet']){
      const changedValues = changes['currentIncomeSheet'].currentValue;
      if(changedValues?._id){
        this.currentIncomeSheetId = changedValues._id;
        const lastDayOfSelectedMonth = DateTime.local(Number(changedValues.year), Number(changedValues.month)).daysInMonth;
        this.allowedMinDateRange = { year: Number(changedValues.year), month: Number(changedValues.month), day: 1}
        this.allowedMaxDateRange = { year: Number(changedValues.year), month: Number(changedValues.month), day: lastDayOfSelectedMonth};
      }
    }
  }

  addNewIncomeRecord(addIncomeRecordModal: any){
    console.log(this.currentIncomeSheetId);
    if(this.currentIncomeSheetId){
      this.modalService.open(addIncomeRecordModal, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'})
      .result.then((result) => {
        if(result.status === 'VALID'){
          //Selected month and year is in range of income sheets month and year
          if(result.value.date.month === this.currentIncomeSheet.month && result.value.date.year === this.currentIncomeSheet.year){
            const newIncomeRecordDto: CreateIncomeRecordDto = {
              date: result.value.date.day,
              notes: result.value.note,
              amount: Number(result.value.amount),
              incomeCategory: result.value.incomeCategory._id,
            }
           this.confirmAddingNewIncomeRecord(this.currentIncomeSheetId, newIncomeRecordDto);
          }
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  removeCurrentSheet(removeCurrentIncomeSheetModal: any) {
    if(this.currentIncomeSheetId){
      this.modalService.open(removeCurrentIncomeSheetModal, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.confirmRemovingIncomeSheet(this.currentIncomeSheetId);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }else{
      this.toastr.warning(`Something went wrong, failed to delete income sheet`, 'Income Sheet Deletion Error');
    }
  }

  private confirmAddingNewIncomeRecord(currentIncomeSheetId: string, createIncomeRecordDto: any){
    const data = this.incomeRecordService.createIncomeRecord(currentIncomeSheetId, createIncomeRecordDto);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else{
          if(result.data.createIncomeRecord && result.data.createIncomeRecord['__typename'] === 'IncomeSheet' || result.data.createIncomeRecord['__typename'] === 'IncomeRecord'){
            this.loading = false;
            const createdIncomeRecord = result.data.createIncomeRecord;
            this.toastr.success(`Income record for ${createdIncomeRecord.notes} is created`, `Income Record Created`);
            setInterval(() => {
              window.location.reload();
            }, 2000);
          }else if(result.data.createIncomeRecord && result.data.createIncomeRecord['__typename'] === 'IncomeSheetResultError'){
            const errorModel = result.data.createIncomeRecord;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else{
            this.loading = false;
            this.toastr.error(`Something went wrong. Cannot create income record`, `Income Record Creation Failed`);
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong. Cannot create income record`, `Income Record Creation Failed`);
      }
    });
  }

  private confirmRemovingIncomeSheet(incomeSheetId: string){
    const data = this.incomeSheetService.deleteIncomeSheet(incomeSheetId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.removeIncomeSheet && result.data.removeIncomeSheet['__typename'] === 'IncomeSheet'){
            const deletedIncomeSheet = result.data.removeIncomeSheet;
            this.loading = false;
            window.location.reload();
            this.toastr.success(`Income Sheet for ${deletedIncomeSheet.month} - ${deletedIncomeSheet.year} is deleted!`, `Income Sheet Deletion`);
          }else if (result.data.removeIncomeSheet && result.data.removeIncomeSheet['__typename'] === 'IncomeSheetResultError') {
            const errorModel = result.data.removeIncomeSheet;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot delete Income Sheet for selected month and year`, 'Income Sheet Deletion Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot delete Income Sheet for selected month and year`, 'Income Sheet Deletion Error');
      }
    })
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
