import React from 'react';
import { ALL_TODOS } from './../query/todos';
import { useQuery } from '@apollo/client';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { loading, error, data } = useQuery(ALL_TODOS);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>Error...</h2>;
  }

  return (
    <>
      <TodoItem data={data} />
    </>
  );
};

export default TodoList;
