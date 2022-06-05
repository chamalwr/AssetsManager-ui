import { IncomeCategory } from "./income-category.entity";

export class IncomeRecord {
    incomeRecordId!: string;
    date!: number;
    notes!: string;
    amount!: number;
    incomeCategory!: IncomeCategory;
}