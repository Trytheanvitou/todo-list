"use client"

import React, { useState, useEffect } from 'react';
import { SupabaseCrudService } from '../services';
import { CreateTodoType, TodoType } from '../types/todoType';
import { UpdateTodo } from './updateTodo';

export default function TodoList() {
  const [allTodos, setAllTodos] = useState<TodoType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [editTodo, setEditTodo] = useState<TodoType>({} as TodoType);
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [warn, setWarn] = useState<boolean>(false);
  const service = new SupabaseCrudService<TodoType>('todo')

  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get todo')
      }

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  };

  const loadTodos = async (): Promise<void> => {
    try {
      const data = await fetchTodos();
      setAllTodos(data)
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

    const handleCreate = async (newTodo: CreateTodoType) => {
    try {
      const jsonData = JSON.stringify({ ...newTodo })
      const response = await fetch(`/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData
      })

      if (!response.ok) {
        throw new Error('Failed to create todo')
      }
      const data = await response.json()
      setTodos([...todos, data]);
      setAllTodos([...todos, data]);

    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleUpdate = async (id: string, value: string) => {
    const newData = todos.map((item) => {
      if (item.id === id) {
        return { ...item, todo: value }
      }
      return item
    })

    setTodos(newData)
    setAllTodos(newData)

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: value })
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      await response.json()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  };

  const handleInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    setWarn(false)
    if (e.key === 'Enter') {
      if (!inputValue.trim()) {
        console.log("inputValue", !inputValue.trim())
        setWarn(true)
        setMessage("Todo cannot be empty")
        return;
      }

      // check duplicate value
      const duplicate = todos.findIndex(
        (item) => (
          item.todo.trim() === inputValue.trim()
        ))

      const newTodo: CreateTodoType = {
        todo: inputValue.trim(),
        isCompleted: false,
        createdAt: new Date().toISOString()
      };

      if (duplicate !== -1) {
        setWarn(true)
        setMessage(`Todo ${inputValue} already exist`)
        return
      } else {
        if (editTodo.id) {
          handleUpdate(editTodo.id, inputValue.trim())
        } else {
          handleCreate(newTodo)
        }
      }

      setInputValue('');
      setEditTodo({} as TodoType)
    }
  };

  const deleteTodoList = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      await response.json()
    } catch (error) {
      console.error('Error updating todo:', error)
    }

    const newData = todos.filter((item) => item.id !== id)
    setTodos(newData)
    setAllTodos(newData)
  }

  const filterSearch = (searchValue: string) => {
    if (!searchValue?.trim()) {
      setTodos(allTodos);
      return;
    }

    const afterFilter = allTodos.filter((item) =>
      item.todo.toLowerCase().includes(searchValue.toLowerCase())
    );

    setTodos(afterFilter)
    setEditTodo({} as TodoType)
  }

  const onComplete = async (id: string) => {
    const newData = todos.map((item) => {
      if (item.id === id) {
        return { ...item, isCompleted: true }
      }
      return item
    })

    setTodos(newData)
    setAllTodos(newData)

    await service.update(id, { isCompleted: true })
  }

  const onInComplete = async (id: string) => {

    const newData = todos.map((item) => {
      if (item.id === id) {
        return { ...item, isCompleted: false }
      }
      return item
    })

    setTodos(newData)
    setAllTodos(newData)

    await service.update(id, { isCompleted: false })
  }

  const onEdit = (edit: TodoType) => {
    setInputValue(edit.todo)
    setEditTodo(edit);
  }

  if (loading) {
    return <div>Loading todos...</div>;
  }

  return (
    <div className='p-5'>
      <h1>Search Todo</h1>
      <input
        type="text"
        value={searchValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchValue(e.target.value);
          filterSearch(e.target.value);
        }}
        placeholder="Search..."
        className='border p-5 w-75 border-gray-400 h-10 rounded-md'
      />

      <div className='mt-10'>
        <h1 className='text-4xl flex justify-center font-bold'>Todo List</h1>
        <h1>Create and Update Todo List</h1>
        <input
          type="text"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleInput}
          placeholder="Type and press Enter to add a new todo"
          className='border p-1 w-80 border-gray-400 h-10 rounded-md'
        />

        {warn && (
          <p className='text-red-600 font-bold'>{message}</p>
        )}

        <div className='bg-slate-50 p-10 border-2 rounded-2xl mt-4 h-100 overflow-auto'>
          <div>
            {todos.length > 0 ? (
              <>
                {todos.map((todo: TodoType, index: number) => (
                  <React.Fragment key={todo.id}>
                    <UpdateTodo todo={todo}
                      onDelete={() => deleteTodoList(todo?.id)}
                      onComplete={() => onComplete(todo?.id)}
                      onInComplete={() => onInComplete(todo?.id)}
                      onEdit={() => onEdit(todo)} />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <div className="flex justify-center items-center h-full text-xl text-slate-400">
                No Todo List
              </div>
            )

            }

          </div>
        </div>

      </div>
    </div>
  );
}