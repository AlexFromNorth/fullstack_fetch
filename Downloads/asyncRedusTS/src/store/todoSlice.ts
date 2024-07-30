import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoState } from '../types/types';
import { RootState } from './store';

const setError = (state: TodoState, action: PayloadAction<unknown>) => {
  state.status = 'failed';
  if (typeof action.payload === 'string') {
    state.error = action.payload;
  } else {
    state.error = 'An unknown error occurred';
  }
};

export const fetchTodos = createAsyncThunk<
  Todo[],
  undefined,
  { rejectValue: string }
>('todos/fetchTodos', async function (_, { rejectWithValue }) {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=10'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return (await response.json()) as Todo[];
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

export const deleteTodo = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('todos/deleteTodo', async function (id, { rejectWithValue, dispatch }) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    dispatch(removeTodo({ id }));
    return id;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

export const toggleStatus = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string; state: RootState }
>(
  'todos/toggleStatus',
  async function (id, { rejectWithValue, dispatch, getState }) {
    try {
      const todo = getState().todos.todos.find((todo) => todo.id === id);
      if (todo) {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              completed: !todo.completed,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to toggle status');
        }
        const updatedTodo = await response.json();
        dispatch(toggleComplete({ id }));
        return updatedTodo;
      } else {
        return rejectWithValue('Todo not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const addNewTodo = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>('todos/addNewTodo', async function (title, { rejectWithValue }) {
  try {
    const todo = {
      title,
      userId: 1,
      completed: false,
    };
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error('Failed to add new todo');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    toggleComplete: (state, action: PayloadAction<{ id: string }>) => {
      const toggledTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      if (toggledTodo) {
        toggledTodo.completed = !toggledTodo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<{ id: string }>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, setError)
      .addCase(deleteTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, setError)
      .addCase(toggleStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleStatus.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(toggleStatus.rejected, setError)
      .addCase(addNewTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(addNewTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      })
      .addCase(addNewTodo.rejected, setError);
  },
});

export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
