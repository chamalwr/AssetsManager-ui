import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { IncomeCategory } from "src/app/assests-manager-common/entity/income-category.entity";

export class TemporyIncomeRecordUpdateDto {
    incomeSheetId!: string;
    incomeRecordId!: string;
    date!: NgbDateStruct;
    note!: string;
    incomeCategory!: IncomeCategory;
    amount!: number;
}