import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Subscription } from "rxjs";
import { CREATE_INCOME_CATEGORY, DELETE_INCOME_CATEGORY, GET_INCOME_CATEGORIES, GET_INCOME_CATEGORY, UPDATE_INCOME_CATEGORY } from "../query/income-category.query";

@Injectable({
    providedIn: "root"
})
export class IncomeCategoryService implements OnDestroy {
    private querySubscription: Subscription = new Subscription;
    public loading: boolean = false;
    public incomeCategories: any;


    constructor(private readonly apolloClient: Apollo){}

    getAllIncomeCategories(userId: string){
        const incomeCategoriesSub = this.apolloClient.watchQuery<any>({
            query: GET_INCOME_CATEGORIES,
            variables: {
                userId: userId
            }
        });

        return incomeCategoriesSub.valueChanges;
    }

    getIncomeCategoryById(id: string){
        const getIncomeCategory = this.apolloClient.watchQuery<any>({
            query: GET_INCOME_CATEGORY,
            variables: {
                id: id
            }
          });

        return getIncomeCategory.valueChanges;
    }

    createIncomeCategory(createIncomeCategoryInput: any){
        return this.apolloClient.mutate({
            mutation: CREATE_INCOME_CATEGORY,
            variables: {
                createIncomeCategoryInput: createIncomeCategoryInput,
            }
        });
    }

    updateIncomeCategory(id: string, updateIncomeCategoryInput: any){
        return this.apolloClient.mutate({
            mutation: UPDATE_INCOME_CATEGORY,
            variables: {
                id: id,
                updateIncomeCategoryInput: updateIncomeCategoryInput,
            }
        });
    }

    removeIncomeCategory(id: string){
       return this.apolloClient.mutate({
         mutation: DELETE_INCOME_CATEGORY,
         variables: {
             id: id
         }
        });
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
    }
}