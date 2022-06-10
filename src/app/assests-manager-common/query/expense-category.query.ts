import { gql } from "apollo-angular";

export const GET_EXPENSE_CATEGORIES = gql`
    query expenseCategories($userId: String!){
        expenseCategories(userId: $userId){
            __typename
            ... on ExpenseCategory {
                _id
                userId
                name
                description
            }

            ... on ExpenseCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const GET_EXPENSE_CATEGORY = gql`
    query expenseCategory($id: String!){
        expenseCategory(id: $id){
            __typename
            ... on ExpenseCategory {
                _id
                userId
                name
                description
            }

            ... on ExpenseCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const CREATE_EXPENSE_CATEGORY = gql`
    mutation createExpenseCategory($createExpenseCategoryInput: CreateExpenseCategoryInput!){
        createExpenseCategory(createExpenseCategoryInput: $createExpenseCategoryInput) {
            __typename
            ... on ExpenseCategory {
                _id
                userId
                name
                description
            }

            ... on ExpenseCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const UPDATE_EXPENSE_CATEGORY = gql`
    mutation updateExpenseCategory($id: String!, $updateExpenseCategoryInput: UpdateExpenseCategoryInput!){
        updateExpenseCategory(id: $id, updateExpenseCategoryInput: $updateExpenseCategoryInput) {
            __typename
            ... on ExpenseCategory {
                _id
                userId
                name
                description
            }

            ... on ExpenseCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const DELETE_EXPENSE_CATEGORY = gql`
    mutation removeExpenseCategory($id: String!) {
        removeExpenseCategory(id: $id) {
            __typename
            ... on ExpenseCategory {
                _id
                userId
                name
                description
            }

            ... on ExpenseCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;