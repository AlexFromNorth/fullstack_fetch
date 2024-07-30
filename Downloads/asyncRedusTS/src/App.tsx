import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTodo, fetchTodos } from './store/todoSlice';
import NewTodoForm from './components/NewTodoForm';
import TodoList from './components/TodoList';
import './App.css';
import { RootState, AppDispatch } from './store/store';

const App: FC = () => {
  const [title, setTitle] = useState<string>('');
  const { status, error } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();

  const handleAction = () => {
    if (title.trim().length) {
      dispatch(addNewTodo(title));
      setTitle('');
    }
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className='App'>
      <NewTodoForm
        value={title}
        updateText={setTitle}
        handleAction={handleAction}
      />
      {status === 'loading' && <h2>Loading...</h2>}
      {error && <h2>An error occurred: {error}</h2>}
      <TodoList />
    </div>
  );
};

export default App;
