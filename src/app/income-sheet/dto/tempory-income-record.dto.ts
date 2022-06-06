import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { IncomeCategory } from "src/app/assests-manager-common/entity/income-category.entity";

export class TemporyIncomeRecord {
    temporyId!: string;
    date!: NgbDateStruct;
    note!: string;
    amount!: number;
    incomeCategory!: IncomeCategory;
}