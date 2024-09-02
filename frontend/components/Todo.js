import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const StyledTodo = styled.li`
  text-decoration: ${pr => pr.$complete ? 'line-through' : 'initial'};
`

const baseURL = 'http://localhost:9009/api/todos'

export default function Todo() {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')

  useEffect(() => {
    const get = () => axios.get(baseURL)
      .then(({ data }) => setTodos(data))
    get()
  }, [])

  const toggle = id => axios.patch(`${baseURL}/${id}`)
    .then(({ data }) => setTodos(data))

  const del = id => axios.delete(`${baseURL}/${id}`)
    .then(({ data }) => setTodos(data))

  const create = evt => {
    evt.preventDefault()
    axios.post(baseURL, { name: todo })
      .then(({ data }) => {
        setTodo('')
        setTodos(data)
      })
  }

  const change = evt => setTodo(evt.target.value)

  return (
    <div>
      <h2>Todo App</h2>
      <ul>
        {
          todos.map(todo => (
            <StyledTodo $complete={todo.complete} key={todo.id}>
              <span onClick={() => toggle(todo.id)}>{todo.name}{todo.complete && ' ✔️'}</span>
              <button onClick={() => del(todo.id)}>del</button>
            </StyledTodo>
          ))
        }
      </ul>
      <form onSubmit={create}>
        <input value={todo} onChange={change} placeholder="type todo" />
      </form>
    </div>
  )
}