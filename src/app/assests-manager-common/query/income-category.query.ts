import { gql } from 'apollo-angular';

export const GET_INCOME_CATEGORIES = gql`
  query incomeCategories($userId: String!) {
    incomeCategories(userId: $userId) {
        __typename
        ... on IncomeCategory {
            _id
            userId
            name
            description
        }

        ... on IncomeCategoryResultError {
            operation
            message
            reason
        }
    }
  }
`;

export const GET_INCOME_CATEGORY = gql`
    query incomeCategory($id: String!) {
        incomeCategory(id: $id) {
            __typename
            ... on IncomeCategory {
            _id
            userId
            name
            description
            }

            ... on IncomeCategoryResultError {
            operation
            message
            reason
            }
        }
    }
`;

export const CREATE_INCOME_CATEGORY = gql`
    mutation createIncomeCategory($createIncomeCategoryInput: CreateIncomeCategoryInput!){
        createIncomeCategory(createIncomeCategoryInput: $createIncomeCategoryInput){
            __typename
            ... on IncomeCategory {
                _id
                userId
                name
                description
            }

            ... on IncomeCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const UPDATE_INCOME_CATEGORY = gql`
    mutation updateIncomeCategory($id: String!, $updateIncomeCategoryInput: UpdateIncomeCategoryInput!){
        updateIncomeCategory(id: $id, updateIncomeCategoryInput: $updateIncomeCategoryInput){
            __typename
            ... on IncomeCategory {
                _id
                userId
                name
                description
            }

            ... on IncomeCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const DELETE_INCOME_CATEGORY = gql`
    mutation removeIncomeCategory($id: String!){
        removeIncomeCategory(id: $id){
            __typename
            ... on IncomeCategory {
                _id
                userId
                name
                description
            }

            ... on IncomeCategoryResultError {
                operation
                message
                reason
            }
        }
    }
`;