import { useEffect, useState } from "react"

interface Todo {
  id: string
  title: string
  description: string
  checked: boolean
}

export const App = () => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const todo = JSON.parse(localStorage.getItem('todos') || '[]')

  const [todoData, setTodoData] = useState<Todo[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('todos') || '[]')
    } catch {
      return []
    }
  })

  const [filter, setFilter] = useState<"0" | "1" | "2">("0")

  const filtrationData = todoData.filter((todo) => {
    switch (filter) {
      case "1":
        return !todo.checked
      case "2":
        return todo.checked
      case "0":
      default:
        return true
    }
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todoData))
  }, [todoData])

  const validateForm = () => {
    if (title.trim() === '' || description.trim() === '') {
      alert('Пожалуйста, заполните все поля формы.')
      return false
    }
    return true
  }

  const todoAdd = () => {
    if (!validateForm()) {
      return
    }

    const newTodo = [...todo, {
      id: Math.random().toString(36).substring(2, 9),
      title: title,
      description: description,
      checked: false
    }]

    setTodoData(newTodo)
    setTitle('')
    setDescription('')
  }

  const checkBoxChange = (id: string) => {
    setTodoData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodoData(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div>
      <div>
        <h1>Todo List</h1>
      </div>
      <div className="filterTab">
        <button onClick={() => setFilter("0")}>
          Все
        </button>
        <button onClick={() => setFilter("1")}>
          Не выполненные
        </button>
        <button onClick={() => setFilter("2")}>
          Выполненные
        </button>
      </div>
      <div className="card-container">
        <div className="card editor">
          <input
            type="text"
            placeholder="Титул задачи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Добавить описание..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <button onClick={todoAdd}>Добавить задачу</button>
          </div>
        </div>
        {filtrationData.map((item: Todo) => (
          <div className="card" key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="todo-actions">
              <div className="todo-item">
                <span>
                  Статус выполнения:
                </span>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => checkBoxChange(item.id)}
                />
              </div>
              <div className="delete-item">
                <button
                  onClick={() => {
                    deleteTodo(item.id)
                  }}
                >
                  X
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
