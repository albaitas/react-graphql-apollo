export const typeDefs = `#graphql
 
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
  }
  type Query {
    todos: [Todo]!
  }
  input CreateTodoInput {
    id: ID
    text: String!
    completed: Boolean!
  }
  type Mutation {
    addTodo(input: CreateTodoInput!): Todo
    removeTodo(id: ID!): Todo
    toggleTodo(id: ID!): Todo
    updateTodo(id: ID!, input: CreateTodoInput!): Todo
  }
`;
