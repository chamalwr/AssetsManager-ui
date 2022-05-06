import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_EXPENSE_SHEET, GET_EXPENSE_SHEETS, GET_EXPENSE_SHEETS_SUMMARY } from '../query/expense-sheet.query';

@Injectable({
  providedIn: 'root'
})
export class ExpenseSheetService {

  constructor(private readonly apolloClient: Apollo) { }

  getAllExpenseSheets(userId: string){
    const expenseSheets = this.apolloClient.watchQuery({
      query: GET_EXPENSE_SHEETS,
      variables: {
        userId: userId,
      }
    });

    return expenseSheets.valueChanges;
  }

  getAllExpenseSheetsSummary(userId: string){
    const expenseSheetsSummary = this.apolloClient.watchQuery({
      query: GET_EXPENSE_SHEETS_SUMMARY,
      variables: {
        userId: userId,
      }
    });

    return expenseSheetsSummary.valueChanges;
  }

  getExpenseSheetById(id: string){
    const expenseSheet = this.apolloClient.watchQuery({
      query: GET_EXPENSE_SHEET,
      variables: {
        id: id,
      }
    });

    return expenseSheet.valueChanges;
  }  
}
