import { IncomeRecord } from "./income-record.entity";

export class IncomeSheet {
    _id!: string;
    userId!: string;
    month!: number;
    year!: number;
    currency!: string;
    totalAmount!: number;
    incomeRecords!: IncomeRecord[];
}