import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import server from '../../backend/mock-server'
import { resetTodos } from '../../backend/helpers'

import Todo from './Todo'

describe('Todos Component', () => {
  let user, laundry, dishes, groceries, input


  afterEach(() => { server.resetHandlers() })
  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })
  beforeEach(async () => {
    resetTodos()
    render(<Todo />)
    user=userEvent.setup()
    await waitFor(()=>{
      laundry=screen.getByText('laundry')
      dishes=screen.getByText('dishes')
      groceries=screen.getByText('groceries')
      input=screen.getByPlaceholderText('type todo')
    })
  })

  test('all todos are present', async() => {
    expect(laundry).toBeVisible()
    expect(dishes).toBeVisible()
    expect(groceries).toBeVisible()
  })

  test('can do and undo todos', async () => {
    const tasks = ['laundry', 'dishes', 'groceries']
    for(const task of tasks){
      const elem=screen.getByText(task)
      await user.click(elem)
      
      expect(await screen.findByText(`${task} ✔️`))    
      await user.click(elem)
      expect(await screen.findByText(task))
      expect(screen.queryByText(`${task} ✔️`)).not.toBeInTheDocument()
    }
    screen.debug()
  })


  test('can delete todos', async () => {
    const tasks = ['laundry', 'dishes', 'groceries']
    for(const task of tasks){
      const span=screen.getByText(task)
      await user.click(span.nextSibling)
      await waitFor(()=>{
        expect(span).not.toBeInTheDocument()
      })
    }
    screen.debug()
  })


  test('can create a new todo, complete it and delete it', async () => {
    const newTask ='Learn JavaScript'

    // Add new todo
    await user.type(input, newTask)
    await user.keyboard('[ENTER]')    
    expect(await screen.findByText(newTask))

    // Check and Uncheck new todo
    const span=screen.getByText(newTask)
    await user.click(span)
    expect(await screen.findByText(`${newTask} ✔️`))
    await user.click(span)
    expect(await screen.findByText(`${newTask}`))

    // Delete new todo
    await user.click(span.nextSibling)
    await waitFor(()=>{
      expect(span).not.toBeInTheDocument()
    })

    screen.debug()
  })
})
