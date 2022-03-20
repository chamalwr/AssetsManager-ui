import { variable } from "@angular/compiler/src/output/output_ast";
import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Subscription } from "rxjs";
import { CREATE_INCOME_CATEGORY, DELETE_INCOME_CATEGORY, GET_INCOME_CATEGORIES, GET_INCOME_CATEGORY, UPDATE_INCOME_CATEGORY } from "../assests-manager-common/query/income-category.query";

@Injectable()
export class IncomeCategoryService implements OnDestroy {
    private querySubscription: Subscription = new Subscription;
    public loading: boolean = false;
    public incomeCategories: any;


    constructor(private readonly apolloClient: Apollo){}

    getAllIncomeCategories(userId: string){
        return this.querySubscription = this.apolloClient.watchQuery<any>({
            query: GET_INCOME_CATEGORIES,
            variables: {
                userId: userId
            }
          })
        .valueChanges
        .subscribe(({ data, loading }) => {
            this.loading = loading;
            this.incomeCategories = data;
            console.log(data);
        });
    }

    getIncomeCategoryById(id: string){
        this.apolloClient.watchQuery<any>({
            query: GET_INCOME_CATEGORY,
            variables: {
                id: id
            }
          })
        .valueChanges
        .subscribe(({ data, loading }) => {
            this.loading = loading;
            this.incomeCategories = data;
            console.log(data);
        });
    }

    createIncomeCategory(createIncomeCategoryInput: any){
        this.apolloClient.mutate({
            mutation: CREATE_INCOME_CATEGORY,
            variables: {
                createIncomeCategoryInput: createIncomeCategoryInput,
            }
        }).subscribe(({data}) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        });
    }

    updateIncomeCategory(id: string, updateIncomeCategoryInput: any){
        this.apolloClient.mutate({
            mutation: UPDATE_INCOME_CATEGORY,
            variables: {
                id: id,
                updateIncomeCategoryInput: updateIncomeCategoryInput,
            }
        }).subscribe(({data}) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        });
    }

    removeIncomeCategory(id: string){
       this.apolloClient.mutate({
         mutation: DELETE_INCOME_CATEGORY,
         variables: {
             id: id
         }
        }).subscribe(({data}) => {
            console.log(data);
        }, (error) => {
            console.log(error)
        });
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
    }
}