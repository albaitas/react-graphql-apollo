import { gql } from '@apollo/client';

export const ALL_TODOS = gql`
  query AllTodos {
    todos {
      id
      text
      completed
    }
  }
`;
export const ADD_TODO = gql`
  mutation AddTodo($input: CreateTodoInput!) {
    addTodo(input: $input) {
      id
      text
      completed
    }
  }
`;
export const REMOVE_TODO = gql`
  mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id) {
      id
    }
  }
`;
export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
      text
      completed
    }
  }
`;
export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $input: CreateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      id
      text
      completed
    }
  }
`;
