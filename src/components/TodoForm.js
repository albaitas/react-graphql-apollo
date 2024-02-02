import React, { useState, useEffect, useRef } from 'react';
import { ADD_TODO } from '../query/todos';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const TodoForm = () => {
  const [task, setTask] = useState('');
  const [addTodo] = useMutation(ADD_TODO);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!task || /^\s*$/.test(task)) return;
    addTodo({
      variables: { input: { text: task, completed: false } },
      update: (cache, { data }) => {
        const newTodo = data.addTodo;
        cache.modify({
          fields: {
            todos(existingTodos = []) {
              const newTodoRef = cache.writeFragment({
                data: newTodo,
                fragment: gql`
                  fragment NewTodo on Todo {
                    id
                    text
                    completed
                  }
                `
              });
              return [...existingTodos, newTodoRef];
            }
          }
        });
      }
    })
      .then(() => {
        setTask('');
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
      });
  };

  return (
    <form onSubmit={handleAddTodo} className='todo-form'>
      <input placeholder='Add a todo' value={task} onChange={handleChange} name='text' className='todo-input' ref={inputRef} />
      <button type='submit' className='todo-button'>
        Add todo
      </button>
    </form>
  );
};

export default TodoForm;
