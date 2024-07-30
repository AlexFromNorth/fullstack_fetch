import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { TodoItemProps } from '../types/types';
import { deleteTodo, toggleStatus } from '../store/todoSlice';



const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <li>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch(toggleStatus(id))}
      />
      <span>{title}</span>
      <span onClick={() => dispatch(deleteTodo(id))}>&times;</span>
    </li>
  );
};

export default TodoItem;
