import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import TodoItem from './TodoItem';

const TodoList: FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          {...todo}
        />
      ))}
    </ul>
  );
};

export default TodoList;
