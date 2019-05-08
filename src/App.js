import React, { useReducer, useRef, useState, useEffect } from 'react'
import uuid from 'uuid/v1'
import './App.css'

const TOGGLE = 'TOGGLE'
const DELETE = 'DELETE'
const ADD = 'ADD'

const todoReducer = (state, action) => {
  switch (action.type) {
    case TOGGLE: {
      return state.map((e, i) =>
        e.id === action.id ? { ...e, completed: !e.completed } : e
      )
    }

    case ADD: {
      return [...state, { title: action.title, completed: false, id: uuid() }]
    }

    case DELETE: {
      return state.filter(e => e.id !== action.id)
    }

    default:
      return state
  }
}

const initialTodos = [
  {
    id: 'someId',
    title: 'Aprender hooks',
    completed: false
  }
]

const backgroundColors = ['lightgrey', 'lightblue', 'lightpink', 'lightyellow']

function App () {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos)
  const [backgroundColor, setBackgroundColor] = useState('lightgrey')

  // Holds mutable object reffering to the DOM node
  const addTodoRef = useRef(null)

  const handleToggle = id => {
    dispatch({ type: TOGGLE, id })
  }

  const handleDelete = id => {
    dispatch({ type: DELETE, id })
  }

  const handleKeyDown = event => {
    // Enter
    if (event.keyCode === 13) {
      dispatch({ type: ADD, title: event.target.value })
      addTodoRef.current.focus()
      addTodoRef.current.value = ''
    }
  }

  const handleChangeBackground = color => setBackgroundColor(color)

  // Used for side effects: think `componentDidMount`, `componentWillUnMount` and `componentDidUpdate` together
  useEffect(() => {
    document.title = `There are ${todos.length} todos created`
  })

  return (
    <div className='container' style={{ backgroundColor }}>
      <div className='color-toggle'>
        <div className='color-toggle-title'>Theme:</div>
        <select
          onChange={({ target: { value: color } }) =>
            handleChangeBackground(color)
          }
        >
          {backgroundColors.map(color => (
            <option key={color} label={color} value={color} />
          ))}
        </select>
      </div>
      <div className='banner'>Add to-do</div>
      <div className='add-todo'>
        <input
          type='text'
          ref={addTodoRef}
          onKeyDown={event => handleKeyDown(event)}
        />
      </div>
      <div className='todo-list'>
        {todos.map((e, i) => (
          <div className='todo' key={`todo-${e.id}`}>
            <div className='todo-title'>{e.title}</div>
            <div className='todo-toggle'>
              <input
                type='checkbox'
                checked={e.completed}
                onChange={() => handleToggle(e.id)}
              />
            </div>
            {!e.completed && (
              <div className='todo-delete'>
                <button onClick={() => handleDelete(e.id)}>X </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
