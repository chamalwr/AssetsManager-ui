import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_EXPENSE_SHEET, DELETE_EXPENSE_SHEET, GET_EXPENSE_SHEET, GET_EXPENSE_SHEETS, GET_EXPENSE_SHEETS_BY_YEAR, GET_EXPENSE_SHEETS_SUMMARY, GET_EXPENSE_SHEET_BY_MONTH_AND_YEAR, UPDATE_EXPENSE_SHEET } from '../query/expense-sheet.query';

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
  
  getExpenseSheetsByMonthAndYear(userId: string, month: number, year: number){
    const expenseSheets = this.apolloClient.watchQuery({
      query: GET_EXPENSE_SHEET_BY_MONTH_AND_YEAR,
      variables: {
        userId: userId,
        month: month,
        year: year,
      }
    });

    return expenseSheets.valueChanges;
  }

  getExpenseSheetsByYear(userId: string, year: number){
    const expenseSheets = this.apolloClient.watchQuery({
      query: GET_EXPENSE_SHEETS_BY_YEAR,
      variables: {
        userId: userId,
        year: year
      }
    });

    return expenseSheets.valueChanges;
  }

  createExpenseSheet(createExpenseSheetDto: any){
    return this.apolloClient.mutate({
      mutation: CREATE_EXPENSE_SHEET,
      variables: {
        createExpenseSheetInput:  createExpenseSheetDto
      }
    });
  }

  deleteExpenseSheet(id: string){
    return this.apolloClient.mutate({
      mutation: DELETE_EXPENSE_SHEET,
      variables: {
        id: id
      }
    });
  }

  updateExpenseSheet(id: string, updateExpenseSheetDto: any){
    return this.apolloClient.mutate({
      mutation: UPDATE_EXPENSE_SHEET,
      variables: {
        id: id,
        updateExpenseSheetInput: updateExpenseSheetDto
      }
    });
  }
}
