import { todos } from '../db.js';

export const resolvers = {
  Query: {
    todos() {
      return todos;
    }
  },
  Mutation: {
    addTodo(_, { input }) {
      const newTodo = { id: String(todos.length + 1), ...input };
      todos.push(newTodo);
      return newTodo;
    },
    removeTodo(_, { id }) {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        const removedTodo = todos.splice(index, 1)[0];
        return removedTodo;
      }
      return null;
    },
    toggleTodo(_, { id }) {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        todos[index].completed = !todos[index].completed;
        return todos[index];
      }
      return null;
    },
    updateTodo(_, { id, input }) {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        todos[index] = { id, ...input };
        return todos[index];
      }
      return null;
    }
  }
};
