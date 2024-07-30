export type Todo = {
    id: string;
    title: string;
    userId: number;
    completed: boolean;
  };
  
  export type TodoState = {
    todos: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  
  export type TodoSliceState = {
    todo: TodoState;
  };
  
  export interface TodoItemProps {
    id: string;
    title: string;
    completed: boolean;
  }