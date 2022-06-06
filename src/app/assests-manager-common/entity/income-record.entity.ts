import { IncomeCategory } from "./income-category.entity";

export class IncomeRecord {
    _id!: string;
    date!: number;
    notes!: string;
    amount!: number;
    incomeCategory!: IncomeCategory;
}