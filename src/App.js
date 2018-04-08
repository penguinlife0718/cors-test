import React, { Component } from 'react'
import styled from 'styled-components'
import 'papercss/dist/paper.min.css'

const { REACT_APP_URI = '/' } = process.env

const Container = ({ children }) => (
  <div className="container">
    <div className="row">
      <div className="col col-12">{children}</div>
    </div>
  </div>
)

const Row = styled.div`
  display: flex;
`

const Input = styled.input`
  flex-grow: 1;
  line-height: 1;
`

const Button = styled.button`
  margin-left: 2em;
`

const Li = styled.li`
  &:not(:last-child) {
    margin-bottom: 1em;
  }
`

class App extends Component {
  state = {
    input: '',
    todos: []
  }

  componentDidMount() {
    fetch(`${REACT_APP_URI}todos`)
      .then(res => res.json())
      .then(todos => this.setState({ todos }))
  }

  addTodo = () => {
    const { todos: lastTodos, input } = this.state
    const tempId = new Date().getTime()

    this.setState(
      { todos: [...lastTodos, { id: tempId, body: input }], input: '' },
      () => {
        fetch(`${REACT_APP_URI}todos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: input })
        })
          .then(res => res.json())
          .then(({ id: realId }) => {
            if (realId === undefined) throw new Error('something failed')
            const { todos } = this.state
            const nextTodos = todos.map(todo => {
              if (todo.id === tempId) {
                return { ...todo, id: realId }
              }
              return todo
            })
            this.setState({ todos: nextTodos })
          })
          .catch(e => {
            const { todos } = this.state
            const nextTodos = todos.filter(todo => {
              if (todo.id === tempId) {
                return false
              }
              return true
            })
            this.setState({ todos: nextTodos })
          })
      }
    )
  }

  onEnter = callback => ({ keyCode }) => {
    if (keyCode === 13) {
      callback()
    }
  }

  onInput = ({ target: { value } }) => {
    this.setState({ input: value })
  }

  renderTodos = ({ id, body }) => {
    return <Li key={id}>{body}</Li>
  }

  render() {
    const { renderTodos, addTodo, onEnter, onInput } = this
    const { todos, input } = this.state
    return (
      <Container>
        <div className="paper">
          <h2>Todos</h2>
          <Row>
            <Input
              type="text"
              onKeyDown={onEnter(addTodo)}
              onInput={onInput}
              value={input}
            />
            <Button type="button" onClick={addTodo}>
              新增
            </Button>
          </Row>
          <ol>{todos.map(renderTodos)}</ol>
        </div>
      </Container>
    )
  }
}

export default App
