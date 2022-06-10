import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CreateExpenseCategoryDto } from '../dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from '../dto/update-expense-category.dto';
import { CREATE_EXPENSE_CATEGORY, DELETE_EXPENSE_CATEGORY, GET_EXPENSE_CATEGORIES, GET_EXPENSE_CATEGORY, UPDATE_EXPENSE_CATEGORY } from '../query/expense-category.query';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {

  public loading: boolean = false;
  public incomeCategories: any;

  constructor(private readonly apolloClient: Apollo) { }

  getAllExpenseCategories(userId: string){
    const allExpenseCategories = this.apolloClient.watchQuery<any>({
        query: GET_EXPENSE_CATEGORIES,
        variables: {
            userId: userId
        }
    });

    return allExpenseCategories.valueChanges;
 }  

  getExpenseCategoryById(id: string){
      const expenseCategory = this.apolloClient.watchQuery<any>({
          query: GET_EXPENSE_CATEGORY,
          variables: {
              id: id
          }
      });

      return expenseCategory.valueChanges;
  }

  createExpenseCategory(createExpenseCategoryInput: CreateExpenseCategoryDto){
      return this.apolloClient.mutate({
          mutation: CREATE_EXPENSE_CATEGORY,
          variables: {
              createExpenseCategoryInput: createExpenseCategoryInput,
          }
      });
  }

  updateExpenseCategory(id: string, updateExpenseCategoryInput: UpdateExpenseCategoryDto){
      return this.apolloClient.mutate({
          mutation: UPDATE_EXPENSE_CATEGORY,
          variables: {
              id: id,
              updateExpenseCategoryInput: updateExpenseCategoryInput,
          }
      });
  }

  removeExpenseCategory(id: string){
    return this.apolloClient.mutate({
      mutation: DELETE_EXPENSE_CATEGORY,
      variables: {
          id: id
      }
    });
  }
}
