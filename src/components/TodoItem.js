import React, { useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import { ALL_TODOS, REMOVE_TODO, UPDATE_TODO, TOGGLE_TODO } from '../query/todos';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const TodoItem = ({ data }) => {
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [removeTodo] = useMutation(REMOVE_TODO);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);

  const handleRemove = (todoId) => {
    removeTodo({
      variables: { id: todoId },
      update(cache, { data: { removeTodo } }) {
        cache.modify({
          fields: {
            todos(currentTodos = []) {
              return currentTodos.filter((todo) => todo.__ref !== `Todo:${removeTodo.id}`);
            }
          }
        });
      }
    }).catch((error) => {
      console.error('Error removing todo:', error);
    });
  };

  const handleToggleTodo = (todoId) => {
    toggleTodo({
      variables: { id: todoId },
      update: (cache, { data }) => {
        const updatedTodo = data.toggleTodo;
        const existingTodos = cache.readQuery({ query: ALL_TODOS });
        const updatedTodos = existingTodos.todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
        cache.writeQuery({
          query: ALL_TODOS,
          data: { todos: updatedTodos }
        });
      }
    }).catch((error) => {
      console.error('Error toggling todo:', error);
    });
  };

  const handleEdit = (todoId, todoText, todoCompleted) => {
    if (todoCompleted) return;
    setEditTodoId(todoId);
    setNewTodoText(todoText);
  };

  const handleSaveEdit = () => {
    if (!newTodoText || /^\s*$/.test(newTodoText)) return;
    updateTodo({
      variables: { id: editTodoId, input: { id: editTodoId, text: newTodoText, completed: false } },
      update: (cache, { data }) => {
        const updatedTodo = data.updateTodo;

        cache.writeFragment({
          id: cache.identify(updatedTodo),
          fragment: gql`
            fragment UpdatedTodo on Todo {
              id
              text
              completed
            }
          `,
          data: updatedTodo
        });
      }
    })
      .then(() => {
        setEditTodoId(null);
        setNewTodoText('');
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
  };

  return (
    <>
      {data.todos.map((todo) => {
        return (
          <div key={todo.id} className={todo.completed ? 'todo-row complete' : 'todo-row'}>
            {editTodoId === todo.id ? (
              <>
                <input type='text' className='new-todo-input' value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />
                <span>
                  <button onClick={handleSaveEdit} className='new-todo-button'>
                    Save
                  </button>
                </span>
              </>
            ) : (
              <>
                <div className='pointer' onClick={() => handleToggleTodo(todo.id)}>
                  <span>{todo.text}</span>
                </div>
                <div className='icons'>
                  <RiCloseCircleLine onClick={() => handleRemove(todo.id)} className='delete-icon' />
                  <TiEdit onClick={() => handleEdit(todo.id, todo.text, todo.completed)} className='edit-icon' />
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default TodoItem;
