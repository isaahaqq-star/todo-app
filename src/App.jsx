import React, { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import { StorageService } from './services/StorageService'

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedTodos = StorageService.getTodos()
    setTodos(savedTodos)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      StorageService.saveTodos(todos)
    }
  }, [todos, isLoading])

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    )
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-white text-opacity-80 text-lg">
            Stay organized and productive
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <TodoForm onAddTodo={addTodo} />

          <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center text-sm text-gray-600">
            <span className="font-semibold">
              {todos.length} total · {activeCount} active · {completedCount} completed
            </span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-red-500 hover:text-red-700 font-semibold transition"
              >
                Clear completed
              </button>
            )}
          </div>

          <div className="flex border-b bg-gray-50">
            {[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Completed', value: 'completed' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex-1 py-3 font-semibold transition ${
                  filter === tab.value
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredTodos.length > 0 ? (
            <TodoList
              todos={filteredTodos}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onEditTodo={editTodo}
            />
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400 text-lg">
                {todos.length === 0
                  ? 'No tasks yet. Add one to get started!'
                  : `No ${filter} tasks`}
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-white text-opacity-70 text-sm">
          <p>Your tasks are automatically saved to your browser</p>
        </div>
      </div>
    </div>
  )
}

export default App
